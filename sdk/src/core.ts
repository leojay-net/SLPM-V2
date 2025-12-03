/**
 * SLPM SDK - Core Orchestrator
 * 
 * Main entry point that combines Privacy Mixer, Cross-Chain Swaps, and Cashu Wallet
 * into a unified interface for privacy-preserving Starknet transactions.
 */

import { Account, RpcProvider } from 'starknet';
import type {
    SLPMConfig,
    WalletConnection,
    Commitment,
    DepositParams,
    DepositResult,
    WithdrawParams,
    WithdrawResult,
    SwapParams,
    SwapResult,
    SwapDirection,
} from './types';
import {
    MAINNET_CONTRACTS,
    SEPOLIA_CONTRACTS,
    RPC_URLS,
    CASHU_MINTS,
} from './constants';
import { generateCommitment } from './crypto';
import { PrivacyMixer } from './privacy';
import { CrossChainSwapper } from './swaps';
import { CashuWallet } from './cashu';

/**
 * Extended config with account for SLPM initialization
 */
export interface SLPMInitConfig extends SLPMConfig {
    /** Starknet account for signing transactions */
    account: Account;
}

/**
 * SLPM - Starknet Lightning Privacy Mixer SDK
 * 
 * The main class that orchestrates all privacy features:
 * - On-chain privacy mixer (deposit/withdraw with commitments)
 * - Cross-chain swaps (STRK ↔ BTC/ZEC via Lightning)
 * - Cashu ecash (privacy-preserving payment layer)
 * 
 * @example
 * ```typescript
 * import { SLPM } from '@slpm/sdk';
 * import { Account, RpcProvider } from 'starknet';
 * 
 * const provider = new RpcProvider({ nodeUrl: 'https://...' });
 * const account = new Account(provider, address, privateKey);
 * 
 * // Initialize SLPM
 * const slpm = new SLPM({
 *   rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
 *   network: 'mainnet',
 *   account,
 *   cashuMintUrl: 'https://mint.minibits.cash/Bitcoin',
 * });
 * 
 * // Privacy mixer deposit
 * const result = await slpm.deposit({
 *   amount: BigInt('1000000000000000000'), // 1 STRK
 * });
 * console.log('Save this commitment:', result.commitment);
 * 
 * // Later, withdraw to a different address
 * await slpm.withdraw({
 *   commitment: result.commitment,
 *   recipient: '0x...',
 *   amount: BigInt('1000000000000000000'),
 * });
 * 
 * // Cross-chain swap with privacy
 * await slpm.swap({
 *   direction: 'strk-to-btc',
 *   amount: '1',
 *   destinationAddress: 'bc1q...',
 *   usePrivacyMixer: true,
 *   useCashuFlow: true,
 * });
 * ```
 */
export class SLPM {
    private config: SLPMInitConfig;
    private wallet: WalletConnection;

    // Sub-modules
    public readonly mixer: PrivacyMixer;
    public readonly swapper: CrossChainSwapper;
    public readonly cashu: CashuWallet;

    /**
     * Create a new SLPM instance
     * 
     * @param config - Configuration options including Starknet account
     */
    constructor(config: SLPMInitConfig) {
        this.config = config;

        // Set up provider
        const rpcUrl = config.rpcUrl || RPC_URLS[config.network];
        const provider = new RpcProvider({ nodeUrl: rpcUrl });

        // Create wallet connection
        this.wallet = {
            account: config.account,
            provider,
            address: config.account.address,
        };

        // Determine cashu mint URL
        const cashuMintUrl = config.cashuMintUrl || CASHU_MINTS.mainnet;

        // Initialize sub-modules
        this.mixer = new PrivacyMixer(config, this.wallet);
        this.swapper = new CrossChainSwapper(config, this.wallet, this.mixer);
        this.cashu = new CashuWallet({
            mintUrl: cashuMintUrl,
            debug: config.debug,
        });

        this.log('SLPM initialized', {
            network: config.network,
            address: this.wallet.address,
        });
    }

    // ==========================================
    // High-Level Privacy Operations
    // ==========================================

    /**
     * Deposit funds into the privacy mixer
     * 
     * @param params - Deposit parameters with amount
     * @returns Deposit result with commitment (SAVE THIS!)
     */
    async deposit(params: DepositParams): Promise<DepositResult> {
        return this.mixer.deposit(params);
    }

    /**
     * Withdraw funds from the privacy mixer
     * 
     * @param params - Withdrawal parameters with commitment
     * @returns Withdrawal result
     */
    async withdraw(params: WithdrawParams): Promise<WithdrawResult> {
        return this.mixer.withdraw(params);
    }

    /**
     * Execute a cross-chain swap
     * 
     * @param params - Swap parameters
     * @returns Swap result
     */
    async swap(params: SwapParams): Promise<SwapResult> {
        return this.swapper.swap(params);
    }

    /**
     * Get a quote for a cross-chain swap
     * 
     * @param direction - Swap direction
     * @param amount - Amount to swap
     */
    async getSwapQuote(direction: SwapDirection, amount: string) {
        return this.swapper.getQuote(direction, amount);
    }

    // ==========================================
    // Privacy-Enhanced Flows
    // ==========================================

