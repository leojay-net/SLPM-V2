/**
 * Cross-Chain Bridge
 * Orchestrates ZEC ↔ STRK transfers using:
 * - FixedFloat (ZEC ↔ Lightning)
 * - Atomiq (Lightning ↔ STRK)
 * - Privacy Mixer (Optional)
 * - Cashu (Optional)
 */

import { v4 as uuidv4 } from 'uuid';
import {
    CrossChainTransfer,
    CrossChainStep,
    ZecToStrkParams,
    StrkToZecParams,
    CrossChainConfig
} from './types';
import { ZecSwapService, ZecSwapServiceConfig } from '../zcash';
import { RealAtomiqSwapClient } from '../swaps/atomiq';
import { SwapQuote, SwapOrder } from '../zcash/types';

export class CrossChainBridge {
    private zecService: ZecSwapService;
    private atomiqClient: RealAtomiqSwapClient;
    private config: CrossChainConfig;

    // Track active transfers
    private activeTransfers: Map<string, CrossChainTransfer> = new Map();

    constructor(config: CrossChainConfig) {
        this.config = config;

        // Initialize ZEC swap service (FixedFloat)
        const zecConfig: ZecSwapServiceConfig = {
            fixedFloat: {
                apiKey: config.fixedFloat.apiKey,
                apiSecret: config.fixedFloat.apiSecret
            }
        };
        this.zecService = new ZecSwapService(zecConfig);

        // Initialize Atomiq client
        const network = config.atomiq.environment === 'mainnet' ? 'MAINNET' : 'TESTNET';
        this.atomiqClient = new RealAtomiqSwapClient(network, config.starknet.rpcUrl);
    }

    /**
     * Get a quote for ZEC → STRK transfer
     * Returns estimated amounts and fees for each leg
     */
    async getZecToStrkQuote(zecAmount: number): Promise<{
        zecAmount: number;
        lightningAmount: number;
        strkAmount: number;
        totalFeePercent: number;
        legs: {
            zecToLightning: { rate: number; fee: number; quote: SwapQuote };
            lightningToStrk: { rate: number; fee: number };
        };
    }> {
        // Step 1: Get ZEC → Lightning quote from FixedFloat
        const zecToLnQuote = await this.zecService.getZecToLightningQuote(zecAmount);
        const lightningBtc = parseFloat(zecToLnQuote.to.amount);
        const lightningAmount = Math.floor(lightningBtc * 100000000); // Convert BTC to sats

        // Step 2: Get Lightning → STRK quote from Atomiq
        // Note: Atomiq expects sats as input
        const lnToStrkQuote = await this.atomiqClient.getQuote('BTC_LN', 'STRK', BigInt(lightningAmount), true);
        const strkAmountWei = lnToStrkQuote.amountOut;
        const strkAmount = Number(strkAmountWei) / 1e18;

        // Calculate fees
        const zecInAmount = parseFloat(zecToLnQuote.from.amount);
        const zecFeePercent = ((zecInAmount - lightningBtc) / zecInAmount) * 100;
        const lnFeePercent = (Number(lnToStrkQuote.fee) / lightningAmount) * 100;
        const totalFeePercent = zecFeePercent + lnFeePercent;

        return {
            zecAmount,
            lightningAmount,
            strkAmount,
            totalFeePercent,
            legs: {
                zecToLightning: {
                    rate: parseFloat(zecToLnQuote.from.rate),
                    fee: zecFeePercent,
                    quote: zecToLnQuote
                },
                lightningToStrk: {
                    rate: Number(lnToStrkQuote.amountOut) / lightningAmount,
                    fee: lnFeePercent
                }
            }
        };
    }

