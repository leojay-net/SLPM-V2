import { Account, RpcProvider } from 'starknet';

/**
 * SLPM SDK Type Definitions
 *
 * Core types for the Starknet Lightning Privacy Mixer SDK
 */

interface SLPMConfig {
    /** Starknet RPC URL */
    rpcUrl: string;
    /** Network: mainnet or sepolia testnet */
    network: 'mainnet' | 'sepolia';
    /** Privacy mixer contract address (optional, uses default) */
    mixerContractAddress?: string;
    /** Verifier contract address (optional, uses default) */
    verifierContractAddress?: string;
    /** Cashu mint URL (optional, uses default) */
    cashuMintUrl?: string;
    /** FixedFloat API credentials (required for cross-chain swaps) */
    fixedFloat?: {
        apiKey: string;
        apiSecret: string;
    };
    /** Enable debug logging */
    debug?: boolean;
}
interface WalletConnection {
    /** Connected Starknet account */
    account: Account;
    /** RPC provider */
    provider: RpcProvider;
    /** Wallet address */
    address: string;
}
/**
 * Commitment data - MUST be stored securely by the user
 * This is required to withdraw funds from the mixer
 */
interface Commitment {
    /** The commitment hash (stored on-chain) */
    commitment: string;
    /** Secret value - KEEP PRIVATE */
    secret: string;
    /** Nullifier - derived from secret */
    nullifier: string;
    /** Hash of nullifier (used to prevent double-spend) */
    nullifierHash: string;
    /** Amount deposited (in wei) */
    amount: bigint;
    /** Leaf index in Merkle tree (set after deposit) */
    leafIndex?: number;
    /** Deposit transaction hash */
    depositTxHash?: string;
    /** Timestamp of creation */
    createdAt: number;
}
interface MerkleProof {
    /** Path elements (sibling hashes) */
    pathElements: string[];
    /** Path indices (0=left, 1=right) */
    pathIndices: number[];
    /** Merkle root */
    root: string;
}
interface DepositParams {
    /** Amount to deposit in wei (e.g., 1e18 for 1 STRK) */
    amount: bigint;
    /** Token address (default: STRK) */
    tokenAddress?: string;
}
interface DepositResult {
    /** Transaction hash */
    txHash: string;
    /** Commitment data - SAVE THIS */
    commitment: Commitment;
    /** Leaf index in Merkle tree */
    leafIndex: number;
    /** Block number */
    blockNumber: number;
}
interface WithdrawParams {
    /** Commitment from deposit */
    commitment: Commitment;
    /** Recipient address */
    recipient: string;
    /** Amount to withdraw */
    amount: bigint;
    /** Optional relayer for enhanced privacy */
    relayer?: string;
    /** Relayer fee */
    relayerFee?: bigint;
}
interface WithdrawResult {
    /** Transaction hash */
    txHash: string;
    /** Amount withdrawn */
    amount: bigint;
    /** Recipient address */
    recipient: string;
    /** Nullifier hash (now spent) */
    nullifierHash: string;
}
interface ZKProof {
    /** Proof data */
    proof: string[];
    /** Public inputs */
    publicInputs: string[];
}
interface MixerStats {
    /** Total deposited amount */
    totalDeposits: bigint;
    /** Total withdrawn amount */
    totalWithdrawals: bigint;
    /** Current anonymity set size */
    anonymitySetSize: number;
    /** Number of active commitments */
    activeCommitments: number;
}
type SwapDirection = 'strk-to-zec' | 'zec-to-strk' | 'strk-to-btc' | 'btc-to-strk';
interface SwapQuote {
    /** Unique quote ID */
    id: string;
    /** Input amount */
    inputAmount: string;
    /** Input currency */
    inputCurrency: string;
    /** Expected output amount */
    outputAmount: string;
    /** Output currency */
    outputCurrency: string;
    /** Exchange rate */
    rate: number;
    /** Fee percentage */
    feePercent: number;
    /** Quote expiry timestamp */
    expiresAt: number;
    /** Minimum acceptable output */
    minOutput: string;
}
interface SwapParams {
    /** Swap direction */
    direction: SwapDirection;
    /** Amount to swap */
    amount: string;
    /** Destination address (ZEC or STRK address) */
    destinationAddress: string;
    /** Enable privacy mixer pre/post processing */
    usePrivacyMixer?: boolean;
    /** Enable Cashu ecash layer */
    useCashuFlow?: boolean;
    /** Slippage tolerance (0-100) */
    slippageTolerance?: number;
}
interface SwapResult {
    /** Unique swap ID */
    id: string;
    /** Swap direction */
    direction: SwapDirection;
    /** Input amount */
    inputAmount: string;
    /** Output amount */
    outputAmount: string;
    /** Current status */
    status: SwapStatus;
    /** Steps completed */
    steps: SwapStep[];
    /** Current step index */
    currentStepIndex: number;
    /** Timestamps */
    timestamps: {
        created: number;
        updated: number;
        completed?: number;
    };
    /** Transaction hashes */
    txHashes: {
        deposit?: string;
        mixerDeposit?: string;
        mixerWithdraw?: string;
        swap?: string;
    };
    /** Error message if failed */
    error?: string;
}
type SwapStatus = 'pending' | 'awaiting-deposit' | 'depositing' | 'mixing' | 'swapping' | 'delivering' | 'completed' | 'failed' | 'expired';
interface SwapStep {
    /** Step ID */
    id: number;
    /** Step name */
    name: string;
    /** Description */
    description: string;
    /** Status */
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    /** Extra data */
    data?: Record<string, unknown>;
}
interface CashuToken {
    /** Encoded token string */
    token: string;
    /** Amount in sats */
    amount: number;
    /** Mint URL */
    mint: string;
}
interface CashuProof {
    /** Keyset ID */
    id: string;
    /** Amount */
    amount: number;
    /** Secret */
    secret: string;
    /** Signature (C) */
    C: string;
}
interface MintQuoteResult {
    /** Quote ID */
    quoteId: string;
    /** Lightning invoice to pay */
    invoice: string;
    /** Amount in sats */
    amount: number;
    /** Expiry timestamp */
    expiresAt: number;
}
interface MeltQuoteResult {
    /** Quote ID */
    quoteId: string;
    /** Amount to melt */
    amount: number;
    /** Fee reserve */
    feeReserve: number;
    /** Expiry timestamp */
    expiresAt: number;
}
type SLPMEventType = 'initialized' | 'connected' | 'disconnected' | 'deposit:started' | 'deposit:confirmed' | 'deposit:failed' | 'withdraw:started' | 'withdraw:proof-generating' | 'withdraw:proof-generated' | 'withdraw:completed' | 'withdraw:failed' | 'swap:initiated' | 'swap:step-changed' | 'swap:completed' | 'swap:failed' | 'cashu:minting' | 'cashu:minted' | 'cashu:melting' | 'cashu:melted' | 'error';
interface SLPMEvent<T = unknown> {
    /** Event type */
    type: SLPMEventType;
    /** Timestamp */
    timestamp: number;
    /** Event data */
    data: T;
}
type SLPMEventCallback<T = unknown> = (event: SLPMEvent<T>) => void;
declare class SLPMError extends Error {
    readonly code: string;
    readonly details?: Record<string, unknown>;
    constructor(message: string, code: string, details?: Record<string, unknown>);
}
declare class ConfigError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}
declare class ConnectionError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}
declare class PrivacyError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}
declare class SwapError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}
declare class ProofError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}
declare class CashuError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>);
}

