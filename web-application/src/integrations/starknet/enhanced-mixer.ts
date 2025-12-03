/**
 * SLPM Enhanced Privacy Mixer Integration
 * 
 * This module integrates the Noir + Garaga ZK proof system with the SLPM mixer.
 */

import type { Account, Contract, RpcProvider } from 'starknet';
import {
    createCommitmentData,
    createWithdrawalProof,
    generateMerkleProof,
    type CommitmentData,
    type GeneratedProof,
} from '../../crypto/noir-proof';

export interface MixerConfig {
    contractAddress: string;
    verifierAddress: string;
    tokenAddress: string;
    rpcUrl: string;
}

export interface DepositResult {
    commitmentData: CommitmentData;
    leafIndex: number;
    txHash: string;
}

export interface WithdrawalResult {
    txHash: string;
    success: boolean;
}

export class EnhancedPrivacyMixer {
    private contract: Contract;
    private provider: RpcProvider;
    private config: MixerConfig;
    private circuitBytecode: Uint8Array;
    private circuitAbi: any;
    private vk: Uint8Array;

    constructor(
        config: MixerConfig,
        contract: Contract,
        provider: RpcProvider,
        circuitBytecode: Uint8Array,
        circuitAbi: any,
        vk: Uint8Array,
    ) {
        this.config = config;
        this.contract = contract;
        this.provider = provider;
        this.circuitBytecode = circuitBytecode;
        this.circuitAbi = circuitAbi;
        this.vk = vk;
    }

    /**
     * Deposit funds into the privacy mixer
     */
    async deposit(account: Account, amount: bigint): Promise<DepositResult> {
        // Generate commitment data
        const commitmentData = createCommitmentData(amount);

        // Call deposit on contract
        const result = await account.execute({
            contractAddress: this.config.contractAddress,
            entrypoint: 'deposit',
            calldata: [commitmentData.commitment, amount.toString()],
        });

        // Wait for transaction to be accepted
        await this.provider.waitForTransaction(result.transaction_hash);

        // Get the leaf index from transaction receipt
        const receipt = await this.provider.getTransactionReceipt(result.transaction_hash);
        const leafIndex = this.extractLeafIndexFromReceipt(receipt);

        return {
            commitmentData,
            leafIndex,
            txHash: result.transaction_hash,
        };
    }

    /**
     * Withdraw funds from the privacy mixer with ZK proof
     */
    async withdraw(
        account: Account,
        secret: string,
        depositIndex: number,
        recipient: string,
        amount: bigint,
    ): Promise<WithdrawalResult> {
        // Get all commitments from contract
        const commitments = await this.getAllCommitments();

        // Generate ZK proof
        console.log('Generating ZK proof...');
        const proof = await createWithdrawalProof(
            this.circuitBytecode,
            this.circuitAbi,
            this.vk,
            secret,
            commitments,
            depositIndex,
            recipient,
            amount,
        );

        console.log('Proof generated, submitting withdrawal...');

        // Get nullifier from public inputs
        const nullifier = proof.publicInputs[0];

        // Call withdraw on contract
        const result = await account.execute({
            contractAddress: this.config.contractAddress,
            entrypoint: 'withdraw',
            calldata: [
                nullifier,
                recipient,
                amount.toString(),
                proof.calldata.length.toString(),
                ...proof.calldata,
            ],
        });

        // Wait for transaction
        await this.provider.waitForTransaction(result.transaction_hash);

        return {
            txHash: result.transaction_hash,
            success: true,
        };
    }

    /**
     * Get current Merkle root
     */
    async getMerkleRoot(): Promise<string> {
        const result = await this.contract.call('get_merkle_root');
        return result.toString();
    }

    /**
     * Get all commitments from the contract
     */
    async getAllCommitments(): Promise<string[]> {
        const nextIndex = await this.contract.call('get_next_deposit_index');
        const count = Number(nextIndex);

        const commitments: string[] = [];
        for (let i = 0; i < count; i++) {
            const commitment = await this.contract.call('get_commitment_at_index', [i]);
            commitments.push(commitment.toString());
        }

        return commitments;
    }

    /**
     * Get anonymity set size
     */
    async getAnonymitySetSize(): Promise<number> {
        const result = await this.contract.call('get_anonymity_set_size');
        return Number(result);
    }

    /**
     * Check if nullifier has been used
     */
    async isNullifierUsed(nullifier: string): Promise<boolean> {
        const result = await this.contract.call('is_nullifier_used', [nullifier]);
        return Boolean(result);
    }

    /**
     * Get total deposits
     */
    async getTotalDeposits(): Promise<bigint> {
        const result = await this.contract.call('get_total_deposits');
        return BigInt(result.toString());
    }

    /**
     * Get total withdrawals
     */
    async getTotalWithdrawals(): Promise<bigint> {
        const result = await this.contract.call('get_total_withdrawals');
        return BigInt(result.toString());
    }

    /**
     * Extract leaf index from deposit transaction receipt
     */
    private extractLeafIndexFromReceipt(receipt: any): number {
        // Look for Deposit event in the receipt
        // Event structure: Deposit { commitment, leaf_index, amount, timestamp, new_root }
        // This is simplified - in production, properly parse the event
        const events = receipt.events || [];
        for (const event of events) {
            if (event.keys && event.keys[0] === 'Deposit') {
                // leaf_index is typically the second data field
                return Number(event.data[1]);
            }
        }
        return 0; // Fallback
    }
}

/**
 * Factory function to create EnhancedPrivacyMixer instance
 */
export async function createEnhancedPrivacyMixer(
    config: MixerConfig,
    account: Account,
    circuitBytecode: Uint8Array,
    circuitAbi: any,
    vk: Uint8Array,
): Promise<EnhancedPrivacyMixer> {
    const { Contract, RpcProvider } = await import('starknet');

    const provider = new RpcProvider({ nodeUrl: config.rpcUrl });

    // Load contract ABI (you need to provide the actual ABI)
    const contractAbi: any[] = []; // Load from enhanced_privacy_mixer ABI

    const contract = new Contract(
        contractAbi,
        config.contractAddress,
        provider,
    );

    return new EnhancedPrivacyMixer(
        config,
        contract,
        provider,
        circuitBytecode,
        circuitAbi,
        vk,
    );
}
