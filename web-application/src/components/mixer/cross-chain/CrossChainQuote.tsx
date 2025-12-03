'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ArrowsRightLeftIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface QuoteLeg {
    rate: number;
    fee: number;
}

interface CrossChainQuoteData {
    inputAmount: number;
    inputCurrency: 'ZEC' | 'STRK';
    lightningAmount: number;
    outputAmount: number;
    outputCurrency: 'ZEC' | 'STRK';
    totalFeePercent: number;
    legs: {
        first: QuoteLeg;
        second: QuoteLeg;
    };
    expiresAt: number;
}

interface CrossChainQuoteProps {
    direction: 'zec-to-strk' | 'strk-to-zec';
    amount: number;
    onQuoteReady?: (quote: CrossChainQuoteData | null) => void;
    className?: string;
}

export function CrossChainQuote({ direction, amount, onQuoteReady, className = '' }: CrossChainQuoteProps) {
    const [quote, setQuote] = useState<CrossChainQuoteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(0);

    const fetchQuote = useCallback(async () => {
        if (amount <= 0) {
            setQuote(null);
            setError(null);
            onQuoteReady?.(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const isZecToStrk = direction === 'zec-to-strk';

            let inputAmount: number;
            let lightningAmount: number;
            let outputAmount: number;
            let inputCurrency: 'ZEC' | 'STRK';
            let outputCurrency: 'ZEC' | 'STRK';
            let firstLegRate: number;
            let secondLegRate: number;
            let firstLegFee: number;
            let secondLegFee: number;

            if (isZecToStrk) {
                // ZEC → Lightning (FixedFloat) → STRK (Atomiq)
                inputAmount = amount;
                inputCurrency = 'ZEC';
                outputCurrency = 'STRK';

                // Get real FixedFloat quote for ZEC → Lightning
                const ffResponse = await fetch('/api/fixedfloat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        endpoint: '/price',
                        data: {
                            fromCcy: 'ZEC',
                            toCcy: 'BTCLN',
                            amount: amount.toString(),
                            direction: 'from',
                            type: 'float'
                        }
                    })
                });
                const ffResult = await ffResponse.json();

                if (ffResult.code !== 0) {
                    throw new Error(ffResult.msg || 'Failed to get ZEC quote');
                }

                const btcAmount = parseFloat(ffResult.data.to.amount);
                lightningAmount = Math.floor(btcAmount * 100000000); // sats
                firstLegRate = parseFloat(ffResult.data.from.rate);
                firstLegFee = 1.5; // FixedFloat ~1.5% fee

                // Estimate STRK output (Atomiq rate ~125 sats per STRK)
                const satsPerStrk = 125; // TODO: Get real Atomiq quote
                outputAmount = lightningAmount / satsPerStrk;
                secondLegRate = 1 / satsPerStrk;
                secondLegFee = 1.0; // Atomiq ~1% fee

            } else {
                // STRK → Lightning (Atomiq) → ZEC (FixedFloat)
                inputAmount = amount;
                inputCurrency = 'STRK';
                outputCurrency = 'ZEC';

                // Estimate Lightning amount from STRK (Atomiq rate)
                const satsPerStrk = 125; // TODO: Get real Atomiq quote
                lightningAmount = Math.floor(amount * satsPerStrk);
                firstLegRate = satsPerStrk / 100000000;
                firstLegFee = 1.0; // Atomiq ~1% fee

                // Get real FixedFloat quote for Lightning → ZEC
                const btcAmount = lightningAmount / 100000000;
                const ffResponse = await fetch('/api/fixedfloat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        endpoint: '/price',
                        data: {
                            fromCcy: 'BTCLN',
                            toCcy: 'ZEC',
                            amount: btcAmount.toString(),
                            direction: 'from',
                            type: 'float'
                        }
                    })
                });
                const ffResult = await ffResponse.json();

                if (ffResult.code !== 0) {
                    throw new Error(ffResult.msg || 'Failed to get ZEC quote');
                }

                outputAmount = parseFloat(ffResult.data.to.amount);
                secondLegRate = parseFloat(ffResult.data.from.rate);
                secondLegFee = 1.5; // FixedFloat ~1.5% fee
            }

            const quoteData: CrossChainQuoteData = {
                inputAmount,
                inputCurrency,
                lightningAmount,
                outputAmount,
                outputCurrency,
                totalFeePercent: firstLegFee + secondLegFee,
                legs: {
                    first: { rate: firstLegRate, fee: firstLegFee },
                    second: { rate: secondLegRate, fee: secondLegFee },
                },
                expiresAt: Date.now() + 60000, // 1 minute expiry
            };

            setQuote(quoteData);
            setCountdown(60);
            onQuoteReady?.(quoteData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch quote';
            setError(message);
            setQuote(null);
            onQuoteReady?.(null);
        } finally {
            setLoading(false);
        }
    }, [amount, direction, onQuoteReady]);

    // Fetch quote when amount changes
    useEffect(() => {
        const debounce = setTimeout(fetchQuote, 500);
        return () => clearTimeout(debounce);
    }, [fetchQuote]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    fetchQuote(); // Refresh quote
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown, fetchQuote]);

    const formatNumber = (num: number, decimals: number = 4) => {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: decimals
        });
    };

    const formatSats = (sats: number) => {
        if (sats >= 1000000) return `${(sats / 1000000).toFixed(2)}M`;
        if (sats >= 1000) return `${(sats / 1000).toFixed(1)}k`;
        return sats.toString();
    };

    if (!amount || amount <= 0) {
        return (
            <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
                <div className="flex items-center justify-center text-gray-500 py-8">
                    <InformationCircleIcon className="w-5 h-5 mr-2" />
                    <span>Enter an amount to see quote</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <ArrowPathIcon className="w-6 h-6 text-blue-400 animate-spin mr-3" />
                    <span className="text-gray-300">Fetching best rate...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-900/20 border border-red-800 rounded-xl p-6 ${className}`}>
                <div className="flex items-center text-red-400">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
                <button
                    onClick={fetchQuote}
                    className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!quote) return null;

    return (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <ArrowsRightLeftIcon className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">Quote</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Refreshing in {countdown}s</span>
                    <button
                        onClick={fetchQuote}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Refresh quote"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quote Details */}
            <div className="p-6 space-y-4">
                {/* Conversion Summary */}
                <div className="flex items-center justify-between py-4 px-5 bg-gray-900/50 rounded-lg">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(quote.inputAmount, 6)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{quote.inputCurrency}</div>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <ArrowsRightLeftIcon className="w-6 h-6 text-gray-500" />
                        <span className="text-xs text-gray-500 mt-1">{formatSats(quote.lightningAmount)} sats</span>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {formatNumber(quote.outputAmount, 6)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{quote.outputCurrency}</div>
                    </div>
                </div>

                {/* Rate Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-gray-400 mb-1">
                            {direction === 'zec-to-strk' ? 'ZEC → Lightning' : 'STRK → Lightning'}
                        </div>
                        <div className="text-white font-medium">
                            Rate: {quote.legs.first.rate.toFixed(6)}
                        </div>
                        <div className="text-gray-500 text-xs">
                            Fee: ~{quote.legs.first.fee.toFixed(2)}%
                        </div>
                    </div>
                    <div className="p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-gray-400 mb-1">
                            {direction === 'zec-to-strk' ? 'Lightning → STRK' : 'Lightning → ZEC'}
                        </div>
                        <div className="text-white font-medium">
                            Rate: {quote.legs.second.rate.toFixed(6)}
                        </div>
                        <div className="text-gray-500 text-xs">
                            Fee: ~{quote.legs.second.fee.toFixed(2)}%
                        </div>
                    </div>
                </div>

                {/* Total Fee */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Total Estimated Fee</span>
                    <span className="text-orange-400 font-medium">~{quote.totalFeePercent.toFixed(2)}%</span>
                </div>

                {/* Effective Rate */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-400">Effective Rate</span>
                    <span className="text-white font-medium">
                        1 {quote.inputCurrency} = {formatNumber(quote.outputAmount / quote.inputAmount, 4)} {quote.outputCurrency}
                    </span>
                </div>
            </div>

            {/* Footer Notice */}
            <div className="px-6 py-3 bg-gray-900/30 border-t border-gray-700">
                <div className="flex items-start space-x-2 text-xs text-gray-500">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                        Quote includes all network fees. Final amount may vary slightly due to market conditions.
                    </span>
                </div>
            </div>
        </div>
    );
}
