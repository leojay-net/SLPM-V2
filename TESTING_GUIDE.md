# Testing Guide - Enhanced SLPM Privacy Mixer

This guide covers all testing steps before deployment to ensure everything works correctly.

## Testing Phases

1. **Circuit Testing** - Verify Noir circuit logic
2. **Proof Generation** - Test client-side proof creation
3. **Local Verification** - Verify proofs work correctly
4. **Contract Testing** - Test Cairo contracts
5. **Integration Testing** - End-to-end flow
6. **Testnet Deployment** - Final validation

## Phase 1: Circuit Testing

### Test Noir Circuit

```bash
cd circuit

# Check circuit compiles
nargo check

# Run all tests
nargo test

# Run specific test
nargo test test_privacy_circuit_valid_proof

# Verbose output
nargo test --show-output
```

**Expected Output:**
```
[slpm_privacy_mixer] Running 3 test functions
[slpm_privacy_mixer] Testing test_privacy_circuit_valid_proof... ok
[slpm_privacy_mixer] Testing test_privacy_circuit_invalid_nullifier... ok
[slpm_privacy_mixer] Testing test_privacy_circuit_invalid_merkle_proof... ok
Test result: ok. 3 passed; 0 failed; 0 skipped
```

### Test with Custom Inputs

Create `circuit/Prover.test.toml`:
```toml
# Test with your own values
secret = "0x123456789abcdef"
path_elements = ["0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0", "0x0"]
path_indices = [0, 0, 0, 0, 0, 0, 0, 0]
nullifier_hash = "0x0"  # Will be computed
root = "0x0"  # Will be computed
recipient = "0x1234"
amount_low = "1000000000000000000"
amount_high = "0"
```

## Phase 2: Proof Generation Testing

### Generate Test Witness

```bash
cd circuit

# Execute circuit with test inputs
nargo execute witness

# Check witness was created
ls -lh target/witness.gz
```

### Generate Test Proof

```bash
# Generate proof with UltraHonk + Starknet oracle
bb prove --scheme ultra_honk --zk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -w ./target/witness.gz \
  -o ./target

# Verify proof was generated
ls -lh target/proof

# Generate verification key
bb write_vk --scheme ultra_honk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -o ./target

# Check VK created
ls -lh target/vk
```

**Expected Files:**
- `target/witness.gz` - Circuit witness
- `target/proof` - ZK proof
- `target/vk` - Verification key
- `target/public_inputs` - Public inputs

### Verify Proof Locally (Before On-Chain)

```bash
# Verify the proof locally
bb verify --scheme ultra_honk --zk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -p ./target/proof \
  -k ./target/vk

# Should output: "Proof verified successfully"
```

## Phase 3: Generate and Test Garaga Verifier

### Generate Cairo Verifier

```bash
cd ..

# Generate verifier contract
garaga gen \
  --system ultra_starknet_zk_honk \
  --vk ./circuit/target/vk \
  --project-name slpm_verifier

cd slpm_verifier
```

### Build Verifier Contract

```bash
# Build the Cairo contract
scarb build

# Check build artifacts
ls -lh target/release/

# Should see:
# - verifier_UltraStarknetZKHonkVerifier.contract_class.json
# - verifier.starknet_artifacts.json
```

### Test Calldata Generation

```bash
cd ..

# Generate calldata for the proof
garaga calldata \
  --system ultra_starknet_zk_honk \
  --proof circuit/target/proof \
  --vk circuit/target/vk \
  --public-inputs circuit/target/public_inputs \
  > test_calldata.txt

# Check calldata was generated
cat test_calldata.txt | wc -l

# Should be ~100-200 lines of field elements
```

## Phase 4: Contract Testing

### Test Enhanced Mixer Contract

Create `contract/src/test_enhanced_mixer.cairo`:

