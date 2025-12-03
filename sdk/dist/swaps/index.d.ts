import { S as SLPMConfig, g as WalletConnection, P as PrivacyMixer, p as SLPMEventCallback, e as SwapDirection, f as SwapQuote, c as SwapParams, d as SwapResult } from '../index-DfPNDdV0.js';
import 'starknet';

/**
 * SLPM SDK - Cross-Chain Swaps Module
 *
 * Handles STRK ↔ ZEC/BTC swaps via Lightning Network
 */

/**
 * Cross-Chain Swapper
 *
 * Enables swaps between STRK and other currencies (ZEC, BTC)
 * via Lightning Network with optional privacy enhancements.
 *
 * @example
 * ```typescript
 * const swapper = new CrossChainSwapper(config, wallet, privacyMixer);
 *
 * // Get quote
 * const quote = await swapper.getQuote('strk-to-zec', '10');
 *
 * // Execute swap with privacy
 * const result = await swapper.swap({
 *   direction: 'strk-to-zec',
 *   amount: '10',
 *   destinationAddress: 'zs1...',
 *   usePrivacyMixer: true,
 *   useCashuFlow: true,
 * });
 * ```
 */
declare class CrossChainSwapper {
    private config;
    private wallet;
    private privacyMixer?;
    private eventCallback?;
    private activeSwaps;
    constructor(config: SLPMConfig, wallet: WalletConnection, privacyMixer?: PrivacyMixer, eventCallback?: SLPMEventCallback);
    /**
     * Get a quote for a swap
     */
    getQuote(direction: SwapDirection, amount: string): Promise<SwapQuote>;
    /**
     * Get quotes for both directions
     */
    getQuotes(amount: string): Promise<{
        strkToZec: SwapQuote;
        zecToStrk: SwapQuote;
    }>;
    /**
     * Execute a cross-chain swap
     */
    swap(params: SwapParams): Promise<SwapResult>;
    /**
     * Get swap status
     */
    getSwap(swapId: string): SwapResult | undefined;
    /**
     * List active swaps
     */
    listSwaps(): SwapResult[];
    /**
     * Cancel a pending swap
     */
    cancelSwap(swapId: string): boolean;
    private executeStrkToExternal;
    private executeExternalToStrk;
    private fetchQuote;
    private createFixedFloatOrder;
    private executeAtomiqSwap;
    private createAtomiqBtcSwap;
    private pollOrderStatus;
    private buildSteps;
    private updateStep;
    private parseCurrencies;
    private validateAmount;
    private delay;
    private emit;
}

export { CrossChainSwapper, CrossChainSwapper as default };
