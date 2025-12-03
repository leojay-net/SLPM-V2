import { Proof, MeltQuoteResponse } from '@cashu/cashu-ts';

/**
 * SLPM SDK - Cashu Ecash Wallet Integration
 *
 * Provides privacy-preserving payment capabilities using Cashu ecash protocol.
 */

/**
 * Configuration options for CashuWallet
 */
interface CashuWalletOptions {
    /** Mint URL to connect to */
    mintUrl?: string;
    /** Unit of currency (default: 'sat') */
    unit?: string;
    /** Enable debug logging */
    debug?: boolean;
}
/**
 * Token balance information
 */
interface TokenBalance {
    /** Total balance in tokens */
    total: number;
    /** Number of proofs/tokens held */
    proofCount: number;
    /** Breakdown by denomination */
    denominations: Record<number, number>;
}
/**
 * Send result containing token and change
 */
interface SendResult {
    /** Encoded token to send */
    token: string;
    /** Change tokens to keep */
    change: Proof[];
}
/**
 * Mint quote result
 */
interface MintQuoteResult {
    /** Quote ID */
    quote: string;
    /** Lightning invoice to pay */
    request: string;
    /** Whether quote has been paid */
    paid: boolean;
    /** Expiry timestamp */
    expiry: number;
}
/**
 * Melt quote result
 */
interface MeltQuoteResult {
    /** Quote ID */
    quote: string;
    /** Amount to melt */
    amount: number;
    /** Fee estimate */
    fee: number;
    /** Whether melt has been completed */
    paid: boolean;
    /** Expiry timestamp */
    expiry: number;
}
/**
 * CashuWallet - Privacy-preserving ecash wallet
 *
 * Implements the Cashu protocol for private Lightning payments:
 * - Mint: Convert Lightning sats to ecash tokens
 * - Melt: Convert ecash tokens back to Lightning
 * - Send/Receive: Transfer ecash tokens peer-to-peer
 *
 * @example
 * ```typescript
 * const wallet = new CashuWallet({
 *   mintUrl: 'https://mint.minibits.cash/Bitcoin'
 * });
 *
 * // Mint tokens from Lightning
 * const quote = await wallet.getMintQuote(1000);
 * // ... pay the Lightning invoice (quote.request) ...
 * const tokens = await wallet.mintTokens(1000, quote.quote);
 *
 * // Send tokens privately
 * const { token } = await wallet.send(tokens, 500);
 *
 * // Receive tokens
 * const received = await wallet.receive(token);
 *
 * // Melt tokens to Lightning
 * const meltQuote = await wallet.getMeltQuote('lnbc...');
 * await wallet.meltTokens(meltQuote, tokens);
 * ```
 */
declare class CashuWallet {
    private mintUrl;
    private unit;
    private debug;
    private cashuMint;
    private cashuWallet;
    private proofs;
    private initialized;
    constructor(options?: CashuWalletOptions);
    /**
     * Initialize connection to the mint
     */
    init(): Promise<void>;
    /**
     * Ensure wallet is initialized
     */
    private ensureInitialized;
    /**
     * Get a mint quote (request to convert Lightning sats to ecash)
     *
     * @param amount - Amount in sats to mint
     * @returns Quote with Lightning invoice to pay
     */
    getMintQuote(amount: number): Promise<MintQuoteResult>;
    /**
     * Check if a mint quote has been paid
     *
     * @param quoteId - Quote ID to check
     * @returns Whether the quote has been paid
     */
    checkMintQuote(quoteId: string): Promise<boolean>;
    /**
     * Mint ecash tokens after paying the Lightning invoice
     *
     * @param amount - Amount to mint
     * @param quoteId - Quote ID from getMintQuote
     * @returns Minted proofs
     */
    mintTokens(amount: number, quoteId: string): Promise<Proof[]>;
    /**
     * Get a melt quote (request to convert ecash to Lightning payment)
     *
     * @param invoice - Lightning invoice to pay
     * @returns Quote with fee estimate
     */
    getMeltQuote(invoice: string): Promise<MeltQuoteResult>;
    /**
     * Melt ecash tokens to pay a Lightning invoice
     *
     * @param meltQuote - Melt quote response from getMeltQuote
     * @param proofs - Proofs to melt
     * @returns Payment result with preimage if successful
     */
    meltTokens(meltQuote: MeltQuoteResponse, proofs: Proof[]): Promise<{
        paid: boolean;
        preimage?: string;
        change: Proof[];
    }>;
    /**
     * Send ecash tokens to another user
     *
     * @param proofs - Proofs to send from
     * @param amount - Amount to send
     * @returns Encoded token string and change
     */
    send(proofs: Proof[], amount: number): Promise<SendResult>;
    /**
     * Receive ecash tokens from another user
     *
     * @param encodedToken - Encoded token string to receive
     * @returns Received proofs
     */
    receive(encodedToken: string): Promise<Proof[]>;
    /**
     * Get current balance from stored proofs
     */
    getBalance(): TokenBalance;
    /**
     * Get all stored proofs
     */
    getProofs(): Proof[];
    /**
     * Add proofs to wallet storage
     *
     * @param proofs - Proofs to add
     */
    addProofs(proofs: Proof[]): void;
    /**
     * Clear all stored proofs
     */
    clearProofs(): void;
    /**
     * Export proofs as encoded token
     *
     * @param proofs - Specific proofs to export (defaults to all)
     */
    exportToken(proofs?: Proof[]): string;
    /**
     * Get the mint URL
     */
    getMintUrl(): string;
    /**
     * Sum the amounts of proofs
     */
    private sumProofs;
    /**
     * Log debug messages
     */
    private log;
}

export { CashuWallet, type CashuWalletOptions, type MeltQuoteResult, type MintQuoteResult, type SendResult, type TokenBalance, CashuWallet as default };