    /**
     * Get a quote for STRK → ZEC transfer
     */
    async getStrkToZecQuote(strkAmount: number): Promise<{
        strkAmount: number;
        lightningAmount: number;
        zecAmount: number;
        totalFeePercent: number;
        legs: {
            strkToLightning: { rate: number; fee: number };
            lightningToZec: { rate: number; fee: number; quote: SwapQuote };
        };
    }> {
        // Step 1: Get STRK → Lightning quote from Atomiq
        const strkAmountWei = BigInt(Math.floor(strkAmount * 1e18));
        const strkToLnQuote = await this.atomiqClient.getQuote('STRK', 'BTC_LN', strkAmountWei, true);
        const lightningAmount = Number(strkToLnQuote.amountOut); // sats

        // Step 2: Get Lightning → ZEC quote from FixedFloat
        const satoshis = lightningAmount;
        const lnToZecQuote = await this.zecService.getLightningToZecQuote(satoshis);
        const zecAmount = parseFloat(lnToZecQuote.to.amount);

        // Calculate fees
        const strkFeePercent = (Number(strkToLnQuote.fee) / Number(strkAmountWei)) * 100;
        const lnInAmount = parseFloat(lnToZecQuote.from.amount);
        const zecFeePercent = ((lnInAmount - zecAmount) / lnInAmount) * 100;
        const totalFeePercent = strkFeePercent + zecFeePercent;

        return {
            strkAmount,
            lightningAmount,
            zecAmount,
            totalFeePercent,
            legs: {
                strkToLightning: {
                    rate: lightningAmount / strkAmount,
                    fee: strkFeePercent
                },
                lightningToZec: {
                    rate: parseFloat(lnToZecQuote.from.rate),
                    fee: zecFeePercent,
                    quote: lnToZecQuote
                }
            }
        };
    }

    /**
     * Initiate ZEC → STRK transfer
     * Full flow: ZEC → FixedFloat → Lightning → Atomiq → STRK
     */
    async initiateZecToStrk(params: ZecToStrkParams): Promise<CrossChainTransfer> {
        const { zecAmount, recipientAddress, useCashuFlow = false, usePrivacyMixer = false, onProgress } = params;

        // Create transfer record
        const transfer: CrossChainTransfer = {
            id: uuidv4(),
            direction: 'zec-to-strk',
            from: {
                currency: 'ZEC',
                amount: zecAmount.toString()
            },
            to: {
                currency: 'STRK',
                amount: '0', // Will be updated
                address: recipientAddress
            },
            steps: this.createZecToStrkSteps(usePrivacyMixer, useCashuFlow),
            currentStepIndex: 0,
            status: 'pending',
            options: { useCashuFlow, usePrivacyMixer },
            createdAt: Date.now()
        };

        this.activeTransfers.set(transfer.id, transfer);
        this.notifyProgress(transfer, onProgress);

        try {
            // Execute the transfer flow
            await this.executeZecToStrkFlow(transfer, onProgress);
            return transfer;
        } catch (error) {
            transfer.status = 'failed';
            transfer.error = error instanceof Error ? error.message : String(error);
            this.notifyProgress(transfer, onProgress);
            throw error;
        }
    }

