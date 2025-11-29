# SLPM Cross-Chain Implementation Roadmap

## Current State Analysis

### What We Have ✅

| Component                  | Location                                    | Status                   |
| -------------------------- | ------------------------------------------- | ------------------------ |
| **Privacy Mixer Contract** | `contract/src/enhanced_privacy_mixer.cairo` | Deployed on Ztarknet     |
| **ZK Verifier**            | `privacy_verifier/`                         | Deployed on Ztarknet     |
| **Noir Circuit**           | `circuit/`                                  | Working, proofs verified |
| **Atomiq Integration**     | `src/integrations/swaps/atomiq.ts`          | Working                  |
| **Cashu Integration**      | `src/integrations/cashu/`                   | Working                  |
| **Lightning Client**       | `src/integrations/lightning/`               | Working                  |
| **Orchestrator**           | `src/orchestrator/`                         | Working                  |
| **Frontend**               | `src/app/`, `src/components/`               | Working                  |

### What We Need to Add 🔨

| Component                           | Priority | Complexity |
| ----------------------------------- | -------- | ---------- |
| **ZEC ↔ Lightning Swap Service**    | HIGH     | Medium     |
| **Zcash RPC Integration**           | HIGH     | Medium     |
| **Cross-Chain Bridge Orchestrator** | HIGH     | High       |
| **Cross-Chain UI Components**       | MEDIUM   | Medium     |
| **End-to-End Tests**                | MEDIUM   | Low        |

### What We Can Remove 🗑️

| Item                      | Reason                               |
| ------------------------- | ------------------------------------ |
| `quickstart/`             | Ztarknet example project, not needed |
| `slpm_verifier/`          | Duplicate of `privacy_verifier/`     |
| `*.bak` files             | Backup files                         |
| Ztarknet-specific configs | Moving to regular Starknet           |
| Test scripts in root      | Should be in `scripts/`              |

---

## Implementation Phases

### Phase 1: Codebase Cleanup (Day 1)
**Goal**: Remove unnecessary files and organize structure

#### Tasks:
- [ ] Remove `quickstart/` folder (Ztarknet example)
- [ ] Remove `slpm_verifier/` (duplicate verifier)
- [ ] Remove/archive Ztarknet-specific files
- [ ] Move root test scripts to `scripts/`
- [ ] Clean up duplicate README files
- [ ] Update `.gitignore`

#### Files to Remove:
```
quickstart/                          # Ztarknet quickstart example
slpm_verifier/                       # Duplicate verifier
contract/snfoundry.toml.bak         # Backup file
test-cashu-mainnet-standalone.ts    # Move to scripts/
test-local-e2e.js                   # Move to scripts/
test-privacy-flow.ts                # Move to scripts/
generate-real-proof-test.js         # Move to scripts/
build-circuit.sh                    # Move to scripts/
deploy-verifier.sh                  # Move to scripts/
Makefile.circuit                    # Consolidate with main Makefile
deployed_verifier.env               # Move to contract/
ENHANCED_PRIVACY_QUICKSTART.md      # Consolidate docs
IMPLEMENTATION_SUMMARY.md           # Consolidate docs
README_ENHANCED.md                  # Consolidate into README.md
TESTING_CHECKLIST.md                # Move to docs/
TESTING_GUIDE.md                    # Move to docs/
TESTING_STATUS.md                   # Move to docs/
UPGRADE.md                          # Move to docs/
```

---

### Phase 2: ZEC ↔ Lightning Integration (Days 2-3)
**Goal**: Enable ZEC to Lightning swaps

#### Tasks:
- [ ] Create `src/integrations/zcash/` module
- [ ] Implement FixedFloat API client
- [ ] Implement SideShift API client (backup)
- [ ] Add swap quote fetching
- [ ] Add swap order creation
- [ ] Add swap status polling
- [ ] Write unit tests

#### Files to Create:
```
src/integrations/zcash/
├── index.ts                    # Module exports
├── types.ts                    # ZEC-specific types
├── swap-service.ts             # FixedFloat/SideShift API
├── client.ts                   # Zcash RPC client (optional)
└── utils.ts                    # Address validation, etc.
```

#### API Integration:
```typescript
// src/integrations/zcash/swap-service.ts
export class ZecSwapService {
  // Get quote: ZEC → Lightning
  async getZecToLnQuote(zecAmount: number): Promise<SwapQuote>
  
  // Get quote: Lightning → ZEC
  async getLnToZecQuote(satoshis: number): Promise<SwapQuote>
  
  // Create swap: ZEC → Lightning
  async createZecToLnSwap(zecAmount: number, lnInvoice: string): Promise<SwapOrder>
  
  // Create swap: Lightning → ZEC
  async createLnToZecSwap(satoshis: number, zecAddress: string): Promise<SwapOrder>
  
  // Check swap status
  async getSwapStatus(orderId: string): Promise<SwapStatus>
}
```

---

### Phase 3: Cross-Chain Bridge (Days 4-5)
**Goal**: Orchestrate full ZEC ↔ STRK flows

