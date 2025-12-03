/**
 * FixedFloat API Client
 * Handles ZEC ↔ Lightning (BTCLN) swaps via FixedFloat service
 * 
 * API Docs: https://fixedfloat.com/api
 */

import crypto from 'crypto';
import {
    SwapQuote,
    SwapOrder,
    SwapStatus,
    SwapStatusSimple,
    ZecSwapConfig,
    FixedFloatPriceResponse,
    FixedFloatOrderResponse,
    FixedFloatStatusResponse,
} from './types';

export class FixedFloatClient {
    private apiKey: string;
    private apiSecret: string;
    private baseUrl: string;

    constructor(config: ZecSwapConfig) {
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.baseUrl = config.baseUrl || 'https://ff.io/api/v2';
    }

    /**
     * Generate HMAC-SHA256 signature for API authentication
     */
    private generateSignature(body: string): string {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(body)
            .digest('hex');
    }

    /**
     * Make authenticated request to FixedFloat API
     */
    private async request<T>(endpoint: string, data: object): Promise<T> {
        const body = JSON.stringify(data);
        const signature = this.generateSignature(body);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
                'X-API-SIGN': signature,
            },
            body,
        });

        if (!response.ok) {
            throw new Error(`FixedFloat API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.code !== 0) {
            throw new Error(`FixedFloat error: ${result.msg} (code: ${result.code})`);
        }

        return result as T;
    }

    // ============ Price/Quote Methods ============

    /**
     * Get exchange rate and quote for ZEC → Lightning
     * @param zecAmount Amount in ZEC (e.g., 1.5)
     */
    async getZecToLightningQuote(zecAmount: number): Promise<SwapQuote> {
        const response = await this.request<FixedFloatPriceResponse>('/price', {
            fromCcy: 'ZEC',
            toCcy: 'BTCLN',
            amount: zecAmount.toString(),
            direction: 'from', // We specify the "from" amount
            type: 'float',     // Float rate (or 'fixed' for locked rate)
        });

        if (response.data.errors && response.data.errors.length > 0) {
            throw new Error(`Quote error: ${response.data.errors.join(', ')}`);
        }

        return {
            id: crypto.randomUUID(),
            from: {
                currency: 'ZEC',
                amount: response.data.from.amount,
                rate: response.data.from.rate,
            },
            to: {
                currency: 'BTCLN',
                amount: response.data.to.amount,
                rate: response.data.to.rate,
            },
            minerFee: '0', // Included in rate
            serviceFee: '0',
            expiresAt: Date.now() + 30 * 60 * 1000, // 30 min validity
        };
    }

    /**
     * Get exchange rate and quote for Lightning → ZEC
     * @param satoshis Amount in satoshis
     */
    async getLightningToZecQuote(satoshis: number): Promise<SwapQuote> {
        const btcAmount = satoshis / 100_000_000;

        const response = await this.request<FixedFloatPriceResponse>('/price', {
            fromCcy: 'BTCLN',
            toCcy: 'ZEC',
            amount: btcAmount.toString(),
            direction: 'from',
            type: 'float',
        });

        if (response.data.errors && response.data.errors.length > 0) {
            throw new Error(`Quote error: ${response.data.errors.join(', ')}`);
        }

        return {
            id: crypto.randomUUID(),
            from: {
                currency: 'BTCLN',
                amount: response.data.from.amount,
                rate: response.data.from.rate,
            },
            to: {
                currency: 'ZEC',
                amount: response.data.to.amount,
                rate: response.data.to.rate,
            },
            minerFee: '0',
            serviceFee: '0',
            expiresAt: Date.now() + 30 * 60 * 1000,
        };
    }

    // ============ Order Methods ============

    /**
     * Create ZEC → Lightning swap order
     * User sends ZEC to deposit address, receives Lightning payment
     * 
     * @param zecAmount Amount in ZEC to swap
     * @param lightningInvoice BOLT11 invoice to receive BTC
     * @param refundAddress Optional ZEC address for refunds
     */
    async createZecToLightningOrder(
        zecAmount: number,
        lightningInvoice: string,
        refundAddress?: string
    ): Promise<SwapOrder> {
        const response = await this.request<FixedFloatOrderResponse>('/order', {
            fromCcy: 'ZEC',
            toCcy: 'BTCLN',
            amount: zecAmount.toString(),
            direction: 'from',
            type: 'float',
            toAddress: lightningInvoice,
            refundAddress: refundAddress,
        });

        return this.mapOrderResponse(response);
    }

    /**
     * Create Lightning → ZEC swap order
     * User pays Lightning invoice, receives ZEC to address
     * 
     * @param satoshis Amount in satoshis to swap
     * @param zecAddress ZEC address to receive (use z-address for privacy!)
     */
    async createLightningToZecOrder(
        satoshis: number,
        zecAddress: string
    ): Promise<SwapOrder> {
        const btcAmount = satoshis / 100_000_000;

        const response = await this.request<FixedFloatOrderResponse>('/order', {
            fromCcy: 'BTCLN',
            toCcy: 'ZEC',
            amount: btcAmount.toString(),
            direction: 'from',
            type: 'float',
            toAddress: zecAddress,
        });

        return this.mapOrderResponse(response);
    }

    // ============ Status Methods ============

    /**
     * Get current status of a swap order
     * @param orderId The order ID returned from createOrder
     * @param token The token returned from createOrder (for security)
     */
    async getOrderStatus(orderId: string, token: string): Promise<SwapOrder> {
        const response = await this.request<FixedFloatOrderResponse>('/status', {
            id: orderId,
            token: token,
        });

        return this.mapOrderResponse(response);
    }

    /**
     * Poll order status until complete or timeout
     * @param orderId Order ID
     * @param token Order token
     * @param timeoutMs Timeout in milliseconds (default: 60 min)
     * @param pollIntervalMs Poll interval (default: 15 sec)
     * @param onStatusChange Callback on status change
     */
    async waitForOrderComplete(
        orderId: string,
        token: string,
        timeoutMs: number = 60 * 60 * 1000,
        pollIntervalMs: number = 15_000,
        onStatusChange?: (order: SwapOrder) => void
    ): Promise<SwapOrder> {
        const startTime = Date.now();
        let lastStatus: SwapStatus | null = null;

        while (Date.now() - startTime < timeoutMs) {
            const order = await this.getOrderStatus(orderId, token);

            if (lastStatus !== order.status) {
                lastStatus = order.status;
                onStatusChange?.(order);
            }

            if (order.status === 'done') {
                return order;
            }

            if (order.status === 'expired' || order.status === 'emergency') {
                throw new Error(`Order ${orderId} failed with status: ${order.status}`);
            }

            await this.sleep(pollIntervalMs);
        }

        throw new Error(`Order ${orderId} timed out after ${timeoutMs}ms`);
    }

    // ============ Helper Methods ============

    /**
     * Map FixedFloat API response to our SwapOrder type
     */
    private mapOrderResponse(response: FixedFloatOrderResponse): SwapOrder {
        const data = response.data;

        return {
            id: data.id,
            status: data.status as SwapStatus,
            from: {
                currency: data.from.currency as 'ZEC' | 'BTCLN',
                amount: data.from.amount,
                address: data.from.address,
                txId: data.from.tx.id || undefined,
                confirmations: data.from.tx.confirmations || undefined,
            },
            to: {
                currency: data.to.currency as 'ZEC' | 'BTCLN',
                amount: data.to.amount,
                address: data.to.address,
                txId: data.to.tx.id || undefined,
            },
            createdAt: data.time.reg * 1000,
            expiresAt: data.time.expiration * 1000,
            emergency: data.back.address ? {
                address: data.back.address,
            } : undefined,
        };
    }

    /**
     * Convert FixedFloat status to simple status
     */
    static toSimpleStatus(status: SwapStatus): SwapStatusSimple {
        const statusMap: Record<SwapStatus, SwapStatusSimple> = {
            'new': 'waiting',
            'pending': 'confirming',
            'exchange': 'exchanging',
            'withdraw': 'sending',
            'done': 'complete',
            'expired': 'failed',
            'emergency': 'failed',
        };
        return statusMap[status] || 'waiting';
    }

    /**
     * Sleep helper
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============ Validation Methods ============

    /**
     * Validate a ZEC address
     * t-addresses start with 't1' (mainnet) or 'tm' (testnet)
     * z-addresses start with 'zs' (mainnet) or 'ztestsapling' (testnet)
     */
    static isValidZecAddress(address: string): boolean {
        // Transparent addresses
        if (address.startsWith('t1') || address.startsWith('t3')) {
            return address.length === 35;
        }
        // Shielded addresses (recommended for privacy)
        if (address.startsWith('zs')) {
            return address.length === 78;
        }
        // Testnet addresses
        if (address.startsWith('tm') || address.startsWith('ztestsapling')) {
            return true;
        }
        return false;
    }

    /**
     * Check if address is shielded (z-address)
     * Shielded addresses provide better privacy
     */
    static isShieldedAddress(address: string): boolean {
        return address.startsWith('zs') || address.startsWith('ztestsapling');
    }

    /**
     * Validate a Lightning invoice (BOLT11)
     */
    static isValidLightningInvoice(invoice: string): boolean {
        const lowerInvoice = invoice.toLowerCase();
        // Mainnet invoices start with 'lnbc'
        // Testnet invoices start with 'lntb'
        // Regtest invoices start with 'lnbcrt'
        return lowerInvoice.startsWith('lnbc') ||
            lowerInvoice.startsWith('lntb') ||
            lowerInvoice.startsWith('lnbcrt');
    }
}

export default FixedFloatClient;
