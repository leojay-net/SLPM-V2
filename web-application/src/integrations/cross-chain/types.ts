/**
 * Cross-Chain Bridge Types
 * Types for ZEC ↔ STRK cross-chain transfers
 */

export interface CrossChainStep {
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed' | 'skipped';
    txId?: string;
    error?: string;
    data?: Record<string, unknown>;
    startedAt?: number;
    completedAt?: number;
}

export interface CrossChainTransfer {
    id: string;
    direction: 'zec-to-strk' | 'strk-to-zec';
    from: {
        currency: 'ZEC' | 'STRK';
        amount: string;
        address?: string;
    };
    to: {
        currency: 'ZEC' | 'STRK';
        amount: string;
        address: string;
    };
    steps: CrossChainStep[];
    currentStepIndex: number;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    options: {
        useCashuFlow: boolean;
        usePrivacyMixer: boolean;
    };
    // Swap order references
    zecSwapOrderId?: string;
    zecSwapToken?: string;
    atomiqSwapId?: string;
    mixerCommitment?: string;
    mixerSecret?: string;  // CRITICAL: Must be stored securely
    // Timestamps
    createdAt: number;
    completedAt?: number;
    error?: string;
}

export interface ZecToStrkParams {
    zecAmount: number;
    recipientAddress: string;  // Starknet address
    useCashuFlow?: boolean;
    usePrivacyMixer?: boolean;
    onProgress?: (transfer: CrossChainTransfer) => void;
}

export interface StrkToZecParams {
    strkAmount: bigint;
    zecAddress: string;  // Use z-address for privacy!
    useCashuFlow?: boolean;
    usePrivacyMixer?: boolean;
    onProgress?: (transfer: CrossChainTransfer) => void;
}

export interface CrossChainConfig {
    // ZEC swap service
    fixedFloat: {
        apiKey: string;
        apiSecret: string;
    };
    // Starknet config
    starknet: {
        rpcUrl: string;
        mixerAddress: string;
        verifierAddress: string;
        privateKey?: string;  // For automated flows
    };
    // Atomiq config (you already have this)
    atomiq: {
        environment: 'testnet' | 'mainnet';
    };
    // Cashu config (you already have this)
    cashu?: {
        mintUrl: string;
    };
}