    /**
     * Execute the ZEC → STRK flow step by step
     */
    private async executeZecToStrkFlow(
        transfer: CrossChainTransfer,
        onProgress?: (transfer: CrossChainTransfer) => void
    ): Promise<void> {
        const zecAmount = parseFloat(transfer.from.amount);

        // Step 1: Create Atomiq Lightning → STRK swap to get invoice
        this.updateStep(transfer, 0, 'in-progress', 'Creating Atomiq Lightning swap...');
        this.notifyProgress(transfer, onProgress);

        // First get a quote to know how many sats we'll receive from FixedFloat
        const zecToLnQuote = await this.zecService.getZecToLightningQuote(zecAmount);
        const lightningBtc = parseFloat(zecToLnQuote.to.amount);
        const expectedSats = Math.floor(lightningBtc * 100000000);

        // Create Atomiq swap with that amount - get the Lightning invoice
        const atomiqSwap = await this.atomiqClient.beginLightningToStrkSwap(
            expectedSats,
            transfer.to.address
        );

        transfer.atomiqSwapId = atomiqSwap.id;
        this.updateStep(transfer, 0, 'complete', 'Atomiq swap created', { swapId: atomiqSwap.id });
        this.notifyProgress(transfer, onProgress);

        // Step 2: Create FixedFloat order with Atomiq's Lightning invoice as destination
        this.updateStep(transfer, 1, 'in-progress', 'Creating ZEC → Lightning order...');
        this.notifyProgress(transfer, onProgress);

        // Create the ZEC → Lightning swap with Atomiq's invoice
        const fixedFloatOrder = await this.zecService.swapZecToLightning(
            zecAmount,
            atomiqSwap.invoice  // This is the key - FixedFloat pays Atomiq's invoice
        );

        transfer.zecSwapOrderId = fixedFloatOrder.id;
        this.updateStep(transfer, 1, 'complete', 'FixedFloat order created', {
            orderId: fixedFloatOrder.id,
            depositAddress: fixedFloatOrder.from.address
        });
        this.notifyProgress(transfer, onProgress);

        // Step 3: Wait for ZEC deposit (user sends ZEC to FixedFloat address)
        this.updateStep(transfer, 2, 'in-progress', 'Waiting for ZEC deposit...', {
            depositAddress: fixedFloatOrder.from.address,
            expectedAmount: fixedFloatOrder.from.amount
        });
        this.notifyProgress(transfer, onProgress);

        // Return here - the user must send ZEC to the deposit address
        // Further steps will be polled/triggered by checkTransferStatus
        console.log(`\n🔔 ACTION REQUIRED: Send ${zecAmount} ZEC to ${fixedFloatOrder.from.address}`);
        console.log(`Transfer ID: ${transfer.id}`);
        console.log(`Use checkTransferStatus('${transfer.id}') to continue after deposit\n`);
    }

    /**
     * Continue ZEC → STRK transfer after deposit
     * Call this after the user has sent ZEC to the deposit address
     */
    async continueZecToStrkTransfer(
        transferId: string,
        onProgress?: (transfer: CrossChainTransfer) => void
    ): Promise<CrossChainTransfer> {
        const transfer = this.activeTransfers.get(transferId);
        if (!transfer) {
            throw new Error(`Transfer ${transferId} not found`);
        }

        if (transfer.direction !== 'zec-to-strk') {
            throw new Error('This method is only for ZEC → STRK transfers');
        }

        try {
            // Check deposit status
            const orderStatus = await this.zecService.getSwapStatus(
                transfer.zecSwapOrderId!,
                transfer.zecSwapToken || ''
            );

            console.log(`📊 FixedFloat order status: ${orderStatus.status}`);

            // Wait for deposit to be confirmed
            if (orderStatus.status === 'new' || orderStatus.status === 'pending') {
                this.updateStep(transfer, 2, 'in-progress', `Waiting for ZEC deposit (status: ${orderStatus.status})`);
                this.notifyProgress(transfer, onProgress);
                return transfer;
            }

            if (orderStatus.status === 'expired' || orderStatus.status === 'emergency') {
                throw new Error(`FixedFloat order ${orderStatus.status}`);
            }

            // Deposit confirmed
            this.updateStep(transfer, 2, 'complete', 'ZEC deposit confirmed');
            this.notifyProgress(transfer, onProgress);

            // Step 4: Wait for Lightning payment to Atomiq
            this.updateStep(transfer, 3, 'in-progress', 'Waiting for Lightning payment to Atomiq...');
            this.notifyProgress(transfer, onProgress);

            // Poll Atomiq for payment
            const atomiqStatus = await this.atomiqClient.getStatus(transfer.atomiqSwapId!);
            console.log(`📊 Atomiq swap status: ${atomiqStatus.status}`);

            if (atomiqStatus.status === 'CREATED' || atomiqStatus.status === 'QUOTED') {
                // Lightning not yet paid
                this.updateStep(transfer, 3, 'in-progress', 'Waiting for FixedFloat to pay Lightning invoice...');
                this.notifyProgress(transfer, onProgress);
                return transfer;
            }

            if (atomiqStatus.status === 'EXPIRED' || atomiqStatus.status === 'FAILED' || atomiqStatus.status === 'REFUNDED') {
                throw new Error(`Atomiq swap ${atomiqStatus.status}`);
            }

            this.updateStep(transfer, 3, 'complete', 'Lightning payment received by Atomiq');
            this.notifyProgress(transfer, onProgress);

            // Step 5: Claim STRK from Atomiq
            this.updateStep(transfer, 4, 'in-progress', 'Claiming STRK on Starknet...');
            this.notifyProgress(transfer, onProgress);

            const claimResult = await this.atomiqClient.claimLightningToStrkSwap(transfer.atomiqSwapId!);

            this.updateStep(transfer, 4, 'complete', 'STRK claimed successfully', {
                txId: claimResult.txId
            });
            this.notifyProgress(transfer, onProgress);

            // Get final amount from Atomiq status
            const finalStatus = await this.atomiqClient.getStatus(transfer.atomiqSwapId!);
            if (finalStatus.amountOut) {
                transfer.to.amount = (Number(finalStatus.amountOut) / 1e18).toString();
            }

            // Mark transfer complete
            transfer.status = 'complete';
            transfer.completedAt = Date.now();
            this.notifyProgress(transfer, onProgress);

            return transfer;

        } catch (error) {
            transfer.status = 'failed';
            transfer.error = error instanceof Error ? error.message : String(error);
            this.notifyProgress(transfer, onProgress);
            throw error;
        }
    }

