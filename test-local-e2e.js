/**
 * SLPM Privacy Mixer - Local End-to-End Test
 * 
 * This script tests the complete privacy mixer flow locally:
 * 1. Generate ZK proof using Noir + Barretenberg
 * 2. Verify the proof can be validated
 * 3. Demonstrate the privacy guarantees
 */

const { Noir } = require('@noir-lang/noir_js');
const { UltraHonkBackend } = require('@aztec/bb.js');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🔐 SLPM Privacy Mixer - Local End-to-End Test\n');
    console.log('='.repeat(60));

    // ====== LOAD CIRCUIT ======
    console.log('\n📦 Loading circuit artifacts...');

    const circuitPath = path.join(__dirname, 'circuit/target/slpm_privacy_mixer.json');

    if (!fs.existsSync(circuitPath)) {
        console.error('❌ Circuit not found at:', circuitPath);
        console.error('   Run ./build-circuit.sh first');
        process.exit(1);
    }

    const circuitData = JSON.parse(fs.readFileSync(circuitPath, 'utf-8'));
    console.log('✅ Circuit loaded successfully');
    console.log(`   Bytecode size: ${circuitData.bytecode.length} chars`);

    // ====== STEP 1: SIMULATE DEPOSIT ======
    console.log('\n' + '='.repeat(60));
    console.log('📥 STEP 1: User Deposits (Simulated)');
    console.log('='.repeat(60));

    // User's secret (generated locally, NEVER shared)
    const userSecret = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const depositAmount = BigInt('1000000000000000000'); // 1 STRK in wei

    console.log('\nUser generates secret locally:');
    console.log(`  Secret: ${userSecret.slice(0, 20)}...${userSecret.slice(-8)} (PRIVATE)`);
    console.log(`  Amount: ${depositAmount} wei (1 STRK)`);

    // These values were computed by the Noir circuit (from our test output)
    const commitment = '0x26fc6c1101de3f0ca3f8fa5ff62b8d939c27f28596358a0ef35e8018e48825da';
    const expectedNullifier = '0x27489b9832adfc0bc2fcff1c500e53d9cddc7e44130dfc9a0b4e823a4b9fbfce';
    const merkleRoot = '0x0357dd44bfb4ef4e06bbc57dc3b9a48e7271beb9d7b143bb8725921190a6fe63';

    console.log('\nComputed values (via Poseidon2 hash):');
    console.log(`  Commitment: ${commitment}`);
    console.log(`  Merkle Root: ${merkleRoot}`);
    console.log('\n✅ Deposit simulated - commitment stored in Merkle tree');

    // ====== STEP 2: GENERATE ZK PROOF ======
    console.log('\n' + '='.repeat(60));
    console.log('🔐 STEP 2: User Generates ZK Proof (Client-Side)');
    console.log('='.repeat(60));

    // These are the inputs to the circuit
    const circuitInputs = {
        // Private inputs (only user knows these)
        secret: userSecret,
        path_elements: ['0', '0', '0', '0', '0', '0', '0', '0'],
        path_indices: ['0', '0', '0', '0', '0', '0', '0', '0'],

        // Public inputs (visible on-chain)
        root: merkleRoot,
        recipient: '0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d',
        amount_low: depositAmount.toString(),
        amount_high: '0'
    };

    console.log('\nCircuit inputs:');
    console.log('  Private (hidden in proof):');
    console.log('    - secret: [HIDDEN]');
    console.log('    - merkle_path: [HIDDEN]');
    console.log('  Public (visible to verifier):');
    console.log(`    - root: ${circuitInputs.root}`);
    console.log(`    - recipient: ${circuitInputs.recipient}`);
    console.log(`    - amount: ${circuitInputs.amount_low}`);

    try {
        // Initialize Noir circuit
        console.log('\n📋 Initializing Noir circuit...');
        const noir = new Noir({
            bytecode: circuitData.bytecode,
            abi: circuitData.abi,
        });

        // Generate witness
        console.log('🔍 Executing circuit (generating witness)...');
        const startWitness = Date.now();
        const execResult = await noir.execute(circuitInputs);
        const witnessTime = Date.now() - startWitness;
        console.log(`✅ Witness generated in ${witnessTime}ms`);

        // The circuit returns (nullifier, commitment, root)
        console.log('\nCircuit outputs (public):');
        if (execResult.returnValue) {
            console.log(`  Return value: ${JSON.stringify(execResult.returnValue)}`);
        }

        // Generate proof using UltraHonk backend
        console.log('\n🔨 Generating ZK proof (UltraHonk with Starknet oracle)...');
        console.log('   This may take a minute...');

        const startProof = Date.now();
        const backend = new UltraHonkBackend(circuitData.bytecode, { threads: 1 });
        const proof = await backend.generateProof(execResult.witness, { starknetZK: true });
        const proofTime = Date.now() - startProof;

        console.log(`\n✅ Proof generated in ${(proofTime / 1000).toFixed(1)}s`);
        console.log(`   Proof size: ${proof.proof.length} bytes`);
        console.log(`   Public inputs count: ${proof.publicInputs.length}`);

        // ====== STEP 3: VERIFY PROOF LOCALLY ======
        console.log('\n' + '='.repeat(60));
        console.log('✓ STEP 3: Verify Proof Locally');
        console.log('='.repeat(60));

        console.log('\n🔍 Verifying proof...');
        const startVerify = Date.now();
        const isValid = await backend.verifyProof(proof);
        const verifyTime = Date.now() - startVerify;

        backend.destroy();

        if (isValid) {
            console.log(`\n✅ PROOF VERIFIED SUCCESSFULLY in ${verifyTime}ms!`);
        } else {
            console.log('\n❌ Proof verification failed!');
            process.exit(1);
        }

        // ====== STEP 4: SHOW PRIVACY PROPERTIES ======
        console.log('\n' + '='.repeat(60));
        console.log('🔒 STEP 4: Privacy Properties Demonstrated');
        console.log('='.repeat(60));

        console.log('\nWhat the proof PROVES:');
        console.log('  ✓ Prover knows a secret for a valid commitment');
        console.log('  ✓ The commitment exists in the Merkle tree');
        console.log('  ✓ The nullifier is correctly derived');
        console.log('  ✓ Amount and recipient are bound to the proof');

        console.log('\nWhat the proof HIDES:');
        console.log('  ✗ Which specific commitment in the tree');
        console.log('  ✗ The secret itself');
        console.log('  ✗ Connection between deposit and withdrawal');

        console.log('\nPublic values (visible on-chain):');
        console.log(`  - Nullifier: prevents double-spending`);
        console.log(`  - Merkle Root: proves membership`);
        console.log(`  - Recipient: receives the funds`);
        console.log(`  - Amount: withdrawal amount`);

        // ====== SUMMARY ======
        console.log('\n' + '='.repeat(60));
        console.log('🎉 END-TO-END TEST COMPLETE!');
        console.log('='.repeat(60));

        console.log('\nNext steps for production:');
        console.log('  1. Deploy Garaga verifier contract to Starknet');
        console.log('  2. Deploy privacy mixer contract that calls verifier');
        console.log('  3. Frontend: users generate proofs in browser');
        console.log('  4. Submit proofs to mixer contract for withdrawal');

        console.log('\nTimings:');
        console.log(`  - Witness generation: ${witnessTime}ms`);
        console.log(`  - Proof generation: ${(proofTime / 1000).toFixed(1)}s`);
        console.log(`  - Proof verification: ${verifyTime}ms`);

    } catch (error) {
        console.error('\n❌ Error during proof generation:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main().catch(console.error);