```cairo
#[cfg(test)]
mod test_enhanced_privacy_mixer {
    use super::super::enhanced_privacy_mixer::{
        EnhancedPrivacyMixer, IEnhancedPrivacyMixer, IEnhancedPrivacyMixerDispatcher,
        IEnhancedPrivacyMixerDispatcherTrait
    };
    use starknet::{ContractAddress, contract_address_const};
    use starknet::testing::{set_caller_address, set_contract_address};

    #[test]
    fn test_deposit() {
        // Setup
        let owner = contract_address_const::<0x123>();
        let token = contract_address_const::<0x456>();
        let verifier = contract_address_const::<0x789>();
        
        // Deploy mixer (simplified for testing)
        // In real tests, use proper deployment
        
        // Test deposit
        let commitment = 0x1234567890abcdef;
        let amount: u256 = 1000000000000000000_u256;
        
        // Would call: mixer.deposit(commitment, amount)
        // Check: leaf_index returned
        // Check: merkle_root updated
        // Check: commitment stored
    }

    #[test]
    fn test_merkle_root_update() {
        // Test that Merkle root updates correctly on deposit
    }

    #[test]
    #[should_panic]
    fn test_double_nullifier() {
        // Test that using same nullifier twice fails
    }
}
```

Build and test:
```bash
cd contract

# Check contract compiles
scarb build

# Run tests (when implemented)
scarb test
```

## Phase 5: Integration Testing

### Create Integration Test Script

Create `test/integration-test.ts`:

```typescript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { createCommitmentData, generateMerkleProof, buildMerkleTree } from '../src/crypto/noir-proof';
import * as fs from 'fs';

describe('SLPM Privacy Integration Tests', () => {
  let circuitBytecode: Uint8Array;
  let circuitAbi: any;
  let vk: Uint8Array;

  beforeAll(async () => {
    // Load circuit artifacts
    const circuitJson = JSON.parse(
      fs.readFileSync('./circuit/target/slpm_privacy_mixer.json', 'utf-8')
    );
    circuitBytecode = new Uint8Array(Buffer.from(circuitJson.bytecode, 'base64'));
    circuitAbi = circuitJson.abi;
    
    // Load verification key
    vk = fs.readFileSync('./circuit/target/vk');
  });

  it('should generate valid commitment data', () => {
    const amount = 1_000_000_000_000_000_000n;
    const data = createCommitmentData(amount);
    
    expect(data.commitment).toBeDefined();
    expect(data.nullifier).toBeDefined();
    expect(data.secret).toBeDefined();
    expect(data.secret).toMatch(/^0x[0-9a-f]+$/i);
  });

  it('should build Merkle tree correctly', () => {
    const commitments = [
      '0x123',
      '0x456',
      '0x789',
    ];
    
    const root = buildMerkleTree(commitments, 8);
    expect(root).toBeDefined();
    expect(root).toMatch(/^0x[0-9a-f]+$/i);
  });

  it('should generate valid Merkle proof', () => {
    const commitments = [
      '0x123',
      '0x456',
      '0x789',
    ];
    
    const proof = generateMerkleProof(commitments, 1, 8);
    
    expect(proof.pathElements).toHaveLength(8);
    expect(proof.pathIndices).toHaveLength(8);
    expect(proof.root).toBeDefined();
  });

  it('should generate ZK proof (slow test)', async () => {
    // This test takes 2-5 seconds
    const secret = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const amount = 1_000_000_000_000_000_000n;
    
    // Create commitment
    const commitmentData = createCommitmentData(amount);
    
    // Build tree with one commitment
    const commitments = [commitmentData.commitment];
    const merkleProof = generateMerkleProof(commitments, 0, 8);
    
    // Generate proof (requires Noir/BB.js)
    // const proof = await generateWithdrawalProof(...);
    // expect(proof.proof).toBeDefined();
    // expect(proof.calldata).toBeDefined();
  }, 30000); // 30 second timeout
});
```

Run tests:
```bash
npm test
```

## Phase 6: Manual E2E Test

### Test Complete Flow Manually

Create `scripts/test-flow.ts`:

