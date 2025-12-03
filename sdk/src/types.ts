/**
 * SLPM SDK Type Definitions
 * 
 * Core types for the Starknet Lightning Privacy Mixer SDK
 */

import type { Account, Provider, RpcProvider } from 'starknet';

// ============================================================================
// Configuration Types
// ============================================================================

export interface SLPMConfig {
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

export interface WalletConnection {
    /** Connected Starknet account */
    account: Account;
    /** RPC provider */
    provider: RpcProvider;
    /** Wallet address */
    address: string;
}

// ============================================================================
// Privacy Mixer Types
// ============================================================================

/**
 * Commitment data - MUST be stored securely by the user
 * This is required to withdraw funds from the mixer
 */
export interface Commitment {
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

export interface MerkleProof {
    /** Path elements (sibling hashes) */
    pathElements: string[];
    /** Path indices (0=left, 1=right) */
    pathIndices: number[];
    /** Merkle root */
    root: string;
}

export interface DepositParams {
    /** Amount to deposit in wei (e.g., 1e18 for 1 STRK) */
    amount: bigint;
    /** Token address (default: STRK) */
    tokenAddress?: string;
}

export interface DepositResult {
    /** Transaction hash */
    txHash: string;
    /** Commitment data - SAVE THIS */
    commitment: Commitment;
    /** Leaf index in Merkle tree */
    leafIndex: number;
    /** Block number */
    blockNumber: number;
}

export interface WithdrawParams {
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

export interface WithdrawResult {
    /** Transaction hash */
    txHash: string;
    /** Amount withdrawn */
    amount: bigint;
    /** Recipient address */
    recipient: string;
    /** Nullifier hash (now spent) */
    nullifierHash: string;
}

export interface ZKProof {
    /** Proof data */
    proof: string[];
    /** Public inputs */
    publicInputs: string[];
}

export interface MixerStats {
    /** Total deposited amount */
    totalDeposits: bigint;
    /** Total withdrawn amount */
    totalWithdrawals: bigint;
    /** Current anonymity set size */
    anonymitySetSize: number;
    /** Number of active commitments */
    activeCommitments: number;
}

// ============================================================================
// Cross-Chain Swap Types
// ============================================================================

export type SwapDirection =
    | 'strk-to-zec'
    | 'zec-to-strk'
    | 'strk-to-btc'
    | 'btc-to-strk';

export interface SwapQuote {
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

export interface SwapParams {
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

export interface SwapResult {
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

export type SwapStatus =
    | 'pending'
    | 'awaiting-deposit'
    | 'depositing'
    | 'mixing'
    | 'swapping'
    | 'delivering'
    | 'completed'
    | 'failed'
    | 'expired';

export interface SwapStep {
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

// ============================================================================
// Cashu Ecash Types
// ============================================================================

export interface CashuToken {
    /** Encoded token string */
    token: string;
    /** Amount in sats */
    amount: number;
    /** Mint URL */
    mint: string;
}

export interface CashuProof {
    /** Keyset ID */
    id: string;
    /** Amount */
    amount: number;
    /** Secret */
    secret: string;
    /** Signature (C) */
    C: string;
}

export interface MintQuoteResult {
    /** Quote ID */
    quoteId: string;
    /** Lightning invoice to pay */
    invoice: string;
    /** Amount in sats */
    amount: number;
    /** Expiry timestamp */
    expiresAt: number;
}

export interface MeltQuoteResult {
    /** Quote ID */
    quoteId: string;
    /** Amount to melt */
    amount: number;
    /** Fee reserve */
    feeReserve: number;
    /** Expiry timestamp */
    expiresAt: number;
}

// ============================================================================
// Event Types
// ============================================================================

export type SLPMEventType =
    | 'initialized'
    | 'connected'
    | 'disconnected'
    | 'deposit:started'
    | 'deposit:confirmed'
    | 'deposit:failed'
    | 'withdraw:started'
    | 'withdraw:proof-generating'
    | 'withdraw:proof-generated'
    | 'withdraw:completed'
    | 'withdraw:failed'
    | 'swap:initiated'
    | 'swap:step-changed'
    | 'swap:completed'
    | 'swap:failed'
    | 'cashu:minting'
    | 'cashu:minted'
    | 'cashu:melting'
    | 'cashu:melted'
    | 'error';

export interface SLPMEvent<T = unknown> {
    /** Event type */
    type: SLPMEventType;
    /** Timestamp */
    timestamp: number;
    /** Event data */
    data: T;
}

export type SLPMEventCallback<T = unknown> = (event: SLPMEvent<T>) => void;

// ============================================================================
// Error Types
// ============================================================================

export class SLPMError extends Error {
    public readonly code: string;
    public readonly details?: Record<string, unknown>;

    constructor(message: string, code: string, details?: Record<string, unknown>) {
        super(message);
        this.name = 'SLPMError';
        this.code = code;
        this.details = details;
    }
}

export class ConfigError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'CONFIG_ERROR', details);
        this.name = 'ConfigError';
    }
}

export class ConnectionError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'CONNECTION_ERROR', details);
        this.name = 'ConnectionError';
    }
}

export class PrivacyError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'PRIVACY_ERROR', details);
        this.name = 'PrivacyError';
    }
}

export class SwapError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'SWAP_ERROR', details);
        this.name = 'SwapError';
    }
}

export class ProofError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'PROOF_ERROR', details);
        this.name = 'ProofError';
    }
}

export class CashuError extends SLPMError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'CASHU_ERROR', details);
        this.name = 'CashuError';
    }
}
