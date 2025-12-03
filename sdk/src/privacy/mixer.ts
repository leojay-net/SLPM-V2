/**
 * SLPM SDK - Privacy Mixer Module
 * 
 * Provides ZK-based private deposits and withdrawals on Starknet
 */

import { Account, Contract, RpcProvider, CallData, cairo } from 'starknet';
import { v4 as uuidv4 } from 'uuid';
import {
    SLPMConfig,
    WalletConnection,
    Commitment,
    DepositParams,
    DepositResult,
    WithdrawParams,
    WithdrawResult,
    MerkleProof,
    ZKProof,
    MixerStats,
    SLPMEvent,
    SLPMEventCallback,
    PrivacyError,
    ProofError,
} from '../types';
import {
    generateCommitment,
    generateMerkleProof,
    verifyMerkleProof,
    formatAmount,
} from '../crypto';
import {
    MAINNET_CONTRACTS,
    SEPOLIA_CONTRACTS,
    MIXER_CONFIG,
} from '../constants';

// Mixer ABI (simplified - use actual ABI in production)
const MIXER_ABI = [
    {
        name: 'deposit',
        type: 'function',
        inputs: [
            { name: 'commitment', type: 'felt252' },
            { name: 'amount', type: 'u256' },
        ],
        outputs: [],
    },
    {
        name: 'withdraw',
        type: 'function',
        inputs: [
            { name: 'nullifier_hash', type: 'felt252' },
            { name: 'recipient', type: 'ContractAddress' },
            { name: 'amount', type: 'u256' },
            { name: 'proof', type: 'Array<felt252>' },
        ],
        outputs: [],
    },
    {
        name: 'get_merkle_root',
        type: 'function',
        inputs: [],
        outputs: [{ type: 'felt252' }],
        state_mutability: 'view',
    },
    {
        name: 'get_anonymity_set_size',
        type: 'function',
        inputs: [],
        outputs: [{ type: 'u64' }],
        state_mutability: 'view',
    },
    {
        name: 'is_nullifier_used',
        type: 'function',
        inputs: [{ name: 'nullifier_hash', type: 'felt252' }],
        outputs: [{ type: 'bool' }],
        state_mutability: 'view',
    },
    {
        name: 'get_commitment_at_index',
        type: 'function',
        inputs: [{ name: 'index', type: 'u64' }],
        outputs: [{ type: 'felt252' }],
        state_mutability: 'view',
    },
];

/**
 * Privacy Mixer - ZK-based private deposits and withdrawals
 * 
 * @example
 * ```typescript
 * const mixer = new PrivacyMixer(config, wallet);
 * 
 * // Deposit
 * const deposit = await mixer.deposit({ amount: parseAmount('10') });
 * console.log('Save this commitment:', deposit.commitment);
 * 
 * // Later, withdraw to a different address
 * const withdraw = await mixer.withdraw({
 *   commitment: deposit.commitment,
 *   recipient: '0x...',
 *   amount: parseAmount('10'),
 * });
 * ```
 */
export class PrivacyMixer {
    private config: SLPMConfig;
    private wallet: WalletConnection;
    private contract: Contract;
    private eventCallback?: SLPMEventCallback;
    private commitments: Map<string, Commitment> = new Map();

    constructor(
        config: SLPMConfig,
        wallet: WalletConnection,
        eventCallback?: SLPMEventCallback
    ) {
        this.config = config;
        this.wallet = wallet;
        this.eventCallback = eventCallback;

        // Get contract address
        const contracts = config.network === 'mainnet' ? MAINNET_CONTRACTS : SEPOLIA_CONTRACTS;
        const contractAddress = config.mixerContractAddress || contracts.MIXER;

        // Initialize contract
        this.contract = new Contract(MIXER_ABI, contractAddress, wallet.provider);
        this.contract.connect(wallet.account);
    }

    // ============================================================================
    // Core Operations
    // ============================================================================