```typescript
#!/usr/bin/env tsx

import { createCommitmentData, generateMerkleProof, buildMerkleTree, splitAmount } from '../src/crypto/noir-proof';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Privacy Flow\n');

  // Step 1: Create commitment
  console.log('1️⃣ Creating commitment...');
  const amount = 1_000_000_000_000_000_000n; // 1 STRK
  const commitmentData = createCommitmentData(amount);
  
  console.log('✅ Commitment:', commitmentData.commitment);
  console.log('✅ Nullifier:', commitmentData.nullifier);
  console.log('✅ Secret:', commitmentData.secret.substring(0, 20) + '...\n');

  // Step 2: Simulate deposits (build tree)
  console.log('2️⃣ Simulating deposits (building Merkle tree)...');
  const commitments = [
    commitmentData.commitment,
    '0x111',
    '0x222',
    '0x333',
  ];
  const root = buildMerkleTree(commitments, 8);
  console.log('✅ Merkle root:', root, '\n');

  // Step 3: Generate Merkle proof
  console.log('3️⃣ Generating Merkle proof...');
  const merkleProof = generateMerkleProof(commitments, 0, 8);
  console.log('✅ Path elements:', merkleProof.pathElements.length);
  console.log('✅ Path indices:', merkleProof.pathIndices);
  console.log('✅ Root matches:', merkleProof.root === root ? '✅' : '❌', '\n');

  // Step 4: Prepare circuit inputs
  console.log('4️⃣ Preparing circuit inputs...');
  const { low, high } = splitAmount(amount);
  const recipient = '0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d';
  
  console.log('✅ Amount low:', low.toString());
  console.log('✅ Amount high:', high.toString());
  console.log('✅ Recipient:', recipient, '\n');

  // Step 5: Generate proof (would require Noir/BB.js)
  console.log('5️⃣ Proof generation...');
  console.log('⚠️  Would generate ZK proof here (requires Noir libraries)');
  console.log('   - Time: ~2-5 seconds');
  console.log('   - Output: proof + calldata\n');

  // Step 6: Verification
  console.log('6️⃣ Verification...');
  console.log('⚠️  Would verify proof on-chain (requires deployed verifier)');
  console.log('   - Gas cost: ~50K-100K');
  console.log('   - Result: ✅ Valid or ❌ Invalid\n');

  console.log('🎉 Test flow complete!');
  console.log('\nNext steps:');
  console.log('1. Test proof generation with actual Noir/BB.js');
  console.log('2. Deploy verifier to testnet');
  console.log('3. Test on-chain verification');
  console.log('4. Deploy mixer contract');
  console.log('5. Test complete deposit + withdrawal');
}

testCompleteFlow().catch(console.error);
```

Run:
```bash
npx tsx scripts/test-flow.ts
```

## Phase 7: Testnet Testing

### 1. Deploy to Ztarknet Testnet

```bash
# Fund your account
# Visit: https://faucet.ztarknet.cash/

# Check balance
sncast balance \
  --token-address 0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d \
  --url https://ztarknet-madara.d.karnot.xyz

# Deploy verifier
./deploy-verifier.sh

# Note the deployed address!
export VERIFIER_ADDRESS="0x..."
```

### 2. Test On-Chain Verification

```bash
# Generate test calldata
garaga calldata \
  --system ultra_starknet_zk_honk \
  --proof circuit/target/proof \
  --vk circuit/target/vk \
  --public-inputs circuit/target/public_inputs \
  > test_calldata.txt

# Call verifier (read-only)
sncast call \
  --contract-address $VERIFIER_ADDRESS \
  --function "verify_ultra_starknet_zk_honk_proof" \
  --calldata $(cat test_calldata.txt) \
  --url https://ztarknet-madara.d.karnot.xyz

# Should return: Some([...public inputs...])
```

### 3. Deploy Enhanced Mixer

```bash
cd contract

# Declare contract
sncast declare \
  --contract-name EnhancedPrivacyMixer \
  --url https://ztarknet-madara.d.karnot.xyz

# Deploy (replace with your addresses)
export OWNER_ADDRESS="0x..."
export TOKEN_ADDRESS="0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d"

sncast deploy \
  --class-hash <CLASS_HASH_FROM_DECLARE> \
  --constructor-calldata $OWNER_ADDRESS $TOKEN_ADDRESS $VERIFIER_ADDRESS \
  --url https://ztarknet-madara.d.karnot.xyz

export MIXER_ADDRESS="0x..."
```

### 4. Test Deposit on Testnet

