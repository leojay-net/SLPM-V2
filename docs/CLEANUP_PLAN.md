# Codebase Cleanup Plan

## Files/Folders to REMOVE

### High Priority (Definitely Remove)

| Path                          | Reason                                     | Size Impact |
| ----------------------------- | ------------------------------------------ | ----------- |
| `quickstart/`                 | Ztarknet example project, not part of SLPM | ~50MB+      |
| `slpm_verifier/`              | Duplicate of `privacy_verifier/`           | ~20MB       |
| `contract/snfoundry.toml.bak` | Backup file                                | Small       |
| `contract/.snfoundry_cache/`  | Cache, can regenerate                      | ~10MB       |

### Scripts to Move (Root → `scripts/`)

| Current Location                   | New Location                     | Reason      |
| ---------------------------------- | -------------------------------- | ----------- |
| `test-cashu-mainnet-standalone.ts` | `scripts/test-cashu-mainnet.ts`  | Organize    |
| `test-local-e2e.js`                | `scripts/test-local-e2e.js`      | Organize    |
| `test-privacy-flow.ts`             | `scripts/test-privacy-flow.ts`   | Organize    |
| `generate-real-proof-test.js`      | `scripts/generate-proof-test.js` | Organize    |
| `build-circuit.sh`                 | `scripts/build-circuit.sh`       | Organize    |
| `deploy-verifier.sh`               | `scripts/deploy-verifier.sh`     | Organize    |
| `Makefile.circuit`                 | DELETE (merge into Makefile)     | Consolidate |

### Docs to Consolidate

| Current Location                 | Action               | Reason      |
| -------------------------------- | -------------------- | ----------- |
| `ENHANCED_PRIVACY_QUICKSTART.md` | Merge into README.md | Consolidate |
| `IMPLEMENTATION_SUMMARY.md`      | Move to `docs/`      | Organize    |
| `README_ENHANCED.md`             | Merge into README.md | Duplicate   |
| `TESTING_CHECKLIST.md`           | Move to `docs/`      | Organize    |
| `TESTING_GUIDE.md`               | Move to `docs/`      | Organize    |
| `TESTING_STATUS.md`              | Move to `docs/`      | Organize    |
| `UPGRADE.md`                     | Move to `docs/`      | Organize    |
| `QUICK_START.md`                 | Merge into README.md | Consolidate |
| `DOCUMENTATION_INDEX.md`         | Update in `docs/`    | Organize    |

### Config Files to Move

| Current Location        | New Location                     | Reason                 |
| ----------------------- | -------------------------------- | ---------------------- |
| `deployed_verifier.env` | `contract/deployed_verifier.env` | Belongs with contracts |

---

## Files to KEEP (Important!)

### Core Application
- `src/` - All frontend and integration code
- `circuit/` - Noir ZK circuit
- `contract/` - Cairo smart contracts
- `privacy_verifier/` - Garaga verifier (keep ONE)
- `docs/` - Documentation

### Configuration
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `.tool-versions`
- `next-env.d.ts`

### Static Assets
- `public/`

---

## Cleanup Commands

Run these commands in order:

```bash
# 1. Remove quickstart folder (Ztarknet example)
rm -rf quickstart/

# 2. Remove duplicate verifier
rm -rf slpm_verifier/

# 3. Remove backup files
rm -f contract/snfoundry.toml.bak

# 4. Clear cache (optional, regenerates)
rm -rf contract/.snfoundry_cache/

# 5. Move scripts to scripts folder
mkdir -p scripts
mv test-cashu-mainnet-standalone.ts scripts/test-cashu-mainnet.ts
mv test-local-e2e.js scripts/test-local-e2e.js
mv test-privacy-flow.ts scripts/test-privacy-flow.ts
mv generate-real-proof-test.js scripts/generate-proof-test.js
mv build-circuit.sh scripts/build-circuit.sh
mv deploy-verifier.sh scripts/deploy-verifier.sh
rm -f Makefile.circuit

# 6. Move docs
mv TESTING_CHECKLIST.md docs/
mv TESTING_GUIDE.md docs/
mv TESTING_STATUS.md docs/
mv UPGRADE.md docs/
mv IMPLEMENTATION_SUMMARY.md docs/

# 7. Move config
mv deployed_verifier.env contract/

# 8. Clean up duplicate READMEs (after merging content)
rm -f ENHANCED_PRIVACY_QUICKSTART.md
rm -f README_ENHANCED.md
rm -f QUICK_START.md
rm -f DOCUMENTATION_INDEX.md
```

---

## After Cleanup - Expected Structure

```
SLPM-enhanced/
├── circuit/                    # Noir ZK circuits
├── contract/                   # Cairo smart contracts
├── privacy_verifier/           # Garaga verifier
├── docs/                       # All documentation
├── scripts/                    # Build/test scripts
├── src/                        # Frontend & Services
├── public/                     # Static assets
├── node_modules/               # Dependencies
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── next.config.ts
├── next-env.d.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── .tool-versions
├── .gitignore
└── README.md                   # Single comprehensive README
```

---

## Space Savings Estimate

| Removed             | Estimated Size |
| ------------------- | -------------- |
| `quickstart/`       | ~50 MB         |
| `slpm_verifier/`    | ~20 MB         |
| `.snfoundry_cache/` | ~10 MB         |
| Misc files          | ~1 MB          |
| **Total**           | **~80 MB**     |

---

## Verification Checklist

After cleanup, verify:

- [ ] `npm run dev` still works
- [ ] `npm run build` still works
- [ ] `cd circuit && nargo compile` still works
- [ ] `cd contract && scarb build` still works
- [ ] `cd privacy_verifier && scarb build` still works
- [ ] All imports resolve correctly
- [ ] No broken links in documentation
