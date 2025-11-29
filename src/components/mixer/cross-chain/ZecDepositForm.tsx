'use client';

import React, { useState } from 'react';
import {
    ArrowsRightLeftIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
    BoltIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ZecDepositFormProps {
    onSubmit: (data: {
        direction: 'zec-to-strk' | 'strk-to-zec';
        amount: number;
        destinationAddress: string;
        usePrivacyMixer: boolean;
        useCashuFlow: boolean;
    }) => void;
    onChange?: (data: {
        direction: 'zec-to-strk' | 'strk-to-zec';
        amount: number;
    }) => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

const currencies = {
    ZEC: {
        name: 'Zcash',
        symbol: 'ZEC',
        icon: 'Z',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        min: 0.003,  // FixedFloat minimum
        max: 27,     // FixedFloat max is ~27 ZEC
    },
    STRK: {
        name: 'Starknet',
        symbol: 'STRK',
        icon: 'S',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        min: 10,
        max: 10000,
    },
};

export function ZecDepositForm({
    onSubmit,
    onChange,
    isLoading = false,
    disabled = false,
    className = '',
}: ZecDepositFormProps) {
    const [direction, setDirection] = useState<'zec-to-strk' | 'strk-to-zec'>('zec-to-strk');
    const [amount, setAmount] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [usePrivacyMixer, setUsePrivacyMixer] = useState(false);
    const [useCashuFlow, setUseCashuFlow] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const fromCurrency = direction === 'zec-to-strk' ? currencies.ZEC : currencies.STRK;
    const toCurrency = direction === 'zec-to-strk' ? currencies.STRK : currencies.ZEC;

    const handleSwapDirection = () => {
        const newDirection = direction === 'zec-to-strk' ? 'strk-to-zec' : 'zec-to-strk';
        setDirection(newDirection);
        setAmount('');
        setDestinationAddress('');
        onChange?.({ direction: newDirection, amount: 0 });
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
        const numValue = parseFloat(value) || 0;
        onChange?.({ direction, amount: numValue });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !destinationAddress) return;

        onSubmit({
            direction,
            amount: parseFloat(amount),
            destinationAddress,
            usePrivacyMixer,
            useCashuFlow,
        });
    };

    const numAmount = parseFloat(amount) || 0;
    const isValidAmount = numAmount >= fromCurrency.min && numAmount <= fromCurrency.max;
    const isValidAddress = destinationAddress.length > 10;
    const canSubmit = isValidAmount && isValidAddress && !isLoading && !disabled;

    return (
        <form onSubmit={handleSubmit} className={`bg-gray-900 border border-gray-700 rounded-xl ${className}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <ArrowsRightLeftIcon className="w-5 h-5 text-blue-400" />
                    <span>Cross-Chain Swap</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Private transfers between Zcash and Starknet
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* From Section */}
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">You Send</label>
                    <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${fromCurrency.bgColor} flex items-center justify-center`}>
                            <span className={`text-sm font-bold ${fromCurrency.color}`}>
                                {fromCurrency.icon}
                            </span>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="0.00"
                            step="any"
                            min={fromCurrency.min}
                            max={fromCurrency.max}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-14 pr-20 py-4 text-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                            disabled={isLoading || disabled}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <span className={`text-lg font-medium ${fromCurrency.color}`}>
                                {fromCurrency.symbol}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Min: {fromCurrency.min} {fromCurrency.symbol}</span>
                        <span>Max: {fromCurrency.max} {fromCurrency.symbol}</span>
                    </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2">
                    <button
                        type="button"
                        onClick={handleSwapDirection}
                        className="p-3 bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 group"
                        disabled={isLoading || disabled}
                    >
                        <ArrowsRightLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors rotate-90" />
                    </button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">You Receive</label>
                    <div className={`relative flex items-center px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg`}>
                        <div className={`w-8 h-8 rounded-full ${toCurrency.bgColor} flex items-center justify-center mr-3`}>
                            <span className={`text-sm font-bold ${toCurrency.color}`}>
                                {toCurrency.icon}
                            </span>
                        </div>
                        <span className="text-lg text-gray-400">
                            {numAmount > 0 ? '~' : ''} Estimated after quote
                        </span>
                        <span className={`ml-auto text-lg font-medium ${toCurrency.color}`}>
                            {toCurrency.symbol}
                        </span>
                    </div>
                </div>

                {/* Destination Address */}
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">
                        {direction === 'zec-to-strk' ? 'Starknet Destination Address' : 'Zcash Destination Address'}
                    </label>
                    <input
                        type="text"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        placeholder={direction === 'zec-to-strk' ? '0x...' : 'z...'}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                        disabled={isLoading || disabled}
                    />
                    {direction === 'strk-to-zec' && (
                        <div className="flex items-start space-x-2 text-xs text-orange-400/80">
                            <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Use a shielded z-address for maximum privacy</span>
                        </div>
                    )}
                </div>

                {/* Advanced Options Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                    <span className="flex items-center space-x-2">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Privacy Options</span>
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                    <div className="space-y-4 pt-2 border-t border-gray-700">
                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={usePrivacyMixer}
                                onChange={(e) => setUsePrivacyMixer(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                disabled={isLoading || disabled}
                            />
                            <div>
                                <span className="text-white group-hover:text-blue-400 transition-colors">
                                    Use Privacy Mixer
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Route through ZK privacy mixer for enhanced anonymity
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={useCashuFlow}
                                onChange={(e) => setUseCashuFlow(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                disabled={isLoading || disabled}
                            />
                            <div>
                                <span className="text-white group-hover:text-blue-400 transition-colors">
                                    Use Cashu Ecash Flow
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Additional privacy layer through ecash tokens
                                </p>
                            </div>
                        </label>
                    </div>
                )}

                {/* Info Box */}
                <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                        <p className="font-medium text-blue-400 mb-1">How it works</p>
                        <p className="text-gray-400">
                            {direction === 'zec-to-strk'
                                ? 'Send ZEC to a generated address. It will be converted through Lightning Network to STRK on Starknet.'
                                : 'Your STRK will be converted through Lightning Network to ZEC at your specified address.'
                            }
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${canSubmit
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <BoltIcon className="w-5 h-5 animate-pulse" />
                            <span>Preparing Transfer...</span>
                        </>
                    ) : (
                        <>
                            <BoltIcon className="w-5 h-5" />
                            <span>
                                {direction === 'zec-to-strk' ? 'Start ZEC to STRK Transfer' : 'Start STRK to ZEC Transfer'}
                            </span>
                        </>
                    )}
                </button>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center">
                    By proceeding, you acknowledge that cross-chain transfers are irreversible and subject to network fees.
                </p>
            </div>
        </form>
    );
}
