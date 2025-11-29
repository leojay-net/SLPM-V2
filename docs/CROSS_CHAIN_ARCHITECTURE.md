# SLPM Cross-Chain Privacy Architecture

## Executive Summary

SLPM Cross-Chain enables **private, trustless transfers** between Zcash (ZEC) and Starknet (STRK) using a four-layer privacy architecture that combines the best features of each chain.

**No Ztarknet required** - this works on regular Starknet (Sepolia/Mainnet).

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           SLPM CROSS-CHAIN PRIVACY SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐        ┌─────────────┐  │
│  │   ZCASH     │        │  LIGHTNING  │        │  STARKNET   │        │   CASHU     │  │
│  │  (Layer 1)  │◄──────►│  (Layer 2)  │◄──────►│  (Layer 3)  │◄──────►│  (Layer 4)  │  │
│  │             │        │             │        │             │        │             │  │
│  │ • Shielded  │        │ • Off-chain │        │ • ZK Mixer  │        │ • Ecash     │  │
│  │ • z-addrs   │        │ • Instant   │        │ • Noir+     │        │ • Bearer    │  │
│  │ • Groth16   │        │ • Onion     │        │   Garaga    │        │   tokens    │  │
│  └─────────────┘        └─────────────┘        └─────────────┘        └─────────────┘  │
│         │                      │                      │                      │         │
│         └──────────────────────┴──────────────────────┴──────────────────────┘         │
│                                       │                                                 │
│                          ┌────────────┴────────────┐                                   │
│                          │    ATOMIQ PROTOCOL      │                                   │
│                          │  (Trustless Swaps)      │                                   │
│                          └─────────────────────────┘                                   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Four-Layer Privacy Architecture

### Layer 1: Zcash Shielded Transactions
```
┌──────────────────────────────────────────────────────────┐
│                    ZCASH PRIVACY                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Transparent (t-addr)          Shielded (z-addr)         │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ t1abc...        │    →     │ zs1xyz...       │       │
│  │ Public on chain │          │ Fully private   │       │
│  │ Like Bitcoin    │          │ Hidden:         │       │
│  └─────────────────┘          │  • Sender       │       │
│                               │  • Receiver     │       │
│                               │  • Amount       │       │
│                               └─────────────────┘       │
│                                                          │
│  Privacy Tech: zk-SNARKs (Groth16, Sapling/Orchard)     │
│  Battle-tested since 2016                                │
└──────────────────────────────────────────────────────────┘
```

### Layer 2: Lightning Network
```
┌──────────────────────────────────────────────────────────┐
│                  LIGHTNING PRIVACY                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  On-chain (Bitcoin L1)         Off-chain (Lightning)     │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ Permanent       │    →     │ No record       │       │
│  │ Public ledger   │          │ Onion routing   │       │
│  │ Traceable       │          │ Multi-hop       │       │
│  └─────────────────┘          └─────────────────┘       │
│                                                          │
│  User A ──► Node1 ──► Node2 ──► Node3 ──► User B        │
│       (each hop only knows prev/next, not endpoints)    │
│                                                          │
│  Privacy Tech: Onion routing, HTLCs, ephemeral          │
└──────────────────────────────────────────────────────────┘
```

### Layer 3: Starknet ZK Mixer
```
┌──────────────────────────────────────────────────────────┐
│                  STARKNET ZK MIXER                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  DEPOSIT                          WITHDRAW               │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ commitment =    │          │ Prove:          │       │
│  │ hash(secret,    │          │ • Know secret   │       │
│  │      nullifier) │          │ • commitment ∈  │       │
│  │                 │          │   Merkle tree   │       │
│  │ Store in        │          │ • nullifier     │       │
│  │ Merkle tree     │          │   not spent     │       │
│  └─────────────────┘          └─────────────────┘       │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │              MERKLE TREE                      │       │
│  │                   root                        │       │
│  │                 /      \                      │       │
│  │              H01        H23                   │       │
│  │             /   \      /   \                  │       │
│  │           C0    C1   C2    C3  ← commitments  │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  Privacy Tech: Noir circuits + Garaga verifier          │
│  Circuit size: 8192 gates, 23 public inputs             │
└──────────────────────────────────────────────────────────┘
```