/**
 * SLPM SDK - Privacy Mixer Module
 *
 * Provides ZK-based private deposits and withdrawals on Starknet
 */

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
declare class PrivacyMixer {
    private config;
    private wallet;
    private contract;
    private eventCallback?;
    private commitments;
    constructor(config: SLPMConfig, wallet: WalletConnection, eventCallback?: SLPMEventCallback);
    /**
     * Deposit funds into the privacy mixer
     *
     * @param params - Deposit parameters
     * @returns Deposit result including commitment (SAVE THIS!)
     */
    deposit(params: DepositParams): Promise<DepositResult>;
    /**
     * Withdraw funds from the privacy mixer
     *
     * @param params - Withdrawal parameters including the original commitment
     * @returns Withdrawal result
     */
    withdraw(params: WithdrawParams): Promise<WithdrawResult>;
    /**
     * Generate ZK proof for withdrawal
     */
    generateWithdrawProof(params: {
        commitment: Commitment;
        merkleProof: MerkleProof;
        recipient: string;
    }): Promise<ZKProof>;
    /**
     * Get Merkle proof for a commitment
     */
    getMerkleProof(commitment: Commitment): Promise<MerkleProof>;
    /**
     * Get current Merkle root
     */
    getMerkleRoot(): Promise<string>;
    /**
     * Get anonymity set size
     */
    getAnonymitySetSize(): Promise<number>;
    /**
     * Check if a nullifier has been used
     */
    isNullifierUsed(nullifierHash: string): Promise<boolean>;
    /**
     * Get all commitments from the contract
     */
    getAllCommitments(): Promise<string[]>;
    /**
     * Get mixer statistics
     */
    getStats(): Promise<MixerStats>;
    /**
     * Store a commitment locally
     */
    storeCommitment(commitment: Commitment): void;
    /**
     * Get stored commitment
     */
    getCommitment(commitmentHash: string): Commitment | undefined;
    /**
     * List all stored commitments
     */
    listCommitments(): Commitment[];
    /**
     * Export commitments for backup
     */
    exportCommitments(): string;
    /**
     * Import commitments from backup
     */
    importCommitments(json: string): void;
    private extractLeafIndex;
    private emit;
}

export { type Commitment as C, type DepositParams as D, type MixerStats as M, PrivacyMixer as P, type SLPMConfig as S, type WithdrawParams as W, type ZKProof as Z, type DepositResult as a, type WithdrawResult as b, type SwapParams as c, type SwapResult as d, type SwapDirection as e, type SwapQuote as f, type WalletConnection as g, type MerkleProof as h, type SwapStep as i, type CashuToken as j, type CashuProof as k, type MintQuoteResult as l, type MeltQuoteResult as m, type SLPMEventType as n, type SLPMEvent as o, type SLPMEventCallback as p, type SwapStatus as q, SLPMError as r, ConfigError as s, ConnectionError as t, PrivacyError as u, SwapError as v, ProofError as w, CashuError as x };
