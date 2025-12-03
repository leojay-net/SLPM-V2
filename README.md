# SLPM - Starknet Lightning Privacy Mixer

A decentralized privacy solution that breaks on-chain transaction linkability on Starknet by routing funds through multiple privacy-preserving layers: Zero-Knowledge Proofs, Lightning Network, Cashu Ecash, and Cross-Chain Atomic Swaps.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Starknet](https://img.shields.io/badge/Starknet-Mainnet-purple)](https://starknet.io)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

---

## Table of Contents

1. [Overview](#overview)
2. [Privacy Architecture](#privacy-architecture)
3. [Cross-Chain Privacy Swaps](#cross-chain-privacy-swaps)
4. [Zero-Knowledge Implementation](#zero-knowledge-implementation)
5. [Technology Stack](#technology-stack)
6. [Installation](#installation)
7. [Usage](#usage)
8. [SDK](#sdk)
9. [Security](#security)
10. [Contributing](#contributing)

---

## Overview

SLPM provides financial privacy for Starknet transactions through a sophisticated multi-layer architecture that makes it cryptographically impossible to link sender and recipient addresses on-chain. The system now supports cross-chain privacy swaps between Zcash (ZEC) and Starknet (STRK).

### Key Features

- Zero-Knowledge Privacy: Cryptographic commitments and nullifiers prevent on-chain linkability
- Lightning Integration: Instant, untraceable cross-chain routing via Bitcoin Lightning Network
- Cashu Ecash: Bearer token privacy with offline storage and peer-to-peer transfers
- Cross-Chain Swaps: Private ZEC to STRK and STRK to ZEC transfers via Atomiq Protocol
- Noir + Garaga: Production-grade ZK proof generation and on-chain verification
- Two Mixing Modes: Full Mix (automated) and Split Mix (manual custody)

---

## Privacy Architecture

### Privacy Pipeline

```
                           SLPM PRIVACY PIPELINE
    ========================================================================

    [DEPOSIT]                                                    [WITHDRAW]
        |                                                             ^
        v                                                             |
    +-------+     +----------+     +--------+     +-------+     +---------+
    | STRK  | --> | Privacy  | --> | Cashu  | --> | Light | --> | Fresh   |
    | Funds |     | Mixer    |     | Ecash  |     | ning  |     | Wallet  |
    +-------+     +----------+     +--------+     +-------+     +---------+
        |              |                |             |              |
        v              v                v             v              v
    Sender         ZK Commit        Anonymous     Off-chain      Recipient
    Address        + Merkle         Tokens        Payment        (Unlinkable)
                   Tree
```

### Four-Layer Privacy

```
    Layer 1: Starknet ZK Mixer
    +------------------------------------------------------------------+
    |  Deposit: commitment = hash(secret, nullifier, amount)           |
    |  Withdraw: Prove membership in Merkle tree without revealing     |
    |            which commitment is yours                             |
    |  Tech: Noir circuits verified via Garaga on Starknet             |
    +------------------------------------------------------------------+

    Layer 2: Lightning Network
    +------------------------------------------------------------------+
    |  Off-chain payment routing                                       |
    |  Multi-hop onion encryption                                      |
    |  No permanent blockchain record                                  |
    +------------------------------------------------------------------+

    Layer 3: Cashu Ecash
    +------------------------------------------------------------------+
    |  Blind-signed bearer tokens                                      |
    |  No ledger tracking transfers                                    |
    |  Offline storage and peer-to-peer transfers                      |
    +------------------------------------------------------------------+

    Layer 4: Cross-Chain Privacy (Zcash)
    +------------------------------------------------------------------+
    |  Shielded transactions (z-addresses)                             |
    |  Groth16 zk-SNARKs                                               |
    |  Hidden sender, receiver, and amount                             |
    +------------------------------------------------------------------+
```

---

## Cross-Chain Privacy Swaps

SLPM integrates with the Atomiq Protocol to enable trustless, privacy-preserving swaps between Zcash and Starknet.

### ZEC to STRK Flow

```
    ZEC --> STRK PRIVATE SWAP FLOW
    =========================================================================

    User (ZEC)                                                    User (STRK)
        |                                                              ^
        | 1. Send shielded ZEC                                         |
        |    (z-addr to z-addr)                                        |
        v                                                              |
    +-------------+                                                    |
    | FixedFloat  |  ZEC/BTC Exchange                                  |
    | Exchange    |  (Transparent swap)                                |
    +-------------+                                                    |
        |                                                              |
        | 2. BTC sent on-chain                                         |
        v                                                              |
    +-------------+                                                    |
    |  Atomiq     |  BTC -> STRK Atomic Swap                           |
    |  Protocol   |  (HTLC-based, trustless)                           |
    +-------------+                                                    |
        |                                                              |
        | 3. STRK received                                             |
        v                                                              |
    +-------------+                                                    |
    |  Privacy    |  Deposit with commitment                           |
    |  Mixer      |  Generate ZK proof                                 |
    +-------------+                                                    |
        |                                                              |
        | 4. (Optional) Cashu flow                                     |
        v                                                              |
    +-------------+                                                    |
    |  Cashu      |  Convert to bearer tokens                          |
    |  Mint       |  Additional privacy layer                          |
    +-------------+                                                    |
        |                                                              |
        | 5. Withdraw to fresh wallet                                  |
        |    (ZK proof, no link to deposit)                            |
        +--------------------------------------------------------------+

    PRIVACY CHAIN: Zcash Shielded -> BTC -> STRK -> ZK Mixer -> Fresh Wallet
```

### STRK to ZEC Flow

```
    STRK --> ZEC PRIVATE SWAP FLOW
    =========================================================================

    User (STRK)                                                    User (ZEC)
        |                                                              ^
        | 1. Deposit to Privacy Mixer                                  |
        |    (Generate commitment)                                     |
        v                                                              |
    +-------------+                                                    |
    |  Privacy    |  commitment = hash(secret, nullifier, amount)      |
    |  Mixer      |  Store in Merkle tree                              |
    +-------------+                                                    |
        |                                                              |
        | 2. (Optional) Cashu flow                                     |
        v                                                              |
    +-------------+                                                    |
    |  Cashu      |  Mint bearer tokens                                |
    |  Mint       |  Blind signatures                                  |
    +-------------+                                                    |
        |                                                              |
        | 3. Withdraw with ZK proof                                    |
        |    Initiate Lightning payment                                |
        v                                                              |
    +-------------+                                                    |
    |  Atomiq     |  STRK -> Lightning                                 |
    |  Protocol   |  HTLC atomic swap                                  |
    +-------------+                                                    |
        |                                                              |
        | 4. Lightning to ZEC                                          |
        v                                                              |
    +-------------+                                                    |
    | FixedFloat  |  BTCLN -> ZEC                                      |
    | Exchange    |  Shielded output                                   |
    +-------------+                                                    |
        |                                                              |
        | 5. Receive shielded ZEC                                      |
        +--------------------------------------------------------------+

    PRIVACY CHAIN: ZK Mixer -> Lightning -> Zcash Shielded
```

### Atomiq Protocol Integration

The Atomiq Protocol enables trustless atomic swaps between Starknet and Bitcoin/Lightning:

```
    ATOMIQ ATOMIC SWAP (STRK <-> BTC)
    =========================================================================

    +-------------------+                      +-------------------+
    |   User Wallet     |                      |  Atomiq Liquidity |
    |   (Starknet)      |                      |  Provider (BTC)   |
    +-------------------+                      +-------------------+
            |                                          |
            |  1. Create HTLC on Starknet              |
            |     Lock STRK with hash(preimage)        |
            +----------------------------------------->|
            |                                          |
            |  2. Create HTLC on Lightning             |
            |     Lock BTC with same hash              |
            |<-----------------------------------------+
            |                                          |
            |  3. User reveals preimage                |
            |     Claims BTC on Lightning              |
            +----------------------------------------->|
            |                                          |
            |  4. LP uses preimage                     |
            |     Claims STRK on Starknet              |
            |<-----------------------------------------+
            |                                          |

    SECURITY: Cryptographic atomicity - either both transfers complete
              or both are refunded. No counterparty risk.
```

---

## Zero-Knowledge Implementation

SLPM uses Noir circuits compiled to UltraHonk proofs, verified on-chain via Garaga.

### Noir Circuit Architecture

```
    NOIR CIRCUIT: Privacy Withdrawal Proof
    =========================================================================

    PRIVATE INPUTS (known only to prover):
    +------------------------------------------------------------------+
    |  secret: Field              - Random value chosen at deposit     |
    |  path_elements: [Field; 8]  - Merkle proof siblings              |
    |  path_indices: [Field; 8]   - Left/right path indicators         |
    +------------------------------------------------------------------+

    PUBLIC INPUTS (verified on-chain):
    +------------------------------------------------------------------+
    |  nullifier_hash: Field      - Prevents double-spending           |
    |  root: Field                - Merkle tree root                   |
    |  recipient: Field           - Withdrawal address                 |
    |  amount_low: Field          - Amount (u128 low bits)             |
    |  amount_high: Field         - Amount (u128 high bits)            |
    +------------------------------------------------------------------+

    CIRCUIT LOGIC:
    +------------------------------------------------------------------+
    |  1. commitment = Poseidon(secret, amount_low, amount_high)       |
    |  2. nullifier = Poseidon(secret, commitment)                     |
    |  3. assert nullifier_hash == Poseidon(nullifier)                 |
    |  4. computed_root = MerkleVerify(commitment, path, indices)      |
    |  5. assert computed_root == root                                 |
    +------------------------------------------------------------------+

    OUTPUT: ZK proof that prover knows a valid commitment in the tree
            without revealing which one
```

### Garaga Verification Pipeline

```
    GARAGA ON-CHAIN VERIFICATION
    =========================================================================

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

    GAS EFFICIENCY: Garaga uses native Cairo circuits for elliptic curve
                   operations, achieving ~10x gas savings vs generic
                   pairing verification
```

### Merkle Tree Structure

```
    MERKLE TREE (Depth 8 = 256 commitments)
    =========================================================================

                              ROOT
                               |
                 +-------------+-------------+
                 |                           |
               H(0,1)                      H(2,3)
                 |                           |
          +------+------+             +------+------+
          |             |             |             |
        H(0)          H(1)          H(2)          H(3)
          |             |             |             |
       +--+--+       +--+--+       +--+--+       +--+--+
       |     |       |     |       |     |       |     |
      C0    C1      C2    C3      C4    C5      C6    C7
       |     |       |     |       |     |       |     |
      ...   ...     ...   ...     ...   ...     ...   ...

    C0-C255: Commitments = Poseidon(secret, nullifier, amount)

    ANONYMITY SET: Each deposit adds to the set. Withdrawer proves
                   membership without revealing which commitment.
```

---

## Technology Stack

### Core Technologies

| Component       | Technology             | Purpose                     |
| --------------- | ---------------------- | --------------------------- |
| Frontend        | Next.js 14, TypeScript | Web application             |
| Smart Contracts | Cairo 2.x              | Starknet privacy mixer      |
| ZK Circuits     | Noir                   | Privacy proof generation    |
| ZK Verification | Garaga                 | On-chain proof verification |
| Atomic Swaps    | Atomiq SDK             | STRK/BTC trustless swaps    |
| Ecash           | Cashu                  | Bearer token privacy        |
| Exchange        | FixedFloat API         | ZEC/BTC conversion          |

### Integration Stack

```
    APPLICATION LAYER
    +------------------------------------------------------------------+
    |  Next.js 14 + TypeScript + React                                 |
    |  Tailwind CSS + Heroicons                                        |
    +------------------------------------------------------------------+
                                    |
    BLOCKCHAIN LAYER
    +------------------------------------------------------------------+
    |  Starknet.js v7.6.4      - Starknet RPC interaction              |
    |  @atomiqlabs/sdk v6.0.3  - Lightning/STRK atomic swaps           |
    |  @cashu/cashu-ts v2.7.2  - Ecash minting/melting                 |
    |  get-starknet v4.0.3     - Wallet connection                     |
    +------------------------------------------------------------------+
                                    |
    SMART CONTRACT LAYER
    +------------------------------------------------------------------+
    |  Cairo 2.x               - Privacy mixer contract                |
    |  Noir                    - ZK circuit definitions                |
    |  Garaga                  - UltraHonk verifier                    |
    +------------------------------------------------------------------+
```

---

## Installation

### Prerequisites

- Node.js 18+ and npm
- Starknet wallet (ArgentX, Braavos, or OKX)
- (Optional) Noir toolchain for circuit development
- (Optional) Garaga for verifier generation

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/SLPM-enhanced.git
cd SLPM-enhanced

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Configuration

```bash
# Network Configuration
NEXT_PUBLIC_NETWORK=MAINNET

# Starknet RPC
NEXT_PUBLIC_STARKNET_RPC=https://starknet-mainnet.public.blastapi.io

# Privacy Mixer Contract
NEXT_PUBLIC_MIXER_CONTRACT_ADDRESS=0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b

# Cashu Mint
NEXT_PUBLIC_CASHU_DEFAULT_MINT=https://mint.lnserver.com

# Atomiq Network
NEXT_PUBLIC_ATOMIQ_NETWORK=mainnet

# FixedFloat API (for cross-chain swaps)
FIXEDFLOAT_API_KEY=your_api_key
FIXEDFLOAT_API_SECRET=your_api_secret
```

### ZK Circuit Setup (Optional)

```bash
# Install Noir toolchain
curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
noirup --version 1.0.0-beta.5

# Install Barretenberg (UltraHonk backend)
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
bbup --version 0.87.4-starknet.1

# Install Garaga
pip install garaga==0.18.1

# Build circuit and generate verifier
./build-circuit.sh
```

---

## SDK

SLPM provides a standalone SDK for programmatic integration.

### Installation

```bash
npm install @slpm/sdk
```

### Basic Usage

```typescript
import { SLPM } from '@slpm/sdk';
import { Account, RpcProvider } from 'starknet';

// Initialize
const provider = new RpcProvider({ nodeUrl: 'https://...' });
const account = new Account(provider, address, privateKey);

const slpm = new SLPM({
  account,
  network: 'mainnet',
  rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
});

// Privacy deposit
const deposit = await slpm.deposit({
  amount: BigInt('1000000000000000000'), // 1 STRK
});

// Withdraw to fresh address (breaks linkability)
await slpm.withdraw({
  commitment: deposit.commitment,
  recipient: '0xFRESH_ADDRESS',
  amount: BigInt('1000000000000000000'),
});
```

### Cross-Chain Swap

```typescript
// STRK to ZEC with privacy
await slpm.swap({
  direction: 'strk-to-zec',
  amount: '10',
  destinationAddress: 'zs1...',
  usePrivacyMixer: true,
  useCashuFlow: true,
});
```

### SDK Modules

| Module  | Import              | Purpose           |
| ------- | ------------------- | ----------------- |
| Core    | `@slpm/sdk`         | Main orchestrator |
| Privacy | `@slpm/sdk/privacy` | Mixer operations  |
| Swaps   | `@slpm/sdk/swaps`   | Cross-chain swaps |
| Cashu   | `@slpm/sdk/cashu`   | Ecash operations  |

---

## Project Structure

```
slpm/
+-- contract/                 # Cairo smart contracts
|   +-- src/
|   |   +-- privacy_mixer.cairo
|   |   +-- lib.cairo
|   +-- tests/
+-- circuit/                  # Noir ZK circuits
|   +-- src/
|   |   +-- main.nr
|   +-- Nargo.toml
+-- sdk/                      # Standalone SDK
|   +-- src/
|   |   +-- core.ts
|   |   +-- privacy/
|   |   +-- swaps/
|   |   +-- cashu/
+-- src/
|   +-- app/                  # Next.js pages
|   |   +-- mixer/
|   |   |   +-- split/
|   |   |   +-- cross-chain/
|   |   +-- api/
|   +-- components/           # React components
|   |   +-- mixer/
|   +-- integrations/         # External services
|   |   +-- cashu/
|   |   +-- swaps/
|   |   +-- starknet/
|   +-- hooks/                # React hooks
|   |   +-- useCrossChainSwap.ts
|   +-- crypto/               # Cryptographic utilities
+-- docs/                     # Documentation
```

---

## Security

### Smart Contract Security

- Emergency pause functionality
- Commitment uniqueness validation
- Nullifier double-spend prevention
- Access control for admin functions
- Reentrancy protection

### Cryptographic Security

- Poseidon hash for Starknet compatibility
- UltraHonk ZK proofs via Noir
- Garaga on-chain verification
- Blind signatures (Cashu BDHKE)

### Operational Security

- API keys secured server-side
- Environment variable validation
- Timeout protection (30-60s limits)
- Comprehensive error handling

---

## Documentation

| Document                                                                | Description                   |
| ----------------------------------------------------------------------- | ----------------------------- |
| [MIXER_ARCHITECTURE.md](./docs/MIXER_ARCHITECTURE.md)                   | Detailed privacy mixer design |
| [NOIR_INTEGRATION.md](./docs/NOIR_INTEGRATION.md)                       | Noir circuit implementation   |
| [ZTARKNET_GARAGA_INTEGRATION.md](./docs/ZTARKNET_GARAGA_INTEGRATION.md) | Garaga verifier setup         |
| [CROSS_CHAIN_ARCHITECTURE.md](./docs/CROSS_CHAIN_ARCHITECTURE.md)       | ZEC/STRK swap flows           |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation for API changes
- Ensure privacy guarantees are maintained

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Disclaimer

This software is provided for educational and research purposes.

- No warranty of any kind
- Test on testnet before mainnet
- Review applicable regulations
- Independent security audit recommended
- Cashu mints are custodial - choose reputable mints
- Backup bearer tokens - they are bearer instruments

---

## Links

- Documentation: [docs/](./docs/)
- GitHub: [github.com/your-repo/SLPM-enhanced](https://github.com/your-repo/SLPM-enhanced)

---

## Acknowledgments

- Starknet for L2 infrastructure
- Atomiq Labs for Lightning/Starknet atomic swaps
- Cashu for ecash protocol
- Noir/Aztec for ZK circuits
- Garaga for efficient on-chain verification