### Layer 4: Cashu Ecash
```
┌──────────────────────────────────────────────────────────┐
│                    CASHU PRIVACY                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Traditional Payment          Cashu Ecash                │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ Account-based   │    →     │ Bearer tokens   │       │
│  │ Identity linked │          │ No identity     │       │
│  │ Traceable       │          │ Offline capable │       │
│  └─────────────────┘          └─────────────────┘       │
│                                                          │
│  MINT                         REDEEM                     │
│  ┌─────────────────┐          ┌─────────────────┐       │
│  │ Pay Lightning   │          │ Send token      │       │
│  │ invoice         │    →     │ to anyone       │       │
│  │ Get blind       │          │ They redeem     │       │
│  │ signed tokens   │          │ for Lightning   │       │
│  └─────────────────┘          └─────────────────┘       │
│                                                          │
│  Privacy Tech: Blind signatures (BDHKE)                 │
└──────────────────────────────────────────────────────────┘
```

---

## Complete Flow Diagrams

### Flow 1: ZEC → STRK (Private)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ZEC → STRK PRIVATE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  USER                                                                           USER    │
│  (ZEC)                                                                         (STRK)  │
│    │                                                                              ▲     │
│    │ Step 1: Send shielded ZEC                                                    │     │
│    │         (z-address → z-address)                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │ FixedFloat  │  ZEC shielded tx                                                 │     │
│  │ (Swap Svc)  │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 2: Receive Lightning payment                                            │     │
│    │         (off-chain, instant)                                                 │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │  Lightning  │  ~0.015 BTC                                                      │     │
│  │   Network   │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 3: Convert to STRK via Atomiq                                           │     │
│    │         (trustless, HTLC-based)                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Atomiq    │  STRK received                                                   │     │
│  │  Protocol   │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 4: Deposit to Privacy Mixer                                             │     │
│    │         (commitment stored, secret saved)                                    │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Privacy   │  commitment + nullifier                                          │     │
│  │    Mixer    │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 5: (Optional) Cashu flow                                                │     │
│    │         (extra privacy layer)                                                │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Cashu     │  bearer tokens                                                   │     │
│  │    Mint     │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 6: Withdraw with ZK proof                                               │     │
│    │         (to fresh address)                                                   │     │
│    ▼                                                                              │     │
│  ┌─────────────┐       ZK proof verified          ┌─────────────┐                │     │
│  │   Privacy   │  ──────────────────────────────► │   Fresh     │ ───────────────┘     │
│  │    Mixer    │       STRK released              │   Wallet    │                      │
│  └─────────────┘                                  └─────────────┘                      │
│                                                                                         │
│  PRIVACY CHAIN:  Zcash → Lightning → ZK Mixer → Cashu → Fresh Wallet                   │
│                  (4 independent privacy layers)                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: STRK → ZEC (Private)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              STRK → ZEC PRIVATE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  USER                                                                           USER    │
│  (STRK)                                                                        (ZEC)   │
│    │                                                                              ▲     │
│    │ Step 1: Deposit STRK to mixer                                                │     │
│    │         (generate commitment)                                                │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Privacy   │  commitment stored                                               │     │
│  │    Mixer    │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 2: (Optional) Cashu flow                                                │     │
│    │                                                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Cashu     │  ecash tokens                                                    │     │
│  │    Mint     │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 3: Withdraw to Atomiq                                                   │     │
│    │         (ZK proof verification)                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Privacy   │  STRK to Atomiq                                                  │     │
│  │    Mixer    │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 4: STRK → Lightning via Atomiq                                          │     │
│    │                                                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │   Atomiq    │  Lightning payment                                               │     │
│  │  Protocol   │  ────────────────►                                               │     │
│  └─────────────┘                                                                  │     │
│    │                                                                              │     │
│    │ Step 5: Lightning → ZEC (shielded)                                           │     │
│    │                                                                              │     │
│    ▼                                                                              │     │
│  ┌─────────────┐                                                                  │     │
│  │ FixedFloat  │  ZEC to z-address                                                │     │
│  │ (Swap Svc)  │  ────────────────►  ─────────────────────────────────────────────┘     │
│  └─────────────┘                                                                        │
│                                                                                         │
│  PRIVACY CHAIN:  STRK Wallet → ZK Mixer → Cashu → Lightning → Zcash Shielded           │
│                  (4 independent privacy layers)                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Privacy Guarantees Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRIVACY GUARANTEES                                         │
├──────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────┤
│                  │   Layer 1    │   Layer 2    │   Layer 3    │   Layer 4    │ RESULT  │
│     ATTRIBUTE    │   (Zcash)    │ (Lightning)  │  (ZK Mixer)  │   (Cashu)    │         │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ Sender Hidden    │      ✅      │      ✅      │      ✅      │      ✅      │   ✅    │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ Receiver Hidden  │      ✅      │      ✅      │      ✅      │      ✅      │   ✅    │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ Amount Hidden    │      ✅      │      ⚠️      │      ⚠️      │      ✅      │   ✅    │
│                  │              │  (in invoice)│ (fixed sets) │              │         │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ Timing Hidden    │      ⚠️      │      ✅      │      ⚠️      │      ✅      │   ✅    │
│                  │ (block time) │  (instant)   │ (block time) │  (offline)   │         │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ Link Broken      │      ✅      │      ✅      │      ✅      │      ✅      │   ✅    │
├──────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────┤
│ On-chain Record  │    Hidden    │     None     │   Minimal    │     None     │ Minimal │
└──────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────┘