    /**
     * Deposit funds into the privacy mixer
     * 
     * @param params - Deposit parameters
     * @returns Deposit result including commitment (SAVE THIS!)
     */
    async deposit(params: DepositParams): Promise<DepositResult> {
        const { amount, tokenAddress } = params;

        // Validate amount
        if (amount < MIXER_CONFIG.MIN_DEPOSIT) {
            throw new PrivacyError(
                `Minimum deposit is ${formatAmount(MIXER_CONFIG.MIN_DEPOSIT)} STRK`,
                { minDeposit: MIXER_CONFIG.MIN_DEPOSIT.toString() }
            );
        }

        if (amount > MIXER_CONFIG.MAX_DEPOSIT) {
            throw new PrivacyError(
                `Maximum deposit is ${formatAmount(MIXER_CONFIG.MAX_DEPOSIT)} STRK`,
                { maxDeposit: MIXER_CONFIG.MAX_DEPOSIT.toString() }
            );
        }

        this.emit('deposit:started', { amount: amount.toString() });

        try {
            // Generate commitment
            const commitmentData = generateCommitment(amount);

            // Create commitment object
            const commitment: Commitment = {
                ...commitmentData,
                amount,
                createdAt: Date.now(),
            };

            // Execute deposit transaction
            const tx = await this.contract.deposit(
                commitmentData.commitment,
                cairo.uint256(amount)
            );

            // Wait for confirmation
            const receipt = await this.wallet.provider.waitForTransaction(tx.transaction_hash);

            // Get leaf index from events
            const leafIndex = this.extractLeafIndex(receipt);
            commitment.leafIndex = leafIndex;
            commitment.depositTxHash = tx.transaction_hash;

            // Store commitment locally
            this.commitments.set(commitmentData.commitment, commitment);

            const result: DepositResult = {
                txHash: tx.transaction_hash,
                commitment,
                leafIndex,
                blockNumber: (receipt as { block_number?: number }).block_number || 0,
            };

            this.emit('deposit:confirmed', { txHash: result.txHash, leafIndex });

            return result;
        } catch (error) {
            this.emit('deposit:failed', { error: String(error) });
            throw new PrivacyError(`Deposit failed: ${error}`, { error: String(error) });
        }
    }

    /**
     * Withdraw funds from the privacy mixer
     * 
     * @param params - Withdrawal parameters including the original commitment
     * @returns Withdrawal result
     */
    async withdraw(params: WithdrawParams): Promise<WithdrawResult> {
        const { commitment, recipient, amount, relayer, relayerFee } = params;

        this.emit('withdraw:started', { recipient, amount: amount.toString() });

        try {
            // Check if nullifier already used
            const isUsed = await this.isNullifierUsed(commitment.nullifierHash);
            if (isUsed) {
                throw new PrivacyError('This commitment has already been withdrawn');
            }

            // Generate Merkle proof
            this.emit('withdraw:proof-generating', {});
            const merkleProof = await this.getMerkleProof(commitment);

            // Generate ZK proof
            const zkProof = await this.generateWithdrawProof({
                commitment,
                merkleProof,
                recipient,
            });

            this.emit('withdraw:proof-generated', {});

            // Execute withdrawal
            const tx = await this.contract.withdraw(
                commitment.nullifierHash,
                recipient,
                cairo.uint256(amount),
                zkProof.proof
            );

            // Wait for confirmation
            await this.wallet.provider.waitForTransaction(tx.transaction_hash);

            const result: WithdrawResult = {
                txHash: tx.transaction_hash,
                amount,
                recipient,
                nullifierHash: commitment.nullifierHash,
            };

            this.emit('withdraw:completed', { txHash: result.txHash, recipient });

            return result;
        } catch (error) {
            this.emit('withdraw:failed', { error: String(error) });
            throw new PrivacyError(`Withdrawal failed: ${error}`, { error: String(error) });
        }
    }

    // ============================================================================
    // Proof Generation
    // ============================================================================

