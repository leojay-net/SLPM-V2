/**
 * SLPM SDK - Cashu Ecash Wallet Integration
 * 
 * Provides privacy-preserving payment capabilities using Cashu ecash protocol.
 */

import {
    getEncodedToken,
    Token,
    TokenEntry,
    Proof,
    CashuMint,
    CashuWallet as CashuWalletLib,
    MeltQuoteResponse,
    MeltTokensResponse,
    SendResponse,
} from '@cashu/cashu-ts';
import { CASHU_MINTS } from '../constants';

/**
 * Configuration options for CashuWallet
 */
export interface CashuWalletOptions {
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
export interface TokenBalance {
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
export interface SendResult {
    /** Encoded token to send */
    token: string;
    /** Change tokens to keep */
    change: Proof[];
}

/**
 * Mint quote result
 */
export interface MintQuoteResult {
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
export interface MeltQuoteResult {
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
export class CashuWallet {
    private mintUrl: string;
    private unit: string;
    private debug: boolean;
    private cashuMint: CashuMint | null = null;
    private cashuWallet: CashuWalletLib | null = null;
    private proofs: Proof[] = [];
    private initialized = false;

    constructor(options: CashuWalletOptions = {}) {
        this.mintUrl = options.mintUrl || CASHU_MINTS.mainnet;
        this.unit = options.unit || 'sat';
        this.debug = options.debug || false;
    }

    /**
     * Initialize connection to the mint
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        try {
            this.cashuMint = new CashuMint(this.mintUrl);
            this.cashuWallet = new CashuWalletLib(this.cashuMint, { unit: this.unit });
            this.initialized = true;
            this.log('Initialized Cashu wallet', { mintUrl: this.mintUrl });
        } catch (error) {
            throw new Error(`Failed to initialize Cashu wallet: ${error}`);
        }
    }

    /**
     * Ensure wallet is initialized
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.init();
        }
    }

    /**
     * Get a mint quote (request to convert Lightning sats to ecash)
     * 
     * @param amount - Amount in sats to mint
     * @returns Quote with Lightning invoice to pay
     */
    async getMintQuote(amount: number): Promise<MintQuoteResult> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const quote = await this.cashuWallet.createMintQuote(amount);
        this.log('Created mint quote', { amount, quote: quote.quote });

        return {
            quote: quote.quote,
            request: quote.request,
            paid: quote.state === 'PAID',
            expiry: quote.expiry || Date.now() + 600000,
        };
    }

    /**
     * Check if a mint quote has been paid
     * 
     * @param quoteId - Quote ID to check
     * @returns Whether the quote has been paid
     */
    async checkMintQuote(quoteId: string): Promise<boolean> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const quote = await this.cashuWallet.checkMintQuote(quoteId);
        return quote.state === 'PAID';
    }

    /**
     * Mint ecash tokens after paying the Lightning invoice
     * 
     * @param amount - Amount to mint
     * @param quoteId - Quote ID from getMintQuote
     * @returns Minted proofs
     */
    async mintTokens(amount: number, quoteId: string): Promise<Proof[]> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const result = await this.cashuWallet.mintTokens(amount, quoteId);
        const proofs = result.proofs;
        this.proofs.push(...proofs);

        this.log('Minted tokens', {
            amount,
            proofCount: proofs.length
        });

        return proofs;
    }

    /**
     * Get a melt quote (request to convert ecash to Lightning payment)
     * 
     * @param invoice - Lightning invoice to pay
     * @returns Quote with fee estimate
     */
    async getMeltQuote(invoice: string): Promise<MeltQuoteResult> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const quote = await this.cashuWallet.createMeltQuote(invoice);
        this.log('Created melt quote', {
            amount: quote.amount,
            fee: quote.fee_reserve
        });

        return {
            quote: quote.quote,
            amount: quote.amount,
            fee: quote.fee_reserve,
            paid: quote.state === 'PAID',
            expiry: quote.expiry || Date.now() + 600000,
        };
    }

    /**
     * Melt ecash tokens to pay a Lightning invoice
     * 
     * @param meltQuote - Melt quote response from getMeltQuote
     * @param proofs - Proofs to melt
     * @returns Payment result with preimage if successful
     */
    async meltTokens(meltQuote: MeltQuoteResponse, proofs: Proof[]): Promise<{
        paid: boolean;
        preimage?: string;
        change: Proof[];
    }> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const result: MeltTokensResponse = await this.cashuWallet.meltTokens(meltQuote, proofs);