Legend: ✅ = Fully protected | ⚠️ = Partially protected | ❌ = Not protected
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SLPM COMPONENT ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FRONTEND (Next.js)                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Deposit View │  │ Mixing View  │  │Withdraw View │  │Cross-Chain   │        │   │
│  │  │              │  │              │  │              │  │View          │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              SERVICES LAYER                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Orchestrator │  │ Cross-Chain  │  │ ZK Prover    │  │ Storage      │        │   │
│  │  │              │  │ Bridge       │  │ (Noir)       │  │ (Secrets)    │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            INTEGRATION LAYER                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Atomiq SDK   │  │ Lightning    │  │ Cashu        │  │ Starknet.js  │        │   │
│  │  │              │  │ Client       │  │ Client       │  │              │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  │                                                                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐                                             │   │
│  │  │ FixedFloat   │  │ Zcash RPC    │   ← NEW for cross-chain                     │   │
│  │  │ API          │  │ (z_sendmany) │                                             │   │
│  │  └──────────────┘  └──────────────┘                                             │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                              │
│                                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            BLOCKCHAIN LAYER                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │   Starknet   │  │  Lightning   │  │   Bitcoin    │  │    Zcash     │        │   │
│  │  │   (STRK)     │  │   Network    │  │   (L1)       │  │    (ZEC)     │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            SMART CONTRACTS                                       │   │
│  │  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐     │   │
│  │  │     EnhancedPrivacyMixer         │  │    UltraStarknetZKHonkVerifier   │     │   │
│  │  │  (Cairo - Starknet)              │  │  (Garaga - ZK Proof Verification)│     │   │
│  │  │                                  │  │                                  │     │   │
│  │  │  • deposit()                     │  │  • verify_ultra_starknet_honk()  │     │   │
│  │  │  • withdraw() + ZK verify        │  │                                  │     │   │
│  │  │  • Merkle tree management        │  │  Circuit: 8192 gates             │     │   │
│  │  │                                  │  │  Public inputs: 23               │     │   │
│  │  └──────────────────────────────────┘  └──────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployed Contracts (Ztarknet/Sepolia)

