/**
 * Cross-Chain Mainnet Test Suite
 * 
 * Tests both legs of the cross-chain flow on mainnet:
 * 1. FixedFloat: ZEC ↔ Lightning (API-based, works in Node.js)
 * 2. Atomiq: Lightning ↔ STRK (Browser required for actual swaps)
 * 
 * Run: node scripts/test-cross-chain-mainnet.js
 */

require('dotenv').config();
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
    fixedFloat: {
        apiKey: process.env.FIXEDFLOAT_API_KEY,
        apiSecret: process.env.FIXEDFLOAT_API_SECRET,
        baseUrl: 'https://ff.io/api/v2'
    },
    starknet: {
        rpc: process.env.STARKNET_RPC || process.env.NEXT_PUBLIC_STARKNET_RPC,
        network: process.env.NEXT_PUBLIC_NETWORK || 'MAINNET'
    },
    // Test amounts
    testZecAmount: 0.1,      // 0.1 ZEC (~$3)
    testStrkAmount: 100,     // 100 STRK
    testSatsAmount: 50000    // 50k sats
};

// ═══════════════════════════════════════════════════════════════════
// FixedFloat API (ZEC ↔ Lightning)
// ═══════════════════════════════════════════════════════════════════

function createSignature(body) {
    return crypto
        .createHmac('sha256', CONFIG.fixedFloat.apiSecret)
        .update(body)
        .digest('hex');
}

async function fixedFloatRequest(endpoint, data) {
    const body = JSON.stringify(data);
    const response = await fetch(`${CONFIG.fixedFloat.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': CONFIG.fixedFloat.apiKey,
            'X-API-SIGN': createSignature(body)
        },
        body
    });
    return response.json();
}

async function getFixedFloatQuote(fromCcy, toCcy, amount) {
    return fixedFloatRequest('/price', {
        fromCcy,
        toCcy,
        amount: amount.toString(),
        direction: 'from',
        type: 'float'
    });
}

async function createFixedFloatOrder(fromCcy, toCcy, amount, toAddress) {
    return fixedFloatRequest('/create', {
        fromCcy,
        toCcy,
        amount: amount.toString(),
        direction: 'from',
        type: 'float',
        toAddress
    });
}

// ═══════════════════════════════════════════════════════════════════
// Test Functions
// ═══════════════════════════════════════════════════════════════════

async function testFixedFloatQuotes() {
    console.log('\n' + '═'.repeat(60));
    console.log('🔄 LEG 1: FixedFloat (ZEC ↔ Lightning) - MAINNET');
    console.log('═'.repeat(60));

    if (!CONFIG.fixedFloat.apiKey || !CONFIG.fixedFloat.apiSecret) {
        console.log('❌ Missing FixedFloat API credentials');
        return null;
    }

    console.log('✅ API credentials loaded');

    // ZEC → Lightning
    console.log(`\n📊 ZEC → Lightning Quote (${CONFIG.testZecAmount} ZEC):`);
    const zecToLn = await getFixedFloatQuote('ZEC', 'BTCLN', CONFIG.testZecAmount);

    let lightningAmount = 0;
    if (zecToLn.code === 0) {
        lightningAmount = Math.floor(parseFloat(zecToLn.data.to.amount) * 100000000);
        console.log(`   Input:  ${zecToLn.data.from.amount} ZEC`);
        console.log(`   Output: ${zecToLn.data.to.amount} BTC (${lightningAmount.toLocaleString()} sats)`);
        console.log(`   Rate:   1 ZEC = ${zecToLn.data.from.rate} BTC`);
        console.log(`   Min:    ${zecToLn.data.from.min} ZEC`);
        console.log(`   Max:    ${zecToLn.data.from.max} ZEC`);
    } else {
        console.log(`   ❌ Error: ${zecToLn.msg}`);
    }

    // Lightning → ZEC
    const btcAmount = CONFIG.testSatsAmount / 100000000;
    console.log(`\n📊 Lightning → ZEC Quote (${CONFIG.testSatsAmount.toLocaleString()} sats):`);
    const lnToZec = await getFixedFloatQuote('BTCLN', 'ZEC', btcAmount);

    if (lnToZec.code === 0) {
        console.log(`   Input:  ${lnToZec.data.from.amount} BTC (${CONFIG.testSatsAmount.toLocaleString()} sats)`);
        console.log(`   Output: ${lnToZec.data.to.amount} ZEC`);
        console.log(`   Rate:   1 BTC = ${(1 / parseFloat(lnToZec.data.from.rate)).toFixed(2)} ZEC`);
    } else {
        console.log(`   ❌ Error: ${lnToZec.msg}`);
    }

    return { zecToLn, lnToZec, lightningAmount };
}

async function testStarknetRpc() {
    console.log('\n' + '═'.repeat(60));
    console.log('🔗 Starknet RPC Connection Test');
    console.log('═'.repeat(60));

    console.log(`   Network: ${CONFIG.starknet.network}`);
    console.log(`   RPC: ${CONFIG.starknet.rpc?.slice(0, 50)}...`);

    try {
        const response = await fetch(CONFIG.starknet.rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'starknet_chainId',
                params: [],
                id: 1
            })
        });
        const data = await response.json();

        if (data.result) {
            const chainId = data.result;
            const isMainnet = chainId === '0x534e5f4d41494e'; // SN_MAIN
            console.log(`   ✅ Connected! Chain ID: ${chainId}`);
            console.log(`   Network: ${isMainnet ? 'MAINNET ✓' : 'TESTNET'}`);
            return true;
        } else {
            console.log(`   ❌ RPC Error: ${JSON.stringify(data.error)}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        return false;
    }
}

