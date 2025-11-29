/**
 * Test script for ZEC ↔ Lightning swap integration (CommonJS version)
 * 
 * Usage:
 *   FIXEDFLOAT_API_KEY=xxx FIXEDFLOAT_API_SECRET=yyy node scripts/test-zec-swap-simple.js
 */

const crypto = require('crypto');

// FixedFloat API client (inline for simplicity)
class FixedFloatClient {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = 'https://ff.io/api/v2';
    }

    generateSignature(body) {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(body)
            .digest('hex');
    }

    async request(endpoint, data) {
        const body = JSON.stringify(data);
        const signature = this.generateSignature(body);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
                'X-API-SIGN': signature,
            },
            body,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error: ${response.status} - ${text}`);
        }

        const result = await response.json();

        if (result.code !== 0) {
            throw new Error(`FixedFloat error: ${result.msg} (code: ${result.code})`);
        }

        return result;
    }

    async getZecToLightningQuote(zecAmount) {
        return this.request('/price', {
            fromCcy: 'ZEC',
            toCcy: 'BTCLN',
            amount: zecAmount.toString(),
            direction: 'from',
            type: 'float',
        });
    }

    async getLightningToZecQuote(satoshis) {
        const btcAmount = satoshis / 100_000_000;
        return this.request('/price', {
            fromCcy: 'BTCLN',
            toCcy: 'ZEC',
            amount: btcAmount.toString(),
            direction: 'from',
            type: 'float',
        });
    }
}

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           ZEC ↔ Lightning Swap Test                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const apiKey = process.env.FIXEDFLOAT_API_KEY;
    const apiSecret = process.env.FIXEDFLOAT_API_SECRET;

    if (!apiKey || !apiSecret) {
        console.log('❌ Missing API keys!');
        console.log('');
        console.log('Usage:');
        console.log('  export FIXEDFLOAT_API_KEY="your-key"');
        console.log('  export FIXEDFLOAT_API_SECRET="your-secret"');
        console.log('  node scripts/test-zec-swap-simple.js');
        console.log('');

        // Show dry run info
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('Expected Flow: ZEC → STRK\n');
        console.log('1. Get quote: ZEC → Lightning BTC');
        console.log('2. Create Atomiq swap: Lightning → STRK (get invoice)');
        console.log('3. Create FixedFloat order: ZEC → Lightning (with Atomiq invoice)');
        console.log('4. User sends ZEC to deposit address');
        console.log('5. FixedFloat pays Lightning, Atomiq completes');
        console.log('6. STRK → Privacy mixer → User wallet');
        return;
    }

    console.log('✅ API keys found. Testing...\n');

    const client = new FixedFloatClient(apiKey, apiSecret);

    // Test 1: ZEC → Lightning quote
    console.log('Test 1: Getting ZEC → Lightning quote for 1 ZEC...');
    try {
        const quote = await client.getZecToLightningQuote(1);
        console.log('  ✅ Success!');
        console.log(`     From: ${quote.data.from.amount} ${quote.data.from.currency}`);
        console.log(`     To: ${quote.data.to.amount} ${quote.data.to.currency}`);
        console.log(`     Min: ${quote.data.from.min} ZEC`);
        console.log(`     Max: ${quote.data.from.max} ZEC`);
        console.log('');
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
    }

    // Test 2: Lightning → ZEC quote
    console.log('Test 2: Getting Lightning → ZEC quote for 100,000 sats...');
    try {
        const quote = await client.getLightningToZecQuote(100_000);
        console.log('  ✅ Success!');
        console.log(`     From: ${quote.data.from.amount} ${quote.data.from.currency}`);
        console.log(`     To: ${quote.data.to.amount} ${quote.data.to.currency}`);
        console.log(`     Min: ${quote.data.from.min} BTC`);
        console.log(`     Max: ${quote.data.from.max} BTC`);
        console.log('');
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
    }

    console.log('─────────────────────────────────────────────────────────────────');
    console.log('✅ Tests complete!\n');
    console.log('Next steps:');
    console.log('1. Integrate with Atomiq to get Lightning invoices');
    console.log('2. Create full ZEC → STRK flow');
    console.log('3. Test with small amounts');
}

main().catch(console.error);
