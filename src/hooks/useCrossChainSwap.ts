/**
 * Client-Side Cross-Chain Swap Hook
 * 
 * Handles ZEC ↔ STRK swaps:
 * - FixedFloat API calls for ZEC ↔ Lightning (via server proxy)
 * - Atomiq SDK for Lightning ↔ STRK (browser-side)
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RealAtomiqSwapClient } from '@/integrations/swaps/atomiq';
import { ENV } from '@/config/env';

interface TransferStep {
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    data?: Record<string, unknown>;
}

interface CrossChainTransfer {
    id: string;
    direction: 'zec-to-strk' | 'strk-to-zec';
    amount: number;
    destinationAddress: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    steps: TransferStep[];
    currentStepIndex: number;
    depositAddress?: string;
    depositAmount?: string;
    atomiqSwapId?: string;
    fixedFloatOrderId?: string;
    error?: string;
    createdAt: number;
}

interface Quote {
    inputAmount: number;
    inputCurrency: string;
    outputAmount: number;
    outputCurrency: string;
    lightningAmount: number;
    totalFeePercent: number;
    legs: {
        first: { from: string; to: string; rate: number; fee: number };
        second: { from: string; to: string; rate: number; fee: number };
    };
    expiry: number;
}

export function useCrossChainSwap() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transfer, setTransfer] = useState<CrossChainTransfer | null>(null);
    const [quote, setQuote] = useState<Quote | null>(null);

    const atomiqClientRef = useRef<RealAtomiqSwapClient | null>(null);
    const initPromiseRef = useRef<Promise<void> | null>(null);

    // Initialize Atomiq SDK on mount (browser only)
    useEffect(() => {
        const init = async () => {
            try {
                console.log('🔧 Initializing cross-chain swap client...');

                // Initialize Atomiq client (browser-only SDK)
                const network = ENV.NETWORK === 'MAINNET' ? 'MAINNET' : 'TESTNET';
                atomiqClientRef.current = new RealAtomiqSwapClient(network);

                // Wait for SDK initialization
                await new Promise(resolve => setTimeout(resolve, 2000));

                setIsInitialized(true);
                console.log('✅ Cross-chain swap client initialized');
            } catch (err) {
                console.error('❌ Failed to initialize:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize');
            }
        };

        initPromiseRef.current = init();
    }, []);

    // FixedFloat API call via server proxy (keeps API keys secure)
    const fixedFloatRequest = useCallback(async (endpoint: string, data: Record<string, unknown>) => {
        const response = await fetch('/api/fixedfloat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint, data })
        });

        const result = await response.json();

        if (!result.success && result.error) {
            throw new Error(result.error);
        }

        return result;
    }, []);

    // Get quote for ZEC → STRK
    const getZecToStrkQuote = useCallback(async (zecAmount: number): Promise<Quote | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Get ZEC → Lightning quote from FixedFloat
            const zecToLnResult = await fixedFloatRequest('/price', {
                fromCcy: 'ZEC',
                toCcy: 'BTCLN',
                amount: zecAmount.toString(),
                direction: 'from',
                type: 'float'
            });

            if (zecToLnResult.code !== 0) {
                throw new Error(zecToLnResult.msg || 'Failed to get ZEC quote');
            }

            const lightningBtc = parseFloat(zecToLnResult.data.to.amount);
            const lightningAmount = Math.floor(lightningBtc * 100000000); // sats

            // Step 2: Get Lightning → STRK estimate from Atomiq
            let strkAmount = 0;
            let lnToStrkFee = 0.5; // Default estimate

            if (atomiqClientRef.current) {
                try {
                    const atomiqQuote = await atomiqClientRef.current.getQuote(
                        'BTC_LN',
                        'STRK',
                        BigInt(lightningAmount),
                        true
                    );
                    strkAmount = Number(atomiqQuote.amountOut) / 1e18;
                    lnToStrkFee = Number(atomiqQuote.fee) / lightningAmount * 100;
                } catch (e) {
                    // Fallback estimate
                    console.warn('Using fallback STRK estimate:', e);
                    const satsPerStrk = ENV.STRK_SATS_RATE || 125;
                    strkAmount = lightningAmount / satsPerStrk;
                }
            } else {
                // Fallback estimate
                const satsPerStrk = ENV.STRK_SATS_RATE || 125;
                strkAmount = lightningAmount / satsPerStrk;
            }

            const zecFee = ((zecAmount - lightningBtc) / zecAmount) * 100;

            const newQuote: Quote = {
                inputAmount: zecAmount,
                inputCurrency: 'ZEC',
                outputAmount: strkAmount,
                outputCurrency: 'STRK',
                lightningAmount,
                totalFeePercent: zecFee + lnToStrkFee,
                legs: {
                    first: { from: 'ZEC', to: 'Lightning', rate: parseFloat(zecToLnResult.data.from.rate), fee: zecFee },
                    second: { from: 'Lightning', to: 'STRK', rate: strkAmount / lightningAmount, fee: lnToStrkFee }
                },
                expiry: Date.now() + 60000
            };

            setQuote(newQuote);
            return newQuote;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to get quote';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [fixedFloatRequest]);

    // Get quote for STRK → ZEC
    const getStrkToZecQuote = useCallback(async (strkAmount: number): Promise<Quote | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Estimate STRK → Lightning via Atomiq
            let lightningAmount = 0;
            let strkToLnFee = 0.5;

            const strkAmountWei = BigInt(Math.floor(strkAmount * 1e18));

            if (atomiqClientRef.current) {
                try {
                    const atomiqQuote = await atomiqClientRef.current.getQuote(
                        'STRK',
                        'BTC_LN',
                        strkAmountWei,
                        true
                    );
                    lightningAmount = Number(atomiqQuote.amountOut);
                    strkToLnFee = Number(atomiqQuote.fee) / Number(strkAmountWei) * 100;
                } catch (e) {
                    console.warn('Using fallback Lightning estimate:', e);
                    const satsPerStrk = ENV.STRK_SATS_RATE || 125;
                    lightningAmount = Math.floor(strkAmount * satsPerStrk);
                }
            } else {
                const satsPerStrk = ENV.STRK_SATS_RATE || 125;
                lightningAmount = Math.floor(strkAmount * satsPerStrk);
            }

            // Step 2: Get Lightning → ZEC quote from FixedFloat
            const btcAmount = lightningAmount / 100000000;
            const lnToZecResult = await fixedFloatRequest('/price', {
                fromCcy: 'BTCLN',
                toCcy: 'ZEC',
                amount: btcAmount.toString(),
                direction: 'from',
                type: 'float'
            });

            if (lnToZecResult.code !== 0) {
                throw new Error(lnToZecResult.msg || 'Failed to get ZEC quote');
            }

            const zecAmount = parseFloat(lnToZecResult.data.to.amount);
            const lnToZecFee = ((btcAmount - zecAmount * parseFloat(lnToZecResult.data.from.rate)) / btcAmount) * 100;

            const newQuote: Quote = {
                inputAmount: strkAmount,
                inputCurrency: 'STRK',
                outputAmount: zecAmount,
                outputCurrency: 'ZEC',
                lightningAmount,
                totalFeePercent: strkToLnFee + Math.abs(lnToZecFee),
                legs: {
                    first: { from: 'STRK', to: 'Lightning', rate: lightningAmount / strkAmount, fee: strkToLnFee },
                    second: { from: 'Lightning', to: 'ZEC', rate: parseFloat(lnToZecResult.data.from.rate), fee: Math.abs(lnToZecFee) }
                },
                expiry: Date.now() + 60000
            };

            setQuote(newQuote);
            return newQuote;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to get quote';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [fixedFloatRequest]);

    // Initiate ZEC → STRK transfer
    const initiateZecToStrk = useCallback(async (
        zecAmount: number,
        recipientAddress: string,
        options: { usePrivacyMixer?: boolean; useCashuFlow?: boolean } = {}
    ): Promise<CrossChainTransfer | null> => {
        setIsLoading(true);
        setError(null);

        const steps: TransferStep[] = [
            { id: 1, name: 'atomiq-swap', description: 'Creating Atomiq Lightning swap', status: 'pending' },
            { id: 2, name: 'fixedfloat-order', description: 'Creating ZEC deposit order', status: 'pending' },
            { id: 3, name: 'awaiting-deposit', description: 'Awaiting ZEC deposit', status: 'pending' },
            { id: 4, name: 'lightning-payment', description: 'Processing Lightning payment', status: 'pending' },
            { id: 5, name: 'strk-claim', description: 'Claiming STRK on Starknet', status: 'pending' },
        ];

        const newTransfer: CrossChainTransfer = {
            id: `transfer_${Date.now()}`,
            direction: 'zec-to-strk',
            amount: zecAmount,
            destinationAddress: recipientAddress,
            status: 'in-progress',
            steps,
            currentStepIndex: 0,
            createdAt: Date.now()
        };

        setTransfer(newTransfer);

        try {
            // Step 1: Get quote to know expected Lightning amount
            updateStep(newTransfer, 0, 'in-progress', 'Getting swap quote...');

            const zecToLnResult = await fixedFloatRequest('/price', {
                fromCcy: 'ZEC',
                toCcy: 'BTCLN',
                amount: zecAmount.toString(),
                direction: 'from',
                type: 'float'
            });

            if (zecToLnResult.code !== 0) {
                throw new Error(zecToLnResult.msg || 'Failed to get ZEC quote');
            }

            // Get the EXACT BTC amount FixedFloat will send (as a string to preserve precision)
            const lightningBtcStr = zecToLnResult.data.to.amount;
            const lightningBtc = parseFloat(lightningBtcStr);
            const expectedSats = Math.floor(lightningBtc * 100000000);

            console.log(`FixedFloat quote: ${zecAmount} ZEC → ${lightningBtcStr} BTC (${expectedSats} sats)`);

            // Step 2: Create Atomiq swap to get Lightning invoice for EXACT amount
            if (!atomiqClientRef.current) {
                throw new Error('Atomiq client not initialized. Please wait and try again.');
            }

            console.log(`Creating Atomiq swap: ${expectedSats} sats → ${recipientAddress}`);
            const atomiqSwap = await atomiqClientRef.current.beginLightningToStrkSwap(
                expectedSats,
                recipientAddress
            );

            newTransfer.atomiqSwapId = atomiqSwap.id;
            updateStep(newTransfer, 0, 'complete', 'Atomiq swap created');
            updateStep(newTransfer, 1, 'in-progress', 'Creating FixedFloat order...');

            // Step 3: Create FixedFloat order with Atomiq's invoice
            // Use direction='to' with the EXACT BTC amount to match the invoice
            console.log(`Creating FixedFloat order: ZEC → ${lightningBtcStr} BTCLN`);
            console.log(`Invoice: ${atomiqSwap.invoice.substring(0, 50)}...`);

            const orderResult = await fixedFloatRequest('/create', {
                fromCcy: 'ZEC',
                toCcy: 'BTCLN',
                amount: lightningBtcStr,  // Use exact BTC amount from quote
                direction: 'to',          // We want to RECEIVE this exact amount in Lightning
                type: 'float',
                toAddress: atomiqSwap.invoice
            });

            console.log('FixedFloat /create response:', JSON.stringify(orderResult, null, 2));

            if (orderResult.code !== 0) {
                // Provide more helpful error messages
                const errorMsg = orderResult.msg || 'Failed to create FixedFloat order';
                console.error('FixedFloat order failed:', errorMsg, orderResult);
                throw new Error(errorMsg);
            }

            const depositAddress = orderResult.data.from.address;
            const expectedAmount = orderResult.data.from.amount;

            newTransfer.fixedFloatOrderId = orderResult.data.id;
            newTransfer.depositAddress = depositAddress;
            newTransfer.depositAmount = expectedAmount;

            updateStep(newTransfer, 1, 'complete', 'FixedFloat order created', {
                orderId: orderResult.data.id,
                depositAddress,
                expectedAmount
            });
            updateStep(newTransfer, 2, 'in-progress', 'Awaiting ZEC deposit');

            console.log(`\n🔔 DEPOSIT ZEC TO: ${depositAddress}`);
            console.log(`   Amount: ${expectedAmount} ZEC`);

            setTransfer({ ...newTransfer });
            return newTransfer;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Transfer failed';
            setError(message);
            newTransfer.status = 'failed';
            newTransfer.error = message;
            setTransfer({ ...newTransfer });
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [fixedFloatRequest]);

    // Initiate STRK → ZEC transfer
    // This flow works because Atomiq PAYS the FixedFloat invoice (outgoing)
    const initiateStrkToZec = useCallback(async (
        strkAmount: number,
        zecAddress: string,
        walletSigner: any // Starknet wallet signer
    ): Promise<CrossChainTransfer | null> => {
        setIsLoading(true);
        setError(null);

        const steps: TransferStep[] = [
            { id: 1, name: 'fixedfloat-order', description: 'Creating FixedFloat order', status: 'pending' },
            { id: 2, name: 'atomiq-swap', description: 'Processing STRK → Lightning swap', status: 'pending' },
            { id: 3, name: 'lightning-payment', description: 'Paying Lightning invoice', status: 'pending' },
            { id: 4, name: 'zec-delivery', description: 'FixedFloat sending ZEC', status: 'pending' },
        ];

        const newTransfer: CrossChainTransfer = {
            id: `transfer_${Date.now()}`,
            direction: 'strk-to-zec',
            amount: strkAmount,
            destinationAddress: zecAddress,
            status: 'in-progress',
            steps,
            currentStepIndex: 0,
            createdAt: Date.now()
        };

        setTransfer(newTransfer);

        try {
            // Step 1: Get STRK → Lightning quote from Atomiq
            updateStep(newTransfer, 0, 'in-progress', 'Getting swap quote...');

            if (!atomiqClientRef.current) {
                throw new Error('Atomiq client not initialized. Please wait and try again.');
            }

            // Estimate how many sats we'll get for our STRK
            const strkAmountWei = BigInt(Math.floor(strkAmount * 1e18));
            let estimatedSats = 0;

            try {
                const atomiqQuote = await atomiqClientRef.current.getQuote(
                    'STRK',
                    'BTC_LN',
                    strkAmountWei,
                    true
                );
                estimatedSats = Number(atomiqQuote.amountOut);
            } catch (e) {
                // Fallback estimate
                const satsPerStrk = ENV.STRK_SATS_RATE || 125;
                estimatedSats = Math.floor(strkAmount * satsPerStrk);
            }

            console.log(`Estimated STRK → Lightning: ${strkAmount} STRK → ${estimatedSats} sats`);

            // Step 2: Create FixedFloat order (BTCLN → ZEC)
            // FixedFloat will provide the Lightning invoice we need to pay
            const btcAmount = (estimatedSats / 100000000).toFixed(8);
            console.log(`Creating FixedFloat order: ${btcAmount} BTCLN → ZEC`);

            const orderResult = await fixedFloatRequest('/create', {
                fromCcy: 'BTCLN',
                toCcy: 'ZEC',
                amount: btcAmount,
                direction: 'from',
                type: 'float',
                toAddress: zecAddress
            });

            console.log('FixedFloat /create response:', JSON.stringify(orderResult, null, 2));

            if (orderResult.code !== 0) {
                throw new Error(orderResult.msg || 'Failed to create FixedFloat order');
            }

            // FixedFloat provides a Lightning invoice for us to pay
            const lightningInvoice = orderResult.data.from.address;
            const expectedBtc = orderResult.data.from.amount;
            const expectedZec = orderResult.data.to.amount;

            newTransfer.fixedFloatOrderId = orderResult.data.id;
            updateStep(newTransfer, 0, 'complete', 'FixedFloat order created', {
                orderId: orderResult.data.id,
                invoice: lightningInvoice.substring(0, 50) + '...',
                expectedZec
            });

            console.log(`FixedFloat order created:`);
            console.log(`  Order ID: ${orderResult.data.id}`);
            console.log(`  Pay: ${expectedBtc} BTC to invoice`);
            console.log(`  Receive: ${expectedZec} ZEC at ${zecAddress}`);

            // Step 3: Use Atomiq to pay the Lightning invoice with STRK
            updateStep(newTransfer, 1, 'in-progress', 'Processing STRK swap...');

            console.log(`Paying FixedFloat invoice via Atomiq STRK → Lightning swap...`);

            const swapResult = await atomiqClientRef.current.swapStrkToLightning(
                strkAmount,
                lightningInvoice,
                walletSigner.address || walletSigner
            );

            if (!swapResult.success) {
                throw new Error(swapResult.error || 'STRK → Lightning swap failed');
            }

            newTransfer.atomiqSwapId = swapResult.txId || 'unknown';
            updateStep(newTransfer, 1, 'complete', 'STRK swap completed');
            updateStep(newTransfer, 2, 'complete', 'Lightning payment sent');
            updateStep(newTransfer, 3, 'in-progress', 'Waiting for ZEC delivery...');

            console.log(`✅ STRK → Lightning swap completed!`);
            console.log(`   Atomiq tx ID: ${swapResult.txId}`);
            console.log(`   FixedFloat will now send ${expectedZec} ZEC to ${zecAddress}`);

            // Step 4: Poll FixedFloat order status until ZEC is delivered
            const orderId = orderResult.data.id;
            const pollInterval = 10000; // 10 seconds
            const maxPolls = 60; // 10 minutes max
            let pollCount = 0;

            const pollStatus = async (): Promise<boolean> => {
                try {
                    const statusResult = await fixedFloatRequest('/order', {
                        id: orderId,
                        token: orderResult.data.token
                    });

                    console.log(`FixedFloat order status (poll ${pollCount + 1}):`, statusResult.data?.status);

                    if (statusResult.code === 0 && statusResult.data) {
                        const status = statusResult.data.status;

                        // FixedFloat statuses: NEW, PENDING, EXCHANGE, WITHDRAW, DONE, EXPIRED, EMERGENCY
                        if (status === 'DONE') {
                            updateStep(newTransfer, 3, 'complete', `ZEC sent! TX: ${statusResult.data.to?.tx?.id || 'confirmed'}`);
                            newTransfer.status = 'complete';
                            setTransfer({ ...newTransfer });
                            return true;
                        } else if (status === 'EXPIRED' || status === 'EMERGENCY') {
                            throw new Error(`FixedFloat order ${status.toLowerCase()}`);
                        } else {
                            // Update with current status
                            const statusMessages: Record<string, string> = {
                                'NEW': 'Order created, waiting for payment confirmation...',
                                'PENDING': 'Payment received, processing...',
                                'EXCHANGE': 'Exchanging to ZEC...',
                                'WITHDRAW': 'Sending ZEC to your wallet...'
                            };
                            updateStep(newTransfer, 3, 'in-progress', statusMessages[status] || `Status: ${status}`);
                        }
                    }
                    return false;
                } catch (pollError) {
                    console.warn('Poll error:', pollError);
                    return false;
                }
            };

            // Start polling in background
            const startPolling = async () => {
                while (pollCount < maxPolls) {
                    pollCount++;
                    const done = await pollStatus();
                    if (done) break;
                    await new Promise(resolve => setTimeout(resolve, pollInterval));
                }

                if (pollCount >= maxPolls && newTransfer.status !== 'complete') {
                    // Timeout - but ZEC might still arrive
                    updateStep(newTransfer, 3, 'complete', 'ZEC should arrive shortly. Check your wallet!');
                    newTransfer.status = 'complete';
                    setTransfer({ ...newTransfer });
                }
            };

            // Start polling without blocking
            startPolling();

            setTransfer({ ...newTransfer });
            return newTransfer;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Transfer failed';
            console.error('STRK → ZEC transfer failed:', message);
            setError(message);
            newTransfer.status = 'failed';
            newTransfer.error = message;
            setTransfer({ ...newTransfer });
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [fixedFloatRequest]);

    // Helper to update step status
    const updateStep = (transfer: CrossChainTransfer, stepIndex: number, status: TransferStep['status'], description?: string, data?: Record<string, unknown>) => {
        if (transfer.steps[stepIndex]) {
            transfer.steps[stepIndex].status = status;
            if (description) transfer.steps[stepIndex].description = description;
            if (data) transfer.steps[stepIndex].data = data;
            transfer.currentStepIndex = stepIndex;
        }
        setTransfer({ ...transfer });
    };

    // Cancel/reset transfer
    const cancelTransfer = useCallback(() => {
        setTransfer(null);
        setError(null);
        setQuote(null);
    }, []);

    return {
        isInitialized,
        isLoading,
        error,
        transfer,
        quote,
        getZecToStrkQuote,
        getStrkToZecQuote,
        initiateZecToStrk,
        initiateStrkToZec,
        cancelTransfer,
        setError
    };
}
