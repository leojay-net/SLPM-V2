#!/usr/bin/env npx ts-node
/**
 * SLPM Privacy Mixer - End-to-End Test Script
 * 
 * This script demonstrates the complete privacy mixer flow:
 * 1. User deposits funds (gets commitment stored in contract)
 * 2. User generates ZK proof client-side
 * 3. User withdraws using the proof (contract verifies via Garaga)
 * 
 * For LOCAL TESTING, we simulate the flow without actual blockchain deployment.
 */

import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import * as fs from 'fs';
import * as path from 'path';

// Simulated Merkle tree state (in production, this comes from the contract)
interface MixerState {
    commitments: string[];
    merkleRoot: string;
    nullifiers: Set<string>;
}

// User's private data (stored locally, never shared)
interface UserPrivateData {
    secret: string;
    commitment: string;
    nullifier: string;
    depositIndex: number;
    amount: bigint;
}

/**
 * Simulates the poseidon hash (in production, use @aztec/bb.js or starknet.js)
 * For testing, we'll use the actual circuit to compute these
 */
async function main() {
    console.log('🔐 SLPM Privacy Mixer - End-to-End Test\n');

    // Load circuit artifacts
    const circuitPath = path.join(__dirname, '../circuit/target/slpm_privacy_mixer.json');

    if (!fs.existsSync(circuitPath)) {
        console.error('❌ Circuit not found. Run ./build-circuit.sh first');
        process.exit(1);
    }

    const circuitData = JSON.parse(fs.readFileSync(circuitPath, 'utf-8'));
    console.log('✅ Circuit loaded');

    // ====== STEP 1: USER DEPOSITS ======
    console.log('\n📥 STEP 1: User Deposits');
    console.log('─'.repeat(40));

    // User generates secret locally (NEVER shared)
    const userSecret = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const depositAmount = 1000000000000000000n; // 1 STRK

    console.log(`Secret: ${userSecret.slice(0, 10)}...${userSecret.slice(-8)} (PRIVATE - never shared)`);
    console.log(`Amount: ${depositAmount} wei (1 STRK)`);

    // In production: User computes commitment locally and sends it to contract
    // The contract stores the commitment in its Merkle tree
    // Here we simulate this:

    const simulatedCommitment = '0x26fc6c1101de3f0ca3f8fa5ff62b8d939c27f28596358a0ef35e8018e48825da';
    const simulatedNullifier = '0x27489b9832adfc0bc2fcff1c500e53d9cddc7e44130dfc9a0b4e823a4b9fbfce';
    const simulatedRoot = '0x0357dd44bfb4ef4e06bbc57dc3b9a48e7271beb9d7b143bb8725921190a6fe63';

    // User stores this data locally
    const userPrivateData: UserPrivateData = {
        secret: userSecret,
        commitment: simulatedCommitment,
        nullifier: simulatedNullifier,
        depositIndex: 0,
        amount: depositAmount
    };

    console.log(`Commitment: ${simulatedCommitment}`);
    console.log('✅ Deposit simulated - commitment added to Merkle tree');

    // ====== STEP 2: TIME PASSES... ======
    console.log('\n⏳ STEP 2: Time Passes...');
    console.log('─'.repeat(40));
    console.log('User waits for anonymity set to grow...');
    console.log('(In production: more users deposit, increasing privacy)');

    // ====== STEP 3: USER GENERATES PROOF FOR WITHDRAWAL ======
    console.log('\n🔐 STEP 3: User Generates ZK Proof (Client-Side)');
    console.log('─'.repeat(40));

    // Prepare circuit inputs
    const circuitInputs = {
        // Private inputs (only user knows)
        secret: userSecret,
        path_elements: ['0', '0', '0', '0', '0', '0', '0', '0'],
        path_indices: ['0', '0', '0', '0', '0', '0', '0', '0'],

        // Public inputs (verified by contract)
        root: simulatedRoot,
        recipient: '0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d',
        amount_low: depositAmount.toString(),
        amount_high: '0'
    };

    console.log('Generating proof with inputs:');
    console.log('  - Secret: [PRIVATE]');
    console.log('  - Merkle Path: [PRIVATE]');
    console.log(`  - Root: ${simulatedRoot}`);
    console.log(`  - Recipient: ${circuitInputs.recipient}`);
    console.log(`  - Amount: ${circuitInputs.amount_low}`);

    try {
        // Initialize Noir
        const noir = new Noir({
            bytecode: circuitData.bytecode,
            abi: circuitData.abi,
            debug_symbols: '',
            file_map: {}
        });

        console.log('\n📋 Executing circuit (generating witness)...');
        const execResult = await noir.execute(circuitInputs);
        console.log('✅ Witness generated');

        console.log('\n🔨 Generating ZK proof (UltraHonk)...');
        const backend = new UltraHonkBackend(circuitData.bytecode, { threads: 1 });
        const proof = await backend.generateProof(execResult.witness, { starknetZK: true });
        backend.destroy();

        console.log('✅ Proof generated!');
        console.log(`   Proof size: ${proof.proof.length} bytes`);
        console.log(`   Public inputs: ${proof.publicInputs.length} values`);

        // The proof contains:
        // - Proof bytes (cryptographic proof)
        // - Public inputs (nullifier, commitment, root - visible to all)

        // ====== STEP 4: USER WITHDRAWS ======
        console.log('\n💸 STEP 4: User Submits Withdrawal');
        console.log('─'.repeat(40));
        console.log('In production:');
        console.log('1. User sends proof + calldata to privacy mixer contract');
        console.log('2. Contract calls Garaga verifier with the proof');
        console.log('3. If valid: funds sent to recipient, nullifier marked as used');
        console.log('4. If invalid: transaction reverts');
        console.log('\n✅ The proof proves:');
        console.log('   - User knows a secret corresponding to a commitment in the tree');
        console.log('   - WITHOUT revealing which commitment it is');
        console.log('   - Nullifier prevents double-spending');

        console.log('\n🎉 End-to-end test complete!');
        console.log('\nKey Privacy Properties:');
        console.log('  ✓ Secret never leaves user\'s device');
        console.log('  ✓ Cannot link deposit to withdrawal');
        console.log('  ✓ Amount is public but sender is hidden');
        console.log('  ✓ Nullifier prevents reuse without revealing identity');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main().catch(console.error);
