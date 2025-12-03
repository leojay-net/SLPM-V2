# SLPM SDK

Starknet Lightning Privacy Mixer SDK - A comprehensive SDK for privacy-preserving transactions on Starknet, integrating Lightning Network swaps and Cashu ecash.

---

## Features

- **Privacy Mixer** - ZK-based private deposits and withdrawals using Noir circuits and Garaga verification
- **Cross-Chain Swaps** - STRK to/from BTC/ZEC via Lightning Network and Atomiq Protocol
- **Cashu Ecash** - Privacy-preserving bearer token payment layer
- **Full Privacy Pipeline** - Mixer to Cashu to Lightning to Cashu to Mixer
- **Noir + Garaga** - Production-grade ZK proofs verified on-chain

---

## Installation

```bash
npm install @slpm/sdk
# or
yarn add @slpm/sdk
# or
pnpm add @slpm/sdk
```

## Quick Start

```typescript
import { SLPM } from '@slpm/sdk';
import { Account, RpcProvider } from 'starknet';

// Initialize provider and account
const provider = new RpcProvider({ 
  nodeUrl: 'https://starknet-mainnet.public.blastapi.io' 
});
const account = new Account(provider, YOUR_ADDRESS, YOUR_PRIVATE_KEY);

// Create SLPM instance
const slpm = new SLPM({
  rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
  network: 'mainnet',
  account,
  cashuMintUrl: 'https://mint.minibits.cash/Bitcoin',
  debug: true,
});

// Privacy mixer deposit
const deposit = await slpm.deposit({
  amount: BigInt('1000000000000000000'), // 1 STRK
});
console.log('Save this commitment:', deposit.commitment);

// Later, withdraw to a different address
const withdraw = await slpm.withdraw({
  commitment: deposit.commitment,
  recipient: '0x...',
  amount: BigInt('1000000000000000000'),
});
```

## Privacy Mixer

The privacy mixer breaks the on-chain link between sender and recipient using ZK proofs.

### Deposit

```typescript
// Deposit funds into the mixer
const deposit = await slpm.deposit({
  amount: BigInt('1000000000000000000'), // 1 STRK
});

// IMPORTANT: Save the commitment - you need it to withdraw!
const commitment = deposit.commitment;
console.log('Commitment:', commitment);
```

### Withdraw

```typescript
// Withdraw to a different address
const withdraw = await slpm.withdraw({
  commitment: savedCommitment,
  recipient: '0xNEW_ADDRESS',
  amount: BigInt('1000000000000000000'),
});
```

### Private Send

Deposit and withdraw in one operation:

```typescript
const result = await slpm.privateSend(
  BigInt('1000000000000000000'), // amount
  '0xRECIPIENT',
  {
    delayMs: 60000, // optional delay for more privacy
    minAnonymitySetSize: 10, // wait for minimum anonymity
  }
);
```

## Cross-Chain Swaps

Swap STRK to/from BTC and ZEC.

### Get Quote

```typescript
const quote = await slpm.getSwapQuote('strk-to-zec', '10');
console.log('Rate:', quote.rate);
console.log('Output:', quote.outputAmount, 'ZEC');
```

### Execute Swap

```typescript
// Swap with privacy features
const result = await slpm.swap({
  direction: 'strk-to-zec',
  amount: '10',
  destinationAddress: 'zs1...',
  usePrivacyMixer: true,
  useCashuFlow: true,
});
```

### Supported Directions

- `strk-to-zec` - STRK → ZEC
- `zec-to-strk` - ZEC → STRK
- `strk-to-btc` - STRK → BTC
- `btc-to-strk` - BTC → STRK

## Cashu Ecash

Use Cashu tokens for private Lightning payments.

### Mint Tokens

```typescript
// Get mint quote
const quote = await slpm.mintCashuTokens(1000); // 1000 sats
console.log('Pay this invoice:', quote.request);

// After paying the invoice
const proofs = await slpm.cashu.mintTokens(1000, quote.quote);
```

### Send/Receive Tokens

```typescript
// Send tokens
const { token, change } = await slpm.cashu.send(proofs, 500);
console.log('Send this token:', token);

// Receive tokens
const received = await slpm.cashu.receive(token);
```

### Pay Lightning Invoice

```typescript
const result = await slpm.payCashuInvoice('lnbc...');
console.log('Paid:', result.paid);
```

## Direct Module Access

Access modules directly for fine-grained control:

```typescript
// Privacy Mixer
const mixer = slpm.mixer;
const stats = await mixer.getStats();

// Swapper
const swapper = slpm.swapper;
const quote = await swapper.getQuote('strk-to-btc', '1');

// Cashu Wallet
const cashu = slpm.cashu;
const balance = cashu.getBalance();
```

## Sub-package Imports

Import specific modules to reduce bundle size:

