# ✅ Testing Checklist - SLPM Enhanced Privacy

Use this checklist to verify everything works before deployment.

## Phase 1: Circuit Testing ✅ COMPLETED

### Noir Circuit Compilation
- [x] Circuit compiles without errors: `cd circuit && nargo check`
- [x] All tests pass: `nargo test`
  ```
  ✅ test_privacy_circuit_valid_proof - PASSED
  ✅ test_privacy_circuit_invalid_nullifier - PASSED  
  ✅ test_privacy_circuit_invalid_merkle_proof - PASSED
  ```

**Status:** ✅ All circuit tests passing!

---

## Phase 2: Proof Generation (NEXT)

### Generate Witness
```bash
cd circuit
nargo execute witness
```
- [ ] Witness file created: `target/witness.gz`
- [ ] No errors during execution
- [ ] Witness size reasonable (< 1MB)

### Generate Proof
```bash
bb prove --scheme ultra_honk --zk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -w ./target/witness.gz \
  -o ./target
```
- [ ] Proof generated successfully
- [ ] Proof file created: `target/proof`
- [ ] Public inputs created: `target/public_inputs`
- [ ] Generation time < 10 seconds

### Generate Verification Key
```bash
bb write_vk --scheme ultra_honk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -o ./target
```
- [ ] VK file created: `target/vk`
- [ ] VK size reasonable (< 10KB)

### Verify Proof Locally
```bash
bb verify --scheme ultra_honk --zk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -p ./target/proof \
  -k ./target/vk
```
- [ ] Verification succeeds
- [ ] Output: "Proof verified successfully"

---

## Phase 3: Garaga Verifier Generation

### Generate Cairo Verifier
```bash
cd ..
garaga gen --system ultra_starknet_zk_honk \
  --vk ./circuit/target/vk \
  --project-name slpm_verifier
```
- [ ] Verifier project created: `slpm_verifier/`
- [ ] Cairo files generated
- [ ] No errors during generation

### Build Verifier Contract
```bash
cd slpm_verifier
scarb build
```
- [ ] Build succeeds
- [ ] Contract class JSON created
- [ ] File size < 500KB

### Generate Test Calldata
```bash
cd ..
garaga calldata --system ultra_starknet_zk_honk \
  --proof circuit/target/proof \
  --vk circuit/target/vk \
  --public-inputs circuit/target/public_inputs \
  > test_calldata.txt
```
- [ ] Calldata file created
- [ ] Calldata is valid array of felts
- [ ] ~100-200 lines of data

---

## Phase 4: Contract Compilation

### Build Enhanced Mixer
```bash
cd contract
scarb build
```
- [ ] Contract compiles successfully
- [ ] No warnings or errors
- [ ] Contract class JSON created

### Check Contract Exports
- [ ] `EnhancedPrivacyMixer` contract present
- [ ] `IEnhancedPrivacyMixer` interface present
- [ ] All required functions exported

---

## Phase 5: Testnet Deployment

### Prerequisites
```bash
# Check account balance
sncast balance \
  --token-address 0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d \
  --url https://ztarknet-madara.d.karnot.xyz
```
- [ ] Account has sufficient balance (> 0.1 STRK)
- [ ] Account is deployed

### Deploy Verifier
```bash
./deploy-verifier.sh
```
- [ ] Declaration succeeds
- [ ] Deployment succeeds
- [ ] Contract address obtained
- [ ] Verified on explorer

**Verifier Address:** `___________________________`

### Test On-Chain Verification
```bash
sncast call \
  --contract-address <VERIFIER_ADDRESS> \
  --function "verify_ultra_starknet_zk_honk_proof" \
  --calldata $(cat test_calldata.txt) \
  --url https://ztarknet-madara.d.karnot.xyz
```
- [ ] Call succeeds
- [ ] Returns `Some([public_inputs])`
- [ ] Public inputs match expected values

---

## Phase 6: Mixer Deployment

### Declare Mixer Contract
```bash
cd contract
sncast declare --contract-name EnhancedPrivacyMixer \
  --url https://ztarknet-madara.d.karnot.xyz
```
- [ ] Declaration succeeds
- [ ] Class hash obtained

**Mixer Class Hash:** `___________________________`

### Deploy Mixer Contract
```bash
# Replace with your values
sncast deploy \
  --class-hash <CLASS_HASH> \
  --constructor-calldata <OWNER> <TOKEN> <VERIFIER> \
  --url https://ztarknet-madara.d.karnot.xyz
```
- [ ] Deployment succeeds
- [ ] Contract address obtained
- [ ] Verified on explorer

**Mixer Address:** `___________________________`

---

## Phase 7: Integration Testing

### Test Deposit
```bash
# 1. Approve token
sncast invoke \
  --contract-address <TOKEN_ADDRESS> \
  --function "approve" \
  --calldata <MIXER_ADDRESS> 1000000000000000000 0

# 2. Make deposit
sncast invoke \
  --contract-address <MIXER_ADDRESS> \
  --function "deposit" \
  --calldata <COMMITMENT> 1000000000000000000 0
```
- [ ] Approval succeeds
- [ ] Deposit succeeds
- [ ] Leaf index returned
- [ ] Event emitted
- [ ] Merkle root updated