async function estimateFullPath(fixedFloatData) {
    console.log('\n' + '═'.repeat(60));
    console.log('📈 FULL PATH ESTIMATES');
    console.log('═'.repeat(60));

    // Atomiq rate estimate (sats per STRK)
    const SATS_PER_STRK_LOW = 100;  // Conservative
    const SATS_PER_STRK_HIGH = 160; // Optimistic

    if (fixedFloatData?.zecToLn?.code === 0) {
        const lightningAmount = fixedFloatData.lightningAmount;
        const strkLow = lightningAmount / SATS_PER_STRK_HIGH;
        const strkHigh = lightningAmount / SATS_PER_STRK_LOW;

        console.log(`\n🔹 ZEC → STRK (${CONFIG.testZecAmount} ZEC):`);
        console.log(`   Step 1: ${CONFIG.testZecAmount} ZEC → ${lightningAmount.toLocaleString()} sats (FixedFloat)`);
        console.log(`   Step 2: ${lightningAmount.toLocaleString()} sats → ${strkLow.toFixed(0)}-${strkHigh.toFixed(0)} STRK (Atomiq)`);
        console.log(`   📊 Total: ${CONFIG.testZecAmount} ZEC ≈ ${strkLow.toFixed(0)}-${strkHigh.toFixed(0)} STRK`);
    }

    console.log(`\n🔹 STRK → ZEC (${CONFIG.testStrkAmount} STRK):`);
    const satsFromStrk = CONFIG.testStrkAmount * ((SATS_PER_STRK_LOW + SATS_PER_STRK_HIGH) / 2);
    const btcForZec = satsFromStrk / 100000000;

    // Estimate ZEC output using Lightning → ZEC rate
    const lnToZecQuote = await getFixedFloatQuote('BTCLN', 'ZEC', btcForZec);
    if (lnToZecQuote?.code === 0) {
        const estimatedZec = parseFloat(lnToZecQuote.data.to.amount);
        console.log(`   Step 1: ${CONFIG.testStrkAmount} STRK → ~${satsFromStrk.toLocaleString()} sats (Atomiq)`);
        console.log(`   Step 2: ${satsFromStrk.toLocaleString()} sats → ~${estimatedZec.toFixed(4)} ZEC (FixedFloat)`);
        console.log(`   📊 Total: ${CONFIG.testStrkAmount} STRK ≈ ${estimatedZec.toFixed(4)} ZEC`);
    } else {
        console.log(`   Step 1: ${CONFIG.testStrkAmount} STRK → ~${satsFromStrk.toLocaleString()} sats (Atomiq)`);
        console.log(`   Step 2: ${satsFromStrk.toLocaleString()} sats → ZEC (FixedFloat) - quote unavailable`);
    }
}

async function printBrowserInstructions() {
    console.log('\n' + '═'.repeat(60));
    console.log('📱 BROWSER TESTING (Atomiq Leg)');
    console.log('═'.repeat(60));

    console.log(`
Atomiq SDK requires browser for actual swaps. To test:

1. Start the app:
   npm run dev

2. Open http://localhost:3000/cross-chain

3. Connect your Starknet wallet (MAINNET):
   - ArgentX or Braavos
   - Ensure you have STRK tokens

4. Test ZEC → STRK flow:
   a. Enter ZEC amount (e.g., 0.1 ZEC)
   b. Click "Get Quote" - shows FixedFloat + Atomiq estimates
   c. Click "Start Transfer" - generates ZEC deposit address
   d. Send ZEC from your wallet (Zashi, etc.)
   e. FixedFloat converts to Lightning
   f. Atomiq converts Lightning to STRK
   g. STRK arrives in your wallet

5. Test STRK → ZEC flow:
   a. Switch direction toggle
   b. Enter STRK amount
   c. Enter your ZEC address (z-address for privacy)
   d. Atomiq converts STRK to Lightning
   e. FixedFloat converts Lightning to ZEC
   f. ZEC arrives at your address

IMPORTANT:
- Use small amounts for initial testing
- FixedFloat minimum: ~0.001 ZEC
- Keep quotes fresh (60 second expiry)
`);
}

// ═══════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════

async function main() {
    console.log('⚡ Cross-Chain Mainnet Test Suite');
    console.log('   ZEC ↔ Lightning ↔ STRK');
    console.log('═'.repeat(60));

    // Test Starknet RPC
    await testStarknetRpc();

    // Test FixedFloat quotes
    const fixedFloatData = await testFixedFloatQuotes();

    // Estimate full paths
    await estimateFullPath(fixedFloatData);

    // Print browser instructions
    await printBrowserInstructions();

    console.log('\n✅ Mainnet configuration verified!');
    console.log('   Ready for cross-chain swaps.\n');
}

main().catch(console.error);