    /**
     * Initiate STRK → ZEC transfer
     * Full flow: STRK → Atomiq → Lightning → FixedFloat → ZEC
     */
    async initiateStrkToZec(params: StrkToZecParams): Promise<CrossChainTransfer> {
        const { strkAmount, zecAddress, useCashuFlow = false, usePrivacyMixer = false, onProgress } = params;

        const transfer: CrossChainTransfer = {
            id: uuidv4(),
            direction: 'strk-to-zec',
            from: {
                currency: 'STRK',
                amount: strkAmount.toString()
            },
            to: {
                currency: 'ZEC',
                amount: '0',
                address: zecAddress
            },
            steps: this.createStrkToZecSteps(usePrivacyMixer, useCashuFlow),
            currentStepIndex: 0,
            status: 'pending',
            options: { useCashuFlow, usePrivacyMixer },
            createdAt: Date.now()
        };

        this.activeTransfers.set(transfer.id, transfer);
        this.notifyProgress(transfer, onProgress);

        try {
            await this.executeStrkToZecFlow(transfer, onProgress);
            return transfer;
        } catch (error) {
            transfer.status = 'failed';
            transfer.error = error instanceof Error ? error.message : String(error);
            this.notifyProgress(transfer, onProgress);
            throw error;
        }
    }

