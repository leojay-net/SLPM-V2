# SLPM Enhanced Privacy - Quick Start

This guide will get you up and running with the enhanced Noir + Garaga privacy mixer in under 10 minutes.

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.10 (for Garaga)
- Git
- Starknet account with testnet funds

## Step 1: Clone and Install (2 minutes)

```bash
# Clone repository
git clone <your-repo>
cd SLPM-enhanced

# Install Node dependencies
npm install

# Install Noir, Barretenberg, and Garaga
make -f Makefile.circuit install
```

## Step 2: Build Circuit and Verifier (3 minutes)

```bash
# Build the Noir circuit and generate Garaga verifier
./build-circuit.sh
```

This will:
- ✅ Compile the Noir privacy circuit
- ✅ Generate verification key
- ✅ Create Cairo verifier contract
- ✅ Build the verifier

## Step 3: Deploy to Ztarknet (2 minutes)

```bash
# Create and fund your account (if not done)
cd quickstart
make account-create
# Visit https://faucet.ztarknet.cash/ and fund your account
make account-deploy

# Deploy the verifier contract
cd ..
./deploy-verifier.sh
```

**Save the deployed verifier address!** You'll need it for the mixer.

## Step 4: Deploy Enhanced Mixer (1 minute)

```bash
cd contract

# Declare the contract
sncast declare --contract-name EnhancedPrivacyMixer

# Deploy (replace CLASS_HASH, TOKEN_ADDRESS, and VERIFIER_ADDRESS)
sncast deploy \
  --class-hash <CLASS_HASH> \
  --constructor-calldata <OWNER_ADDRESS> <STRK_TOKEN_ADDRESS> <VERIFIER_ADDRESS>
```

## Step 5: Make Your First Private Transaction (2 minutes)

### Deposit

```typescript
import { createEnhancedPrivacyMixer } from './src/integrations/starknet/enhanced-mixer';

const config = {
  contractAddress: '<MIXER_ADDRESS>',
  verifierAddress: '<VERIFIER_ADDRESS>',
  tokenAddress: '<STRK_TOKEN_ADDRESS>',
  rpcUrl: 'https://ztarknet-madara.d.karnot.xyz'
};

// Load circuit artifacts
const circuitBytecode = await loadCircuitBytecode();
const circuitAbi = await loadCircuitAbi();
const vk = await loadVerificationKey();

const mixer = await createEnhancedPrivacyMixer(
  config,
  account,
  circuitBytecode,
  circuitAbi,
  vk
);

// Deposit 1 STRK
const amount = 1_000_000_000_000_000_000n;
const result = await mixer.deposit(account, amount);

console.log('✅ Deposited!');
console.log('📝 Save this data for withdrawal:');
console.log('Secret:', result.commitmentData.secret);
console.log('Nullifier:', result.commitmentData.nullifier);
console.log('Leaf Index:', result.leafIndex);
```

### Withdraw (after some time for privacy)

```typescript
// Use your saved data
const recipientAddress = '<YOUR_OTHER_ADDRESS>';

const result = await mixer.withdraw(
  account,
  secret,           // From deposit
  leafIndex,        // From deposit
  recipientAddress,
  amount
);

console.log('✅ Withdrawn privately!');
console.log('Transaction:', result.txHash);
```

## What You've Achieved

🎉 **Congratulations!** You now have:

- ✅ A working zero-knowledge privacy mixer
- ✅ True unlinkability between deposits and withdrawals
- ✅ Cryptographically sound privacy guarantees
- ✅ Gas-efficient on-chain verification

## Next Steps

### Learn More
- Read [NOIR_INTEGRATION.md](./docs/NOIR_INTEGRATION.md) for detailed architecture
- Read [ZTARKNET_GARAGA_INTEGRATION.md](./docs/ZTARKNET_GARAGA_INTEGRATION.md) for Garaga details
- Study the [Noir circuit](./circuit/src/main.nr) to understand the privacy logic

### Customize
- Increase Merkle tree depth for larger anonymity set
- Add variable denominations
- Implement relayer support for fully anonymous withdrawals
- Integrate with Lightning Network for cross-chain privacy

### Deploy to Mainnet
When you're ready for production:

1. **Audit your circuit** - Security is critical
2. **Test extensively** - Use testnet first
3. **Monitor gas costs** - Optimize if needed
4. **Setup monitoring** - Track deposits/withdrawals
5. **Create documentation** - Help users understand privacy guarantees

## Troubleshooting

### Circuit build fails
```bash
# Check Noir version
nargo --version  # Should be 1.0.0-beta.5

# Check Barretenberg version
bb --version  # Should be 0.87.4-starknet.1
```

### Deployment fails
```bash
# Check account balance
sncast balance --token-address <STRK_TOKEN>

# Check account is deployed
sncast account list
```

### Proof generation fails
```typescript
// Use single-threaded mode
const backend = new UltraHonkBackend(bytecode, { threads: 1 });
```

### Verification fails on-chain
- Check public inputs match circuit outputs
- Verify Merkle root is current
- Ensure nullifier not already used

## Common Questions

**Q: How much does it cost?**
A: ~50K-100K gas per withdrawal verification (varies)

**Q: How long does proof generation take?**
A: 2-5 seconds on modern hardware

**Q: Can I withdraw to any address?**
A: Yes! That's the point - complete unlinkability

**Q: What if I lose my secret?**
A: Your funds are permanently locked. Back up securely!

**Q: How many people need to use it for privacy?**
A: More = better. Wait for anonymity set > 10 recommended.

## Resources

- **Documentation:** `docs/` directory
- **Example Code:** `quickstart/` directory
- **Circuit:** `circuit/src/main.nr`
- **Contract:** `contract/src/enhanced_privacy_mixer.cairo`

## Support

Need help?
- GitHub Issues: Report bugs and request features
- Documentation: Check the docs folder
- Community: Join Starknet Discord #privacy-mixers

---

**Remember:** This is experimental software. Always test on testnet first. Never risk more than you can afford to lose.

**Privacy Tip:** Use Tor/VPN when interacting with the mixer for network-level privacy.
