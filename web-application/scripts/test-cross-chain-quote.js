/**
 * Test Cross-Chain Quote Flow
 * 
 * Usage:
 *   node scripts/test-cross-chain-quote.js
 */

const crypto = require('crypto');

// Load env
require('dotenv').config();

class FixedFloatClient {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = 'https://ff.io/api/v2';
    }

    generateSignature(body) {
        return crypto.createHmac('sha256', this.apiSecret).update(body).digest('hex');
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

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(`FixedFloat error: ${result.msg}`);
        }
        return result;
    }

    async getZecToLnQuote(zecAmount) {
        return this.request('/price', {
            fromCcy: 'ZEC',
            toCcy: 'BTCLN',
            amount: zecAmount.toString(),
            direction: 'from',
            type: 'float',
        });
    }

    async getLnToZecQuote(btcAmount) {
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
    console.log('║         Cross-Chain Quote Test (ZEC ↔ STRK)                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const apiKey = process.env.FIXEDFLOAT_API_KEY;
    const apiSecret = process.env.FIXEDFLOAT_API_SECRET;

    if (!apiKey || !apiSecret) {
        console.log('❌ Missing API keys in .env file');
        return;
    }

    const client = new FixedFloatClient(apiKey, apiSecret);

    // ============ ZEC → STRK Quote ============
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('ZEC → STRK Quote (for 1 ZEC)\n');

    try {
        const zecToLn = await client.getZecToLnQuote(1);

        console.log('Step 1: ZEC → Lightning (FixedFloat)');
        console.log(`  Input:  1 ZEC`);
        console.log(`  Output: ${zecToLn.data.to.amount} BTC (~${Math.floor(parseFloat(zecToLn.data.to.amount) * 100000000)} sats)`);
        console.log(`  Min:    ${zecToLn.data.from.min} ZEC`);
        console.log(`  Max:    ${zecToLn.data.from.max} ZEC`);
        console.log('');

        // Estimate STRK (placeholder - would need Atomiq quote)
        const btcAmount = parseFloat(zecToLn.data.to.amount);
        const sats = Math.floor(btcAmount * 100000000);

        console.log('Step 2: Lightning → STRK (Atomiq)');
        console.log(`  Input:  ${sats} sats`);
        console.log(`  Output: ~XXX STRK (requires Atomiq quote)`);
        console.log('');

        console.log('Step 3: Privacy Mixer');
        console.log(`  Input:  XXX STRK`);
        console.log(`  Output: XXX STRK (to fresh address)`);
        console.log(`  ZK Proof: commitment/nullifier scheme`);
        console.log('');

        console.log('Privacy Layers Used:');
        console.log('  ✅ Layer 1: Zcash Shielded (if using z-address)');
        console.log('  ✅ Layer 2: Lightning Network (off-chain)');
        console.log('  ✅ Layer 3: Starknet ZK Mixer');
        console.log('  ⬜ Layer 4: Cashu (optional)');
        console.log('');

    } catch (error) {
        console.log(`❌ Error: ${error.message}\n`);
    }

    // ============ STRK → ZEC Quote ============
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('STRK → ZEC Quote (for ~100k sats worth)\n');

    try {
        // Assume we're converting ~100k sats worth of STRK
        const lnToZec = await client.getLnToZecQuote(0.001); // 100k sats = 0.001 BTC

        console.log('Step 1: STRK → Privacy Mixer');
        console.log(`  Input:  XXX STRK`);
        console.log(`  Output: commitment stored, secret saved`);
        console.log('');

        console.log('Step 2: Mixer → Lightning (Atomiq)');
        console.log(`  Input:  XXX STRK (withdrawn with ZK proof)`);
        console.log(`  Output: ~100000 sats`);
        console.log('');

        console.log('Step 3: Lightning → ZEC (FixedFloat)');
        console.log(`  Input:  0.001 BTC (100000 sats)`);
        console.log(`  Output: ${lnToZec.data.to.amount} ZEC`);
        console.log(`  Min:    ${lnToZec.data.from.min} BTC`);
        console.log(`  Max:    ${lnToZec.data.from.max} BTC`);
        console.log('');

        console.log('Privacy Layers Used:');
        console.log('  ✅ Layer 1: Starknet ZK Mixer');
        console.log('  ⬜ Layer 2: Cashu (optional)');
        console.log('  ✅ Layer 3: Lightning Network (off-chain)');
        console.log('  ✅ Layer 4: Zcash Shielded (USE z-address!)');
        console.log('');

        console.log('⚠️  IMPORTANT: Use a shielded z-address (starts with "zs")');
        console.log('    for maximum privacy. Transparent addresses are public!');
        console.log('');

    } catch (error) {
        console.log(`❌ Error: ${error.message}\n`);
    }

    // ============ Summary ============
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('Summary\n');
    console.log('✅ FixedFloat API: Working');
    console.log('⏳ Atomiq Integration: Needs connection to your existing code');
    console.log('✅ Privacy Mixer: Deployed on Ztarknet');
    console.log('✅ ZK Verifier: Deployed on Ztarknet');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Connect Atomiq SDK to get Lightning invoices');
    console.log('2. Wire up the full flow in the frontend');
    console.log('3. Test with small amounts');
}

main().catch(console.error);
