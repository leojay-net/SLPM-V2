# Garaga Integration for SLPM Privacy Mixer

## What is Garaga?

[Garaga](https://github.com/keep-starknet-strange/garaga) is a Cairo library and toolchain for efficient zero-knowledge proof verification on Starknet. It enables verification of Noir/UltraHonk proofs with optimal gas efficiency using native Cairo circuits.

## Why Garaga for SLPM?

### Previous Approach (Simplified Hashing)
```cairo
// Old: Just hash verification
fn _verify_withdrawal_proof(
    nullifier: felt252,
    commitment: felt252,
    // ...
) {
    let computed_commitment = PoseidonTrait::new()
        .update(secret)
        .update(amount)
        .finalize();
    assert!(computed_commitment == commitment, "Invalid");
}
```

❌ **Problems:**
- No real zero-knowledge privacy
- Secret must be revealed to contract
- No proper anonymity set
- Vulnerable to linkability attacks

### Enhanced Approach (Garaga Verification)
```cairo
// New: Real ZK proof verification
fn withdraw(
    nullifier: felt252,
    recipient: ContractAddress,
    amount: u256,
    proof_with_hints: Array<felt252>,
) {
    let verifier = IUltraStarknetZKHonkVerifierDispatcher {
        contract_address: self.verifier_contract.read()
    };
    
    let public_inputs = verifier.verify_ultra_starknet_zk_honk_proof(
        proof_with_hints.span()
    );
    
    assert!(public_inputs.is_some(), "Proof verification failed");
    // Verify public inputs match without revealing secret
}
```

✅ **Benefits:**
- True zero-knowledge privacy
- Secret never leaves client
- Proper Merkle tree anonymity
- Cryptographically sound

## How Garaga Works

### 1. Circuit Compilation Pipeline

```
┌──────────────┐
│ Noir Circuit │  Your privacy logic in Noir
│  (main.nr)   │
└──────┬───────┘
       │ nargo compile
       ▼
┌──────────────┐
│   Bytecode   │  ACIR representation
│  (.json)     │
└──────┬───────┘
       │ bb prove (UltraHonk)
       ▼
┌──────────────┐
│  ZK Proof +  │  Proof + verification key
│     VK       │
└──────┬───────┘
       │ garaga gen
       ▼
┌──────────────┐
│ Cairo Verifier│ Deployed to Starknet
│  Contract    │
└──────────────┘
```

### 2. Proof Verification on Starknet

```
┌──────────────────┐
│ Client-side      │
│ (Browser/Node)   │
│                  │
│ 1. Generate      │
│    witness       │
│ 2. Create proof  │
│ 3. Prepare       │
│    calldata      │
└────────┬─────────┘
         │
         │ proof_with_hints
         ▼
┌──────────────────┐
│ Starknet         │
│                  │
│ ┌──────────────┐ │
│ │   Privacy    │ │
│ │   Mixer      │ │
│ └──────┬───────┘ │
│        │         │
│        │ verify  │
│        ▼         │
│ ┌──────────────┐ │
│ │   Garaga     │ │
│ │  Verifier    │ │
│ └──────┬───────┘ │
│        │         │
│        │ result  │
│        ▼         │
│    Success ✓     │
└──────────────────┘
```

## Technical Deep Dive

### Proof System: UltraHonk with Starknet Oracle

Garaga uses **UltraHonk**, an optimized variant of Plonk that:
- Supports custom gates for efficiency
- Uses KZG polynomial commitments
- Optimized for Starknet's hash function (Poseidon)
- Smaller proof sizes than Groth16
- No trusted setup required (unlike Groth16)

**Key Components:**
1. **Sumcheck Protocol:** Reduces polynomial evaluation claims
2. **Gemini:** Batch opens multiple polynomial commitments
3. **Shplonk:** Accumulates opening proofs efficiently
4. **KZG Verification:** Final pairing check

### Starknet-Specific Optimizations

**Poseidon Hash Oracle:**
```bash
bb prove --scheme ultra_honk --zk --oracle_hash starknet
```

This tells Barretenberg to use Poseidon (Starknet's native hash) instead of Keccak, resulting in:
- ✅ 10-100x cheaper verification gas
- ✅ Native Cairo compatibility
- ✅ No expensive hash conversions

**MSM (Multi-Scalar Multiplication) Hints:**
- Garaga pre-computes expensive elliptic curve operations
- Hints are included in proof calldata
- Verifier reuses precomputed values
- Result: Faster verification, lower gas

### Generated Verifier Structure

When you run `garaga gen`, it creates:

```
slpm_verifier/
├── Scarb.toml
└── src/
    ├── lib.cairo
    ├── honk_verifier.cairo         # Main entry point
    ├── honk_verifier_circuits.cairo # Cairo circuits for EC ops
    └── honk_verifier_constants.cairo # VK constants
```

**Main Verification Function:**
```cairo
#[starknet::interface]
pub trait IUltraStarknetZKHonkVerifier<TContractState> {
    fn verify_ultra_starknet_zk_honk_proof(
        self: @TContractState, 
        full_proof_with_hints: Span<felt252>,
    ) -> Option<Span<u256>>;
}
```

Returns:
- `Some(public_inputs)` if proof is valid
- `None` if proof is invalid

### Calldata Format

The `proof_with_hints` parameter contains:

```
[
    // Proof data
    proof_commitments[],    // EC points (G1)
    proof_evaluations[],    // Field elements
    
    // MSM hints (for optimization)
    msm_scalars[],
    msm_points[],
    
    // KZG hints
    kzg_commitment[],
    kzg_proof[],
    
    // Public inputs
    public_inputs[],
]
```

Generated by Garaga SDK:
```typescript
import { getZKHonkCallData } from 'garaga';

const callData = getZKHonkCallData(
    proof.proof,
    flattenedPublicInputs,
    vk,
    1 // HonkFlavor.STARKNET
);
```

## Integration Steps

### Step 1: Build Circuit
```bash
cd circuit
nargo check
nargo execute witness
```

### Step 2: Generate Proof
```bash
bb prove --scheme ultra_honk --zk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -w ./target/witness.gz \
  -o ./target
```

### Step 3: Generate VK
```bash
bb write_vk --scheme ultra_honk --oracle_hash starknet \
  -b ./target/slpm_privacy_mixer.json \
  -o ./target
```

### Step 4: Generate Cairo Verifier
```bash
garaga gen \
  --system ultra_starknet_zk_honk \
  --vk ./circuit/target/vk \
  --project-name slpm_verifier
```

### Step 5: Build and Deploy
```bash
cd slpm_verifier
scarb build

# Declare contract
sncast declare --contract-name UltraStarknetZKHonkVerifier

# Deploy via UDC
sncast invoke \
  --contract-address 0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf \
  --function "deployContract" \
  --calldata <CLASS_HASH> 0x0 0x0 0x0
```

### Step 6: Integrate with Mixer

```cairo
#[constructor]
fn constructor(
    ref self: ContractState,
    owner: ContractAddress,
    strk_token: ContractAddress,
    verifier_contract: ContractAddress,  // ← Garaga verifier address
) {
    // ...
    self.verifier_contract.write(verifier_contract);
}
```

## Gas Optimization Techniques

### 1. Proof Batching
Instead of verifying one proof per withdrawal, batch multiple:
```cairo
fn batch_withdraw(
    nullifiers: Array<felt252>,
    recipients: Array<ContractAddress>,
    amounts: Array<u256>,
    aggregated_proof: Array<felt252>,  // Single proof for all
) {
    // Verify one proof that covers all withdrawals
    // Result: ~10x gas savings
}
```

### 2. Recursive Proofs
Create a proof that verifies other proofs:
```noir
fn verify_batch(
    proof1: Proof,
    proof2: Proof,
    // ...
) {
    verify_proof(proof1);
    verify_proof(proof2);
    // Result: One on-chain verification for many proofs
}
```

### 3. Lazy Verification
Don't verify immediately, batch verifications:
```cairo
fn queue_withdrawal(proof: Array<felt252>) -> u32 {
    // Store proof, return queue_id
    // Verify later in batch
}

fn process_batch(queue_ids: Array<u32>) {
    // Verify all proofs together
}
```

## Comparison with Alternatives

### Garaga vs. Traditional Verifiers

| Feature         | Garaga           | Traditional   |
| --------------- | ---------------- | ------------- |
| Language        | Cairo (native)   | Solidity port |
| Gas Cost        | ~50K-100K        | ~500K-1M      |
| Proof System    | UltraHonk        | Groth16/Plonk |
| Hash Function   | Poseidon         | Keccak        |
| Setup           | No trusted setup | Trusted setup |
| Proof Size      | 1-2 KB           | 1-3 KB        |
| Generation Time | 2-5s             | 1-3s          |

### Why Not Risc0/SP1?
- Risc0/SP1 are for general computation
- Noir is specialized for ZK circuits
- Better performance for crypto primitives
- Smaller proof sizes for privacy use cases

## Security Considerations

### Verifier Security
✅ **Audited:** Garaga core is audited by Trail of Bits
✅ **Open Source:** Full source available on GitHub
✅ **Battle-Tested:** Used in production by multiple projects

### Soundness
- UltraHonk provides ~128-bit security
- Resistant to quantum attacks (lattice-based)
- No known vulnerabilities in the proof system

### Completeness
- Valid proofs always verify
- No false negatives
- Deterministic verification

### Zero-Knowledge
- Proof reveals nothing about private inputs
- Simulator indistinguishable from real proofs
- Information-theoretic privacy

## Monitoring and Debugging

### On-Chain Verification Logs
```cairo
#[event]
struct ProofVerificationFailed {
    nullifier: felt252,
    timestamp: u64,
    reason: felt252,
}
```

### Client-Side Debugging
```typescript
try {
    const proof = await generateProof(inputs);
} catch (error) {
    if (error.message.includes('witness generation')) {
        // Circuit constraints not satisfied
        console.error('Invalid inputs:', inputs);
    } else if (error.message.includes('proof generation')) {
        // Backend error
        console.error('BB error:', error);
    }
}
```

### Common Issues

**"Proof verification failed"**
- Check public inputs match
- Verify Merkle root is current
- Ensure nullifier not reused

**"Gas limit exceeded"**
- Proof too complex
- Use batch verification
- Optimize circuit size

**"Invalid witness"**
- Circuit constraints violated
- Check Merkle proof validity
- Verify commitment calculation

## Best Practices

1. **Always test on testnet first**
2. **Monitor gas costs** - optimize if > 100K
3. **Batch operations** when possible
4. **Cache verification keys** - don't regenerate
5. **Use latest Garaga version** - active development
6. **Pin dependency versions** - reproducible builds
7. **Audit custom circuits** - security critical

## Resources

- **Garaga GitHub:** https://github.com/keep-starknet-strange/garaga
- **Garaga Docs:** https://garaga.gitbook.io/
- **UltraHonk Paper:** https://eprint.iacr.org/2023/552
- **Starknet Docs:** https://docs.starknet.io/
- **Noir Docs:** https://noir-lang.org/

## Support

For Garaga-specific issues:
- GitHub Issues: garaga repository
- Discord: #garaga on Starknet Discord
- Documentation: Garaga Gitbook

---

**Note:** Garaga is under active development. Always check for updates and breaking changes when upgrading.
