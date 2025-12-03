/**
 * SLPM SDK - Starknet Lightning Privacy Mixer
 * 
 * A comprehensive SDK for privacy-preserving transactions on Starknet,
 * integrating Lightning Network swaps and Cashu ecash.
 * 
 * @packageDocumentation
 */

// Core SLPM class
export { SLPM, default } from './core';
export type { SLPMInitConfig } from './core';

// Privacy Mixer
export { PrivacyMixer } from './privacy';

// Cross-Chain Swaps
export { CrossChainSwapper } from './swaps';

// Cashu Wallet
export { CashuWallet } from './cashu';
export type { CashuWalletOptions, TokenBalance, SendResult } from './cashu/wallet';

// Crypto utilities
export {
    generateCommitment,
    verifyCommitment,
    randomHex,
    hash,
    pedersenHash,
    poseidonHash,
    computeMerkleRoot,
    generateMerkleProof,
    verifyMerkleProof,
    formatAmount,
    parseAmount,
} from './crypto';

// Constants
export {
    MAINNET_CONTRACTS,
    SEPOLIA_CONTRACTS,
    RPC_URLS,
    CASHU_MINTS,
    MIXER_CONFIG,
    SWAP_CONFIG,
    CURRENCIES,
} from './constants';

// Types
export type {
    // Config types
    SLPMConfig,
    WalletConnection,

    // Commitment types
    Commitment,
    MerkleProof,
    ZKProof,

    // Operation types
    DepositParams,
    DepositResult,
    WithdrawParams,
    WithdrawResult,
    SwapParams,
    SwapDirection,

    // Result types
    SwapResult,
    SwapQuote,
    SwapStep,
    MixerStats,

    // Cashu types
    CashuToken,
    CashuProof,
    MintQuoteResult,
    MeltQuoteResult,

    // Event types
    SLPMEventType,
    SLPMEvent,
    SLPMEventCallback,

    // Status types
    SwapStatus,

    // Error types
    SLPMError,
    ConfigError,
    ConnectionError,
    PrivacyError,
    SwapError,
    ProofError,
    CashuError,
} from './types';
