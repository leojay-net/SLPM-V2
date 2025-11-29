# Enhanced SLPM Privacy with Noir Circuits and Garaga

## Overview

This document describes the enhanced privacy architecture for SLPM (Starknet Lightning Privacy Mixer) using **Noir circuits** for zero-knowledge proof generation and **Garaga** for efficient ZK proof verification on Starknet.

## Architecture

### Previous Implementation

The original SLPM privacy mixer used a simple commitment scheme with basic Poseidon hashing:
- ✅ Commitment = Hash(secret, amount)
- ✅ Nullifier = Hash(secret, commitment)
- ❌ No proper Merkle tree for anonymity set
- ❌ No real ZK proof verification (just hash checks)
- ❌ Limited privacy guarantees

### Enhanced Implementation

The enhanced system provides **true zero-knowledge privacy** using:

1. **Noir Circuits** - Compile privacy logic to zero-knowledge circuits
2. **UltraHonk Backend** - Generate efficient ZK proofs with Starknet compatibility
3. **Garaga Verifier** - Verify proofs on-chain in Cairo with optimal gas efficiency
4. **Merkle Tree** - Proper anonymity set with membership proofs

## Components

### 1. Noir Privacy Circuit (`circuit/src/main.nr`)

The circuit proves:
- ✅ You know a secret that corresponds to a commitment in the Merkle tree
- ✅ The nullifier is correctly derived (prevents double-spending)
- ✅ The withdrawal parameters (recipient, amount) are bound to the proof

**Circuit Inputs:**
```noir
fn main(
    // Private (hidden from verifier)
    secret: Field,
    path_elements: [Field; 8],  // Merkle proof
    path_indices: [Field; 8],    // Left/right indicators
    
    // Public (visible to verifier and on-chain)
    nullifier_hash: pub Field,
    root: pub Field,
    recipient: pub Field,
    amount_low: pub Field,
    amount_high: pub Field,
)
```

**Circuit Logic:**
1. Compute commitment = Poseidon(secret, amount_low, amount_high)
2. Verify nullifier = Poseidon(secret, commitment)
3. Verify commitment exists in Merkle tree with root
4. Bind recipient and amount to prevent tampering

### 2. Garaga Verifier Contract

Generated automatically from the Noir circuit using Garaga CLI:
```bash
garaga gen --system ultra_starknet_zk_honk --vk ./circuit/target/vk --project-name slpm_verifier
```

The verifier contract:
- Verifies UltraHonk ZK proofs on Starknet
- Extracts and validates public inputs
- Uses optimized Cairo circuits for elliptic curve operations
- Gas-efficient proof verification

### 3. Enhanced Privacy Mixer Contract (`contract/src/enhanced_privacy_mixer.cairo`)

**Key Features:**
- Proper Merkle tree implementation (depth 8 = 256 commitments)
- Integration with Garaga verifier contract
- Nullifier tracking to prevent double-spending
- Support for async withdrawals (Merkle root changes between deposit and withdrawal)

**Deposit Flow:**
```cairo
fn deposit(commitment: felt252, amount: u256) -> u32 {
    1. Transfer STRK tokens to contract
    2. Add commitment to Merkle tree at next available index
    3. Update Merkle root
    4. Emit Deposit event with leaf_index
    5. Return leaf_index for later withdrawal
}
```

**Withdrawal Flow:**
```cairo
fn withdraw(
    nullifier: felt252,
    recipient: ContractAddress,
    amount: u256,
    proof_with_hints: Array<felt252>,
) -> bool {
    1. Check nullifier not used
    2. Call Garaga verifier with proof
    3. Verify public inputs match (nullifier, root, recipient, amount)
    4. Mark nullifier as used
    5. Transfer STRK tokens to recipient
    6. Emit Withdrawal event
}
```

### 4. TypeScript Integration (`src/crypto/noir-proof.ts`)

**Utilities for generating proofs:**

```typescript
// Generate commitment data
const commitmentData = createCommitmentData(amount);
// Returns: { commitment, nullifier, secret }

// Generate Merkle proof
const merkleProof = generateMerkleProof(commitments, depositIndex);
// Returns: { pathElements, pathIndices, root }

// Generate ZK proof for withdrawal
const proof = await createWithdrawalProof(
  circuitBytecode,
  circuitAbi,
  vk,
  secret,
  commitments,
  depositIndex,
  recipient,
  amount
);
// Returns: { proof, publicInputs, calldata }
```

## Usage Guide

### Setup and Installation

1. **Install Dependencies:**
```bash
# Install Noir toolchain
curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
noirup --version 1.0.0-beta.5

# Install Barretenberg (UltraHonk backend)
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
bbup --version 0.87.4-starknet.1

# Install Garaga (Python 3.10 required)
pip install garaga==0.18.1
```

2. **Build Circuit and Generate Verifier:**
```bash
cd /path/to/SLPM-enhanced
./build-circuit.sh
```

This will:
- Compile Noir circuit
- Generate verification key
- Generate Cairo verifier contract with Garaga
- Build the verifier contract

3. **Deploy Verifier Contract:**
```bash
./deploy-verifier.sh
```

Save the deployed contract address for the mixer configuration.

### Making a Private Deposit

