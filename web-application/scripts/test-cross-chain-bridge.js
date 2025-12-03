/**
 * Test Cross-Chain Bridge - Quote Only
 * Tests the ZEC ↔ Lightning quotes from FixedFloat
 * (Atomiq requires browser environment)
 */
require('dotenv').config();
const crypto = require('crypto');

const API_KEY = process.env.FIXEDFLOAT_API_KEY;
const API_SECRET = process.env.FIXEDFLOAT_API_SECRET;
const BASE_URL = 'https://ff.io/api/v2';

function createSignature(body) {
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(body)
        .digest('hex');
}

async function getQuote(fromCurrency, toCurrency, amount) {
    const body = JSON.stringify({
        fromCcy: fromCurrency,
        toCcy: toCurrency,
        amount: amount.toString(),
        direction: 'from',
        type: 'float'
    });

    const response = await fetch(`${BASE_URL}/price`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
            'X-API-SIGN': createSignature(body)
        },
        body
    });

    return response.json();
}

async function testBridge() {
    console.log('🔗 Cross-Chain Bridge Quote Test\n');

    if (!API_KEY || !API_SECRET) {
        console.error('❌ Missing FIXEDFLOAT_API_KEY or FIXEDFLOAT_API_SECRET');
        process.exit(1);
    }

    console.log('✅ API credentials loaded\n');

    // Test ZEC → Lightning quote (1 ZEC)
    console.log('📊 ZEC → Lightning Quote (1 ZEC):');
    const zecToLn = await getQuote('ZEC', 'BTCLN', 1.0);
    if (zecToLn.code === 0) {
        const sats = Math.floor(parseFloat(zecToLn.data.to.amount) * 100000000);
        console.log(`  Input: ${zecToLn.data.from.amount} ZEC`);
        console.log(`  Output: ${zecToLn.data.to.amount} BTC (${sats} sats)`);
        console.log(`  Rate: ${zecToLn.data.from.rate}`);
        console.log('');
    } else {
        console.error(`  Error: ${zecToLn.msg}`);
    }

    // Test Lightning → ZEC quote (500,000 sats = 0.005 BTC)
    console.log('📊 Lightning → ZEC Quote (0.005 BTC / 500k sats):');
    const lnToZec = await getQuote('BTCLN', 'ZEC', 0.005);
    if (lnToZec.code === 0) {
        console.log(`  Input: ${lnToZec.data.from.amount} BTC (${Math.floor(parseFloat(lnToZec.data.from.amount) * 100000000)} sats)`);
        console.log(`  Output: ${lnToZec.data.to.amount} ZEC`);
        console.log(`  Rate: ${lnToZec.data.from.rate}`);
        console.log('');
    } else {
        console.error(`  Error: ${lnToZec.msg}`);
    }

    // Calculate full ZEC → STRK path estimate
    if (zecToLn.code === 0) {
        const lightningBtc = parseFloat(zecToLn.data.to.amount);
        const lightningSats = Math.floor(lightningBtc * 100000000);

        // Estimate STRK output (Atomiq typical rate ~125-200 sats per STRK)
        const estimatedStrkLow = lightningSats / 200;  // Conservative
        const estimatedStrkHigh = lightningSats / 125; // Optimistic

        console.log('� Estimated Full Path (ZEC → STRK):');
        console.log(`  1 ZEC → ~${lightningSats.toLocaleString()} sats → ${estimatedStrkLow.toFixed(2)} - ${estimatedStrkHigh.toFixed(2)} STRK`);
        console.log(`  (Actual STRK amount depends on Atomiq real-time rates)`);
        console.log('');
    }

    // Calculate full STRK → ZEC path estimate
    if (lnToZec.code === 0) {
        // 100 STRK at ~125-200 sats/STRK
        const strkAmount = 100;
        const satsLow = strkAmount * 125;
        const satsHigh = strkAmount * 200;

        console.log('📈 Estimated Full Path (STRK → ZEC):');
        console.log(`  100 STRK → ~${satsLow.toLocaleString()}-${satsHigh.toLocaleString()} sats → ~${(parseFloat(lnToZec.data.to.amount) * (satsLow / 500000)).toFixed(4)}-${(parseFloat(lnToZec.data.to.amount) * (satsHigh / 500000)).toFixed(4)} ZEC`);
        console.log(`  (Actual ZEC amount depends on Atomiq real-time rates)`);
        console.log('');
    }

    console.log('✅ Quote test complete!\n');
    console.log('Next steps:');
    console.log('1. Run full bridge test in browser (Atomiq requires browser)');
    console.log('2. Use CrossChainBridge.initiateZecToStrk() to start real transfer');
    console.log('3. Use CrossChainBridge.initiateStrkToZec() for reverse direction');
}

testBridge().catch(console.error);
