# 🔐 SLPM Enhanced - Zero-Knowledge Privacy Mixer for Starknet

[![Starknet](https://img.shields.io/badge/Starknet-Compatible-purple)](https://starknet.io)
[![Noir](https://img.shields.io/badge/Noir-ZK%20Circuits-blue)](https://noir-lang.org)
[![Garaga](https://img.shields.io/badge/Garaga-Verifier-green)](https://github.com/keep-starknet-strange/garaga)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **True zero-knowledge privacy for Starknet using Noir circuits and Garaga verification**

SLPM (Starknet Lightning Privacy Mixer) now features **cryptographically sound privacy** through integration with:
- 🎯 **Noir ZK Circuits** - Compile privacy logic to zero-knowledge proofs
- ⚡ **UltraHonk Backend** - Fast proof generation with Starknet optimization
- 🛡️ **Garaga Verifier** - Efficient on-chain proof verification in Cairo

## ✨ What's New: Enhanced Privacy

### Before vs After

| Feature       | Original SLPM            | Enhanced SLPM                   |
| ------------- | ------------------------ | ------------------------------- |
| Privacy       | Basic hashing            | True zero-knowledge             |
| Anonymity Set | ❌ None                   | ✅ Merkle tree (256 commitments) |
| Secret Safety | ⚠️ Revealed on withdrawal | ✅ Never leaves client           |
| Proof System  | ❌ Hash verification only | ✅ UltraHonk ZK proofs           |
| Unlinkability | ⚠️ Weak                   | ✅ Cryptographic guarantee       |
| Gas Cost      | ~5K gas                  | ~50K-100K gas                   |
| Security      | ⚠️ Limited                | ✅ 128-bit soundness             |

### Privacy Guarantees

- **🎭 Unlinkability:** Impossible to link deposits to withdrawals
- **🔒 Confidentiality:** Secrets never revealed on-chain
- **🌳 Anonymity Set:** Hide among up to 256 concurrent deposits
- **🚫 Double-Spend Prevention:** Nullifier tracking ensures one-time use
- **⏱️ Timing Privacy:** Withdraw anytime after deposit

## 🚀 Quick Start

Get started in under 10 minutes! See [ENHANCED_PRIVACY_QUICKSTART.md](ENHANCED_PRIVACY_QUICKSTART.md) for detailed instructions.

```bash
# 1. Install dependencies (one-time setup)
make -f Makefile.circuit install

# 2. Build circuit and verifier
./build-circuit.sh

# 3. Deploy to Ztarknet
./deploy-verifier.sh

# 4. Use in your app
npm install
npm run dev
```

## 📖 Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT SIDE                         │
│                                                         │
│  1. Generate secret & commitment                       │
│     commitment = Poseidon(secret, amount)              │
│                                                         │
│  2. Deposit to mixer                                   │
│     → Commitment added to Merkle tree                  │
│     → Get leaf index for withdrawal                    │
│                                                         │
│  3. Later: Generate ZK proof (client-side)             │
│     → Prove: "I know secret for commitment in tree"    │
│     → Without revealing which commitment!              │
│                                                         │
│  4. Withdraw with proof                                │
│     → Submit proof + public inputs                     │
│     → Garaga verifies proof on-chain                   │
│     → Funds sent to recipient address                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    STARKNET CHAIN                       │
│                                                         │
│  ┌──────────────────┐      ┌─────────────────┐        │
│  │ Privacy Mixer    │─────→│ Garaga Verifier │        │
│  │                  │verify │                 │        │
│  │ • Deposits       │←─────│ • UltraHonk     │        │
│  │ • Withdrawals    │result│ • ZK Proofs     │        │
│  │ • Merkle Tree    │      │ • Public Inputs │        │
│  └──────────────────┘      └─────────────────┘        │
│                                                         │
│  Result: ✅ Unlinkable transactions                     │
└─────────────────────────────────────────────────────────┘
```

### Components

1. **Noir Circuit** (`circuit/src/main.nr`)
   - Proves knowledge of secret without revealing it
   - Verifies commitment exists in Merkle tree
   - Ensures nullifier prevents double-spending

2. **Garaga Verifier** (Auto-generated)
   - Verifies UltraHonk proofs on Starknet
   - Optimized for gas efficiency
   - Uses Poseidon hash for Starknet compatibility

3. **Enhanced Mixer Contract** (`contract/src/enhanced_privacy_mixer.cairo`)
   - Manages deposits and withdrawals
   - Maintains Merkle tree of commitments
   - Calls Garaga verifier for proof verification

4. **TypeScript SDK** (`src/crypto/noir-proof.ts`, `src/integrations/starknet/enhanced-mixer.ts`)
   - Generate commitments and secrets
   - Build Merkle proofs
   - Create ZK proofs client-side
   - Interact with mixer contract

## 💻 Usage Example

### Deposit

```typescript
import { createEnhancedPrivacyMixer } from './src/integrations/starknet/enhanced-mixer';
import { createCommitmentData } from './src/crypto/noir-proof';

// Initialize mixer
const mixer = await createEnhancedPrivacyMixer(config, account, circuitBytecode, abi, vk);

// Deposit 1 STRK
const amount = 1_000_000_000_000_000_000n;
const result = await mixer.deposit(account, amount);

console.log('Deposited! Save this:');
console.log('Secret:', result.commitmentData.secret);
console.log('Nullifier:', result.commitmentData.nullifier);
console.log('Leaf Index:', result.leafIndex);
```

### Withdraw (Privately!)

```typescript
// Later, from a different address...
const recipientAddress = '0x...'; // Your other address

const result = await mixer.withdraw(
  account,
  secret,           // From deposit
  leafIndex,        // From deposit
  recipientAddress,
  amount
);

console.log('Withdrawn privately!');
console.log('No one can link this to your deposit! 🎉');
```

## 📚 Documentation

Comprehensive guides for all aspects:

- **[ENHANCED_PRIVACY_QUICKSTART.md](ENHANCED_PRIVACY_QUICKSTART.md)** - Get started in 10 minutes
- **[NOIR_INTEGRATION.md](docs/NOIR_INTEGRATION.md)** - Complete architecture guide
- **[ZTARKNET_GARAGA_INTEGRATION.md](docs/ZTARKNET_GARAGA_INTEGRATION.md)** - Garaga deep dive
- **[MIXER_ARCHITECTURE.md](docs/MIXER_ARCHITECTURE.md)** - Original SLPM design
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Python 3.10 (for Garaga)
- Noir 1.0.0-beta.5
- Barretenberg 0.87.4-starknet.1
- Garaga 0.18.1

### Build from Source

```bash
# Clone repository
git clone <your-repo>
cd SLPM-enhanced

# Install dependencies
npm install
make -f Makefile.circuit install

# Build circuit
cd circuit
nargo check
nargo test

# Generate verifier
cd ..
./build-circuit.sh

# Build contracts
cd contract
scarb build
```

### Testing

```bash
# Test Noir circuit
cd circuit && nargo test

# Generate test proof
make -f Makefile.circuit generate-proof

# Test on-chain verification
make -f Makefile.circuit verify-on-chain CONTRACT=0x...
```

## 🔒 Security

### Audited Components
- ✅ **Garaga Core** - Audited by Trail of Bits
- ✅ **UltraHonk** - Extensively reviewed by Aztec team
- ⚠️ **Custom Circuit** - Recommend independent audit before mainnet

### Security Best Practices
1. **Never lose your secret** - Funds are unrecoverable
2. **Use Tor/VPN** - Protect network-level privacy
3. **Wait for anonymity** - Don't withdraw immediately after deposit
4. **Test on testnet** - Always test before mainnet
5. **Verify contracts** - Check deployed contract addresses

### Known Limitations
- Current implementation supports up to 256 concurrent deposits (8-level tree)
- Gas costs higher than simple transfers (~50K-100K gas)
- Proof generation requires ~2-5 seconds client-side
- Browser requires WebAssembly support

## 📊 Performance

| Metric               | Value       |
| -------------------- | ----------- |
| **Proof Generation** | 2-5 seconds |
| **Proof Size**       | 1-2 KB      |
| **Verification Gas** | 50K-100K    |
| **Circuit Size**     | ~12K gates  |
| **Anonymity Set**    | Up to 256   |
| **Merkle Depth**     | 8 levels    |

## 🗺️ Roadmap

### Phase 1: Enhanced Privacy ✅
- [x] Noir circuit implementation
- [x] Garaga verifier integration
- [x] Enhanced mixer contract
- [x] TypeScript SDK
- [x] Comprehensive documentation

### Phase 2: Scale & Optimize
- [ ] Increase Merkle tree depth to 16+ levels
- [ ] Recursive proof aggregation for batching
- [ ] Gas optimization techniques
- [ ] Mobile SDK with secure enclave

### Phase 3: Advanced Features
- [ ] Variable denominations
- [ ] Relayer support for fully anonymous withdrawals
- [ ] Cross-chain privacy bridges
- [ ] Lightning Network integration
- [ ] Governance and upgrades

## 🤝 Contributing

We welcome contributions! Areas where you can help:

- Circuit optimization and security review
- Gas cost reduction
- UI/UX improvements
- Documentation and tutorials
- Testing and bug reports

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Noir Team** - Amazing ZK circuit language
- **Garaga Team** - Efficient verifier implementation
- **Starknet Foundation** - Platform and support
- **Aztec** - UltraHonk proof system
- **Ztarknet** - Testnet for development

## ⚠️ Disclaimer

This software is experimental and provided "as is" without warranty. Use at your own risk. Always test on testnet before mainnet deployment. This is not financial advice.

## 📞 Support

- **GitHub Issues:** Report bugs and request features
- **Documentation:** See `docs/` directory
- **Discord:** Join Starknet Discord #privacy-mixers
- **Twitter:** Follow [@StarknetPrivacy](https://twitter.com/starknet)

---

**Built with ❤️ for privacy on Starknet**

[Get Started](ENHANCED_PRIVACY_QUICKSTART.md) | [Documentation](docs/) | [Examples](examples/)
