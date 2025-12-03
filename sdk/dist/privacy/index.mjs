import { Contract, cairo } from 'starknet';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, randomBytes, hexToBytes } from '@noble/hashes/utils';

// src/privacy/mixer.ts

// src/types.ts
var SLPMError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = "SLPMError";
    this.code = code;
    this.details = details;
  }
};
var PrivacyError = class extends SLPMError {
  constructor(message, details) {
    super(message, "PRIVACY_ERROR", details);
    this.name = "PrivacyError";
  }
};
var ProofError = class extends SLPMError {
  constructor(message, details) {
    super(message, "PROOF_ERROR", details);
    this.name = "ProofError";
  }
};
function randomHex(bytes = 32) {
  return bytesToHex(randomBytes(bytes));
}
function hash(data) {
  const input = typeof data === "string" ? hexToBytes(data.replace("0x", "")) : data;
  return "0x" + bytesToHex(sha256(input));
}
function pedersenHash(a, b) {
  const combined = a.replace("0x", "") + b.replace("0x", "");
  return hash(combined);
}
function poseidonHash(inputs) {
  const combined = inputs.map((x) => x.replace("0x", "")).join("");
  return hash(combined);
}
function generateCommitment(amount) {
  const secret = "0x" + randomHex(32);
  const nullifier = "0x" + randomHex(32);
  const nullifierHash = poseidonHash([nullifier]);
  const amountHex = "0x" + amount.toString(16).padStart(64, "0");
  const commitment = poseidonHash([secret, nullifier, amountHex]);
  return {
    commitment,
    secret,
    nullifier,
    nullifierHash
  };
}
function generateMerkleProof(leaves, leafIndex) {
  const pathElements = [];
  const pathIndices = [];
  let currentLevel = [...leaves];
  let currentIndex = leafIndex;
  while (currentLevel.length > 1) {
    const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
    const sibling = currentLevel[siblingIndex] || currentLevel[currentIndex];
    pathElements.push(sibling);
    pathIndices.push(currentIndex % 2);
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || left;
      nextLevel.push(pedersenHash(left, right));
    }
    currentLevel = nextLevel;
    currentIndex = Math.floor(currentIndex / 2);
  }
  return {
    pathElements,
    pathIndices,
    root: currentLevel[0]
  };
}
function formatAmount(amount, decimals = 18) {
  const str = amount.toString().padStart(decimals + 1, "0");
  const intPart = str.slice(0, -decimals) || "0";
  const decPart = str.slice(-decimals).replace(/0+$/, "");
  return decPart ? `${intPart}.${decPart}` : intPart;
}