#### Tasks:
- [ ] Create `src/integrations/cross-chain/` module
- [ ] Implement ZEC → STRK flow
- [ ] Implement STRK → ZEC flow
- [ ] Integrate with existing orchestrator
- [ ] Add progress tracking
- [ ] Handle error recovery
- [ ] Write integration tests

#### Files to Create:
```
src/integrations/cross-chain/
├── index.ts                    # Module exports
├── types.ts                    # Cross-chain types
├── bridge.ts                   # Main bridge orchestrator
├── zec-to-strk.ts              # ZEC → STRK flow
├── strk-to-zec.ts              # STRK → ZEC flow
└── state-machine.ts            # Flow state management
```

#### Flow Implementation:
```typescript
// src/integrations/cross-chain/bridge.ts
export class CrossChainBridge {
  // ZEC → STRK (private)
  async zecToStrk(params: {
    zecAmount: number;
    recipientAddress: string;
    useCashuFlow?: boolean;
    onProgress?: (step: Step) => void;
  }): Promise<CrossChainTransfer>
  
  // STRK → ZEC (private)
  async strkToZec(params: {
    strkAmount: bigint;
    zecAddress: string;  // Use z-address!
    useCashuFlow?: boolean;
    onProgress?: (step: Step) => void;
  }): Promise<CrossChainTransfer>
}
```

---

### Phase 4: Frontend Integration (Days 6-7)
**Goal**: Add cross-chain UI components

#### Tasks:
- [ ] Create cross-chain page `/app/cross-chain/page.tsx`
- [ ] Create ZEC ↔ STRK swap form component
- [ ] Add progress stepper for multi-step flow
- [ ] Add transaction history view
- [ ] Update navigation
- [ ] Add error handling UI

#### Files to Create/Modify:
```
src/app/cross-chain/
├── page.tsx                    # Main cross-chain page
└── layout.tsx                  # Layout wrapper

src/components/cross-chain/
├── SwapForm.tsx                # ZEC ↔ STRK form
├── FlowStepper.tsx             # Multi-step progress
├── QuoteDisplay.tsx            # Show exchange rates
├── TransferHistory.tsx         # Past transfers
└── AddressInput.tsx            # Z-address input with validation
```

#### UI Flow:
```
┌─────────────────────────────────────────────────────────────┐
│                    Cross-Chain Transfer                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  From: [ZEC ▼]  Amount: [________]                          │
│  To:   [STRK ▼] You receive: ~X STRK                        │
│                                                              │
│  [ ] Use Cashu flow (extra privacy)                         │
│                                                              │
│  Recipient Address:                                          │
│  [0x...                                              ]       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Exchange Rate: 1 ZEC ≈ 0.015 BTC ≈ X STRK          │     │
│  │ Network Fee: ~$X.XX                                 │     │
│  │ Privacy Layers: 4 (ZEC→LN→Mixer→Cashu)             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│              [Start Private Transfer]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Mainnet Preparation (Days 8-9)
**Goal**: Prepare for production deployment

#### Tasks:
- [ ] Deploy contracts to Starknet Mainnet
- [ ] Update contract addresses in config
- [ ] Set up production RPC endpoints
- [ ] Configure mainnet Atomiq
- [ ] Add mainnet Cashu mints
- [ ] Security review
- [ ] Documentation update

#### Configuration Updates:
```typescript
// src/config/constants.ts
export const NETWORKS = {
  mainnet: {
    rpcUrl: 'https://starknet-mainnet...',
    mixerAddress: '0x...',
    verifierAddress: '0x...',
    strkToken: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  },
  testnet: {
    rpcUrl: 'https://starknet-sepolia...',
    mixerAddress: '0x03c4e5b7f9f1156eca95382594b3ee561cf8f78f1b36794030d2c763af083aa0',
    verifierAddress: '0x07b7149cd3b79e9568f21cca07057ae5baff9611b5bb7a2af746338635d81a56',
    strkToken: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  },
};
```

---

### Phase 6: Testing & Launch (Day 10)
**Goal**: Comprehensive testing and launch

#### Tasks:
- [ ] End-to-end testing on testnet
- [ ] Small amount testing on mainnet
- [ ] Load testing
- [ ] Document all flows
- [ ] Create user guide
- [ ] Launch announcement

---

## Detailed File Structure (Target)

```
SLPM-enhanced/
├── circuit/                          # Noir ZK circuits
│   ├── src/
│   │   ├── main.nr                   # Main circuit
│   │   └── lib.nr                    # Library
│   ├── target/                       # Compiled outputs
│   ├── Nargo.toml
│   └── Prover.toml
│
├── contract/                         # Cairo smart contracts
│   ├── src/
│   │   ├── enhanced_privacy_mixer.cairo
│   │   └── lib.cairo
│   ├── tests/
│   ├── target/
│   ├── Scarb.toml
│   └── snfoundry.toml
│
├── privacy_verifier/                 # Garaga ZK verifier
│   ├── src/
│   │   ├── honk_verifier.cairo
│   │   └── lib.cairo
│   ├── target/
│   └── Scarb.toml
│
├── docs/                             # Documentation
│   ├── CROSS_CHAIN_ARCHITECTURE.md   # This file
│   ├── IMPLEMENTATION_ROADMAP.md     # Implementation plan
│   ├── MIXER_ARCHITECTURE.md
│   ├── NOIR_INTEGRATION.md
│   └── TESTING_GUIDE.md
│
├── scripts/                          # Build/test scripts
│   ├── build-circuit.sh
│   ├── deploy-contracts.sh
│   ├── test-cross-chain.ts
│   └── test-e2e.ts
│
├── src/                              # Frontend & Services
│   ├── app/                          # Next.js pages
│   │   ├── page.tsx
│   │   ├── mixer/
│   │   └── cross-chain/              # NEW
│   │       └── page.tsx
│   │
│   ├── components/                   # React components
│   │   ├── mixer/
│   │   └── cross-chain/              # NEW
│   │       ├── SwapForm.tsx
│   │       ├── FlowStepper.tsx
│   │       └── QuoteDisplay.tsx
│   │
│   ├── integrations/                 # External services
│   │   ├── atomiq/                   # Atomiq SDK wrapper
│   │   │   └── atomiq.ts
│   │   ├── cashu/                    # Cashu integration
│   │   │   ├── client.ts
│   │   │   └── direct.ts
│   │   ├── lightning/                # Lightning client
│   │   │   └── client.ts
│   │   ├── starknet/                 # Starknet integration
│   │   │   ├── enhanced-mixer.ts
│   │   │   └── wallet.ts
│   │   ├── zcash/                    # NEW: ZEC integration
│   │   │   ├── index.ts
│   │   │   ├── swap-service.ts
│   │   │   └── types.ts
│   │   └── cross-chain/              # NEW: Cross-chain bridge
│   │       ├── index.ts
│   │       ├── bridge.ts
│   │       ├── zec-to-strk.ts
│   │       └── strk-to-zec.ts
│   │
│   ├── orchestrator/                 # Flow orchestration
│   │   ├── index.ts
│   │   └── steps/
│   │
│   ├── crypto/                       # Cryptography
│   │   ├── bdhke.ts
│   │   └── noir-proof.ts
│   │
│   └── config/                       # Configuration
│       ├── constants.ts
│       └── env.ts
│
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Quick Start Commands

