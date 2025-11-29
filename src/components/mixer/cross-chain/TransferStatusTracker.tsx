'use client';

import React from 'react';
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ArrowPathIcon,
    BanknotesIcon,
    BoltIcon,
    WalletIcon,
    ShieldCheckIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export interface TransferStep {
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed' | 'skipped';
    txId?: string;
    error?: string;
    data?: Record<string, unknown>;
    startedAt?: number;
    completedAt?: number;
}

interface TransferStatusTrackerProps {
    steps: TransferStep[];
    currentStepIndex: number;
    direction: 'zec-to-strk' | 'strk-to-zec';
    depositAddress?: string;
    depositAmount?: string;
    className?: string;
}

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'atomiq-swap-create': BoltIcon,
    'fixedfloat-order': ArrowPathIcon,
    'zec-deposit': BanknotesIcon,
    'lightning-payment': BoltIcon,
    'strk-claim': WalletIcon,
    'strk-to-lightning': BoltIcon,
    'zec-delivery': BanknotesIcon,
    'privacy-mixer': ShieldCheckIcon,
    'cashu-flow': ShieldCheckIcon,
};

const statusColors = {
    pending: 'text-gray-500 border-gray-600 bg-gray-800',
    'in-progress': 'text-blue-400 border-blue-500 bg-blue-500/10',
    complete: 'text-green-400 border-green-500 bg-green-500/10',
    failed: 'text-red-400 border-red-500 bg-red-500/10',
    skipped: 'text-gray-500 border-gray-600 bg-gray-800/50',
};

const statusIconColors = {
    pending: 'text-gray-500',
    'in-progress': 'text-blue-400',
    complete: 'text-green-400',
    failed: 'text-red-400',
    skipped: 'text-gray-500',
};

export function TransferStatusTracker({
    steps,
    currentStepIndex,
    direction,
    depositAddress,
    depositAmount,
    className = '',
}: TransferStatusTrackerProps) {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getStepIcon = (step: TransferStep) => {
        const Icon = stepIcons[step.name] || ArrowPathIcon;
        return Icon;
    };

    const getStatusIndicator = (step: TransferStep, index: number) => {
        const isActive = index === currentStepIndex;

        switch (step.status) {
            case 'complete':
                return (
                    <CheckCircleSolidIcon className="w-5 h-5 text-green-400" />
                );
            case 'in-progress':
                return (
                    <div className="relative">
                        <ArrowPathIcon className="w-5 h-5 text-blue-400 animate-spin" />
                        {isActive && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        )}
                    </div>
                );
            case 'failed':
                return (
                    <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
                );
            case 'skipped':
                return (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-600" />
                );
            default:
                return (
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                );
        }
    };

    const formatDuration = (startedAt?: number, completedAt?: number) => {
        if (!startedAt) return null;
        const end = completedAt || Date.now();
        const seconds = Math.floor((end - startedAt) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    };

    const completedSteps = steps.filter(s => s.status === 'complete').length;
    const progressPercent = (completedSteps / steps.length) * 100;

    return (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
            {/* Header with Progress */}
            <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Transfer Progress</h3>
                    <span className="text-sm text-gray-400">
                        {completedSteps} of {steps.length} steps
                    </span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Deposit Address Card (if applicable) */}
            {depositAddress && direction === 'zec-to-strk' && currentStepIndex <= 2 && (
                <div className="mx-6 mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm text-orange-400 font-medium mb-1">
                                Send {depositAmount} ZEC to:
                            </div>
                            <code className="text-xs text-white font-mono break-all">
                                {depositAddress}
                            </code>
                        </div>
                        <button
                            onClick={() => copyToClipboard(depositAddress)}
                            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors flex-shrink-0"
                            title="Copy address"
                        >
                            {copied ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                            ) : (
                                <DocumentDuplicateIcon className="w-5 h-5 text-orange-400" />
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        Transfer will continue automatically once deposit is confirmed
                    </div>
                </div>
            )}

            {/* Steps List */}
            <div className="p-6 space-y-1">
                {steps.map((step, index) => {
                    const Icon = getStepIcon(step);
                    const isActive = index === currentStepIndex;
                    const duration = formatDuration(step.startedAt, step.completedAt);

                    return (
                        <div
                            key={step.id}
                            className={`relative flex items-start p-4 rounded-lg transition-colors ${isActive ? 'bg-gray-900/50' : ''
                                }`}
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-7 top-14 w-0.5 h-6 ${step.status === 'complete' ? 'bg-green-500/50' : 'bg-gray-700'
                                        }`}
                                />
                            )}

                            {/* Step Icon */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center mr-4 ${statusColors[step.status]
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${statusIconColors[step.status]}`} />
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className={`font-medium ${step.status === 'complete' ? 'text-green-400' :
                                            step.status === 'in-progress' ? 'text-blue-400' :
                                                step.status === 'failed' ? 'text-red-400' :
                                                    'text-gray-400'
                                        }`}>
                                        {step.description}
                                    </span>
                                    {getStatusIndicator(step, index)}
                                </div>

                                {/* Duration */}
                                {duration && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {step.status === 'complete' ? 'Completed in' : 'Running for'} {duration}
                                    </div>
                                )}

                                {/* Transaction ID */}
                                {step.txId && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">TX:</span>
                                        <code className="text-xs text-blue-400 font-mono truncate max-w-[200px]">
                                            {step.txId}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(step.txId!)}
                                            className="p-1 hover:bg-gray-700 rounded"
                                        >
                                            <DocumentDuplicateIcon className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                )}

                                {/* Error Message */}
                                {step.error && (
                                    <div className="mt-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                                        {step.error}
                                    </div>
                                )}

                                {/* Additional Data */}
                                {step.data && Object.keys(step.data).length > 0 && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        {Object.entries(step.data).map(([key, value]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                <span className="text-gray-400 truncate max-w-[150px]">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