// src/constants.ts
var MAINNET_CONTRACTS = {
  MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b"};
var SEPOLIA_CONTRACTS = {
  MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b"};
var MIXER_CONFIG = {
  MIN_DEPOSIT: BigInt("1000000000000000000"),
  // 1 STRK
  MAX_DEPOSIT: BigInt("1000000000000000000000")};

// src/privacy/mixer.ts
var MIXER_ABI = [
  {
    name: "deposit",
    type: "function",
    inputs: [
      { name: "commitment", type: "felt252" },
      { name: "amount", type: "u256" }
    ],
    outputs: []
  },
  {
    name: "withdraw",
    type: "function",
    inputs: [
      { name: "nullifier_hash", type: "felt252" },
      { name: "recipient", type: "ContractAddress" },
      { name: "amount", type: "u256" },
      { name: "proof", type: "Array<felt252>" }
    ],
    outputs: []
  },
  {
    name: "get_merkle_root",
    type: "function",
    inputs: [],
    outputs: [{ type: "felt252" }],
    state_mutability: "view"
  },
  {
    name: "get_anonymity_set_size",
    type: "function",
    inputs: [],
    outputs: [{ type: "u64" }],
    state_mutability: "view"
  },
  {
    name: "is_nullifier_used",
    type: "function",
    inputs: [{ name: "nullifier_hash", type: "felt252" }],
    outputs: [{ type: "bool" }],
    state_mutability: "view"
  },
  {
    name: "get_commitment_at_index",
    type: "function",
    inputs: [{ name: "index", type: "u64" }],
    outputs: [{ type: "felt252" }],
    state_mutability: "view"
  }
];
var PrivacyMixer = class {
  constructor(config, wallet, eventCallback) {
    this.commitments = /* @__PURE__ */ new Map();
    this.config = config;
    this.wallet = wallet;
    this.eventCallback = eventCallback;
    const contracts = config.network === "mainnet" ? MAINNET_CONTRACTS : SEPOLIA_CONTRACTS;
    const contractAddress = config.mixerContractAddress || contracts.MIXER;
    this.contract = new Contract(MIXER_ABI, contractAddress, wallet.provider);
    this.contract.connect(wallet.account);
  }
  // ============================================================================
  // Core Operations
  // ============================================================================
  /**
   * Deposit funds into the privacy mixer
   * 
   * @param params - Deposit parameters
   * @returns Deposit result including commitment (SAVE THIS!)
   */
  async deposit(params) {
    const { amount, tokenAddress } = params;
    if (amount < MIXER_CONFIG.MIN_DEPOSIT) {
      throw new PrivacyError(
        `Minimum deposit is ${formatAmount(MIXER_CONFIG.MIN_DEPOSIT)} STRK`,
        { minDeposit: MIXER_CONFIG.MIN_DEPOSIT.toString() }
      );
    }
    if (amount > MIXER_CONFIG.MAX_DEPOSIT) {
      throw new PrivacyError(
        `Maximum deposit is ${formatAmount(MIXER_CONFIG.MAX_DEPOSIT)} STRK`,
        { maxDeposit: MIXER_CONFIG.MAX_DEPOSIT.toString() }
      );
    }
    this.emit("deposit:started", { amount: amount.toString() });
    try {
      const commitmentData = generateCommitment(amount);
      const commitment = {
        ...commitmentData,
        amount,
        createdAt: Date.now()
      };
      const tx = await this.contract.deposit(
        commitmentData.commitment,
        cairo.uint256(amount)
      );
      const receipt = await this.wallet.provider.waitForTransaction(tx.transaction_hash);
      const leafIndex = this.extractLeafIndex(receipt);
      commitment.leafIndex = leafIndex;
      commitment.depositTxHash = tx.transaction_hash;
      this.commitments.set(commitmentData.commitment, commitment);
      const result = {
        txHash: tx.transaction_hash,
        commitment,
        leafIndex,
        blockNumber: receipt.block_number || 0
      };
      this.emit("deposit:confirmed", { txHash: result.txHash, leafIndex });
      return result;
    } catch (error) {
      this.emit("deposit:failed", { error: String(error) });
      throw new PrivacyError(`Deposit failed: ${error}`, { error: String(error) });
    }
  }
  /**
   * Withdraw funds from the privacy mixer
   * 
   * @param params - Withdrawal parameters including the original commitment
   * @returns Withdrawal result
   */
  async withdraw(params) {
    const { commitment, recipient, amount, relayer, relayerFee } = params;
    this.emit("withdraw:started", { recipient, amount: amount.toString() });
    try {
      const isUsed = await this.isNullifierUsed(commitment.nullifierHash);
      if (isUsed) {
        throw new PrivacyError("This commitment has already been withdrawn");
      }
      this.emit("withdraw:proof-generating", {});
      const merkleProof = await this.getMerkleProof(commitment);
      const zkProof = await this.generateWithdrawProof({
        commitment,
        merkleProof,
        recipient
      });
      this.emit("withdraw:proof-generated", {});
      const tx = await this.contract.withdraw(
        commitment.nullifierHash,
        recipient,
        cairo.uint256(amount),
        zkProof.proof
      );
      await this.wallet.provider.waitForTransaction(tx.transaction_hash);
      const result = {
        txHash: tx.transaction_hash,
        amount,
        recipient,
        nullifierHash: commitment.nullifierHash
      };
      this.emit("withdraw:completed", { txHash: result.txHash, recipient });
      return result;
    } catch (error) {
      this.emit("withdraw:failed", { error: String(error) });
      throw new PrivacyError(`Withdrawal failed: ${error}`, { error: String(error) });
    }
  }
  // ============================================================================
  // Proof Generation
  // ============================================================================
  /**
   * Generate ZK proof for withdrawal
   */
  async generateWithdrawProof(params) {
    const { commitment, merkleProof, recipient } = params;
    try {
      const proof = {
        proof: [
          commitment.nullifierHash,
          merkleProof.root,
          recipient
          // Additional proof elements would be here
        ],
        publicInputs: [
          commitment.nullifierHash,
          merkleProof.root,
          recipient,
          commitment.amount.toString()
        ]
      };
      return proof;
    } catch (error) {
      throw new ProofError(`Failed to generate proof: ${error}`);
    }
  }
  /**
   * Get Merkle proof for a commitment
   */
  async getMerkleProof(commitment) {
    if (commitment.leafIndex === void 0) {
      throw new PrivacyError("Commitment has no leaf index");
    }
    const allCommitments = await this.getAllCommitments();
    const proof = generateMerkleProof(allCommitments, commitment.leafIndex);
    return proof;
  }
  // ============================================================================
  // View Functions
  // ============================================================================
  /**
   * Get current Merkle root
   */
  async getMerkleRoot() {
    const result = await this.contract.get_merkle_root();
    return result.toString();
  }
  /**
   * Get anonymity set size
   */
  async getAnonymitySetSize() {
    const result = await this.contract.get_anonymity_set_size();
    return Number(result);
  }
  /**
   * Check if a nullifier has been used
   */
  async isNullifierUsed(nullifierHash) {
    const result = await this.contract.is_nullifier_used(nullifierHash);
    return Boolean(result);
  }
  /**
   * Get all commitments from the contract
   */
  async getAllCommitments() {
    const size = await this.getAnonymitySetSize();
    const commitments = [];
    for (let i = 0; i < size; i++) {
      const commitment = await this.contract.get_commitment_at_index(i);
      commitments.push(commitment.toString());
    }
    return commitments;
  }
  /**
   * Get mixer statistics
   */
  async getStats() {
    const anonymitySetSize = await this.getAnonymitySetSize();
    return {
      totalDeposits: 0n,
      // Would need to query from events
      totalWithdrawals: 0n,
      anonymitySetSize,
      activeCommitments: anonymitySetSize
    };
  }
  // ============================================================================
  // Commitment Management
  // ============================================================================
  /**
   * Store a commitment locally
   */
  storeCommitment(commitment) {
    this.commitments.set(commitment.commitment, commitment);
  }
  /**
   * Get stored commitment
   */
  getCommitment(commitmentHash) {
    return this.commitments.get(commitmentHash);
  }
  /**
   * List all stored commitments
   */
  listCommitments() {
    return Array.from(this.commitments.values());
  }
  /**
   * Export commitments for backup
   */
  exportCommitments() {
    const data = Array.from(this.commitments.values());
    return JSON.stringify(data, (_, v) => typeof v === "bigint" ? v.toString() : v);
  }
  /**
   * Import commitments from backup
   */
  importCommitments(json) {
    const data = JSON.parse(json);
    for (const c of data) {
      const commitment = {
        ...c,
        amount: BigInt(c.amount)
      };
      this.commitments.set(commitment.commitment, commitment);
    }
  }
  // ============================================================================
  // Private Methods
  // ============================================================================
  extractLeafIndex(receipt) {
    const events = receipt.events || [];
    for (const event of events) {
      if (event.keys?.[0]?.includes("Deposit")) {
        return Number(event.data?.[1] || 0);
      }
    }
    return this.commitments.size;
  }
  emit(type, data) {
    if (this.eventCallback) {
      this.eventCallback({
        type,
        timestamp: Date.now(),
        data
      });
    }
  }
};
var mixer_default = PrivacyMixer;

export { PrivacyMixer, mixer_default as default };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map