| Contract                        | Address                                                              | Purpose             |
| ------------------------------- | -------------------------------------------------------------------- | ------------------- |
| **EnhancedPrivacyMixer**        | `0x03c4e5b7f9f1156eca95382594b3ee561cf8f78f1b36794030d2c763af083aa0` | Main mixer contract |
| **UltraStarknetZKHonkVerifier** | `0x07b7149cd3b79e9568f21cca07057ae5baff9611b5bb7a2af746338635d81a56` | ZK proof verifier   |

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  FRONTEND                                                                               │
│  ├── Next.js 14 (App Router)                                                           │
│  ├── TypeScript                                                                         │
│  ├── TailwindCSS                                                                        │
│  └── React Query                                                                        │
│                                                                                         │
│  ZK CIRCUITS                                                                            │
│  ├── Noir 1.0.0-beta.3 (circuit language)                                              │
│  ├── Barretenberg v0.86.0-starknet.1 (prover)                                          │
│  └── Garaga 0.18.1 (Starknet verifier generation)                                      │
│                                                                                         │
│  SMART CONTRACTS                                                                        │
│  ├── Cairo (Starknet contracts)                                                         │
│  ├── Scarb 2.14.0 (build tool)                                                         │
│  └── Starknet Foundry 0.52.0 (testing)                                                 │
│                                                                                         │
│  INTEGRATIONS                                                                           │
│  ├── Atomiq SDK (Lightning ↔ STRK swaps)                                               │
│  ├── Cashu-ts (ecash tokens)                                                           │
│  ├── Starknet.js (blockchain interaction)                                              │
│  ├── FixedFloat API (ZEC ↔ Lightning)  ← NEW                                           │
│  └── Zcash RPC (shielded transactions) ← NEW                                           │
│                                                                                         │
│  NETWORKS                                                                               │
│  ├── Starknet Sepolia (testnet)                                                        │
│  ├── Starknet Mainnet (production)                                                     │
│  ├── Bitcoin Lightning (instant payments)                                              │
│  └── Zcash (privacy chain)                                                             │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY MODEL                                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  TRUST ASSUMPTIONS                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐    │
│  │ Component          │ Trust Level  │ Notes                                      │    │
│  ├────────────────────┼──────────────┼────────────────────────────────────────────┤    │
│  │ Starknet           │ Trustless    │ Validity proofs to Ethereum                │    │
│  │ Lightning          │ Trustless    │ HTLCs with cryptographic guarantees        │    │
│  │ Zcash              │ Trustless    │ PoW consensus + zk-SNARKs                  │    │
│  │ Atomiq             │ Trustless    │ HTLC-based atomic swaps                    │    │
│  │ Cashu Mint         │ Semi-trusted │ Custodial, but blind signatures            │    │
│  │ FixedFloat         │ Semi-trusted │ Non-custodial swap service                 │    │
│  │ ZK Mixer           │ Trustless    │ On-chain verification, user holds secret   │    │
│  └────────────────────┴──────────────┴────────────────────────────────────────────┘    │
│                                                                                         │
│  ATTACK VECTORS & MITIGATIONS                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────┐    │
│  │ Attack              │ Mitigation                                               │    │
│  ├─────────────────────┼──────────────────────────────────────────────────────────┤    │
│  │ Chain analysis      │ 4 independent privacy layers                            │    │
│  │ Timing correlation  │ Random delays, async flows                              │    │
│  │ Amount correlation  │ Fixed denomination sets                                 │    │
│  │ Graph analysis      │ Multiple hops, mixer anonymity set                      │    │
│  │ Metadata leaks      │ Tor/VPN recommended                                     │    │
│  │ Front-running       │ Commit-reveal scheme in mixer                           │    │
│  │ Double-spend        │ Nullifier tracking in contract                          │    │
│  └─────────────────────┴──────────────────────────────────────────────────────────┘    │
│                                                                                         │
│  CRITICAL USER RESPONSIBILITIES                                                        │
│  • Store mixer secret securely (loss = loss of funds)                                  │
│  • Use z-addresses (not t-addresses) for ZEC                                           │
│  • Use fresh Starknet addresses for withdrawals                                        │
│  • Verify all addresses before confirming transactions                                 │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for the detailed implementation plan.
