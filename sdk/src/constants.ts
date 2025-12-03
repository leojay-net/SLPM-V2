/**
 * SLPM SDK Constants
 */

// Default contract addresses (mainnet)
export const MAINNET_CONTRACTS = {
    MIXER: '0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b',
    VERIFIER: '', // Set after deployment
    STRK_TOKEN: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
} as const;

// Testnet (Sepolia) contract addresses
export const SEPOLIA_CONTRACTS = {
    MIXER: '0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b',
    VERIFIER: '',
    STRK_TOKEN: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
} as const;

// RPC endpoints
export const RPC_URLS = {
    mainnet: 'https://starknet-mainnet.public.blastapi.io',
    sepolia: 'https://starknet-sepolia.public.blastapi.io',
} as const;

// Default Cashu mints
export const CASHU_MINTS = {
    mainnet: 'https://mint.minibits.cash/Bitcoin',
    testnet: 'https://testnut.cashu.space',
} as const;

// Mixer configuration
export const MIXER_CONFIG = {
    MIN_DEPOSIT: BigInt('1000000000000000000'), // 1 STRK
    MAX_DEPOSIT: BigInt('1000000000000000000000'), // 1000 STRK
    FEE_RATE: 10n, // 0.1% (10/10000)
    MERKLE_TREE_HEIGHT: 20,
} as const;

// Swap configuration
export const SWAP_CONFIG = {
    MIN_AMOUNT_ZEC: 0.001,
    MAX_AMOUNT_ZEC: 10,
    MIN_AMOUNT_STRK: 1,
    MAX_AMOUNT_STRK: 10000,
    DEFAULT_SLIPPAGE: 1, // 1%
    QUOTE_EXPIRY_MS: 60000, // 1 minute
    POLL_INTERVAL_MS: 10000, // 10 seconds
    MAX_POLL_ATTEMPTS: 60, // 10 minutes
} as const;

// Supported currencies
export const CURRENCIES = {
    STRK: {
        symbol: 'STRK',
        name: 'Starknet Token',
        decimals: 18,
        chain: 'starknet',
    },
    ZEC: {
        symbol: 'ZEC',
        name: 'Zcash',
        decimals: 8,
        chain: 'zcash',
    },
    BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        decimals: 8,
        chain: 'bitcoin',
    },
    BTCLN: {
        symbol: 'BTCLN',
        name: 'Bitcoin Lightning',
        decimals: 8,
        chain: 'lightning',
    },
} as const;