    /**
     * Execute the STRK → ZEC flow step by step
     */
    private async executeStrkToZecFlow(
        transfer: CrossChainTransfer,
        onProgress?: (transfer: CrossChainTransfer) => void
    ): Promise<void> {
        const strkAmount = BigInt(transfer.from.amount);
        const strkAmountNum = Number(strkAmount) / 1e18;

        // Step 1: Get Lightning invoice from FixedFloat for ZEC output
        this.updateStep(transfer, 0, 'in-progress', 'Creating Lightning → ZEC order...');
        this.notifyProgress(transfer, onProgress);

        // First estimate sats we'll get from STRK
        const estimate = await this.atomiqClient.estimateLightningSatsFromStrk(strkAmountNum);
        const estimatedSats = estimate.satsOut;

        // Create FixedFloat order for Lightning → ZEC
        const fixedFloatOrder = await this.zecService.swapLightningToZec(
            estimatedSats,
            transfer.to.address  // ZEC address (should be z-address for privacy)
        );

        transfer.zecSwapOrderId = fixedFloatOrder.id;

        // The Lightning invoice to pay is in the order
        const lightningInvoice = fixedFloatOrder.from.address; // FixedFloat's LN invoice

        this.updateStep(transfer, 0, 'complete', 'FixedFloat order created', {
            orderId: fixedFloatOrder.id,
            invoice: lightningInvoice
        });
        this.notifyProgress(transfer, onProgress);

        // Step 2: Execute STRK → Lightning swap via Atomiq, paying FixedFloat's invoice
        this.updateStep(transfer, 1, 'in-progress', 'Executing STRK → Lightning swap...');
        this.notifyProgress(transfer, onProgress);

        // Get the source address for the swap (shared account)
        const { getSharedSwapAccount } = await import('../starknet/sharedAccount');
        const sharedSigner = getSharedSwapAccount();
        const sourceAddress = sharedSigner?.getAddress() || '';

        if (!sourceAddress) {
            throw new Error('No shared swap account configured - cannot execute STRK → Lightning swap');
        }

        const atomiqResult = await this.atomiqClient.swapStrkToLightning(
            strkAmountNum,
            lightningInvoice,
            sourceAddress
        );

        if (!atomiqResult.success) {
            throw new Error(`Atomiq swap failed: ${atomiqResult.error}`);
        }

        this.updateStep(transfer, 1, 'complete', 'STRK → Lightning swap complete', {
            txId: atomiqResult.txId
        });
        this.notifyProgress(transfer, onProgress);

        // Step 3: Wait for FixedFloat to process and send ZEC
        this.updateStep(transfer, 2, 'in-progress', 'Waiting for ZEC delivery...');
        this.notifyProgress(transfer, onProgress);

        // Poll for ZEC delivery
        console.log(`\n🔔 Waiting for FixedFloat to deliver ZEC to ${transfer.to.address}`);
        console.log(`Transfer ID: ${transfer.id}`);
        console.log(`Use checkTransferStatus('${transfer.id}') to check delivery status\n`);
    }

    /**
     * Continue STRK → ZEC transfer (check ZEC delivery status)
     */
    async continueStrkToZecTransfer(
        transferId: string,
        onProgress?: (transfer: CrossChainTransfer) => void
    ): Promise<CrossChainTransfer> {
        const transfer = this.activeTransfers.get(transferId);
        if (!transfer) {
            throw new Error(`Transfer ${transferId} not found`);
        }

        if (transfer.direction !== 'strk-to-zec') {
            throw new Error('This method is only for STRK → ZEC transfers');
        }

        try {
            // Check ZEC delivery status
            const orderStatus = await this.zecService.getSwapStatus(
                transfer.zecSwapOrderId!,
                transfer.zecSwapToken || ''
            );

            console.log(`📊 FixedFloat ZEC delivery status: ${orderStatus.status}`);

            if (orderStatus.status === 'done') {
                transfer.to.amount = orderStatus.to.amount;

                this.updateStep(transfer, 2, 'complete', 'ZEC delivered', {
                    amount: orderStatus.to.amount,
                    txId: orderStatus.to.txId
                });
                this.notifyProgress(transfer, onProgress);

                transfer.status = 'complete';
                transfer.completedAt = Date.now();
                this.notifyProgress(transfer, onProgress);

                return transfer;
            }

            if (orderStatus.status === 'expired' || orderStatus.status === 'emergency') {
                throw new Error(`FixedFloat order ${orderStatus.status}`);
            }

            this.updateStep(transfer, 2, 'in-progress', `Waiting for ZEC delivery (status: ${orderStatus.status})`);
            this.notifyProgress(transfer, onProgress);

            return transfer;

        } catch (error) {
            transfer.status = 'failed';
            transfer.error = error instanceof Error ? error.message : String(error);
            this.notifyProgress(transfer, onProgress);
            throw error;
        }
    }

    /**
     * Get transfer status
     */
    getTransfer(id: string): CrossChainTransfer | undefined {
        return this.activeTransfers.get(id);
    }

    /**
     * List all transfers
     */
    listTransfers(): CrossChainTransfer[] {
        return Array.from(this.activeTransfers.values());
    }