```typescript
import { PrivacyMixer } from '@slpm/sdk/privacy';
import { CrossChainSwapper } from '@slpm/sdk/swaps';
import { CashuWallet } from '@slpm/sdk/cashu';
```

## Configuration

```typescript
interface SLPMInitConfig {
  // Required
  account: Account;              // Starknet account
  network: 'mainnet' | 'sepolia'; // Network
  
  // Optional
  rpcUrl?: string;               // RPC URL (uses default)
  mixerContractAddress?: string; // Custom mixer contract
  cashuMintUrl?: string;         // Cashu mint URL
  debug?: boolean;               // Enable debug logs
  
  // For cross-chain swaps
  fixedFloat?: {
    apiKey: string;
    apiSecret: string;
  };
}
```

## Utility Functions

```typescript
import { 
  generateCommitment,
  formatAmount,
  parseAmount,
  randomHex,
} from '@slpm/sdk';

// Generate commitment
const commitment = generateCommitment(BigInt('1000000000000000000'));

// Format/parse amounts
const formatted = formatAmount(BigInt('1500000000000000000')); // '1.5'
const parsed = parseAmount('1.5'); // BigInt('1500000000000000000')
```

## Constants

```typescript
import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  CASHU_MINTS,
  MIXER_CONFIG,
  SWAP_CONFIG,
} from '@slpm/sdk';

console.log(MAINNET_CONTRACTS.MIXER);
console.log(MIXER_CONFIG.MIN_DEPOSIT);
```

## Types

Full TypeScript support with exported types:

```typescript
import type {
  Commitment,
  DepositParams,
  DepositResult,
  WithdrawParams,
  WithdrawResult,
  SwapParams,
  SwapResult,
  SwapQuote,
  SLPMConfig,
} from '@slpm/sdk';
```

## Error Handling

```typescript
import { 
  SLPMError, 
  PrivacyError, 
  SwapError, 
  CashuError 
} from '@slpm/sdk';

try {
  await slpm.deposit({ amount: BigInt('100') });
} catch (error) {
  if (error instanceof PrivacyError) {
    console.log('Privacy error:', error.code, error.details);
  }
}
```

## Security Considerations

1. **Save Your Commitments** - Without the commitment, you cannot withdraw funds
2. **Private Keys** - Never expose private keys or commitment secrets
3. **Wait for Anonymity** - More deposits = better privacy
4. **Use Full Pipeline** - Combine mixer + Cashu for maximum privacy

---

## Architecture

### Zero-Knowledge Proof Pipeline

The SDK uses Noir circuits compiled to UltraHonk proofs, verified on-chain via Garaga:

```
    CLIENT SIDE                              STARKNET
    +-----------------+                      +------------------------+
    |                 |                      |                        |
    | 1. Compute      |                      |                        |
    |    witness      |                      |                        |
    |                 |                      |                        |
    | 2. Generate     |   proof + hints      |  4. Garaga Verifier    |
    |    UltraHonk    | -------------------> |     Contract           |
    |    proof        |                      |     - Parse proof      |
    |                 |                      |     - Verify pairing   |
    | 3. Prepare      |                      |     - Extract pubins   |
    |    calldata     |                      |                        |
    |                 |                      |  5. Privacy Mixer      |
    +-----------------+                      |     Contract           |
                                             |     - Check nullifier  |
                                             |     - Verify root      |
                                             |     - Transfer funds   |
                                             +------------------------+
```

### Cross-Chain Swap Pipeline (ZEC to STRK)

```
    ZEC --> STRK PRIVACY SWAP
    ================================================================

    [Zcash]           [Exchange]          [Lightning]         [Starknet]
        |                 |                    |                   |
        | Shielded TX     |                    |                   |
        +---------------->|                    |                   |
        |                 | BTC on-chain       |                   |
        |                 +------------------->|                   |
        |                 |                    | Atomiq HTLC       |
        |                 |                    +------------------>|
        |                 |                    |                   | ZK Mixer
        |                 |                    |                   +-------+
        |                 |                    |                   |       |
        |                 |                    |                   |<------+
        |                 |                    |                   |
    [z-addr]          [FixedFloat]         [HTLC]           [Fresh Wallet]
```

### Noir Circuit Inputs

```
    PRIVATE INPUTS                    PUBLIC INPUTS
    +---------------------------+     +---------------------------+
    | secret: Field             |     | nullifier_hash: Field     |
    | path_elements: [Field;8]  |     | root: Field               |
    | path_indices: [Field;8]   |     | recipient: Field          |
    +---------------------------+     | amount_low: Field         |
                                      | amount_high: Field        |
                                      +---------------------------+
```

---

## License

MIT

---

## Links

- Documentation: docs/
- GitHub: github.com/your-repo/SLPM-enhanced
