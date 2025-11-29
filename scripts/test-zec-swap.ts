/**
 * Test script for ZEC ↔ Lightning swap integration
 * 
 * Usage:
 *   FIXEDFLOAT_API_KEY=xxx FIXEDFLOAT_API_SECRET=yyy npx ts-node scripts/test-zec-swap.ts
 */

import { ZecSwapService, FixedFloatClient } from '../src/integrations/zcash/index.js';

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           ZEC ↔ Lightning Swap Test                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Check for API keys
    const apiKey = process.env.FIXEDFLOAT_API_KEY;
    const apiSecret = process.env.FIXEDFLOAT_API_SECRET;

    if (!apiKey || !apiSecret) {
        console.log('⚠️  No API keys found. Running in dry-run mode.\n');
        console.log('To test with real API:');
        console.log('  export FIXEDFLOAT_API_KEY="your-key"');
        console.log('  export FIXEDFLOAT_API_SECRET="your-secret"');
        console.log('  npx ts-node scripts/test-zec-swap.ts\n');

        await runDryRunTests();
        return;
    }

    console.log('✅ API keys found. Testing real API...\n');

    const swapService = new ZecSwapService({
        fixedFloat: {
            apiKey,
            apiSecret,
        },
    });

    await runRealTests(swapService);
}

async function runDryRunTests() {
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('DRY RUN TESTS (No API calls)\n');

    // Test address validation
    console.log('Testing ZEC address validation:');

    const addresses = [
        { addr: 't1exampleaddress1234567890123456789', expected: true, type: 'transparent' },
        { addr: 'zs1exampleshieldedaddressxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', expected: true, type: 'shielded' },
        { addr: 'invalid', expected: false, type: 'invalid' },
    ];

    for (const { addr, expected, type } of addresses) {
        const isValid = FixedFloatClient.isValidZecAddress(addr);
        const isShielded = FixedFloatClient.isShieldedAddress(addr);
        console.log(`  ${type}: valid=${isValid} (expected ${expected}), shielded=${isShielded}`);
    }

    console.log('\nTesting Lightning invoice validation:');

    const invoices = [
        { inv: 'lnbc100n1p...', expected: true, network: 'mainnet' },
        { inv: 'lntb100n1p...', expected: true, network: 'testnet' },
        { inv: 'invalid123', expected: false, network: 'invalid' },
    ];

    for (const { inv, expected, network } of invoices) {
        const isValid = FixedFloatClient.isValidLightningInvoice(inv);
        console.log(`  ${network}: valid=${isValid} (expected ${expected})`);
    }

    // Test unit conversions
    console.log('\nTesting unit conversions:');
    console.log(`  1 ZEC = ${ZecSwapService.zecToZatoshis(1)} zatoshis`);
    console.log(`  100000000 zatoshis = ${ZecSwapService.zatoshisToZec(100000000)} ZEC`);
    console.log(`  1 BTC = ${ZecSwapService.btcToSats('1')} satoshis`);
    console.log(`  100000000 satoshis = ${ZecSwapService.satsToBtc(100000000)} BTC`);

    // Show expected flow
    console.log('\n─────────────────────────────────────────────────────────────────');
    console.log('EXPECTED FLOW: ZEC → STRK\n');

    console.log('Step 1: User initiates ZEC → STRK transfer');
    console.log('        Input: 10 ZEC, recipient Starknet address\n');

    console.log('Step 2: Get quote from FixedFloat');
    console.log('        ZEC → Lightning BTC');
    console.log('        Expected: ~0.0015 BTC (~15000 sats)\n');

    console.log('Step 3: Create Atomiq swap (you already have this!)');
    console.log('        Lightning → STRK');
    console.log('        Generate invoice for 15000 sats\n');

    console.log('Step 4: Create FixedFloat order');
    console.log('        ZEC → Lightning, with Atomiq invoice as recipient\n');

    console.log('Step 5: User sends ZEC to deposit address');
    console.log('        Wait for ~10 confirmations (~25 min)\n');

    console.log('Step 6: FixedFloat sends Lightning to Atomiq');
    console.log('        Atomiq completes STRK swap\n');

    console.log('Step 7: STRK deposited to privacy mixer');
    console.log('        (Your existing code)\n');

    console.log('Step 8: Withdraw STRK to fresh address');
    console.log('        (Your existing ZK proof flow)\n');

    console.log('─────────────────────────────────────────────────────────────────');
    console.log('EXPECTED FLOW: STRK → ZEC\n');

    console.log('Step 1: User initiates STRK → ZEC transfer');
    console.log('        Input: 1000 STRK, recipient ZEC z-address\n');

    console.log('Step 2: Deposit STRK to privacy mixer');
    console.log('        Generate commitment, save secret\n');

    console.log('Step 3: Withdraw from mixer to Atomiq');
    console.log('        (After optional Cashu flow)\n');

    console.log('Step 4: Create Atomiq swap');
    console.log('        STRK → Lightning\n');

    console.log('Step 5: Get quote from FixedFloat');
    console.log('        Lightning → ZEC\n');

    console.log('Step 6: Create FixedFloat order');
    console.log('        Lightning → ZEC, pay with Atomiq LN\n');

    console.log('Step 7: Pay Lightning invoice');
    console.log('        (Automatic from Atomiq)\n');

    console.log('Step 8: Receive ZEC to shielded address');
    console.log('        ~10 confirmations for privacy\n');

    console.log('─────────────────────────────────────────────────────────────────');
    console.log('\n✅ Dry run complete!\n');
}

async function runRealTests(swapService: ZecSwapService) {
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('REAL API TESTS\n');

    try {
        // Test 1: Get ZEC → Lightning quote
        console.log('Test 1: Getting ZEC → Lightning quote for 1 ZEC...');
        const zecToLnQuote = await swapService.getZecToLightningQuote(1);
        console.log('  ✅ Quote received:');
        console.log(`     From: ${zecToLnQuote.from.amount} ZEC`);
        console.log(`     To: ${zecToLnQuote.to.amount} BTC`);
        console.log(`     Rate: ${zecToLnQuote.from.rate}`);
        console.log('');

    } catch (error) {
        console.log(`  ❌ Error: ${(error as Error).message}\n`);
    }

    try {
        // Test 2: Get Lightning → ZEC quote
        console.log('Test 2: Getting Lightning → ZEC quote for 100,000 sats...');
        const lnToZecQuote = await swapService.getLightningToZecQuote(100_000);
        console.log('  ✅ Quote received:');
        console.log(`     From: ${lnToZecQuote.from.amount} BTC`);
        console.log(`     To: ${lnToZecQuote.to.amount} ZEC`);
        console.log(`     Rate: ${lnToZecQuote.from.rate}`);
        console.log('');

    } catch (error) {
        console.log(`  ❌ Error: ${(error as Error).message}\n`);
    }

    // Note: Don't create actual orders in tests to avoid real fund movement
    console.log('Test 3: Creating swap order (SKIPPED - would move real funds)');
    console.log('  To test order creation, use a small amount manually.\n');

    console.log('─────────────────────────────────────────────────────────────────');
    console.log('\n✅ Real API tests complete!\n');
}

main().catch(console.error);
