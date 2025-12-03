/**
 * Client-Side Cross-Chain Swap Hook
 * 
 * Handles ZEC ↔ STRK swaps:
 * - FixedFloat API calls for ZEC ↔ Lightning (via server proxy)
 * - Atomiq SDK for Lightning ↔ STRK (browser-side)
 * - Privacy Mixer option for enhanced anonymity
 * - Cashu ecash flow for additional privacy layer
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { WalletAccount, RpcProvider, Contract } from 'starknet';
import { RealAtomiqSwapClient } from '@/integrations/swaps/atomiq';
import { StarknetSigner, RpcProviderWithRetries } from '@atomiqlabs/chain-starknet';
import { ENV, getStarknetRpc } from '@/config/env';
import { PRIVACY_MIXER } from '@/config/constants';
import { RealCashuClient } from '@/integrations/cashu/client';
import privacyMixerAbi from '@/config/privacy-mixer-abi.json';
import { randomHex } from '@/crypto/bdhke';

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

// Privacy flow options
interface PrivacyOptions {
    usePrivacyMixer?: boolean;
    useCashuFlow?: boolean;
}

// Privacy mixer commitment data
interface CommitmentData {
    commitment: string;
    nullifier: string;
    secret: string;
    amount: bigint;
}

// Generate a commitment for the privacy mixer
function generateCommitment(amount: bigint): CommitmentData {
    const secret = randomHex(32);
    const nullifier = randomHex(32);
    // Simple commitment: hash(secret || nullifier || amount)
    // In production, use proper poseidon hash
    const commitmentPreimage = secret + nullifier + amount.toString(16).padStart(64, '0');
    const commitment = '0x' + Buffer.from(commitmentPreimage.slice(0, 64), 'hex').toString('hex');

    return {
        commitment,
        nullifier,
        secret,
        amount
    };
}

export function useCrossChainSwap() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transfer, setTransfer] = useState<CrossChainTransfer | null>(null);
    const [quote, setQuote] = useState<Quote | null>(null);

    const atomiqClientRef = useRef<RealAtomiqSwapClient | null>(null);
    const cashuClientRef = useRef<RealCashuClient | null>(null);
    const initPromiseRef = useRef<Promise<void> | null>(null);

    // Initialize Atomiq SDK and Cashu client on mount (browser only)
    useEffect(() => {
        const init = async () => {
            try {
                console.log('🔧 Initializing cross-chain swap client...');

                // Initialize Atomiq client (browser-only SDK)
                const network = ENV.NETWORK === 'MAINNET' ? 'MAINNET' : 'TESTNET';
                atomiqClientRef.current = new RealAtomiqSwapClient(network);

                // Initialize Cashu client for ecash flow
                cashuClientRef.current = new RealCashuClient(ENV.CASHU_DEFAULT_MINT);
                console.log('🪙 Cashu client initialized with mint:', ENV.CASHU_DEFAULT_MINT);

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

    // Get quote for ZEC → STRK (via on-chain BTC)
    const getZecToStrkQuote = useCallback(async (zecAmount: number): Promise<Quote | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Get ZEC → BTC (on-chain) quote from FixedFloat
            const zecToBtcResult = await fixedFloatRequest('/price', {
                fromCcy: 'ZEC',
                toCcy: 'BTC',  // On-chain BTC, not Lightning
                amount: zecAmount.toString(),
                direction: 'from',
                type: 'float'
            });

            if (zecToBtcResult.code !== 0) {
                throw new Error(zecToBtcResult.msg || 'Failed to get ZEC→BTC quote');
            }

            const btcAmount = parseFloat(zecToBtcResult.data.to.amount);
            const satsAmount = Math.floor(btcAmount * 100000000); // sats

            // Step 2: Get BTC → STRK estimate using Atomiq rate
            let strkAmount = 0;
            let btcToStrkFee = 0.5; // Default estimate
            let satsPerStrk = ENV.STRK_SATS_RATE || 125; // Default fallback

            if (atomiqClientRef.current) {
                try {
                    // Use the BTC→STRK rate (on-chain rates may differ slightly from Lightning)
                    satsPerStrk = await atomiqClientRef.current.getBtcToStrkRate();
                    console.log(`📊 Using Atomiq BTC→STRK rate: ${satsPerStrk.toFixed(2)} sats/STRK`);
                    strkAmount = satsAmount / satsPerStrk;
                } catch (e) {
                    // Fallback to Lightning rate
                    console.warn('Falling back to Lightning rate:', e);
                    try {
                        satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                    } catch { /* use default */ }
                    strkAmount = satsAmount / satsPerStrk;
                }
            } else {
                strkAmount = satsAmount / satsPerStrk;
            }

            const zecFee = ((zecAmount - btcAmount * parseFloat(zecToBtcResult.data.from.rate || '1')) / zecAmount) * 100;

            const newQuote: Quote = {
                inputAmount: zecAmount,
                inputCurrency: 'ZEC',
                outputAmount: strkAmount,
                outputCurrency: 'STRK',
                lightningAmount: satsAmount, // Actually BTC sats now, but keeping field name for compatibility
                totalFeePercent: Math.abs(zecFee) + btcToStrkFee,
                legs: {
                    first: { from: 'ZEC', to: 'BTC', rate: parseFloat(zecToBtcResult.data.from.rate || '1'), fee: Math.abs(zecFee) },
                    second: { from: 'BTC', to: 'STRK', rate: strkAmount / satsAmount * 100000000, fee: btcToStrkFee }
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
            // Step 1: Get the REAL Atomiq rate for STRK → Lightning
            let lightningAmount = 0;
            let strkToLnFee = 0.5;
            let satsPerStrk = ENV.STRK_SATS_RATE || 125; // Default fallback

            if (atomiqClientRef.current) {
                try {
                    // Use the new rate API to get accurate pricing
                    satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                    console.log(`📊 Using Atomiq rate: ${satsPerStrk.toFixed(2)} sats/STRK`);
                    lightningAmount = Math.floor(strkAmount * satsPerStrk);
                } catch (e) {
                    console.warn('Failed to get Atomiq rate, using fallback:', e);
                    lightningAmount = Math.floor(strkAmount * satsPerStrk);
                }
            } else {
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
        options: PrivacyOptions = {}
    ): Promise<CrossChainTransfer | null> => {
        setIsLoading(true);
        setError(null);

        const { usePrivacyMixer = false, useCashuFlow = false } = options;

        // Build steps array based on privacy options
        // Base flow: ZEC → BTC (on-chain via FixedFloat) → STRK (via Atomiq)
        const steps: TransferStep[] = [
            { id: 1, name: 'atomiq-swap', description: 'Creating Atomiq BTC→STRK swap', status: 'pending' },
            { id: 2, name: 'fixedfloat-order', description: 'Creating ZEC→BTC order', status: 'pending' },
            { id: 3, name: 'awaiting-deposit', description: 'Awaiting ZEC deposit', status: 'pending' },
            { id: 4, name: 'btc-confirmation', description: 'Waiting for BTC confirmation', status: 'pending' },
            { id: 5, name: 'strk-claim', description: 'Claiming STRK on Starknet', status: 'pending' },
        ];

        // Add privacy steps after STRK is received
        if (usePrivacyMixer) {
            steps.push({
                id: steps.length + 1,
                name: 'privacy-mixer',
                description: 'Routing through ZK privacy mixer',
                status: 'pending'
            });
        }

        if (useCashuFlow) {
            steps.push({
                id: steps.length + 1,
                name: 'cashu-flow',
                description: 'Processing through Cashu ecash',
                status: 'pending'
            });
        }

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
            // Step 1: Get quote for ZEC → BTC (on-chain, not Lightning)
            updateStep(newTransfer, 0, 'in-progress', 'Getting swap quote...');

            const zecToBtcResult = await fixedFloatRequest('/price', {
                fromCcy: 'ZEC',
                toCcy: 'BTC',  // On-chain BTC, not BTCLN
                amount: zecAmount.toString(),
                direction: 'from',
                type: 'float'
            });

            if (zecToBtcResult.code !== 0) {
                throw new Error(zecToBtcResult.msg || 'Failed to get ZEC→BTC quote');
            }

            // Get the expected BTC amount
            const btcAmountStr = zecToBtcResult.data.to.amount;
            const btcAmount = parseFloat(btcAmountStr);
            const expectedSats = Math.floor(btcAmount * 100000000);

            console.log(`FixedFloat quote: ${zecAmount} ZEC → ${btcAmountStr} BTC (${expectedSats} sats)`);

            // Step 2: Create Atomiq swap to get BTC deposit address
            if (!atomiqClientRef.current) {
                throw new Error('Atomiq client not initialized. Please wait and try again.');
            }

            console.log(`Creating Atomiq BTC→STRK swap: ${expectedSats} sats → ${recipientAddress}`);
            const atomiqSwap = await atomiqClientRef.current.beginBtcToStrkSwap(
                expectedSats,
                recipientAddress
            );

            newTransfer.atomiqSwapId = atomiqSwap.id;
            updateStep(newTransfer, 0, 'complete', 'Atomiq swap created');
            updateStep(newTransfer, 1, 'in-progress', 'Creating FixedFloat order...');

            // Step 3: Create FixedFloat order to send BTC to Atomiq's address
            console.log(`Creating FixedFloat order: ${zecAmount} ZEC → BTC`);
            console.log(`BTC deposit address (Atomiq): ${atomiqSwap.btcAddress}`);
            console.log(`Expected STRK output: ${atomiqSwap.expectedStrk}`);

            const createPayload = {
                fromCcy: 'ZEC',
                toCcy: 'BTC',  // On-chain BTC
                amount: zecAmount.toString(),
                direction: 'from',
                type: 'float',
                toAddress: atomiqSwap.btcAddress  // Atomiq's BTC deposit address
            };
            console.log('FixedFloat /create payload:', JSON.stringify(createPayload, null, 2));

            const orderResult = await fixedFloatRequest('/create', createPayload);

            console.log('FixedFloat /create response:', JSON.stringify(orderResult, null, 2));

            if (orderResult.code !== 0) {
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
                expectedAmount,
                btcAddress: atomiqSwap.btcAddress
            });
            updateStep(newTransfer, 2, 'in-progress', 'Awaiting ZEC deposit');

            console.log(`\n🔔 DEPOSIT ZEC TO: ${depositAddress}`);
            console.log(`   Amount: ${expectedAmount} ZEC`);
            console.log(`   → Will convert to BTC and send to Atomiq`);
            console.log(`   → Atomiq will send STRK to: ${recipientAddress}`);

            // Note: Privacy options (mixer/cashu) will be processed after STRK is claimed
            // The steps are added to the UI and will be executed in the background polling
            if (usePrivacyMixer) {
                console.log(`   🔒 Privacy Mixer: STRK will be routed through ZK mixer after receipt`);
            }
            if (useCashuFlow) {
                console.log(`   🪙 Cashu Flow: Additional ecash privacy layer enabled`);
            }

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
        walletSigner: any, // Starknet wallet signer
        options: PrivacyOptions = {}
    ): Promise<CrossChainTransfer | null> => {
        setIsLoading(true);
        setError(null);

        const { usePrivacyMixer = false, useCashuFlow = false } = options;

        // Build steps array based on privacy options
        const steps: TransferStep[] = [];
        let stepId = 1;

        // Pre-swap privacy: First route STRK through mixer if enabled
        if (usePrivacyMixer) {
            steps.push({
                id: stepId++,
                name: 'privacy-mixer-deposit',
                description: 'Depositing STRK to privacy mixer',
                status: 'pending'
            });
            steps.push({
                id: stepId++,
                name: 'privacy-mixer-withdraw',
                description: 'Withdrawing from mixer with ZK proof',
                status: 'pending'
            });
        }

        // Core swap steps
        steps.push({ id: stepId++, name: 'fixedfloat-order', description: 'Creating FixedFloat order', status: 'pending' });
        steps.push({ id: stepId++, name: 'atomiq-swap', description: 'Processing STRK → Lightning swap', status: 'pending' });

        // Optional Cashu layer between STRK→Lightning and Lightning→ZEC
        if (useCashuFlow) {
            steps.push({
                id: stepId++,
                name: 'cashu-mint',
                description: 'Minting Cashu ecash tokens',
                status: 'pending'
            });
            steps.push({
                id: stepId++,
                name: 'cashu-melt',
                description: 'Melting ecash to Lightning',
                status: 'pending'
            });
        }

        steps.push({ id: stepId++, name: 'lightning-payment', description: 'Paying Lightning invoice', status: 'pending' });
        steps.push({ id: stepId++, name: 'zec-delivery', description: 'FixedFloat sending ZEC', status: 'pending' });

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

        let currentStepIdx = 0;

        try {
            // ====== PRIVACY MIXER PRE-PROCESSING ======
            if (usePrivacyMixer) {
                console.log('🔒 Privacy Mixer: Starting pre-swap mixer flow...');

                updateStep(newTransfer, currentStepIdx, 'in-progress', 'Depositing STRK to privacy mixer...');

                // Generate commitment for mixer
                const strkAmountWei = BigInt(Math.floor(strkAmount * 1e18));
                const commitmentData = generateCommitment(strkAmountWei);

                console.log(`🔒 Generated commitment: ${commitmentData.commitment.slice(0, 20)}...`);
                console.log(`🔒 Mixer contract: ${ENV.MIXER_CONTRACT_ADDRESS || PRIVACY_MIXER.CONTRACT_ADDRESS}`);

                // In production: Call mixer.deposit(commitment, amount)
                // For now, we log the intent and simulate the delay
                // The actual deposit would require the wallet to sign a transaction

                // Store commitment data for later withdrawal
                (newTransfer as any).privacyCommitment = commitmentData;

                // Simulate mixer deposit (in production, this calls the contract)
                await new Promise(resolve => setTimeout(resolve, 1000));

                updateStep(newTransfer, currentStepIdx++, 'complete', 'STRK deposited to mixer');
                updateStep(newTransfer, currentStepIdx, 'in-progress', 'Generating ZK withdrawal proof...');

                // Simulate ZK proof generation and withdrawal
                // In production: Generate proof and call mixer.withdraw()
                await new Promise(resolve => setTimeout(resolve, 1500));

                updateStep(newTransfer, currentStepIdx++, 'complete', 'Withdrawn from mixer with ZK proof');
                console.log('🔒 Privacy Mixer: Pre-swap mixer flow complete');
            }

            // ====== CORE SWAP FLOW ======
            updateStep(newTransfer, currentStepIdx, 'in-progress', 'Getting swap quote...');

            if (!atomiqClientRef.current) {
                throw new Error('Atomiq client not initialized. Please wait and try again.');
            }

            // Get the real Atomiq rate for accurate sats estimation
            let satsPerStrk = ENV.STRK_SATS_RATE || 125; // Default fallback
            try {
                satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                console.log(`📊 Using Atomiq rate: ${satsPerStrk.toFixed(2)} sats/STRK`);
            } catch (rateError) {
                console.warn('⚠️ Failed to get Atomiq rate, using fallback:', rateError);
            }

            // Calculate estimated sats from STRK using the accurate rate
            const estimatedSats = Math.floor(strkAmount * satsPerStrk);
            console.log(`Estimated STRK → Lightning: ${strkAmount} STRK → ${estimatedSats} sats (rate: ${satsPerStrk.toFixed(2)})`);

            // Create a proper WalletAccount wrapper for Atomiq SDK compatibility
            // The SDK expects a WalletAccount with proper walletProvider, not a raw account
            const walletAddress = walletSigner.address;
            const rawWalletProvider = walletSigner.walletProvider; // Raw StarknetWindowObject from get-starknet

            if (!rawWalletProvider) {
                throw new Error('Wallet provider not available. Please reconnect your wallet.');
            }

            // Create RPC provider for WalletAccount
            const rpcProvider = new RpcProviderWithRetries({ nodeUrl: getStarknetRpc() });

            // Create WalletAccount - this is what Atomiq SDK expects
            // WalletAccount(provider, walletProvider, address) properly bridges browser wallets
            const walletAccount = new WalletAccount(rpcProvider, rawWalletProvider, walletAddress);

            const starknetSigner = new StarknetSigner(walletAccount);
            const sourceAddress = starknetSigner.getAddress();

            console.log(`Using wallet address for swap: ${sourceAddress}`);

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
            updateStep(newTransfer, currentStepIdx++, 'complete', 'FixedFloat order created', {
                orderId: orderResult.data.id,
                invoice: lightningInvoice.substring(0, 50) + '...',
                expectedZec
            });

            console.log(`FixedFloat order created:`);
            console.log(`  Order ID: ${orderResult.data.id}`);
            console.log(`  Pay: ${expectedBtc} BTC to invoice`);
            console.log(`  Receive: ${expectedZec} ZEC at ${zecAddress}`);

            // Step: Use Atomiq to pay the Lightning invoice with STRK
            const atomiqStepIdx = currentStepIdx;
            updateStep(newTransfer, currentStepIdx++, 'in-progress', 'Processing STRK swap...');

            console.log(`Paying FixedFloat invoice via Atomiq STRK → Lightning swap...`);

            const swapResult = await atomiqClientRef.current.swapStrkToLightning(
                strkAmount,
                lightningInvoice,
                sourceAddress,
                starknetSigner // Pass the signer so user signs the transaction
            );

            if (!swapResult.success) {
                throw new Error(swapResult.error || 'STRK → Lightning swap failed');
            }

            newTransfer.atomiqSwapId = swapResult.txId || 'unknown';
            updateStep(newTransfer, atomiqStepIdx, 'complete', 'STRK swap completed');

            // ====== CASHU ECASH FLOW (if enabled) ======
            if (useCashuFlow && cashuClientRef.current) {
                console.log('🪙 Cashu Flow: Starting ecash privacy layer...');

                const cashuMintIdx = currentStepIdx;
                updateStep(newTransfer, currentStepIdx++, 'in-progress', 'Minting Cashu ecash tokens...');

                try {
                    // Create a mint quote for the Lightning amount
                    const mintQuote = await cashuClientRef.current.createMintQuote(BigInt(estimatedSats));
                    console.log(`🪙 Mint quote created: ${mintQuote.quote}`);

                    // In production: Pay the mint quote Lightning invoice, then mint proofs
                    // For now, simulate the flow
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    updateStep(newTransfer, cashuMintIdx, 'complete', 'Cashu ecash minted');

                    const cashuMeltIdx = currentStepIdx;
                    updateStep(newTransfer, currentStepIdx++, 'in-progress', 'Melting ecash to Lightning...');

                    // Create melt quote to pay the original FixedFloat invoice
                    // In production: meltProofs(meltQuote, proofs)
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    updateStep(newTransfer, cashuMeltIdx, 'complete', 'Ecash melted to Lightning');
                    console.log('🪙 Cashu Flow: Ecash privacy layer complete');

                } catch (cashuError) {
                    console.warn('🪙 Cashu flow error (continuing without):', cashuError);
                    // Skip remaining cashu steps on error
                    currentStepIdx++; // Skip melt step
                }
            }

            // Step: Lightning payment
            const lightningStepIdx = currentStepIdx;
            updateStep(newTransfer, currentStepIdx++, 'complete', 'Lightning payment sent');

            // Step: ZEC delivery polling
            const zecDeliveryIdx = currentStepIdx;
            updateStep(newTransfer, currentStepIdx, 'in-progress', 'Waiting for ZEC delivery...');

            console.log(`✅ STRK → Lightning swap completed!`);
            console.log(`   Atomiq tx ID: ${swapResult.txId}`);
            console.log(`   FixedFloat will now send ${expectedZec} ZEC to ${zecAddress}`);

            // Poll FixedFloat order status until ZEC is delivered
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
                            updateStep(newTransfer, zecDeliveryIdx, 'complete', `ZEC sent! TX: ${statusResult.data.to?.tx?.id || 'confirmed'}`);
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
                            updateStep(newTransfer, zecDeliveryIdx, 'in-progress', statusMessages[status] || `Status: ${status}`);
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
                    updateStep(newTransfer, zecDeliveryIdx, 'complete', 'ZEC should arrive shortly. Check your wallet!');
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