    /**
     * Generate ZK proof for withdrawal
     */
    async generateWithdrawProof(params: {
        commitment: Commitment;
        merkleProof: MerkleProof;
        recipient: string;
    }): Promise<ZKProof> {
        const { commitment, merkleProof, recipient } = params;

        try {
            // In production, this would call the Noir prover
            // For now, return a mock proof structure
            const proof: ZKProof = {
                proof: [
                    commitment.nullifierHash,
                    merkleProof.root,
                    recipient,
                    // Additional proof elements would be here
                ],
                publicInputs: [
                    commitment.nullifierHash,
                    merkleProof.root,
                    recipient,
                    commitment.amount.toString(),
                ],
            };

            return proof;
        } catch (error) {
            throw new ProofError(`Failed to generate proof: ${error}`);
        }
    }

    /**
     * Get Merkle proof for a commitment
     */
    async getMerkleProof(commitment: Commitment): Promise<MerkleProof> {
        if (commitment.leafIndex === undefined) {
            throw new PrivacyError('Commitment has no leaf index');
        }

        // Fetch all commitments from contract
        const allCommitments = await this.getAllCommitments();

        // Generate proof
        const proof = generateMerkleProof(allCommitments, commitment.leafIndex);

        return proof;
    }

    // ============================================================================
    // View Functions
    // ============================================================================

    /**
     * Get current Merkle root
     */
    async getMerkleRoot(): Promise<string> {
        const result = await this.contract.get_merkle_root();
        return result.toString();
    }

    /**
     * Get anonymity set size
     */
    async getAnonymitySetSize(): Promise<number> {
        const result = await this.contract.get_anonymity_set_size();
        return Number(result);
    }

    /**
     * Check if a nullifier has been used
     */
    async isNullifierUsed(nullifierHash: string): Promise<boolean> {
        const result = await this.contract.is_nullifier_used(nullifierHash);
        return Boolean(result);
    }

    /**
     * Get all commitments from the contract
     */
    async getAllCommitments(): Promise<string[]> {
        const size = await this.getAnonymitySetSize();
        const commitments: string[] = [];

        for (let i = 0; i < size; i++) {
            const commitment = await this.contract.get_commitment_at_index(i);
            commitments.push(commitment.toString());
        }

        return commitments;
    }

    /**
     * Get mixer statistics
     */
    async getStats(): Promise<MixerStats> {
        const anonymitySetSize = await this.getAnonymitySetSize();

        return {
            totalDeposits: 0n, // Would need to query from events
            totalWithdrawals: 0n,
            anonymitySetSize,
            activeCommitments: anonymitySetSize,
        };
    }

    // ============================================================================
    // Commitment Management
    // ============================================================================

    /**
     * Store a commitment locally
     */
    storeCommitment(commitment: Commitment): void {
        this.commitments.set(commitment.commitment, commitment);
    }

    /**
     * Get stored commitment
     */
    getCommitment(commitmentHash: string): Commitment | undefined {
        return this.commitments.get(commitmentHash);
    }

    /**
     * List all stored commitments
     */
    listCommitments(): Commitment[] {
        return Array.from(this.commitments.values());
    }

    /**
     * Export commitments for backup
     */
    exportCommitments(): string {
        const data = Array.from(this.commitments.values());
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    }

    /**
     * Import commitments from backup
     */
    importCommitments(json: string): void {
        const data = JSON.parse(json);
        for (const c of data) {
            const commitment: Commitment = {
                ...c,
                amount: BigInt(c.amount),
            };
            this.commitments.set(commitment.commitment, commitment);
        }
    }

    // ============================================================================
    // Private Methods
    // ============================================================================

    private extractLeafIndex(receipt: any): number {
        // Extract leaf index from deposit event
        const events = receipt.events || [];
        for (const event of events) {
            if (event.keys?.[0]?.includes('Deposit')) {
                return Number(event.data?.[1] || 0);
            }
        }
        return this.commitments.size;
    }

    private emit(type: string, data: Record<string, unknown>): void {
        if (this.eventCallback) {
            this.eventCallback({
                type: type as any,
                timestamp: Date.now(),
                data,
            });
        }
    }
}

// Export for direct import
export default PrivacyMixer;
