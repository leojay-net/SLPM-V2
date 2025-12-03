import * as _cashu_cashu_ts from '@cashu/cashu-ts';
import { CashuWallet, MintQuoteResult, TokenBalance } from './cashu/index.js';
export { CashuWalletOptions, SendResult } from './cashu/index.js';
import { P as PrivacyMixer, S as SLPMConfig, D as DepositParams, a as DepositResult, W as WithdrawParams, b as WithdrawResult, c as SwapParams, d as SwapResult, e as SwapDirection, f as SwapQuote, M as MixerStats } from './index-DfPNDdV0.js';
export { x as CashuError, k as CashuProof, j as CashuToken, C as Commitment, s as ConfigError, t as ConnectionError, m as MeltQuoteResult, h as MerkleProof, l as MintQuoteResult, u as PrivacyError, w as ProofError, r as SLPMError, o as SLPMEvent, p as SLPMEventCallback, n as SLPMEventType, v as SwapError, q as SwapStatus, i as SwapStep, g as WalletConnection, Z as ZKProof } from './index-DfPNDdV0.js';
import { Account } from 'starknet';
import { CrossChainSwapper } from './swaps/index.js';

/**
 * SLPM SDK Cryptographic Utilities
 */
/**
 * Generate random hex string
 */
declare function randomHex(bytes?: number): string;
/**
 * Hash data using SHA256
 */
declare function hash(data: string | Uint8Array): string;
/**
 * Pedersen hash (simplified - in production use actual Pedersen)
 * For compatibility with Starknet/Cairo
 */
declare function pedersenHash(a: string, b: string): string;
/**
 * Poseidon hash (simplified - in production use actual Poseidon)
 * For compatibility with Noir circuits
 */
declare function poseidonHash(inputs: string[]): string;
/**
 * Generate a commitment for the privacy mixer
 */
declare function generateCommitment(amount: bigint): {
    commitment: string;
    secret: string;
    nullifier: string;
    nullifierHash: string;
};
/**
 * Verify a commitment
 */
declare function verifyCommitment(secret: string, nullifier: string, amount: bigint, expectedCommitment: string): boolean;
/**
 * Compute Merkle root from leaves
 */
declare function computeMerkleRoot(leaves: string[]): string;
/**
 * Generate Merkle proof for a leaf
 */
declare function generateMerkleProof(leaves: string[], leafIndex: number): {
    pathElements: string[];
    pathIndices: number[];
    root: string;
};
/**
 * Verify a Merkle proof
 */
declare function verifyMerkleProof(leaf: string, pathElements: string[], pathIndices: number[], root: string): boolean;
/**
 * Format amount for display
 */
declare function formatAmount(amount: bigint, decimals?: number): string;
/**
 * Parse amount from string
 */
declare function parseAmount(amount: string, decimals?: number): bigint;

/**
 * Extended config with account for SLPM initialization
 */
