module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/config/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MIXING_DELAY_MS",
    ()=>MIXING_DELAY_MS,
    "MIX_MAX_DELAY_MS",
    ()=>MIX_MAX_DELAY_MS,
    "MIX_MIN_DELAY_MS",
    ()=>MIX_MIN_DELAY_MS,
    "PRIVACY_MIXER",
    ()=>PRIVACY_MIXER,
    "SHARED_SWAP_ACCOUNT_ADDRESS",
    ()=>SHARED_SWAP_ACCOUNT_ADDRESS,
    "SPLIT_MAX_PARTS",
    ()=>SPLIT_MAX_PARTS,
    "SPLIT_MIN_DENOM",
    ()=>SPLIT_MIN_DENOM,
    "VERSION",
    ()=>VERSION
]);
const MIXING_DELAY_MS = 200; // legacy placeholder
const MIX_MIN_DELAY_MS = 1_000; // 1s minimal jitter window
const MIX_MAX_DELAY_MS = 15_000; // 15s upper bound (tunable)
const SPLIT_MAX_PARTS = 8;
const SPLIT_MIN_DENOM = 1n; // smallest sat denomination for splitting
const VERSION = '0.0.1-mvp';
const PRIVACY_MIXER = {
    CONTRACT_ADDRESS: '0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b',
    CLASS_HASH: '0x00abc35fe33a082fad61df2a88160f16202d1a08cc338f1954063320063be4d5',
    STRK_TOKEN: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    DEPLOYMENT_PARAMS: {
        OWNER: '0x01734203d1C5B2699B3dbC50223c86EC59E2B79E2d34CBE8363F0dCCdC1E9634',
        MIN_DEPOSIT: 1000000000000000000n,
        MAX_DEPOSIT: 1000000000000000000000n,
        MIN_DELAY: 0n,
        MIN_ANONYMITY: 0n,
        FEE_RATE: 10n // 1% (10000 = 100%)
    }
};
const SHARED_SWAP_ACCOUNT_ADDRESS = '0x075a05264A7D0ebB864abFbE2bbFeE33D085EB77397b939bD17d55c2e69d87D3';
}),
"[project]/src/config/env.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Centralized environment parsing and defaults
__turbopack_context__.s([
    "CONFIG_STATUS",
    ()=>CONFIG_STATUS,
    "ENV",
    ()=>ENV,
    "getNetworkStatus",
    ()=>getNetworkStatus,
    "getStarknetRpc",
    ()=>getStarknetRpc,
    "getTestnetStatus",
    ()=>getTestnetStatus,
    "isMainnetReady",
    ()=>isMainnetReady,
    "isTestnetReady",
    ()=>isTestnetReady,
    "validateConfig",
    ()=>validateConfig
]);
const ENV = {
    NETWORK: ("TURBOPACK compile-time value", "MAINNET") || 'MAINNET',
    // Starknet RPC Configuration
    STARKNET_RPC: ("TURBOPACK compile-time value", "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/kwgGr9GGk4YyLXuGfEvpITv1jpvn3PgP") || process.env.STARKNET_RPC || '',
    STARKNET_PRIVATE_KEY: process.env.STARKNET_PRIVATE_KEY || '',
    SHARED_SWAP_ACCOUNT_PRIVATE_KEY: process.env.SHARED_SWAP_ACCOUNT_PRIVATE_KEY || ("TURBOPACK compile-time value", "0x017e929b437eb038963df230f6dcc8002d06741107abfe22972e4532ba25ccaa") || '',
    // Optional: allow overriding address via env (falls back to constant)
    SHARED_SWAP_ACCOUNT_ADDRESS: process.env.SHARED_SWAP_ACCOUNT_ADDRESS || '',
    // Privacy Mixer Contract
    MIXER_CONTRACT_ADDRESS: ("TURBOPACK compile-time value", "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b") || process.env.MIXER_CONTRACT_ADDRESS || '',
    // Lightning Network Configuration
    LND_URL: ("TURBOPACK compile-time value", "https://slpm-node.t.voltageapp.io:8080") || process.env.LND_URL || '',
    LND_MACAROON: ("TURBOPACK compile-time value", "0201036c6e64025e030a103294bb4616a5eb95a9a935fd5183e1111207383635383234331a160a0761646472657373120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a0f0a076f6e636861696e12047265616400000620bb9f424dcd1d871d56445eb2394e9f734a461bfbd8904538bb370965efd79643") || process.env.LND_MACAROON || '',
    LND_TLS: ("TURBOPACK compile-time value", "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUUyRENDQkY2Z0F3SUJBZ0lTQmRPR3lzblJnUmJaR1NON3B3ZTQ2a0NrTUFvR0NDcUdTTTQ5QkFNRE1ESXgKQ3pBSkJnTlZCQVlUQWxWVE1SWXdGQVlEVlFRS0V3MU1aWFFuY3lCRmJtTnllWEIwTVFzd0NRWURWUVFERXdKRgpPREFlRncweU5UQTVNVGt5TXpRd01EZGFGdzB5TlRFeU1UZ3lNelF3TURaYU1Cb3hHREFXQmdOVkJBTU1EeW91CmRtOXNkR0ZuWldGd2NDNXBiekJaTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEEwSUFCQ2tTZnIyTVlzWUgKN05zYUNOVVdCY1V2NmlJMGRVUkxFL0E2UEVSRjUvZkdIU1Vneldzc0o5emdqeG1uQ29JK0tzN1llcWlvMVBHWgp0dUJoVjNJVkJNV2pnZ05xTUlJRFpqQU9CZ05WSFE4QkFmOEVCQU1DQjRBd0hRWURWUjBsQkJZd0ZBWUlLd1lCCkJRVUhBd0VHQ0NzR0FRVUZCd01DTUF3R0ExVWRFd0VCL3dRQ01BQXdIUVlEVlIwT0JCWUVGTzRVNGdScjA3djIKbUUwc1dFdmdjeFpEbk84Sk1COEdBMVVkSXdRWU1CYUFGSThORTZMMkxuN1JVR3d6R0RoZFdZNGpjcEhLTURJRwpDQ3NHQVFVRkJ3RUJCQ1l3SkRBaUJnZ3JCZ0VGQlFjd0FvWVdhSFIwY0RvdkwyVTRMbWt1YkdWdVkzSXViM0puCkx6Q0NBV1VHQTFVZEVRU0NBVnd3Z2dGWWdoRXFMbUl1ZG05c2RHRm5aV0Z3Y0M1cGI0SVJLaTVrTG5admJIUmgKWjJVdVkyeHZkV1NDRVNvdVpDNTJiMngwWVdkbFlYQndMbWx2Z2hjcUxtMHVjbVZzWVhrdWRtOXNkR0ZuWlM1agpiRzkxWklJWEtpNXRMbkpsYkdGNUxuWnZiSFJoWjJWaGNIQXVhVytDRVNvdWJTNTJiMngwWVdkbExtTnNiM1ZrCmdoRXFMbTB1ZG05c2RHRm5aV0Z3Y0M1cGI0SU9LaTV1YjNOMGNpNTJiSFF1WjJXQ0Z5b3VkQzV5Wld4aGVTNTIKYjJ4MFlXZGxMbU5zYjNWa2doY3FMblF1Y21Wc1lYa3VkbTlzZEdGblpXRndjQzVwYjRJUktpNTBMblp2YkhSaApaMlV1WTJ4dmRXU0NFU291ZEM1MmIyeDBZV2RsWVhCd0xtbHZnaEVxTG5VdWRtOXNkR0ZuWldGd2NDNXBiNElQCktpNTJiMngwWVdkbExtTnNiM1ZrZ2hBcUxuWnZiSFJoWjJWaGNHa3VZMjl0Z2c4cUxuWnZiSFJoWjJWaGNIQXUKYVcrQ0JuWnNkQzVuWllJT2RtOXNkR0ZuWldGd2FTNWpiMjB3RXdZRFZSMGdCQXd3Q2pBSUJnWm5nUXdCQWdFdwpMUVlEVlIwZkJDWXdKREFpb0NDZ0hvWWNhSFIwY0RvdkwyVTRMbU11YkdWdVkzSXViM0puTHpNM0xtTnliRENDCkFRUUdDaXNHQVFRQjFua0NCQUlFZ2ZVRWdmSUE4QUIyQU4zY3lqU1YxK0VXQmVlVk12ckhuL2c5SEZEZjJ3QTYKRkJKMkNpeXN1OGdxQUFBQm1XU1BBNVlBQUFRREFFY3dSUUlnVVV0TGtNQk9oYUtDUk1odkZpa1AwUi9DUEhLdgptZHdSNGtsMWVZT3VOSklDSVFDaS8xZmVKNVBYZmMyME9FWDBnMDVZQkxEL01Ic2xzWkZ3UXF5M3BHY3h0UUIyCkFNejdEMnFGY1FsbC9wV2JVODdwc253aTZZVmNEWmVOdHFsK1ZNRCtUQTJ3QUFBQm1XU1BBNkVBQUFRREFFY3cKUlFJaEFKM0QvTFFzR0d5cFYrT2FpSWZJekQ4bFo4bEo3TnZaT2Y3QnVveStxR00xQWlCaTFxZFVwSGdNdTgzbQo5TGxTQ2k5YVo0eFN6VW93aVp6MDBkZDhlN3g5VlRBS0JnZ3Foa2pPUFFRREF3Tm9BREJsQWpFQWpyUERRM1FuClVjYTJSRng0TkhhZ1FwdWtFcTRrV2k0VkduUHIwZFplMERWc2RBM3hnSy9QTHRpcFlDODVDeUlxQWpCNjhLT2cKQzMvb05PN1ZqcmovUjFFWVd1QjZXWDJwYlMyN25PSW10V2taMm9ldWV1dUJ6Y2QyM1pKMHp6Z01UUXM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUVWakNDQWo2Z0F3SUJBZ0lRWTVXVFk4Sk9jSUp4V1JpL3c5ZnRWakFOQmdrcWhraUc5dzBCQVFzRkFEQlAKTVFzd0NRWURWUVFHRXdKVlV6RXBNQ2NHQTFVRUNoTWdTVzUwWlhKdVpYUWdVMlZqZFhKcGRIa2dVbVZ6WldGeQpZMmdnUjNKdmRYQXhGVEFUQmdOVkJBTVRERWxUVWtjZ1VtOXZkQ0JZTVRBZUZ3MHlOREF6TVRNd01EQXdNREJhCkZ3MHlOekF6TVRJeU16VTVOVGxhTURJeEN6QUpCZ05WQkFZVEFsVlRNUll3RkFZRFZRUUtFdzFNWlhRbmN5QkYKYm1OeWVYQjBNUXN3Q1FZRFZRUURFd0pGT0RCMk1CQUdCeXFHU000OUFnRUdCU3VCQkFBaUEySUFCTkZsOGw3YwpTN1FNQXB6U3N2cnU2V3lyT3E0NG9mVFVPVEl6eFVMVXpETU1OTWNoSUpCd1hPaGlMeHh4czBMWGViNUdEY0hiClI2RVRvTWZmZ1Naak85U05IZlk5Z2pNeTl2UXI1L1dXT3JRVFp4aDdhejZOU05ucTN1MnViVDZIVEtPQitEQ0IKOVRBT0JnTlZIUThCQWY4RUJBTUNBWVl3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdJR0NDc0dBUVVGQndNQgpNQklHQTFVZEV3RUIvd1FJTUFZQkFmOENBUUF3SFFZRFZSME9CQllFRkk4TkU2TDJMbjdSVUd3ekdEaGRXWTRqCmNwSEtNQjhHQTFVZEl3UVlNQmFBRkhtMFdlWjd0dVhrQVhPQUNJaklHbGoyNlp0dU1ESUdDQ3NHQVFVRkJ3RUIKQkNZd0pEQWlCZ2dyQmdFRkJRY3dBb1lXYUhSMGNEb3ZMM2d4TG1rdWJHVnVZM0l1YjNKbkx6QVRCZ05WSFNBRQpEREFLTUFnR0JtZUJEQUVDQVRBbkJnTlZIUjhFSURBZU1CeWdHcUFZaGhab2RIUndPaTh2ZURFdVl5NXNaVzVqCmNpNXZjbWN2TUEwR0NTcUdTSWIzRFFFQkN3VUFBNElDQVFCbkUwaEdJTktzQ1lXaTBYeDF5Z3hENXFpaEVqWjAKUkkzdFRaejF3dUFUSDNad1lQSXA5N2tXRWF5YW5EMWowY0RoSVl6eTRDa0RvMmpCOEQ1dDBhNnpaV3pscjk4ZApBUUZOaDh1S0prSUhkTFNoeStuVXllWnhjNWJOZU1wMUx1MGdTekU0TWNxZm1OTXZJcGVpd1dTWU85dzgyT2I4Cm90dlhjTzJKVVlpM3N2SElXUm0zKzcwN0RVYkw1MVhNY1kyaVpkbENxNFdhOW5idWszV1RVNGdyNkxZOE16VkEKYURRRzIrNFUzZUo2cVVGMTBiQm5SMXV1VnlEWXM5Umhyd3VjUlZuZnVEajI5Q01MVHNwbE01ZjV3U1Y1aFVwbQpVd3AvdlY3TTR3NGFHdW50NzRrb1g3MW40RWRhZ0NzTC9ZazUrbUFRVTArdHVlMEpPZkFWL1I2dDFrK1hrOXMyCkhNUUZlb3hwcGZ6QVZDMDRGZEc5TStBQzJKV3htRlN0NkJDdWgzQ0VleTNmRTUyUXJqOVlNNzVydHZJanNtLzEKSGwrdS8vV3F4bnUxWlE0anBhK1ZwdVppR09sV3JxU1A5ZW9nZE9oQ0dpc255ZXdXSndSUU9xSzE2d2lHeVplUgp4cy9CZWt3NjV2d1NJYVZrQnJ1UGlUZk1PbzBaaDRnVmE4L3FKZ01iSmJ5cnd3Rzk3ei9QUmdtTEtDRGw4ejNkCnRBMFo3cXE3ZnRhMEdsMjR1eXVCMDVkcUk1SjFMdkF6S3VXZElqVDF0UDhxQ294U0UveHBpeDhoWDJkdDNoKy8KanVqVWdGUEZaMEVWWjB4U3lCTlJGM01ib0dabllYRlV4cE5qVFdQS3BhZ0RISlFtcXJBY0RtV0puTXNGWTNqUwp1MWlndjNPZWZuV2pTUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K") || process.env.LND_TLS || '',
    // Cashu Configuration
    CASHU_MINTS: (("TURBOPACK compile-time value", "https://mint.coinos.io") || process.env.CASHU_MINTS || '').split(',').map((s)=>s.trim()).filter(Boolean),
    CASHU_DEFAULT_MINT: ("TURBOPACK compile-time value", "https://mint.coinos.io") || process.env.CASHU_MINT || 'https://mint.coinos.io',
    // Privacy behavior overrides
    CASHU_SINGLE_MINT: (("TURBOPACK compile-time value", "true") || process.env.CASHU_SINGLE_MINT || 'false') === 'true',
    DISABLE_CASHU_SPLIT: (("TURBOPACK compile-time value", "true") || process.env.DISABLE_CASHU_SPLIT || 'false') === 'true',
    // Rate / Pricing Overrides
    // If STRK_BTC_RATE provided (BTC per STRK), convert to sats; else use explicit STRK_SATS_RATE; else default 125
    STRK_BTC_RATE: Number(process.env.NEXT_PUBLIC_STRK_BTC_RATE || process.env.STRK_BTC_RATE || '0'),
    STRK_SATS_RATE: (()=>{
        const explicit = process.env.NEXT_PUBLIC_STRK_SATS_RATE || process.env.STRK_SATS_RATE;
        if (explicit) return Number(explicit);
        const btcPerStrk = Number(process.env.NEXT_PUBLIC_STRK_BTC_RATE || process.env.STRK_BTC_RATE || '0');
        if (btcPerStrk && !isNaN(btcPerStrk) && btcPerStrk > 0) {
            return Math.floor(btcPerStrk * 100_000_000); // sats
        }
        return 125; // updated conservative default
    })(),
    DISABLE_ATOMIQ_PRICE_FETCH: (("TURBOPACK compile-time value", "false") || process.env.DISABLE_ATOMIQ_PRICE_FETCH || 'false') === 'true',
    ALLOW_SWAP_PRICE_FALLBACK: process.env.ALLOW_SWAP_PRICE_FALLBACK === 'true' || false // Real swaps only
};
function getStarknetRpc() {
    if (ENV.STARKNET_RPC) {
        return ENV.STARKNET_RPC;
    }
    // Use network-specific defaults
    switch(ENV.NETWORK){
        case 'MAINNET':
            return 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/kwgGr9GGk4YyLXuGfEvpITv1jpvn3PgP';
        case 'TESTNET':
            return 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7';
        default:
            return 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/kwgGr9GGk4YyLXuGfEvpITv1jpvn3PgP'; // Default to mainnet now
    }
}
function validateConfig() {
    const errors = [];
    const warnings = [];
    // Critical validations
    if (!ENV.NETWORK || ![
        'MAINNET',
        'TESTNET'
    ].includes(ENV.NETWORK)) {
        errors.push('Invalid network configuration');
    }
    if (!ENV.CASHU_DEFAULT_MINT) {
        errors.push('No Cashu mint configured');
    }
    // Testnet readiness warnings
    if (!ENV.STARKNET_RPC) {
        warnings.push(`Using default ${ENV.NETWORK} Starknet RPC - configure STARKNET_RPC for better reliability`);
    }
    if (!ENV.LND_URL) {
        warnings.push('Lightning node URL not configured - using fallback mode');
    }
    if (ENV.CASHU_MINTS.length === 0) {
        warnings.push('No multi-mint configuration - using single mint mode');
    }
    if (!ENV.STARKNET_PRIVATE_KEY && "undefined" === 'undefined') {
        warnings.push('No Starknet private key configured for server-side operations');
    }
    // Shared swap account checks (prototype central account approach)
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Log warnings
    warnings.forEach((warning)=>console.warn(warning));
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
function isTestnetReady() {
    const checks = [
        ENV.NETWORK === 'TESTNET' && ENV.STARKNET_RPC && ENV.STARKNET_PRIVATE_KEY && ENV.CASHU_DEFAULT_MINT
    ];
    return checks.every(Boolean);
}
function isMainnetReady() {
    const isClientSide = "undefined" !== 'undefined';
    const checks = [
        ENV.NETWORK === 'MAINNET' && ENV.STARKNET_RPC && (isClientSide || ENV.STARKNET_PRIVATE_KEY) && // Private key only required server-side
        ENV.CASHU_DEFAULT_MINT && ENV.LND_URL && ENV.LND_MACAROON // Lightning required for mainnet
    ];
    return checks.every(Boolean);
}
function getNetworkStatus() {
    const lightningConfigured = Boolean(ENV.LND_URL && ENV.LND_MACAROON);
    const isReady = ENV.NETWORK === 'MAINNET' ? isMainnetReady() : isTestnetReady();
    return {
        network: ENV.NETWORK,
        starknetRpc: Boolean(ENV.STARKNET_RPC),
        privateKey: Boolean(ENV.STARKNET_PRIVATE_KEY),
        cashuMint: Boolean(ENV.CASHU_DEFAULT_MINT),
        lightningNode: Boolean(ENV.LND_URL),
        lightningConfigured,
        cashuMints: ENV.CASHU_MINTS.length,
        ready: isReady,
        warnings: (()=>{
            const warnings = [];
            const isClientSide = "undefined" !== 'undefined';
            if (!ENV.STARKNET_RPC) warnings.push('STARKNET_RPC not configured');
            if (!ENV.STARKNET_PRIVATE_KEY && !isClientSide) warnings.push('STARKNET_PRIVATE_KEY not configured');
            if (!ENV.CASHU_DEFAULT_MINT) warnings.push('CASHU_DEFAULT_MINT not configured');
            if (ENV.NETWORK === 'MAINNET') {
                if (!ENV.LND_URL) warnings.push('Lightning node (LND_URL) required for mainnet');
                if (!ENV.LND_MACAROON) warnings.push('Lightning authentication (LND_MACAROON) required for mainnet');
            }
            return warnings;
        })()
    };
}
function getTestnetStatus() {
    return getNetworkStatus();
}
const CONFIG_STATUS = validateConfig();
}),
"[project]/src/config/privacy-mixer-abi.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("[{\"type\":\"impl\",\"name\":\"PrivacyMixerImpl\",\"interface_name\":\"contract::privacy_mixer::IPrivacyMixer\"},{\"type\":\"struct\",\"name\":\"core::integer::u256\",\"members\":[{\"name\":\"low\",\"type\":\"core::integer::u128\"},{\"name\":\"high\",\"type\":\"core::integer::u128\"}]},{\"type\":\"enum\",\"name\":\"core::bool\",\"variants\":[{\"name\":\"False\",\"type\":\"()\"},{\"name\":\"True\",\"type\":\"()\"}]},{\"type\":\"struct\",\"name\":\"contract::privacy_mixer::MixingStats\",\"members\":[{\"name\":\"total_deposits\",\"type\":\"core::integer::u256\"},{\"name\":\"total_withdrawals\",\"type\":\"core::integer::u256\"},{\"name\":\"active_commitments\",\"type\":\"core::integer::u256\"},{\"name\":\"anonymity_set_size\",\"type\":\"core::integer::u256\"},{\"name\":\"mixing_efficiency\",\"type\":\"core::integer::u256\"}]},{\"type\":\"struct\",\"name\":\"contract::privacy_mixer::PrivacyMetrics\",\"members\":[{\"name\":\"min_anonymity_set\",\"type\":\"core::integer::u256\"},{\"name\":\"avg_mixing_time\",\"type\":\"core::integer::u256\"},{\"name\":\"unlinkability_score\",\"type\":\"core::integer::u256\"},{\"name\":\"temporal_privacy_score\",\"type\":\"core::integer::u256\"}]},{\"type\":\"interface\",\"name\":\"contract::privacy_mixer::IPrivacyMixer\",\"items\":[{\"type\":\"function\",\"name\":\"deposit\",\"inputs\":[{\"name\":\"commitment\",\"type\":\"core::felt252\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\"}],\"outputs\":[{\"type\":\"core::felt252\"}],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"batch_deposit\",\"inputs\":[{\"name\":\"commitments\",\"type\":\"core::array::Array::<core::felt252>\"},{\"name\":\"amounts\",\"type\":\"core::array::Array::<core::integer::u256>\"}],\"outputs\":[{\"type\":\"core::array::Array::<core::felt252>\"}],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"withdraw\",\"inputs\":[{\"name\":\"nullifier\",\"type\":\"core::felt252\"},{\"name\":\"commitment\",\"type\":\"core::felt252\"},{\"name\":\"recipient\",\"type\":\"core::starknet::contract_address::ContractAddress\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\"},{\"name\":\"proof\",\"type\":\"core::array::Array::<core::felt252>\"}],\"outputs\":[{\"type\":\"core::bool\"}],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"get_anonymity_set_size\",\"inputs\":[],\"outputs\":[{\"type\":\"core::integer::u256\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_total_deposits\",\"inputs\":[],\"outputs\":[{\"type\":\"core::integer::u256\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_total_withdrawals\",\"inputs\":[],\"outputs\":[{\"type\":\"core::integer::u256\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_min_delay\",\"inputs\":[],\"outputs\":[{\"type\":\"core::integer::u64\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_min_anonymity_set\",\"inputs\":[],\"outputs\":[{\"type\":\"core::integer::u256\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"is_nullifier_used\",\"inputs\":[{\"name\":\"nullifier\",\"type\":\"core::felt252\"}],\"outputs\":[{\"type\":\"core::bool\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"is_commitment_valid\",\"inputs\":[{\"name\":\"commitment\",\"type\":\"core::felt252\"}],\"outputs\":[{\"type\":\"core::bool\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"register_account\",\"inputs\":[{\"name\":\"account_type\",\"type\":\"core::felt252\"},{\"name\":\"metadata\",\"type\":\"core::felt252\"}],\"outputs\":[{\"type\":\"core::felt252\"}],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"get_account_balance\",\"inputs\":[{\"name\":\"account_id\",\"type\":\"core::felt252\"}],\"outputs\":[{\"type\":\"core::integer::u256\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"transfer_between_accounts\",\"inputs\":[{\"name\":\"from\",\"type\":\"core::felt252\"},{\"name\":\"to\",\"type\":\"core::felt252\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\"}],\"outputs\":[{\"type\":\"core::bool\"}],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"emergency_pause\",\"inputs\":[],\"outputs\":[],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"emergency_unpause\",\"inputs\":[],\"outputs\":[],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"is_paused\",\"inputs\":[],\"outputs\":[{\"type\":\"core::bool\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"set_min_delay\",\"inputs\":[{\"name\":\"new_delay\",\"type\":\"core::integer::u64\"}],\"outputs\":[],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"set_min_anonymity\",\"inputs\":[{\"name\":\"new_min_anonymity\",\"type\":\"core::integer::u256\"}],\"outputs\":[],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"set_fee_rate\",\"inputs\":[{\"name\":\"new_fee_rate\",\"type\":\"core::integer::u256\"}],\"outputs\":[],\"state_mutability\":\"external\"},{\"type\":\"function\",\"name\":\"get_owner\",\"inputs\":[],\"outputs\":[{\"type\":\"core::starknet::contract_address::ContractAddress\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_strk_token\",\"inputs\":[],\"outputs\":[{\"type\":\"core::starknet::contract_address::ContractAddress\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"get_mixing_stats\",\"inputs\":[],\"outputs\":[{\"type\":\"contract::privacy_mixer::MixingStats\"}],\"state_mutability\":\"view\"},{\"type\":\"function\",\"name\":\"verify_privacy_guarantees\",\"inputs\":[],\"outputs\":[{\"type\":\"contract::privacy_mixer::PrivacyMetrics\"}],\"state_mutability\":\"view\"}]},{\"type\":\"constructor\",\"name\":\"constructor\",\"inputs\":[{\"name\":\"owner\",\"type\":\"core::starknet::contract_address::ContractAddress\"},{\"name\":\"strk_token\",\"type\":\"core::starknet::contract_address::ContractAddress\"},{\"name\":\"min_deposit\",\"type\":\"core::integer::u256\"},{\"name\":\"max_deposit\",\"type\":\"core::integer::u256\"},{\"name\":\"mixing_fee\",\"type\":\"core::integer::u256\"},{\"name\":\"min_anonymity\",\"type\":\"core::integer::u256\"},{\"name\":\"min_delay\",\"type\":\"core::integer::u64\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::Deposit\",\"kind\":\"struct\",\"members\":[{\"name\":\"commitment\",\"type\":\"core::felt252\",\"kind\":\"key\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"depositor\",\"type\":\"core::starknet::contract_address::ContractAddress\",\"kind\":\"data\"},{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"},{\"name\":\"anonymity_set_size\",\"type\":\"core::integer::u256\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::Withdrawal\",\"kind\":\"struct\",\"members\":[{\"name\":\"nullifier\",\"type\":\"core::felt252\",\"kind\":\"key\"},{\"name\":\"recipient\",\"type\":\"core::starknet::contract_address::ContractAddress\",\"kind\":\"data\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"},{\"name\":\"anonymity_set_size\",\"type\":\"core::integer::u256\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::AccountRegistered\",\"kind\":\"struct\",\"members\":[{\"name\":\"account_id\",\"type\":\"core::felt252\",\"kind\":\"key\"},{\"name\":\"owner\",\"type\":\"core::starknet::contract_address::ContractAddress\",\"kind\":\"data\"},{\"name\":\"account_type\",\"type\":\"core::felt252\",\"kind\":\"data\"},{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::AccountTransfer\",\"kind\":\"struct\",\"members\":[{\"name\":\"from_account\",\"type\":\"core::felt252\",\"kind\":\"key\"},{\"name\":\"to_account\",\"type\":\"core::felt252\",\"kind\":\"key\"},{\"name\":\"amount\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::EmergencyPause\",\"kind\":\"struct\",\"members\":[{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"},{\"name\":\"triggered_by\",\"type\":\"core::starknet::contract_address::ContractAddress\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::EmergencyUnpause\",\"kind\":\"struct\",\"members\":[{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"},{\"name\":\"triggered_by\",\"type\":\"core::starknet::contract_address::ContractAddress\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::PrivacyMetricsUpdate\",\"kind\":\"struct\",\"members\":[{\"name\":\"anonymity_set_size\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"mixing_efficiency\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"temporal_privacy_score\",\"type\":\"core::integer::u256\",\"kind\":\"data\"},{\"name\":\"timestamp\",\"type\":\"core::integer::u64\",\"kind\":\"data\"}]},{\"type\":\"event\",\"name\":\"contract::privacy_mixer::PrivacyMixer::Event\",\"kind\":\"enum\",\"variants\":[{\"name\":\"Deposit\",\"type\":\"contract::privacy_mixer::PrivacyMixer::Deposit\",\"kind\":\"nested\"},{\"name\":\"Withdrawal\",\"type\":\"contract::privacy_mixer::PrivacyMixer::Withdrawal\",\"kind\":\"nested\"},{\"name\":\"AccountRegistered\",\"type\":\"contract::privacy_mixer::PrivacyMixer::AccountRegistered\",\"kind\":\"nested\"},{\"name\":\"AccountTransfer\",\"type\":\"contract::privacy_mixer::PrivacyMixer::AccountTransfer\",\"kind\":\"nested\"},{\"name\":\"EmergencyPause\",\"type\":\"contract::privacy_mixer::PrivacyMixer::EmergencyPause\",\"kind\":\"nested\"},{\"name\":\"EmergencyUnpause\",\"type\":\"contract::privacy_mixer::PrivacyMixer::EmergencyUnpause\",\"kind\":\"nested\"},{\"name\":\"PrivacyMetricsUpdate\",\"type\":\"contract::privacy_mixer::PrivacyMixer::PrivacyMetricsUpdate\",\"kind\":\"nested\"}]}]"));}),
"[project]/src/integrations/starknet/privacy-mixer-contract.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * TypeScript interface for interacting with the Starknet Privacy Mixer smart contract
 * Provides type-safe access to all contract functions and events
 */ __turbopack_context__.s([
    "PrivacyMixerContract",
    ()=>PrivacyMixerContract,
    "createPrivacyMixerContract",
    ()=>createPrivacyMixerContract,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deployPrivacyMixerContract",
    ()=>deployPrivacyMixerContract
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/starknet/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$privacy$2d$mixer$2d$abi$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/config/privacy-mixer-abi.json (json)");
;
;
;
;
class PrivacyMixerContract {
    contract;
    account;
    provider;
    constructor(contractAddress, account, provider){
        this.account = account;
        this.provider = provider;
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Contract"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$privacy$2d$mixer$2d$abi$2e$json__$28$json$29$__["default"], contractAddress, provider);
        this.contract.connect(account);
    }
    async deposit(commitment, amount) {
        // Convert hex string to felt252 format for Cairo
        const commitmentFelt = commitment.startsWith('0x') ? commitment : '0x' + commitment;
        return await this.contract.deposit(commitmentFelt, amount);
    }
    async batch_deposit(commitments, amounts) {
        return await this.contract.batch_deposit(commitments, amounts);
    }
    async withdraw(nullifier, commitment, recipient, amount, proof) {
        // Convert hex strings to felt252 format for Cairo
        const nullifierFelt = nullifier.startsWith('0x') ? nullifier : '0x' + nullifier;
        const commitmentFelt = commitment.startsWith('0x') ? commitment : '0x' + commitment;
        return await this.contract.withdraw(nullifierFelt, commitmentFelt, recipient, amount, proof);
    }
    async get_anonymity_set_size() {
        const result = await this.contract.get_anonymity_set_size();
        return BigInt(result.toString());
    }
    async get_total_deposits() {
        const result = await this.contract.get_total_deposits();
        return BigInt(result.toString());
    }
    async get_total_withdrawals() {
        const result = await this.contract.get_total_withdrawals();
        return BigInt(result.toString());
    }
    async is_nullifier_used(nullifier) {
        const result = await this.contract.is_nullifier_used(nullifier);
        return Boolean(result);
    }
    async is_commitment_valid(commitment) {
        const result = await this.contract.is_commitment_valid(commitment);
        return Boolean(result);
    }
    async register_account(account_type, metadata) {
        return await this.contract.register_account(account_type, metadata);
    }
    async get_account_balance(account_id) {
        const result = await this.contract.get_account_balance(account_id);
        return BigInt(result.toString());
    }
    async transfer_between_accounts(from, to, amount) {
        return await this.contract.transfer_between_accounts(from, to, amount);
    }
    async emergency_pause() {
        return await this.contract.emergency_pause();
    }
    async emergency_unpause() {
        return await this.contract.emergency_unpause();
    }
    async is_paused() {
        const result = await this.contract.is_paused();
        return Boolean(result);
    }
    async get_mixing_stats() {
        const result = await this.contract.get_mixing_stats();
        return {
            total_deposits: BigInt(result.total_deposits.toString()),
            total_withdrawals: BigInt(result.total_withdrawals.toString()),
            active_commitments: BigInt(result.active_commitments.toString()),
            anonymity_set_size: BigInt(result.anonymity_set_size.toString()),
            mixing_efficiency: BigInt(result.mixing_efficiency.toString())
        };
    }
    async verify_privacy_guarantees() {
        const result = await this.contract.verify_privacy_guarantees();
        return {
            min_anonymity_set: BigInt(result.min_anonymity_set.toString()),
            avg_mixing_time: BigInt(result.avg_mixing_time.toString()),
            unlinkability_score: BigInt(result.unlinkability_score.toString()),
            temporal_privacy_score: BigInt(result.temporal_privacy_score.toString())
        };
    }
    // Event handling methods
    async getDepositEvents(fromBlock, toBlock) {
        const events = await this.provider.getEvents({
            address: this.contract.address,
            from_block: fromBlock ? {
                block_number: fromBlock
            } : undefined,
            to_block: toBlock ? {
                block_number: toBlock
            } : undefined,
            keys: [
                [
                    'Deposit'
                ]
            ],
            chunk_size: 100
        });
        return events.events.map((event)=>({
                commitment: event.data[0],
                amount: BigInt(event.data[1]),
                depositor: event.data[2],
                timestamp: BigInt(event.data[3]),
                anonymity_set_size: BigInt(event.data[4])
            }));
    }
    async getWithdrawalEvents(fromBlock, toBlock) {
        const events = await this.provider.getEvents({
            address: this.contract.address,
            from_block: fromBlock ? {
                block_number: fromBlock
            } : undefined,
            to_block: toBlock ? {
                block_number: toBlock
            } : undefined,
            keys: [
                [
                    'Withdrawal'
                ]
            ],
            chunk_size: 100
        });
        return events.events.map((event)=>({
                nullifier: event.data[0],
                recipient: event.data[1],
                amount: BigInt(event.data[2]),
                timestamp: BigInt(event.data[3]),
                anonymity_set_size: BigInt(event.data[4])
            }));
    }
    // Privacy-specific helper methods
    async generateCommitment(secret, amount) {
        // Generate a Pedersen hash commitment
        // In a real implementation, this would use proper cryptographic libraries
        const crypto = await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)");
        const hash = crypto.createHash('sha256').update(secret).update(amount.toString()).digest('hex');
        return '0x' + hash;
    }
    async generateNullifier(secret, commitment) {
        // Generate nullifier from secret and commitment
        // In a real implementation, this would use proper cryptographic libraries
        const crypto = await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)");
        const hash = crypto.createHash('sha256').update(secret).update(commitment).digest('hex');
        return '0x' + hash;
    }
    async generateZKProof(secret, commitment, nullifier, recipient, amount) {
        // Generate zero-knowledge proof for withdrawal
        // In a real implementation, this would use a proper ZK proving system like circom/snarkjs
        // For now, we return a mock proof
        return [
            nullifier,
            commitment,
            recipient,
            amount.toString(),
            'mock_proof_element_1',
            'mock_proof_element_2',
            'mock_proof_element_3'
        ];
    }
    // Utility methods for privacy analysis
    async calculatePrivacyScore() {
        const metrics = await this.verify_privacy_guarantees();
        const stats = await this.get_mixing_stats();
        // Simple privacy score calculation
        const anonymityScore = Number(metrics.unlinkability_score);
        const temporalScore = Number(metrics.temporal_privacy_score);
        const volumeScore = stats.anonymity_set_size > 10n ? 100 : Number(stats.anonymity_set_size) * 10;
        return Math.min(100, (anonymityScore + temporalScore + volumeScore) / 3);
    }
    async estimateOptimalMixingTime() {
        const metrics = await this.verify_privacy_guarantees();
        const baseTime = Number(metrics.avg_mixing_time);
        const anonymitySet = await this.get_anonymity_set_size();
        // Recommend longer mixing time for smaller anonymity sets
        if (anonymitySet < 5n) {
            return baseTime * 2;
        } else if (anonymitySet < 10n) {
            return Math.floor(baseTime * 1.5);
        } else {
            return baseTime;
        }
    }
    async recommendOptimalAmount(targetAmount) {
        const stats = await this.get_mixing_stats();
        // Analyze common amounts to suggest better privacy
        // In practice, this would analyze recent deposits to find common denominations
        const commonDenominations = [
            BigInt(1e18),
            BigInt(5e18),
            BigInt(10e18),
            BigInt(50e18),
            BigInt(100e18)
        ];
        if (commonDenominations.includes(targetAmount)) {
            return {
                suggestedAmounts: [
                    targetAmount
                ],
                reason: 'Amount matches common denomination for better privacy'
            };
        }
        // Find closest common denominations
        const smaller = commonDenominations.filter((d)=>d < targetAmount).pop();
        const larger = commonDenominations.find((d)=>d > targetAmount);
        const suggestions = [];
        if (smaller) suggestions.push(smaller);
        if (larger) suggestions.push(larger);
        return {
            suggestedAmounts: suggestions,
            reason: 'Consider using common denominations to blend with other users'
        };
    }
}
async function createPrivacyMixerContract(accountPrivateKey, accountAddress, rpcUrl = 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/kwgGr9GGk4YyLXuGfEvpITv1jpvn3PgP', contractAddress = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENV"].MIXER_CONTRACT_ADDRESS || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIVACY_MIXER"].CONTRACT_ADDRESS) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RpcProvider"]({
        nodeUrl: rpcUrl
    });
    const account = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Account"](provider, accountAddress, accountPrivateKey);
    return new PrivacyMixerContract(contractAddress, account, provider);
}
async function deployPrivacyMixerContract(account, constructorArgs) {
    // In practice, this would compile and deploy the Cairo contract
    // For now, we return a mock deployment result
    throw new Error('Contract deployment not implemented - requires Starknet toolchain');
}
const __TURBOPACK__default__export__ = PrivacyMixerContract;
}),
"[project]/src/integrations/starknet/wallet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Starknet wallet integration for ArgentX and Braavos
__turbopack_context__.s([
    "MockStarknetWalletClient",
    ()=>MockStarknetWalletClient,
    "RealStarknetWalletClient",
    ()=>RealStarknetWalletClient,
    "StarknetWalletManager",
    ()=>StarknetWalletManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$starknet$2d$io$2f$get$2d$starknet$2f$dist$2f$ui$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@starknet-io/get-starknet/dist/ui.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/starknet/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$privacy$2d$mixer$2d$contract$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/starknet/privacy-mixer-contract.ts [app-ssr] (ecmascript)");
;
;
;
class RealStarknetWalletClient {
    connection = null;
    rpcProvider;
    mixerContract = null;
    // Maintain a static/shared connection across instances to avoid duplicate wallet popups
    static sharedConnection = null;
    constructor(rpcUrl){
        this.rpcProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RpcProvider"]({
            nodeUrl: rpcUrl || 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
        });
    }
    async connect(preferredWallet) {
        try {
            // Check if we have a shared connection and validate it's still working
            if (RealStarknetWalletClient.sharedConnection) {
                try {
                    // Test the connection by trying to access the account address
                    const testAddress = RealStarknetWalletClient.sharedConnection.account.address;
                    if (testAddress) {
                        this.connection = RealStarknetWalletClient.sharedConnection;
                        console.log('🔄 Reusing existing wallet connection', {
                            address: testAddress,
                            walletType: this.connection.walletType
                        });
                        return this.connection;
                    }
                } catch (validationError) {
                    console.warn('⚠️ Cached connection is stale, creating new connection:', validationError);
                    RealStarknetWalletClient.sharedConnection = null;
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                throw new Error('Wallet connection is only available in the browser');
            }
            // Try to connect to a specific injected wallet first
            const w = window;
            let injected = null;
            const want = (preferredWallet || 'argentX').toLowerCase();
            if (want === 'argentx') injected = w.starknet_argentX || null;
            if (want === 'braavos') injected = w.starknet_braavos || injected;
            if (want === 'okx') injected = w.starknet_okxwallet || injected;
            // Only use fallback modal if no injected wallet found AND no shared connection
            let provider = injected;
            if (!provider) {
                console.log('🔍 No injected wallet found, trying modal fallback...');
                try {
                    provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$starknet$2d$io$2f$get$2d$starknet$2f$dist$2f$ui$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["connect"])({
                        modalMode: 'always'
                    });
                } catch (modalError) {
                    console.warn('⚠️ Modal connection failed:', modalError);
                // ignore and handle below
                }
            }
            if (!provider) {
                throw new Error('No compatible Starknet wallet found');
            }
            // Ask for permissions/enable
            if (typeof provider.enable === 'function') {
                await provider.enable({
                    showModal: false
                }).catch(()=>{});
            }
            const walletType = this.detectWalletType(provider);
            const account = provider.account || provider;
            // IMPORTANT: Use the wallet's provider, not our RPC provider for wallet operations
            // This ensures we maintain the wallet context for balance queries
            const walletProvider = provider.provider || this.rpcProvider;
            this.connection = {
                account,
                provider: walletProvider,
                isConnected: true,
                walletType
            };
            // Cache globally for subsequent client instances
            RealStarknetWalletClient.sharedConnection = this.connection;
            console.log('✅ New wallet connection established and cached', {
                address: this.connection.account.address,
                walletType: this.connection.walletType,
                providerType: walletProvider === this.rpcProvider ? 'RPC' : 'Wallet'
            });
            return this.connection;
        } catch (error) {
            throw new Error(`Failed to connect to Starknet wallet: ${error}`);
        }
    }
    async disconnect() {
        if (this.connection) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$starknet$2d$io$2f$get$2d$starknet$2f$dist$2f$ui$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["disconnect"])();
            this.connection = null;
            // Clear shared connection so next connect will prompt for wallet selection
            RealStarknetWalletClient.sharedConnection = null;
        }
    }
    isConnected() {
        return this.connection?.isConnected || false;
    }
    getAccount() {
        if (!this.connection) return null;
        return {
            address: this.connection.account.address,
            publicKey: '',
            walletType: this.connection.walletType,
            chainId: 'SN_MAIN' // Default to mainnet
        };
    }
    async getBalance(tokenAddress) {
        if (!this.connection) {
            throw new Error('Wallet not connected');
        }
        // Handle native STRK vs ERC-20 tokens
        if (!tokenAddress || tokenAddress.toLowerCase() === 'strk' || tokenAddress.toLowerCase() === 'native') {
            // Get native STRK balance using the official STRK token contract
            // Native STRK is actually an ERC-20 token on Starknet
            const NATIVE_STRK_CONTRACT = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'; // Sepolia STRK
            try {
                // Use the same approach as the E2E test - direct contract creation and balance_of call
                const ERC20_ABI = [
                    {
                        name: 'balance_of',
                        type: 'function',
                        inputs: [
                            {
                                name: 'account',
                                type: 'core::starknet::contract_address::ContractAddress'
                            }
                        ],
                        outputs: [
                            {
                                type: 'core::integer::u256'
                            }
                        ],
                        state_mutability: 'view'
                    }
                ];
                // Use our configured RPC provider instead of wallet's provider for reliability
                // This ensures we use the stable Alchemy endpoint instead of the wallet's default
                const strkContract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Contract"](ERC20_ABI, NATIVE_STRK_CONTRACT, this.rpcProvider);
                const balance = await strkContract.balance_of(this.connection.account.address);
                console.log('💰 STRK balance check via contract:', {
                    address: this.connection.account.address,
                    contract: NATIVE_STRK_CONTRACT,
                    balance: balance.toString()
                });
                return {
                    symbol: 'STRK',
                    address: NATIVE_STRK_CONTRACT,
                    balance: BigInt(balance.toString()),
                    decimals: 18 // STRK has 18 decimals
                };
            } catch (error) {
                console.error('Failed to get STRK balance via contract:', error);
                throw new Error(`Failed to get STRK balance: ${error}`);
            }
        } else {
            // Handle ERC-20 tokens using same pattern as test
            try {
                const ERC20_ABI = [
                    {
                        name: 'balance_of',
                        type: 'function',
                        inputs: [
                            {
                                name: 'account',
                                type: 'core::starknet::contract_address::ContractAddress'
                            }
                        ],
                        outputs: [
                            {
                                type: 'core::integer::u256'
                            }
                        ],
                        state_mutability: 'view'
                    },
                    {
                        name: 'decimals',
                        type: 'function',
                        inputs: [],
                        outputs: [
                            {
                                type: 'core::integer::u8'
                            }
                        ],
                        state_mutability: 'view'
                    },
                    {
                        name: 'symbol',
                        type: 'function',
                        inputs: [],
                        outputs: [
                            {
                                type: 'core::felt252'
                            }
                        ],
                        state_mutability: 'view'
                    }
                ];
                // Use our configured RPC provider instead of wallet's provider for reliability
                const tokenContract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Contract"](ERC20_ABI, tokenAddress, this.rpcProvider);
                const balance = await tokenContract.balance_of(this.connection.account.address);
                const decimals = await tokenContract.decimals();
                const symbol = await tokenContract.symbol();
                console.log('💰 Token balance check via contract:', {
                    address: this.connection.account.address,
                    contract: tokenAddress,
                    balance: balance.toString(),
                    decimals: decimals.toString(),
                    symbol: symbol.toString()
                });
                return {
                    symbol: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["num"].toHex(symbol),
                    address: tokenAddress,
                    balance: BigInt(balance.toString()),
                    decimals: Number(decimals.toString())
                };
            } catch (error) {
                throw new Error(`Failed to get token balance: ${error}`);
            }
        }
    }
    async sendTransaction(calls) {
        if (!this.connection) {
            throw new Error('Wallet not connected');
        }
        try {
            const result = await this.connection.account.execute(calls);
            return {
                transactionHash: result.transaction_hash,
                status: 'PENDING'
            };
        } catch (error) {
            throw new Error(`Transaction failed: ${error}`);
        }
    }
    async waitForTransaction(txHash, retryInterval = 5000) {
        if (!this.connection) {
            throw new Error('Wallet not connected');
        }
        try {
            const receipt = await this.rpcProvider.waitForTransaction(txHash);
            return {
                transactionHash: txHash,
                status: receipt.isSuccess() ? 'ACCEPTED_ON_L2' : 'REJECTED',
                blockNumber: receipt.block_number || undefined,
                actualFee: receipt.actual_fee?.toString() || undefined
            };
        } catch (error) {
            throw new Error(`Failed to wait for transaction: ${error}`);
        }
    }
    async transfer(tokenAddress, recipient, amount) {
        // Handle native STRK vs ERC-20 tokens
        if (!tokenAddress || tokenAddress.toLowerCase() === 'strk' || tokenAddress.toLowerCase() === 'native') {
            // Native STRK transfer - direct account execution
            const calls = [
                {
                    contractAddress: recipient,
                    entrypoint: '__default__',
                    calldata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CallData"].compile([
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cairo"].uint256(amount)
                    ])
                }
            ];
            return this.sendTransaction(calls);
        } else {
            // ERC-20 token transfer
            const calls = [
                {
                    contractAddress: tokenAddress,
                    entrypoint: 'transfer',
                    calldata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CallData"].compile([
                        recipient,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cairo"].uint256(amount)
                    ])
                }
            ];
            return this.sendTransaction(calls);
        }
    }
    async approve(tokenAddress, spender, amount) {
        // Native STRK doesn't need approval - only ERC-20 tokens do
        if (!tokenAddress || tokenAddress.toLowerCase() === 'strk' || tokenAddress.toLowerCase() === 'native') {
            throw new Error('Native STRK does not require approval - use direct transfer');
        }
        // ERC-20 token approval
        const calls = [
            {
                contractAddress: tokenAddress,
                entrypoint: 'approve',
                calldata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CallData"].compile([
                    spender,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cairo"].uint256(amount)
                ])
            }
        ];
        return this.sendTransaction(calls);
    }
    async switchAccount(accountIndex) {
        // This would depend on wallet's multi-account support
        // For now, return current account
        const account = this.getAccount();
        if (!account) {
            throw new Error('No account connected');
        }
        return account;
    }
    async listAccounts() {
        // This would query the wallet for all available accounts
        // For now, return current account
        const account = this.getAccount();
        return account ? [
            account
        ] : [];
    }
    async callContract(contractAddress, entrypoint, calldata) {
        if (!this.connection) {
            throw new Error('Wallet not connected');
        }
        return this.rpcProvider.callContract({
            contractAddress,
            entrypoint,
            calldata
        });
    }
    // Privacy mixer contract integration
    async initMixerContract(contractAddress) {
        if (!this.connection) {
            throw new Error('No wallet connected');
        }
        try {
            // Create contract directly since we already have the connected account
            this.mixerContract = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$privacy$2d$mixer$2d$contract$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PrivacyMixerContract"](contractAddress, this.connection.account, this.rpcProvider);
        } catch (error) {
            console.error('Failed to initialize mixer contract:', error);
            throw error;
        }
    }
    async depositToMixer(commitment, amount) {
        if (!this.mixerContract) {
            throw new Error('Mixer contract not initialized. Call initMixerContract first.');
        }
        if (!this.connection) {
            throw new Error('No wallet connected');
        }
        try {
            const result = await this.mixerContract.deposit(commitment, amount);
            return result.transaction_hash;
        } catch (error) {
            console.error('Failed to deposit to mixer:', error);
            throw error;
        }
    }
    async withdrawFromMixer(nullifier, commitment, recipient, amount, proof) {
        if (!this.mixerContract) {
            throw new Error('Mixer contract not initialized. Call initMixerContract first.');
        }
        if (!this.connection) {
            throw new Error('No wallet connected');
        }
        try {
            const result = await this.mixerContract.withdraw(nullifier, commitment, recipient, amount, proof);
            return result.transaction_hash;
        } catch (error) {
            console.error('Failed to withdraw from mixer:', error);
            throw error;
        }
    }
    async getMixerStats() {
        if (!this.mixerContract) {
            throw new Error('Mixer contract not initialized. Call initMixerContract first.');
        }
        return await this.mixerContract.get_mixing_stats();
    }
    async getPrivacyMetrics() {
        if (!this.mixerContract) {
            throw new Error('Mixer contract not initialized. Call initMixerContract first.');
        }
        return await this.mixerContract.verify_privacy_guarantees();
    }
    detectWalletType(starknet) {
        // Detect wallet type based on provider details
        if (starknet.id?.includes('argentX')) return 'argentX';
        if (starknet.id?.includes('braavos')) return 'braavos';
        if (starknet.id?.includes('bitkeep')) return 'bitkeep';
        if (starknet.id?.includes('okx')) return 'okx';
        // Default fallback
        return 'argentX';
    }
}
class MockStarknetWalletClient {
    connected = false;
    mockAccount = {
        address: '0x123...mock',
        publicKey: '0xabc...mock',
        walletType: 'argentX',
        chainId: 'SN_MAIN'
    };
    async connect(preferredWallet) {
        this.connected = true;
        return {
            account: {},
            provider: {},
            isConnected: true,
            walletType: preferredWallet || 'argentX'
        };
    }
    async disconnect() {
        this.connected = false;
    }
    isConnected() {
        return this.connected;
    }
    getAccount() {
        return this.connected ? this.mockAccount : null;
    }
    async getBalance(tokenAddress) {
        return {
            symbol: 'STRK',
            address: tokenAddress || '0x123...strk',
            balance: BigInt(1000000),
            decimals: 18
        };
    }
    async sendTransaction(calls) {
        return {
            transactionHash: '0x' + Date.now().toString(16),
            status: 'PENDING'
        };
    }
    async waitForTransaction(txHash) {
        return {
            transactionHash: txHash,
            status: 'ACCEPTED_ON_L2',
            blockNumber: 123456
        };
    }
    async transfer(tokenAddress, recipient, amount) {
        return this.sendTransaction([]);
    }
    async approve(tokenAddress, spender, amount) {
        return this.sendTransaction([]);
    }
    async switchAccount(accountIndex) {
        return this.mockAccount;
    }
    async listAccounts() {
        return [
            this.mockAccount
        ];
    }
    async callContract(contractAddress, entrypoint, calldata) {
        return {
            result: [
                '0x123'
            ]
        };
    }
    async initMixerContract(_contractAddress) {
    // Mock implementation - no-op
    }
    async depositToMixer(_commitment, _amount) {
        return '0x' + Date.now().toString(16);
    }
    async withdrawFromMixer(_nullifier, _commitment, _recipient, _amount, _proof) {
        return '0x' + Date.now().toString(16);
    }
    async getMixerStats() {
        return {
            total_deposits: 1000n,
            total_withdrawals: 500n,
            active_commitments: 500n,
            anonymity_set_size: 100n,
            mixing_efficiency: 95n
        };
    }
    async getPrivacyMetrics() {
        return {
            min_anonymity_set: 10n,
            avg_mixing_time: 3600n,
            unlinkability_score: 95n,
            temporal_privacy_score: 90n
        };
    }
}
class StarknetWalletManager {
    clients = new Map();
    activeClient = null;
    constructor(){
        // Initialize supported wallet clients
        this.clients.set('argentX', new RealStarknetWalletClient());
        this.clients.set('braavos', new RealStarknetWalletClient());
        this.clients.set('okx', new RealStarknetWalletClient());
    }
    async connectWallet(preferredWallet) {
        const client = preferredWallet ? this.clients.get(preferredWallet) : this.clients.get('argentX');
        if (!client) {
            throw new Error(`Unsupported wallet: ${preferredWallet}`);
        }
        const connection = await client.connect(preferredWallet);
        this.activeClient = client;
        return connection;
    }
    getActiveClient() {
        return this.activeClient;
    }
    async disconnectAll() {
        if (this.activeClient) {
            await this.activeClient.disconnect();
            this.activeClient = null;
        }
    }
    getSupportedWallets() {
        return Array.from(this.clients.keys());
    }
}
}),
"[project]/src/context/WalletProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletProvider",
    ()=>WalletProvider,
    "useWallet",
    ()=>useWallet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$wallet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/starknet/wallet.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Ctx = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function WalletProvider({ children }) {
    const [client] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$wallet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RealStarknetWalletClient"]());
    const [isReady, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [conn, setConn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (preferred)=>{
        const c = await client.connect(preferred);
        setConn(c);
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch  {}
    }, [
        client
    ]);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await client.disconnect();
        setConn(null);
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch  {}
    }, [
        client
    ]);
    // Auto-connect on mount from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (async ()=>{
            try {
                const last = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            } catch  {}
            setReady(true);
        })();
    }, [
        connect
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            isReady,
            isConnected: Boolean(conn?.isConnected),
            address: conn?.account?.address,
            walletType: conn?.walletType,
            connect,
            disconnect,
            client
        }), [
        isReady,
        conn,
        connect,
        disconnect,
        client
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Ctx.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/WalletProvider.tsx",
        lineNumber: 62,
        columnNumber: 12
    }, this);
}
function useWallet() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(Ctx);
    if (!ctx) throw new Error('useWallet must be used within WalletProvider');
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0884d526._.js.map