**Test Deposit Data:**
- Commitment: `___________________________`
- Secret (SAVE THIS!): `___________________________`
- Leaf Index: `___________________________`
- Nullifier: `___________________________`

### Verify Deposit State
```bash
# Check next index
sncast call --contract-address <MIXER_ADDRESS> \
  --function "get_next_deposit_index"

# Check merkle root
sncast call --contract-address <MIXER_ADDRESS> \
  --function "get_merkle_root"

# Check anonymity set
sncast call --contract-address <MIXER_ADDRESS> \
  --function "get_anonymity_set_size"
```
- [ ] Next index incremented
- [ ] Merkle root changed
- [ ] Anonymity set size increased

### Test Withdrawal (After More Deposits!)
```typescript
// Generate proof for withdrawal
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
await account.execute({
  contractAddress: mixerAddress,
  entrypoint: 'withdraw',
  calldata: [nullifier, recipient, amount, ...proof.calldata]
});
```
- [ ] Proof generation succeeds (2-5 seconds)
- [ ] Withdrawal transaction succeeds
- [ ] Funds transferred to recipient
- [ ] Nullifier marked as used
- [ ] Cannot withdraw twice

---

## Phase 8: Security Verification

### Privacy Checks
- [ ] Secret never appears in transaction data
- [ ] Cannot link deposit to withdrawal address
- [ ] Merkle tree provides anonymity set
- [ ] Nullifier prevents double-spending
- [ ] Observer cannot determine which commitment was withdrawn

### Edge Cases
- [ ] Double withdrawal with same nullifier fails
- [ ] Withdrawal with invalid proof fails
- [ ] Withdrawal with wrong root fails
- [ ] Withdrawal with wrong amount fails
- [ ] Paused contract blocks operations

### Gas Costs
- [ ] Deposit: < 50K gas ✅
- [ ] Withdrawal: < 150K gas ⚠️ (acceptable for privacy)
- [ ] Verification: Included in withdrawal

---

## Phase 9: Performance Testing

### Proof Generation
- [ ] Time: 2-5 seconds ✅
- [ ] Memory: < 1GB ✅
- [ ] Works in browser (WebAssembly) ✅
- [ ] Works in Node.js ✅

### Contract Performance
- [ ] Deposit execution time < 5s
- [ ] Withdrawal execution time < 10s
- [ ] Handles concurrent deposits
- [ ] Merkle tree updates efficiently

---

## Phase 10: Documentation Verification

### User Guides
- [ ] Quick start guide complete
- [ ] Usage examples work
- [ ] Troubleshooting covers common issues
- [ ] Security warnings present

### Technical Docs
- [ ] Architecture documented
- [ ] Circuit logic explained
- [ ] Integration guide complete
- [ ] API reference accurate

---

## Pre-Mainnet Checklist

### Critical Items
- [ ] ⚠️ **SECURITY AUDIT** - Get circuit and contracts audited
- [ ] All tests passing on testnet
- [ ] Gas costs acceptable
- [ ] Privacy guarantees verified
- [ ] Edge cases handled
- [ ] Emergency procedures tested
- [ ] Monitoring setup
- [ ] Incident response plan

### Recommended Items
- [ ] Multiple testnet users tested
- [ ] Large anonymity set tested (100+ deposits)
- [ ] Stress testing completed
- [ ] Documentation reviewed
- [ ] Community feedback incorporated
- [ ] Bug bounty program launched

---

## Test Results Summary

### ✅ Completed Tests
- Circuit compilation: ✅ PASSED
- Circuit tests: ✅ 3/3 PASSED
- [Add more as you complete them]

### ⏳ Pending Tests
- [ ] Proof generation
- [ ] Verifier deployment
- [ ] Mixer deployment
- [ ] Integration testing
- [ ] Security audit

### 📊 Metrics
- Total Tests: 3 passed, 0 failed
- Gas Cost: TBD
- Proof Time: TBD
- Success Rate: 100%

---

## Notes and Issues

### Issues Found
(Document any issues discovered during testing)

### Performance Observations
(Document gas costs, timings, etc.)

### Security Concerns
(Document any security considerations)

---

## Sign-Off

- [ ] All critical tests passed
- [ ] Security review completed
- [ ] Ready for mainnet deployment

**Tester:** ___________________________
**Date:** ___________________________
**Signature:** ___________________________

---

## Quick Reference Commands

```bash
# Test circuit
cd circuit && nargo test

# Generate proof
cd circuit && nargo execute witness
bb prove --scheme ultra_honk --zk --oracle_hash starknet -b ./target/slpm_privacy_mixer.json -w ./target/witness.gz -o ./target

# Deploy verifier
./deploy-verifier.sh

# Build contracts
cd contract && scarb build

# Deploy to testnet
sncast deploy --class-hash <HASH> --constructor-calldata <ARGS>

# Test deposit
sncast invoke --contract-address <MIXER> --function "deposit" --calldata <COMMITMENT> <AMOUNT>
```

---

**Remember:** Privacy is critical! Test thoroughly before mainnet deployment. 🔐