interface SLPMInitConfig extends SLPMConfig {
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
declare class SLPM {
    private config;
    private wallet;
    readonly mixer: PrivacyMixer;
    readonly swapper: CrossChainSwapper;
    readonly cashu: CashuWallet;
    /**
     * Create a new SLPM instance
     *
     * @param config - Configuration options including Starknet account
     */
    constructor(config: SLPMInitConfig);
    /**
     * Deposit funds into the privacy mixer
     *
     * @param params - Deposit parameters with amount
     * @returns Deposit result with commitment (SAVE THIS!)
     */
    deposit(params: DepositParams): Promise<DepositResult>;
    /**
     * Withdraw funds from the privacy mixer
     *
     * @param params - Withdrawal parameters with commitment
     * @returns Withdrawal result
     */
    withdraw(params: WithdrawParams): Promise<WithdrawResult>;
    /**
     * Execute a cross-chain swap
     *
     * @param params - Swap parameters
     * @returns Swap result
     */
    swap(params: SwapParams): Promise<SwapResult>;
    /**
     * Get a quote for a cross-chain swap
     *
     * @param direction - Swap direction
     * @param amount - Amount to swap
     */
    getSwapQuote(direction: SwapDirection, amount: string): Promise<SwapQuote>;
    /**
     * Private send - deposit to mixer, then withdraw to recipient
     * Breaks the on-chain link between sender and recipient
     *
     * @param amount - Amount to send (in wei as bigint)
     * @param recipientAddress - Recipient's Starknet address
     * @param options - Additional options
     */
    privateSend(amount: bigint, recipientAddress: string, options?: {
        delayMs?: number;
        minAnonymitySetSize?: number;
    }): Promise<{
        depositResult: DepositResult;
        withdrawResult: WithdrawResult;
    }>;
    /**
     * Private cross-chain transfer with full privacy pipeline
     *
     * Uses: Mixer deposit → Cashu mint → Lightning swap → Cashu melt → Mixer withdraw
     *
     * @param params - Swap parameters with enhanced privacy
     */
    privateSwap(params: SwapParams): Promise<SwapResult>;
    /**
     * Mint Cashu tokens by paying a Lightning invoice
     *
     * @param amount - Amount in sats
     * @returns Mint quote with invoice
     */
    mintCashuTokens(amount: number): Promise<MintQuoteResult>;
    /**
     * Finalize minting after paying the invoice
     *
     * @param quoteId - Quote ID from mintCashuTokens
     */
    finalizeCashuMint(quoteId: string): Promise<MintQuoteResult>;
    /**
     * Pay a Lightning invoice using Cashu tokens
     *
     * @param invoice - Lightning invoice to pay
     */
    payCashuInvoice(invoice: string): Promise<{
        paid: boolean;
        preimage?: string;
        change: _cashu_cashu_ts.Proof[];
    }>;
    /**
     * Get Cashu wallet balance
     */
    getCashuBalance(): TokenBalance;
    /**
     * Get mixer statistics
     */
    getMixerStats(): Promise<MixerStats>;
    /**
     * Check if a nullifier has been used (commitment spent)
     *
     * @param nullifierHash - Nullifier hash to check
     */
    isNullifierUsed(nullifierHash: string): Promise<boolean>;
    /**
     * Wait until anonymity set reaches minimum size
     *
     * @param minSize - Minimum anonymity set size
     * @param timeoutMs - Timeout in milliseconds (default: 5 minutes)
     */
    waitForAnonymitySet(minSize: number, timeoutMs?: number): Promise<void>;
    /**
     * Generate a new commitment for future deposit
     *
     * @param amount - Amount for the commitment
     */
    createCommitment(amount: bigint): ReturnType<typeof generateCommitment>;
    /**
     * Get the connected wallet address
     */
    getAddress(): string;
    /**
     * Get the network
     */
    getNetwork(): 'mainnet' | 'sepolia';
    private delay;
    private log;
}

/**
 * SLPM SDK Constants
 */
declare const MAINNET_CONTRACTS: {
    readonly MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b";
    readonly VERIFIER: "";
    readonly STRK_TOKEN: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
};
declare const SEPOLIA_CONTRACTS: {
    readonly MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b";
    readonly VERIFIER: "";
    readonly STRK_TOKEN: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
};
declare const RPC_URLS: {
    readonly mainnet: "https://starknet-mainnet.public.blastapi.io";
    readonly sepolia: "https://starknet-sepolia.public.blastapi.io";
};
declare const CASHU_MINTS: {
    readonly mainnet: "https://mint.minibits.cash/Bitcoin";
    readonly testnet: "https://testnut.cashu.space";
};
declare const MIXER_CONFIG: {
    readonly MIN_DEPOSIT: bigint;
    readonly MAX_DEPOSIT: bigint;
    readonly FEE_RATE: 10n;
    readonly MERKLE_TREE_HEIGHT: 20;
};
declare const SWAP_CONFIG: {
    readonly MIN_AMOUNT_ZEC: 0.001;
    readonly MAX_AMOUNT_ZEC: 10;
    readonly MIN_AMOUNT_STRK: 1;
    readonly MAX_AMOUNT_STRK: 10000;
    readonly DEFAULT_SLIPPAGE: 1;
    readonly QUOTE_EXPIRY_MS: 60000;
    readonly POLL_INTERVAL_MS: 10000;
    readonly MAX_POLL_ATTEMPTS: 60;
};
declare const CURRENCIES: {
    readonly STRK: {
        readonly symbol: "STRK";
        readonly name: "Starknet Token";
        readonly decimals: 18;
        readonly chain: "starknet";
    };
    readonly ZEC: {
        readonly symbol: "ZEC";
        readonly name: "Zcash";
        readonly decimals: 8;
        readonly chain: "zcash";
    };
    readonly BTC: {
        readonly symbol: "BTC";
        readonly name: "Bitcoin";
        readonly decimals: 8;
        readonly chain: "bitcoin";
    };
    readonly BTCLN: {
        readonly symbol: "BTCLN";
        readonly name: "Bitcoin Lightning";
        readonly decimals: 8;
        readonly chain: "lightning";
    };
};

export { CASHU_MINTS, CURRENCIES, CashuWallet, CrossChainSwapper, DepositParams, DepositResult, MAINNET_CONTRACTS, MIXER_CONFIG, MixerStats, PrivacyMixer, RPC_URLS, SEPOLIA_CONTRACTS, SLPM, SLPMConfig, type SLPMInitConfig, SWAP_CONFIG, SwapDirection, SwapParams, SwapQuote, SwapResult, TokenBalance, WithdrawParams, WithdrawResult, computeMerkleRoot, SLPM as default, formatAmount, generateCommitment, generateMerkleProof, hash, parseAmount, pedersenHash, poseidonHash, randomHex, verifyCommitment, verifyMerkleProof };