```bash
# Approve token spend
sncast invoke \
  --contract-address $TOKEN_ADDRESS \
  --function "approve" \
  --calldata $MIXER_ADDRESS 1000000000000000000 0 \
  --url https://ztarknet-madara.d.karnot.xyz

# Make test deposit
sncast invoke \
  --contract-address $MIXER_ADDRESS \
  --function "deposit" \
  --calldata 0x123456789abcdef 1000000000000000000 0 \
  --url https://ztarknet-madara.d.karnot.xyz

# Check it was added
sncast call \
  --contract-address $MIXER_ADDRESS \
  --function "get_next_deposit_index" \
  --url https://ztarknet-madara.d.karnot.xyz
```

### 5. Test Withdrawal on Testnet

```typescript
// Create test-withdrawal.ts script
import { Account, RpcProvider, Contract } from 'starknet';
import { createWithdrawalProof } from './src/crypto/noir-proof';

async function testWithdrawal() {
  // Load your account
  const provider = new RpcProvider({ nodeUrl: 'https://ztarknet-madara.d.karnot.xyz' });
  const account = new Account(provider, accountAddress, privateKey);
  
  // Generate proof
  const proof = await createWithdrawalProof(
    circuitBytecode,
    circuitAbi,
    vk,
    secret,
    commitments,
    depositIndex,
    recipientAddress,
    amount
  );
  
  // Submit withdrawal
  const result = await account.execute({
    contractAddress: mixerAddress,
    entrypoint: 'withdraw',
    calldata: [
      nullifier,
      recipientAddress,
      amount.toString(),
      proof.calldata.length,
      ...proof.calldata
    ]
  });
  
  console.log('Withdrawal tx:', result.transaction_hash);
}
```

## Testing Checklist

Before deploying to mainnet, ensure:

- [ ] ✅ All circuit tests pass
- [ ] ✅ Witness generation works
- [ ] ✅ Proof generation succeeds (2-5 seconds)
- [ ] ✅ Local proof verification passes
- [ ] ✅ Garaga verifier builds successfully
- [ ] ✅ Calldata generation works
- [ ] ✅ Cairo contracts compile
- [ ] ✅ Integration tests pass
- [ ] ✅ Manual E2E test succeeds
- [ ] ✅ Verifier deployed to testnet
- [ ] ✅ On-chain verification works
- [ ] ✅ Mixer deployed to testnet
- [ ] ✅ Test deposit succeeds
- [ ] ✅ Test withdrawal succeeds
- [ ] ✅ Gas costs acceptable (<150K)
- [ ] ✅ Privacy guarantees verified
- [ ] ✅ No secrets leaked on-chain
- [ ] ✅ Merkle tree updates correctly
- [ ] ✅ Nullifiers tracked properly
- [ ] ✅ Edge cases handled

## Common Issues and Solutions

### Circuit Test Fails
```bash
# Check Noir version
nargo --version  # Should be 1.0.0-beta.5

# Clean and rebuild
rm -rf circuit/target
cd circuit && nargo check
```

### Proof Generation Fails
```bash
# Check BB version
bb --version  # Should be 0.87.4-starknet.1

# Verify witness exists
ls -lh circuit/target/witness.gz

# Try with fresh witness
cd circuit && rm target/witness.gz && nargo execute witness
```

### Garaga Generation Fails
```bash
# Check Python version
python --version  # Should be 3.10.x

# Reinstall Garaga
pip uninstall garaga
pip install garaga==0.18.1

# Check VK exists
ls -lh circuit/target/vk
```

### On-Chain Verification Fails
- Check public inputs match circuit outputs
- Verify Merkle root is current
- Ensure calldata format is correct
- Check verifier contract address

## Next Steps After Testing

Once all tests pass:

1. **Security Audit** - Have circuit and contracts audited
2. **Mainnet Deployment** - Deploy to Starknet mainnet
3. **Monitor** - Set up monitoring for deposits/withdrawals
4. **Documentation** - Update with mainnet addresses
5. **UI** - Build user-friendly interface

---

**Remember:** Testing is crucial for privacy systems. A bug could expose user secrets!