After cleanup, these should be the main commands:

```bash
# Install dependencies
npm install

# Build ZK circuit
cd circuit && nargo compile && cd ..

# Build contracts
cd contract && scarb build && cd ..

# Run tests
cd contract && snforge test && cd ..

# Start dev server
npm run dev

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

---

## Environment Variables

```bash
# .env.local

# Starknet
NEXT_PUBLIC_STARKNET_RPC=https://starknet-sepolia.g.alchemy.com/...
NEXT_PUBLIC_MIXER_ADDRESS=0x03c4e5b7f9f1156eca95382594b3ee561cf8f78f1b36794030d2c763af083aa0
NEXT_PUBLIC_VERIFIER_ADDRESS=0x07b7149cd3b79e9568f21cca07057ae5baff9611b5bb7a2af746338635d81a56

# Atomiq
NEXT_PUBLIC_ATOMIQ_ENV=testnet

# Cashu
CASHU_MINT_URL=https://mint.example.com

# ZEC Swap Service (FixedFloat)
FIXEDFLOAT_API_KEY=your-api-key
FIXEDFLOAT_API_SECRET=your-api-secret

# Lightning (optional, for direct node)
LND_REST_HOST=localhost:8080
LND_MACAROON=...
```

---

## Risk Mitigation

| Risk                     | Mitigation                            |
| ------------------------ | ------------------------------------- |
| FixedFloat API down      | Implement SideShift as fallback       |
| ZEC tx confirmation slow | UI shows progress, allow cancellation |
| User loses mixer secret  | Strong warning, backup prompts        |
| Swap rate changes        | Lock rate with quotes, set slippage   |
| Network fees spike       | Show fee estimate before confirmation |

---

## Success Metrics

- [ ] ZEC → STRK flow completes in < 30 min
- [ ] STRK → ZEC flow completes in < 30 min
- [ ] < 1% failure rate on swaps
- [ ] All 4 privacy layers active
- [ ] Gas cost < $5 for full flow
- [ ] Mobile-responsive UI

---

## Timeline Summary

| Phase                 | Duration    | Deliverable             |
| --------------------- | ----------- | ----------------------- |
| 1. Cleanup            | 1 day       | Clean codebase          |
| 2. ZEC Integration    | 2 days      | ZEC ↔ Lightning swaps   |
| 3. Cross-Chain Bridge | 2 days      | Full flow orchestration |
| 4. Frontend           | 2 days      | Cross-chain UI          |
| 5. Mainnet Prep       | 2 days      | Production deployment   |
| 6. Testing & Launch   | 1 day       | Go live                 |
| **Total**             | **10 days** | **Production ready**    |

---

## Next Action

Start with **Phase 1: Codebase Cleanup** - see the list of files to remove above.
