'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
    ArrowsRightLeftIcon,
    ShieldCheckIcon,
    BoltIcon,
    ClockIcon,
    CheckCircleIcon,
    XMarkIcon,
    WalletIcon,
} from '@heroicons/react/24/outline';
import { CrossChainQuote } from './CrossChainQuote';
import { ZecDepositForm } from './ZecDepositForm';
import { TransferStatusTracker, TransferStep } from './TransferStatusTracker';
import { useCrossChainSwap } from '@/hooks/useCrossChainSwap';
import { useWallet } from '@/context/WalletProvider';

interface ActiveTransfer {
    id: string;
    direction: 'zec-to-strk' | 'strk-to-zec';
    amount: number;
    destinationAddress: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    steps: TransferStep[];
    currentStepIndex: number;
    depositAddress?: string;
    depositAmount?: string;
    createdAt: number;
}

export function CrossChainSwap() {
    const {
        isInitialized,
        isLoading: hookLoading,
        error: hookError,
        transfer,
        initiateZecToStrk,
        initiateStrkToZec,
        cancelTransfer,
        setError
    } = useCrossChainSwap();

    const { isConnected, address, account, walletProvider, connect, disconnect, isReady: walletReady, client: walletClient } = useWallet();

    const [activeTransfer, setActiveTransfer] = useState<ActiveTransfer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setLocalError] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        direction: 'zec-to-strk' | 'strk-to-zec';
        amount: number;
    } | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Sync hook transfer to local state
    useEffect(() => {
        if (transfer) {
            setActiveTransfer({
                id: transfer.id,
                direction: transfer.direction,
                amount: transfer.amount,
                destinationAddress: transfer.destinationAddress,
                status: transfer.status,
                steps: transfer.steps.map((s, i) => ({
                    id: i + 1,
                    name: s.name,
                    description: s.description,
                    status: s.status,
                })),
                currentStepIndex: transfer.currentStepIndex,
                depositAddress: transfer.depositAddress,
                depositAmount: transfer.depositAmount,
                createdAt: transfer.createdAt,
            });
        }
    }, [transfer]);

    // Sync hook error
    useEffect(() => {
        if (hookError) {
            setLocalError(hookError);
        }
    }, [hookError]);

    const handleFormSubmit = useCallback(async (data: {
        direction: 'zec-to-strk' | 'strk-to-zec';
        amount: number;
        destinationAddress: string;
        usePrivacyMixer: boolean;
        useCashuFlow: boolean;
    }) => {
        setIsLoading(true);
        setLocalError(null);
        setError(null);

        try {
            console.log('Initiating cross-chain swap (client-side):', data);

            if (data.direction === 'zec-to-strk') {
                // ZEC → STRK flow
                // Note: This requires FixedFloat to PAY our Atomiq invoice
                // which currently fails due to Lightning routing issues
                const result = await initiateZecToStrk(
                    data.amount,
                    data.destinationAddress,
                    {
                        usePrivacyMixer: data.usePrivacyMixer,
                        useCashuFlow: data.useCashuFlow
                    }
                );

                if (!result) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return;
                }

                console.log('Transfer initiated:', result);

            } else {
                // STRK → ZEC flow
                // This works because WE pay FixedFloat's invoice via Atomiq
                if (!isConnected || !address || !account || !walletProvider) {
                    setLocalError('STRK → ZEC requires wallet connection. Please connect your Starknet wallet first.');
                    return;
                }

                console.log('Starting STRK → ZEC flow with wallet:', address);
                if (data.usePrivacyMixer) {
                    console.log('🔒 Privacy Mixer enabled - STRK will be routed through ZK mixer');
                }
                if (data.useCashuFlow) {
                    console.log('🪙 Cashu Flow enabled - Additional ecash privacy layer');
                }

                // Pass the full wallet info so we can create a proper WalletAccount
                // Also pass privacy options for enhanced privacy flow
                const result = await initiateStrkToZec(
                    data.amount,
                    data.destinationAddress,
                    { address, walletProvider }, // Pass wallet info for WalletAccount creation
                    {
                        usePrivacyMixer: data.usePrivacyMixer,
                        useCashuFlow: data.useCashuFlow
                    }
                );

                if (!result) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return;
                }

                console.log('STRK → ZEC transfer initiated:', result);
            }

        } catch (err) {
            console.error('Failed to create transfer:', err);
            setLocalError(err instanceof Error ? err.message : 'Failed to initiate transfer');
        } finally {
            setIsLoading(false);
        }
    }, [initiateZecToStrk, initiateStrkToZec, setError, isConnected, address]);

    const handleCancelTransfer = () => {
        cancelTransfer();
        setActiveTransfer(null);
        setFormData(null);
        setLocalError(null);
    };

    const handleNewTransfer = () => {
        cancelTransfer();
        setActiveTransfer(null);
        setFormData(null);
        setLocalError(null);
    };

    const handleFormChange = (data: { direction: 'zec-to-strk' | 'strk-to-zec'; amount: number }) => {
        setFormData(data);
    };

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        setLocalError(null);
        try {
            await connect();
        } catch (err) {
            console.error('Failed to connect wallet:', err);
            setLocalError(err instanceof Error ? err.message : 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnectWallet = () => {
        disconnect();
    };

    // Combine loading states
    const combinedLoading = isLoading || hookLoading;
    // Combine errors
    const combinedError = error || hookError;

    return (
        <div className="flex-1 bg-gray-950 text-white">
            {/* Background Grid - matching mixer page */}
            <div className="fixed inset-0 bg-gray-950 -z-10">
                <div className="absolute inset-0 opacity-70 pointer-events-none" style={{
                    backgroundImage: "url('/patterns/grid.svg')",
                    backgroundSize: '32px 32px',
                    backgroundRepeat: 'repeat'
                }}></div>
            </div>

            <div className="relative z-10">
                {/* Page Header */}
                <div className="border-b border-gray-800">
                    <div className="max-w-6xl mx-auto px-4 py-12">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <div className="p-3 bg-orange-500/10 rounded-xl">
                                    <span className="text-2xl font-bold text-orange-500">Z</span>
                                </div>
                                <ArrowsRightLeftIcon className="w-8 h-8 text-gray-500" />
                                <div className="p-3 bg-orange-400/10 rounded-xl">
                                    <span className="text-2xl font-bold text-orange-400">S</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                Cross-Chain Privacy Transfer
                            </h1>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Seamlessly transfer between Zcash and Starknet with enhanced privacy through Lightning Network, ZK proofs, and Cashu ecash.
                            </p>

                            {/* Feature badges */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                                <span className="inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
                                    <ShieldCheckIcon className="w-4 h-4 mr-1.5 text-green-400" />
                                    ZK Privacy
                                </span>
                                <span className="inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
                                    <BoltIcon className="w-4 h-4 mr-1.5 text-orange-400" />
                                    Lightning Fast
                                </span>
                                <span className="inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
                                    <ClockIcon className="w-4 h-4 mr-1.5 text-blue-400" />
                                    ~5 min transfers
                                </span>
                            </div>

                            {/* Wallet Connection */}
                            <div className="mt-6 flex justify-center">
                                {walletReady ? (
                                    isConnected && address ? (
                                        <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                <span className="text-sm text-gray-300">
                                                    {address.slice(0, 6)}...{address.slice(-4)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleDisconnectWallet}
                                                className="text-sm text-gray-400 hover:text-white transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleConnectWallet}
                                            disabled={isConnecting}
                                            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                        >
                                            <WalletIcon className="w-5 h-5" />
                                            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                                        </button>
                                    )
                                ) : (
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
                                        <ClockIcon className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Loading wallet...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {activeTransfer ? (
                        /* Active Transfer View */
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Transfer Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {activeTransfer.status === 'complete' ? 'Transfer Complete' : 'Transfer in Progress'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {activeTransfer.direction === 'zec-to-strk'
                                            ? `${activeTransfer.amount} ZEC to STRK`
                                            : `${activeTransfer.amount} STRK to ZEC`
                                        }
                                    </p>
                                </div>
                                {activeTransfer.status === 'complete' ? (
                                    <button
                                        onClick={handleNewTransfer}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                        <ArrowsRightLeftIcon className="w-4 h-4" />
                                        <span>New Transfer</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancelTransfer}
                                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        title="Cancel"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Success Message */}
                            {activeTransfer.status === 'complete' && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-green-400">Transfer Successful</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Your funds have been successfully transferred to the destination address.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Transfer Status Tracker */}
                            <TransferStatusTracker
                                steps={activeTransfer.steps}
                                currentStepIndex={activeTransfer.currentStepIndex}
                                direction={activeTransfer.direction}
                                depositAddress={activeTransfer.depositAddress}
                                depositAmount={activeTransfer.depositAmount}
                            />
                        </div>
                    ) : (
                        /* Form View */
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            {/* Left: Form */}
                            <div>
                                {/* Initialization Notice */}
                                {!isInitialized && (
                                    <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start space-x-3">
                                        <ClockIcon className="w-6 h-6 text-blue-400 flex-shrink-0 animate-spin" />
                                        <div>
                                            <p className="font-medium text-blue-400">Initializing...</p>
                                            <p className="text-sm text-gray-400 mt-1">Connecting to swap providers...</p>
                                        </div>
                                    </div>
                                )}
                                {/* Error Display */}
                                {combinedError && (
                                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
                                        <XMarkIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-red-400">Transfer Failed</p>
                                            <p className="text-sm text-gray-400 mt-1">{combinedError}</p>
                                        </div>
                                    </div>
                                )}
                                <ZecDepositForm
                                    onSubmit={handleFormSubmit}
                                    isLoading={combinedLoading}
                                    onChange={handleFormChange}
                                />
                            </div>

                            {/* Right: Quote */}
                            <div className="space-y-6">
                                <CrossChainQuote
                                    direction={formData?.direction || 'zec-to-strk'}
                                    amount={formData?.amount || 0}
                                />

                                {/* Route Visualization */}
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                                    <h3 className="font-medium text-white mb-4">Transfer Route</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-lg font-bold text-orange-500">Z</span>
                                            </div>
                                            <span className="text-gray-400">Zcash</span>
                                        </div>
                                        <div className="flex-1 px-2">
                                            <div className="h-0.5 bg-gradient-to-r from-orange-500/50 via-orange-400/50 to-orange-400/50 rounded" />
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <BoltIcon className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <span className="text-gray-400">Lightning</span>
                                        </div>
                                        <div className="flex-1 px-2">
                                            <div className="h-0.5 bg-gradient-to-r from-orange-400/50 via-orange-400/50 to-orange-400/50 rounded" />
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-lg font-bold text-orange-400">S</span>
                                            </div>
                                            <span className="text-gray-400">Starknet</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Funds are routed through Lightning Network for speed and privacy
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