    // Helper methods

    private createZecToStrkSteps(usePrivacyMixer: boolean, useCashuFlow: boolean): CrossChainStep[] {
        const steps: CrossChainStep[] = [
            { id: 1, name: 'atomiq-swap-create', description: 'Create Atomiq Lightning swap', status: 'pending' },
            { id: 2, name: 'fixedfloat-order', description: 'Create ZEC → Lightning order', status: 'pending' },
            { id: 3, name: 'zec-deposit', description: 'Waiting for ZEC deposit', status: 'pending' },
            { id: 4, name: 'lightning-payment', description: 'Lightning payment to Atomiq', status: 'pending' },
            { id: 5, name: 'strk-claim', description: 'Claim STRK on Starknet', status: 'pending' }
        ];

        if (usePrivacyMixer) {
            steps.push({
                id: steps.length + 1,
                name: 'privacy-mixer',
                description: 'Process through privacy mixer',
                status: 'pending'
            });
        }

        if (useCashuFlow) {
            steps.push({
                id: steps.length + 1,
                name: 'cashu-flow',
                description: 'Process through Cashu ecash',
                status: 'pending'
            });
        }

        return steps;
    }

    private createStrkToZecSteps(usePrivacyMixer: boolean, useCashuFlow: boolean): CrossChainStep[] {
        const steps: CrossChainStep[] = [
            { id: 1, name: 'fixedfloat-order', description: 'Create Lightning → ZEC order', status: 'pending' },
            { id: 2, name: 'strk-to-lightning', description: 'STRK → Lightning swap via Atomiq', status: 'pending' },
            { id: 3, name: 'zec-delivery', description: 'Wait for ZEC delivery', status: 'pending' }
        ];

        if (usePrivacyMixer) {
            steps.unshift({
                id: 0,
                name: 'privacy-mixer',
                description: 'Process through privacy mixer',
                status: 'pending'
            });
        }

        return steps;
    }

    private updateStep(
        transfer: CrossChainTransfer,
        stepIndex: number,
        status: CrossChainStep['status'],
        description?: string,
        data?: Record<string, unknown>
    ): void {
        const step = transfer.steps[stepIndex];
        if (step) {
            step.status = status;
            if (description) step.description = description;
            if (data) step.data = data;
            if (status === 'in-progress') step.startedAt = Date.now();
            if (status === 'complete' || status === 'failed') step.completedAt = Date.now();

            if (status === 'in-progress') {
                transfer.currentStepIndex = stepIndex;
                transfer.status = 'in-progress';
            }
        }
    }

    private notifyProgress(
        transfer: CrossChainTransfer,
        onProgress?: (transfer: CrossChainTransfer) => void
    ): void {
        if (onProgress) {
            // Send a copy to prevent mutation issues
            onProgress({ ...transfer, steps: [...transfer.steps] });
        }
    }
}

/**
 * Create a CrossChainBridge instance with environment config
 */
export function createCrossChainBridge(): CrossChainBridge {
    // Load config from environment
    const config: CrossChainConfig = {
        fixedFloat: {
            apiKey: process.env.FIXEDFLOAT_API_KEY || '',
            apiSecret: process.env.FIXEDFLOAT_API_SECRET || ''
        },
        starknet: {
            rpcUrl: process.env.STARKNET_RPC_URL || 'https://starknet-mainnet.public.blastapi.io',
            mixerAddress: process.env.PRIVACY_MIXER_ADDRESS || '',
            verifierAddress: process.env.VERIFIER_ADDRESS || ''
        },
        atomiq: {
            environment: (process.env.ATOMIQ_ENVIRONMENT || 'mainnet') as 'testnet' | 'mainnet'
        }
    };

    if (!config.fixedFloat.apiKey || !config.fixedFloat.apiSecret) {
        throw new Error('FIXEDFLOAT_API_KEY and FIXEDFLOAT_API_SECRET must be set');
    }

    return new CrossChainBridge(config);
}