        // Remove melted proofs from local storage
        const proofIds = new Set(proofs.map(p => p.secret));
        this.proofs = this.proofs.filter(p => !proofIds.has(p.secret));

        // Add any change
        if (result.change && result.change.length > 0) {
            this.proofs.push(...result.change);
        }

        this.log('Melted tokens', {
            paid: result.isPaid,
            changeAmount: result.change?.length || 0
        });

        return {
            paid: result.isPaid,
            preimage: result.preimage || undefined,
            change: result.change || [],
        };
    }

    /**
     * Send ecash tokens to another user
     * 
     * @param proofs - Proofs to send from
     * @param amount - Amount to send
     * @returns Encoded token string and change
     */
    async send(proofs: Proof[], amount: number): Promise<SendResult> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const totalAmount = this.sumProofs(proofs);
        if (totalAmount < amount) {
            throw new Error(`Insufficient balance: have ${totalAmount}, need ${amount}`);
        }

        // Get proofs for exact amount + get change back
        const result: SendResponse = await this.cashuWallet.send(amount, proofs);
        const { send, returnChange } = result;

        // Create encoded token
        const tokenEntry: TokenEntry = {
            mint: this.mintUrl,
            proofs: send,
        };
        const token: Token = {
            token: [tokenEntry],
        };
        const encodedToken = getEncodedToken(token);

        // Update local proofs - remove sent, keep change
        const sentIds = new Set(send.map(p => p.secret));
        this.proofs = this.proofs.filter(p => !sentIds.has(p.secret));
        this.proofs.push(...returnChange);

        this.log('Sent tokens', { amount, changeAmount: this.sumProofs(returnChange) });

        return {
            token: encodedToken,
            change: returnChange,
        };
    }

    /**
     * Receive ecash tokens from another user
     * 
     * @param encodedToken - Encoded token string to receive
     * @returns Received proofs
     */
    async receive(encodedToken: string): Promise<Proof[]> {
        await this.ensureInitialized();

        if (!this.cashuWallet) {
            throw new Error('Wallet not initialized');
        }

        const proofs = await this.cashuWallet.receive(encodedToken);
        this.proofs.push(...proofs);

        this.log('Received tokens', {
            amount: this.sumProofs(proofs),
            proofCount: proofs.length
        });

        return proofs;
    }

    /**
     * Get current balance from stored proofs
     */
    getBalance(): TokenBalance {
        const denominations: Record<number, number> = {};
        let total = 0;

        for (const proof of this.proofs) {
            total += proof.amount;
            denominations[proof.amount] = (denominations[proof.amount] || 0) + 1;
        }

        return {
            total,
            proofCount: this.proofs.length,
            denominations,
        };
    }

    /**
     * Get all stored proofs
     */
    getProofs(): Proof[] {
        return [...this.proofs];
    }

    /**
     * Add proofs to wallet storage
     * 
     * @param proofs - Proofs to add
     */
    addProofs(proofs: Proof[]): void {
        this.proofs.push(...proofs);
    }

    /**
     * Clear all stored proofs
     */
    clearProofs(): void {
        this.proofs = [];
    }

    /**
     * Export proofs as encoded token
     * 
     * @param proofs - Specific proofs to export (defaults to all)
     */
    exportToken(proofs?: Proof[]): string {
        const toExport = proofs || this.proofs;
        const tokenEntry: TokenEntry = {
            mint: this.mintUrl,
            proofs: toExport,
        };
        const token: Token = {
            token: [tokenEntry],
        };
        return getEncodedToken(token);
    }

    /**
     * Get the mint URL
     */
    getMintUrl(): string {
        return this.mintUrl;
    }

    /**
     * Sum the amounts of proofs
     */
    private sumProofs(proofs: Proof[]): number {
        return proofs.reduce((sum, p) => sum + p.amount, 0);
    }

    /**
     * Log debug messages
     */
    private log(message: string, data?: Record<string, unknown>): void {
        if (this.debug) {
            console.log(`[CashuWallet] ${message}`, data || '');
        }
    }
}

export default CashuWallet;