    /**
     * Private send - deposit to mixer, then withdraw to recipient
     * Breaks the on-chain link between sender and recipient
     * 
     * @param amount - Amount to send (in wei as bigint)
     * @param recipientAddress - Recipient's Starknet address
     * @param options - Additional options
     */
    async privateSend(
        amount: bigint,
        recipientAddress: string,
        options?: {
            delayMs?: number;
            minAnonymitySetSize?: number;
        }
    ): Promise<{
        depositResult: DepositResult;
        withdrawResult: WithdrawResult;
    }> {
        // Step 1: Deposit to mixer
        const depositResult = await this.deposit({ amount });

        this.log('Private send: deposited', { txHash: depositResult.txHash });

        // Wait for minimum anonymity set if specified
        if (options?.minAnonymitySetSize) {
            await this.waitForAnonymitySet(options.minAnonymitySetSize);
        }

        // Optional delay for privacy
        if (options?.delayMs) {
            await this.delay(options.delayMs);
        }

        // Step 2: Withdraw to recipient
        const withdrawResult = await this.withdraw({
            commitment: depositResult.commitment,
            recipient: recipientAddress,
            amount,
        });

        this.log('Private send: withdrawn', { txHash: withdrawResult.txHash });

        return {
            depositResult,
            withdrawResult,
        };
    }

    /**
     * Private cross-chain transfer with full privacy pipeline
     * 
     * Uses: Mixer deposit → Cashu mint → Lightning swap → Cashu melt → Mixer withdraw
     * 
     * @param params - Swap parameters with enhanced privacy
     */
    async privateSwap(params: SwapParams): Promise<SwapResult> {
        // Enable all privacy features
        const enhancedParams: SwapParams = {
            ...params,
            usePrivacyMixer: true,
            useCashuFlow: true,
        };

        return this.swap(enhancedParams);
    }

    // ==========================================
    // Cashu Operations
    // ==========================================

    /**
     * Mint Cashu tokens by paying a Lightning invoice
     * 
     * @param amount - Amount in sats
     * @returns Mint quote with invoice
     */
    async mintCashuTokens(amount: number) {
        await this.cashu.init();
        return this.cashu.getMintQuote(amount);
    }

    /**
     * Finalize minting after paying the invoice
     * 
     * @param quoteId - Quote ID from mintCashuTokens
     */
    async finalizeCashuMint(quoteId: string) {
        await this.cashu.init();
        // Use receive with encoded token after payment confirmed
        const isPaid = await this.cashu.checkMintQuote(quoteId);
        if (!isPaid) {
            throw new Error('Mint quote not yet paid');
        }
        // Internal method access through mint
        return this.cashu.getMintQuote(0); // Placeholder - actual mint uses internal
    }

    /**
     * Pay a Lightning invoice using Cashu tokens
     * 
     * @param invoice - Lightning invoice to pay
     */
    async payCashuInvoice(invoice: string) {
        await this.cashu.init();
        const quoteResult = await this.cashu.getMeltQuote(invoice);
        const proofs = this.cashu.getProofs();
        // Need to get the full melt quote response - fetch it again
        const meltQuote = await (this.cashu as any).cashuWallet?.checkMeltQuote(quoteResult.quote);
        if (!meltQuote) throw new Error('Failed to get melt quote');
        return this.cashu.meltTokens(meltQuote, proofs);
    }

    /**
     * Get Cashu wallet balance
     */
    getCashuBalance() {
        return this.cashu.getBalance();
    }

    // ==========================================
    // Utility Methods
    // ==========================================

    /**
     * Get mixer statistics
     */
    async getMixerStats() {
        return this.mixer.getStats();
    }

    /**
     * Check if a nullifier has been used (commitment spent)
     * 
     * @param nullifierHash - Nullifier hash to check
     */
    async isNullifierUsed(nullifierHash: string): Promise<boolean> {
        return this.mixer.isNullifierUsed(nullifierHash);
    }

    /**
     * Wait until anonymity set reaches minimum size
     * 
     * @param minSize - Minimum anonymity set size
     * @param timeoutMs - Timeout in milliseconds (default: 5 minutes)
     */
    async waitForAnonymitySet(
        minSize: number,
        timeoutMs: number = 300000
    ): Promise<void> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            const stats = await this.mixer.getStats();

            if (stats.anonymitySetSize >= minSize) {
                this.log('Anonymity set reached', { currentSize: stats.anonymitySetSize, minSize });
                return;
            }

            // Wait before checking again
            await this.delay(10000);
        }

        throw new Error(`Timeout waiting for anonymity set (min: ${minSize})`);
    }

    /**
     * Generate a new commitment for future deposit
     * 
     * @param amount - Amount for the commitment
     */
    createCommitment(amount: bigint): ReturnType<typeof generateCommitment> {
        return generateCommitment(amount);
    }

    /**
     * Get the connected wallet address
     */
    getAddress(): string {
        return this.wallet.address;
    }

    /**
     * Get the network
     */
    getNetwork(): 'mainnet' | 'sepolia' {
        return this.config.network;
    }

    // ==========================================
    // Private Helpers
    // ==========================================

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private log(message: string, data?: Record<string, unknown>): void {
        if (this.config.debug) {
            console.log(`[SLPM] ${message}`, data || '');
        }
    }
}

export default SLPM;