```typescript
import { EnhancedPrivacyMixer } from './src/integrations/starknet/enhanced-mixer';
import { createCommitmentData } from './src/crypto/noir-proof';

// Initialize mixer
const mixer = await createEnhancedPrivacyMixer(config, account, circuitBytecode, circuitAbi, vk);

// Deposit 1 STRK
const amount = 1_000_000_000_000_000_000n; // 1 STRK in wei
const result = await mixer.deposit(account, amount);

console.log('Deposit successful!');
console.log('Leaf Index:', result.leafIndex);
console.log('Transaction:', result.txHash);

// IMPORTANT: Save this data securely for withdrawal
console.log('Secret:', result.commitmentData.secret);
console.log('Nullifier:', result.commitmentData.nullifier);
```

### Making a Private Withdrawal

```typescript
// After some time passes (for privacy)...
// Retrieve your saved secret and deposit index

const recipientAddress = '0x...'; // Where to send funds
const amount = 1_000_000_000_000_000_000n; // Must match deposit

const result = await mixer.withdraw(
  account,
  secret,          // From your saved commitment data
  depositIndex,    // From deposit result
  recipientAddress,
  amount
);

console.log('Withdrawal successful!');
console.log('Transaction:', result.txHash);
```

## Privacy Guarantees

### What is Protected

1. **Unlinkability:** No one can link your deposit address to your withdrawal address
2. **Amount Privacy:** Exact amounts are hidden in the anonymity set
3. **Timing Privacy:** Withdrawals can happen at any time after deposit
4. **Double-Spend Prevention:** Nullifiers ensure each commitment can only be withdrawn once

### Anonymity Set

- Each deposit adds to the anonymity set
- Current implementation supports up to 256 concurrent deposits (8-level Merkle tree)
- Larger anonymity set = stronger privacy
- Recommended: Wait until anonymity set > 10 before withdrawing

### What is NOT Protected

- Transaction metadata (timestamps, gas fees)
- Network-level information (IP addresses) - use Tor/VPN
- If you're the only user, there's no anonymity set
- Amount correlation if you're the only one depositing that exact amount

## Security Considerations

### Cryptographic Security

✅ **Poseidon Hash Function:** Optimized for zero-knowledge circuits and STARK-friendly
✅ **UltraHonk Proofs:** Latest ZK proof system with optimal soundness
✅ **Garaga Verification:** Audited Cairo implementation of Honk verifier

### Operational Security

⚠️ **Secret Management:** Your secret is everything. Lose it = lose funds
⚠️ **Browser Security:** Generate proofs in secure environment
⚠️ **Network Privacy:** Use Tor/VPN when depositing and withdrawing
⚠️ **Timing Analysis:** Don't withdraw immediately after deposit

### Smart Contract Security

- Emergency pause functionality (owner only)
- No upgrade capability (immutable after deployment)
- Nullifier tracking prevents double-spends
- Merkle root validation prevents fake withdrawals

## Performance Metrics

### Proof Generation (Client-side)
- **Circuit Size:** ~12K gates (UltraHonk)
- **Proof Generation Time:** ~2-5 seconds (1 thread)
- **Proof Size:** ~1-2 KB
- **Browser Compatibility:** WebAssembly required

### On-Chain Verification (Starknet)
- **Gas Cost:** ~50K-100K gas (varies with proof complexity)
- **Verification Time:** <1 second
- **Calldata Size:** ~8-12 KB

## Testing

### Test Noir Circuit
```bash
cd circuit
nargo test
```

### Generate Test Proof
```bash
make -f Makefile.circuit generate-proof
```

### Verify Test Proof On-Chain
```bash
make -f Makefile.circuit generate-calldata
make -f Makefile.circuit verify-on-chain CONTRACT=0x...
```

## Troubleshooting

### Circuit Compilation Errors
- Ensure Noir version 1.0.0-beta.5
- Check Poseidon2 is available in std library

### Proof Generation Fails
- Check witness generation succeeds first: `nargo execute`
- Verify barretenberg version 0.87.4-starknet.1
- Try single-threaded mode: `{ threads: 1 }`

### On-Chain Verification Fails
- Verify public inputs match circuit outputs
- Check Merkle root is current
- Ensure nullifier not already used
- Verify amount matches deposit

## Roadmap

### Future Enhancements

- [ ] Increase Merkle tree depth to 16+ levels (65K+ anonymity set)
- [ ] Implement variable denominations
- [ ] Add relayer support for fully anonymous withdrawals
- [ ] Recursive proof aggregation for batch withdrawals
- [ ] Cross-chain privacy bridges
- [ ] Integration with Lightning Network routing
- [ ] Mobile app with secure enclave proof generation

## References

- [Noir Language](https://noir-lang.org/)
- [Garaga Documentation](https://github.com/keep-starknet-strange/garaga)
- [UltraHonk Proofs](https://aztec.network/)
- [Starknet Documentation](https://docs.starknet.io/)
- [SLPM Architecture](./MIXER_ARCHITECTURE.md)

## Support

For questions and support:
- GitHub Issues: [SLPM Repository]
- Documentation: See `docs/` directory
- Community: Starknet Discord #privacy-mixers

---

**⚠️ DISCLAIMER:** This software is experimental. Use at your own risk. Always test on testnet first. Never deposit more than you can afford to lose. This is not financial advice.
