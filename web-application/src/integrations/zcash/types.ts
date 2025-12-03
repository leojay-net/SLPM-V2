/**
 * ZEC Integration Types
 * Types for Zcash ↔ Lightning swap operations
 */

// ============ Swap Quote Types ============

export interface SwapQuote {
    id: string;
    from: {
        currency: 'ZEC' | 'BTCLN';
        amount: string;
        rate: string;
    };
    to: {
        currency: 'ZEC' | 'BTCLN';
        amount: string;
        rate: string;
    };
    minerFee: string;
    serviceFee: string;
    expiresAt: number;
}

// ============ Swap Order Types ============

export interface SwapOrder {
    id: string;
    status: SwapStatus;
    from: {
        currency: 'ZEC' | 'BTCLN';
        amount: string;
        address: string;      // Deposit address (ZEC) or Lightning invoice
        txId?: string;        // Transaction ID when confirmed
        confirmations?: number;
    };
    to: {
        currency: 'ZEC' | 'BTCLN';
        amount: string;
        address: string;      // Recipient address
        txId?: string;        // Transaction ID when sent
    };
    createdAt: number;
    expiresAt: number;
    emergency?: {
        address: string;      // Refund address
        txId?: string;
    };
}

export type SwapStatus =
    | 'new'           // Order created, waiting for deposit
    | 'pending'       // Deposit detected, waiting for confirmations
    | 'exchange'      // Exchanging
    | 'withdraw'      // Sending to recipient
    | 'done'          // Complete
    | 'expired'       // Order expired
    | 'emergency';    // Error, funds returned

export type SwapStatusSimple =
    | 'waiting'       // Waiting for deposit
    | 'confirming'    // Confirming deposit
    | 'exchanging'    // Swapping
    | 'sending'       // Sending to recipient
    | 'complete'      // Done
    | 'failed';       // Failed/expired

// ============ API Response Types ============

export interface FixedFloatPriceResponse {
    code: number;
    msg: string;
    data: {
        from: {
            currency: string;
            network: string;
            amount: string;
            rate: string;
            precision: number;
            min: string;
            max: string;
        };
        to: {
            currency: string;
            network: string;
            amount: string;
            rate: string;
            precision: number;
        };
        errors?: string[];
    };
}

export interface FixedFloatOrderResponse {
    code: number;
    msg: string;
    data: {
        id: string;
        type: string;
        email: string;
        status: string;
        time: {
            reg: number;
            start: number | null;
            finish: number | null;
            update: number;
            expiration: number;
            left: number;
        };
        from: {
            currency: string;
            network: string;
            amount: string;
            rate: string;
            address: string;
            addressAlt: string | null;
            tag: string | null;
            tagName: string | null;
            reqConfirmations: number;
            maxConfirmations: number;
            tx: {
                id: string | null;
                amount: string | null;
                fee: string | null;
                ccyfee: string | null;
                timeReg: number | null;
                timeBlock: number | null;
                confirmations: number | null;
            };
        };
        to: {
            currency: string;
            network: string;
            amount: string;
            rate: string;
            address: string;
            tag: string | null;
            tx: {
                id: string | null;
                amount: string | null;
                fee: string | null;
                ccyfee: string | null;
                timeReg: number | null;
                timeBlock: number | null;
                confirmations: number | null;
            };
        };
        back: {
            currency: string;
            network: string;
            address: string | null;
            tag: string | null;
        };
        emergency: {
            status: string[];
            choice: string;
            repeat: string;
        };
        token: string;
    };
}

export interface FixedFloatStatusResponse {
    code: number;
    msg: string;
    data: {
        id: string;
        status: string;
        from: {
            tx: {
                id: string | null;
                confirmations: number | null;
            };
        };
        to: {
            tx: {
                id: string | null;
            };
        };
    };
}

// ============ Configuration Types ============

export interface ZecSwapConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl?: string;
    testMode?: boolean;
}

// ============ Cross-Chain Transfer Types ============

export interface CrossChainStep {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    txId?: string;
    error?: string;
    startedAt?: number;
    completedAt?: number;
}

export interface CrossChainTransfer {
    id: string;
    direction: 'zec-to-strk' | 'strk-to-zec';
    from: {
        currency: 'ZEC' | 'STRK';
        amount: string;
        address: string;
    };
    to: {
        currency: 'ZEC' | 'STRK';
        amount: string;
        address: string;
    };
    steps: CrossChainStep[];
    currentStepIndex: number;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    useCashuFlow: boolean;
    createdAt: number;
    completedAt?: number;
    error?: string;
}
