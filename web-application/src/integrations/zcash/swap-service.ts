/**
 * ZEC Swap Service
 * High-level service for ZEC ↔ Lightning swaps
 * Handles provider abstraction and error handling
 */

import { FixedFloatClient } from './fixedfloat-client';
import { SwapQuote, SwapOrder, ZecSwapConfig, SwapStatusSimple } from './types';

export interface ZecSwapServiceConfig {
    fixedFloat: ZecSwapConfig;
    // Future: Add SideShift, ChangeNow as fallbacks
}

export class ZecSwapService {
    private fixedFloat: FixedFloatClient;

    constructor(config: ZecSwapServiceConfig) {
        this.fixedFloat = new FixedFloatClient(config.fixedFloat);
    }

    // ============ Quote Methods ============

    /**
     * Get quote for ZEC → Lightning swap
     * @param zecAmount Amount in ZEC
     * @returns Quote with expected BTC amount
     */
    async getZecToLightningQuote(zecAmount: number): Promise<SwapQuote> {
        try {
            return await this.fixedFloat.getZecToLightningQuote(zecAmount);
        } catch (error) {
            console.error('Failed to get ZEC→LN quote:', error);
            throw new Error(`Failed to get quote: ${(error as Error).message}`);
        }
    }

    /**
     * Get quote for Lightning → ZEC swap
     * @param satoshis Amount in satoshis
     * @returns Quote with expected ZEC amount
     */
    async getLightningToZecQuote(satoshis: number): Promise<SwapQuote> {
        try {
            return await this.fixedFloat.getLightningToZecQuote(satoshis);
        } catch (error) {
            console.error('Failed to get LN→ZEC quote:', error);
            throw new Error(`Failed to get quote: ${(error as Error).message}`);
        }
    }

    // ============ Swap Methods ============

    /**
     * Create ZEC → Lightning swap
     * 
     * Flow:
     * 1. User sends ZEC to returned deposit address
     * 2. Once confirmed, Lightning payment is sent to provided invoice
     * 
     * @param zecAmount Amount in ZEC to swap
     * @param lightningInvoice BOLT11 invoice to receive BTC
     * @param refundAddress Optional ZEC address for refunds
     */
    async swapZecToLightning(
        zecAmount: number,
        lightningInvoice: string,
        refundAddress?: string
    ): Promise<SwapOrder> {
        // Validate Lightning invoice
        if (!FixedFloatClient.isValidLightningInvoice(lightningInvoice)) {
            throw new Error('Invalid Lightning invoice format');
        }

        try {
            const order = await this.fixedFloat.createZecToLightningOrder(
                zecAmount,
                lightningInvoice,
                refundAddress
            );

            console.log(`Created ZEC→LN swap order: ${order.id}`);
            console.log(`Deposit ${zecAmount} ZEC to: ${order.from.address}`);
            console.log(`You will receive Lightning payment to your invoice`);

            return order;
        } catch (error) {
            console.error('Failed to create ZEC→LN swap:', error);
            throw error;
        }
    }

    /**
     * Create Lightning → ZEC swap
     * 
     * Flow:
     * 1. Pay the returned Lightning invoice
     * 2. ZEC is sent to provided address
     * 
     * @param satoshis Amount in satoshis to swap
     * @param zecAddress ZEC address to receive (use z-address for privacy!)
     */
    async swapLightningToZec(
        satoshis: number,
        zecAddress: string
    ): Promise<SwapOrder> {
        // Validate ZEC address
        if (!FixedFloatClient.isValidZecAddress(zecAddress)) {
            throw new Error('Invalid ZEC address format');
        }

        // Warn if using transparent address
        if (!FixedFloatClient.isShieldedAddress(zecAddress)) {
            console.warn('⚠️  Using transparent t-address. Consider using a shielded z-address for privacy!');
        }

        try {
            const order = await this.fixedFloat.createLightningToZecOrder(
                satoshis,
                zecAddress
            );

            console.log(`Created LN→ZEC swap order: ${order.id}`);
            console.log(`Pay this Lightning invoice: ${order.from.address}`);
            console.log(`You will receive ZEC at: ${zecAddress}`);

            return order;
        } catch (error) {
            console.error('Failed to create LN→ZEC swap:', error);
            throw error;
        }
    }

    // ============ Status Methods ============

    /**
     * Get swap order status
     */
    async getSwapStatus(orderId: string, token: string): Promise<SwapOrder> {
        return this.fixedFloat.getOrderStatus(orderId, token);
    }

    /**
     * Wait for swap to complete
     */
    async waitForSwapComplete(
        orderId: string,
        token: string,
        onStatusChange?: (order: SwapOrder, simpleStatus: SwapStatusSimple) => void
    ): Promise<SwapOrder> {
        return this.fixedFloat.waitForOrderComplete(
            orderId,
            token,
            60 * 60 * 1000, // 60 min timeout
            15_000,         // 15 sec poll
            (order) => {
                const simpleStatus = FixedFloatClient.toSimpleStatus(order.status);
                onStatusChange?.(order, simpleStatus);
            }
        );
    }

    // ============ Utility Methods ============

    /**
     * Convert satoshis to BTC string
     */
    static satsToBtc(satoshis: number): string {
        return (satoshis / 100_000_000).toFixed(8);
    }

    /**
     * Convert BTC string to satoshis
     */
    static btcToSats(btc: string | number): number {
        return Math.floor(Number(btc) * 100_000_000);
    }

    /**
     * Convert ZEC string to zatoshis (smallest unit)
     */
    static zecToZatoshis(zec: string | number): number {
        return Math.floor(Number(zec) * 100_000_000);
    }

    /**
     * Convert zatoshis to ZEC string
     */
    static zatoshisToZec(zatoshis: number): string {
        return (zatoshis / 100_000_000).toFixed(8);
    }
}

export default ZecSwapService;
