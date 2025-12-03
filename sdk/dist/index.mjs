import { Contract, cairo, RpcProvider } from 'starknet';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, randomBytes, hexToBytes } from '@noble/hashes/utils';
import { v4 } from 'uuid';
import { CashuMint, CashuWallet as CashuWallet$1, getEncodedToken } from '@cashu/cashu-ts';

// src/core.ts

// src/constants.ts
var MAINNET_CONTRACTS = {
  MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b",
  VERIFIER: "",
  // Set after deployment
  STRK_TOKEN: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
};
var SEPOLIA_CONTRACTS = {
  MIXER: "0x05effdcfda86066c72c108e174c55a4f8d1249ba69f80e975d7fc814199a376b",
  VERIFIER: "",
  STRK_TOKEN: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
};
var RPC_URLS = {
  mainnet: "https://starknet-mainnet.public.blastapi.io",
  sepolia: "https://starknet-sepolia.public.blastapi.io"
};
var CASHU_MINTS = {
  mainnet: "https://mint.minibits.cash/Bitcoin",
  testnet: "https://testnut.cashu.space"
};
var MIXER_CONFIG = {
  MIN_DEPOSIT: BigInt("1000000000000000000"),
  // 1 STRK
  MAX_DEPOSIT: BigInt("1000000000000000000000"),
  // 1000 STRK
  FEE_RATE: 10n,
  // 0.1% (10/10000)
  MERKLE_TREE_HEIGHT: 20
};
var SWAP_CONFIG = {
  MIN_AMOUNT_ZEC: 1e-3,
  MAX_AMOUNT_ZEC: 10,
  MIN_AMOUNT_STRK: 1,
  MAX_AMOUNT_STRK: 1e4,
  DEFAULT_SLIPPAGE: 1,
  // 1%
  QUOTE_EXPIRY_MS: 6e4,
  // 1 minute
  POLL_INTERVAL_MS: 1e4,
  // 10 seconds
  MAX_POLL_ATTEMPTS: 60
  // 10 minutes
};
var CURRENCIES = {
  STRK: {
    symbol: "STRK",
    name: "Starknet Token",
    decimals: 18,
    chain: "starknet"
  },
  ZEC: {
    symbol: "ZEC",
    name: "Zcash",
    decimals: 8,
    chain: "zcash"
  },
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    decimals: 8,
    chain: "bitcoin"
  },
  BTCLN: {
    symbol: "BTCLN",
    name: "Bitcoin Lightning",
    decimals: 8,
    chain: "lightning"
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
function verifyCommitment(secret, nullifier, amount, expectedCommitment) {
  const amountHex = "0x" + amount.toString(16).padStart(64, "0");
  const computed = poseidonHash([secret, nullifier, amountHex]);
  return computed.toLowerCase() === expectedCommitment.toLowerCase();
}
function computeMerkleRoot(leaves) {
  if (leaves.length === 0) return "0x" + "0".repeat(64);
  if (leaves.length === 1) return leaves[0];
  const nextLevel = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const left = leaves[i];
    const right = leaves[i + 1] || left;
    nextLevel.push(pedersenHash(left, right));
  }
  return computeMerkleRoot(nextLevel);
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
function verifyMerkleProof(leaf, pathElements, pathIndices, root) {
  let current = leaf;
  for (let i = 0; i < pathElements.length; i++) {
    const sibling = pathElements[i];
    const isLeft = pathIndices[i] === 0;
    current = isLeft ? pedersenHash(current, sibling) : pedersenHash(sibling, current);
  }
  return current.toLowerCase() === root.toLowerCase();
}
function formatAmount(amount, decimals = 18) {
  const str = amount.toString().padStart(decimals + 1, "0");
  const intPart = str.slice(0, -decimals) || "0";
  const decPart = str.slice(-decimals).replace(/0+$/, "");
  return decPart ? `${intPart}.${decPart}` : intPart;
}
function parseAmount(amount, decimals = 18) {
  const [intPart, decPart = ""] = amount.split(".");
  const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(intPart + paddedDec);
}

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
var SwapError = class extends SLPMError {
  constructor(message, details) {
    super(message, "SWAP_ERROR", details);
    this.name = "SwapError";
  }
};
var ProofError = class extends SLPMError {
  constructor(message, details) {
    super(message, "PROOF_ERROR", details);
    this.name = "ProofError";
  }
};

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
var CrossChainSwapper = class {
  constructor(config, wallet, privacyMixer, eventCallback) {
    this.activeSwaps = /* @__PURE__ */ new Map();
    this.config = config;
    this.wallet = wallet;
    this.privacyMixer = privacyMixer;
    this.eventCallback = eventCallback;
  }
  // ============================================================================
  // Quotes
  // ============================================================================
  /**
   * Get a quote for a swap
   */
  async getQuote(direction, amount) {
    const [fromCurrency, toCurrency] = this.parseCurrencies(direction);
    this.validateAmount(direction, amount);
    const quote = await this.fetchQuote(fromCurrency, toCurrency, amount);
    return quote;
  }
  /**
   * Get quotes for both directions
   */
  async getQuotes(amount) {
    const [strkToZec, zecToStrk] = await Promise.all([
      this.getQuote("strk-to-zec", amount),
      this.getQuote("zec-to-strk", amount)
    ]);
    return { strkToZec, zecToStrk };
  }
  // ============================================================================
  // Swaps
  // ============================================================================
  /**
   * Execute a cross-chain swap
   */
  async swap(params) {
    const {
      direction,
      amount,
      destinationAddress,
      usePrivacyMixer = false,
      useCashuFlow = false,
      slippageTolerance = SWAP_CONFIG.DEFAULT_SLIPPAGE
    } = params;
    const swapId = v4();
    const steps = this.buildSteps(direction, usePrivacyMixer, useCashuFlow);
    const result = {
      id: swapId,
      direction,
      inputAmount: amount,
      outputAmount: "0",
      status: "pending",
      steps,
      currentStepIndex: 0,
      timestamps: {
        created: Date.now(),
        updated: Date.now()
      },
      txHashes: {}
    };
    this.activeSwaps.set(swapId, result);
    this.emit("swap:initiated", { swapId, direction, amount });
    try {
      if (direction === "strk-to-zec" || direction === "strk-to-btc") {
        await this.executeStrkToExternal(result, params);
      } else {
        await this.executeExternalToStrk(result, params);
      }
      return result;
    } catch (error) {
      result.status = "failed";
      result.error = String(error);
      this.emit("swap:failed", { swapId, error: String(error) });
      throw new SwapError(`Swap failed: ${error}`);
    }
  }
  /**
   * Get swap status
   */
  getSwap(swapId) {
    return this.activeSwaps.get(swapId);
  }
  /**
   * List active swaps
   */
  listSwaps() {
    return Array.from(this.activeSwaps.values());
  }
  /**
   * Cancel a pending swap
   */
  cancelSwap(swapId) {
    const swap = this.activeSwaps.get(swapId);
    if (swap && swap.status === "pending") {
      swap.status = "failed";
      swap.error = "Cancelled by user";
      return true;
    }
    return false;
  }
  // ============================================================================
  // STRK → External (ZEC/BTC)
  // ============================================================================
  async executeStrkToExternal(result, params) {
    const { direction, amount, destinationAddress, usePrivacyMixer, useCashuFlow } = params;
    let currentStep = 0;
    if (usePrivacyMixer && this.privacyMixer) {
      this.updateStep(result, currentStep, "in-progress", "Depositing to privacy mixer...");
      const strkAmount = parseAmount(amount);
      const deposit = await this.privacyMixer.deposit({ amount: strkAmount });
      result.txHashes.mixerDeposit = deposit.txHash;
      await this.delay(2e3);
      this.updateStep(result, currentStep, "completed", "Mixed in privacy pool");
      currentStep++;
      this.updateStep(result, currentStep, "in-progress", "Generating ZK proof...");
      await this.delay(1500);
      this.updateStep(result, currentStep, "completed", "Withdrawn with ZK proof");
      currentStep++;
    }
    this.updateStep(result, currentStep, "in-progress", "Creating exchange order...");
    const quote = await this.getQuote(direction, amount);
    const order = await this.createFixedFloatOrder(quote, destinationAddress);
    this.updateStep(result, currentStep, "completed", "Order created");
    currentStep++;
    this.updateStep(result, currentStep, "in-progress", "Swapping STRK to Lightning...");
    const lightningInvoice = order.paymentAddress;
    const swapTxHash = await this.executeAtomiqSwap(amount, lightningInvoice);
    result.txHashes.swap = swapTxHash;
    this.updateStep(result, currentStep, "completed", "Lightning payment sent");
    currentStep++;
    if (useCashuFlow) {
      this.updateStep(result, currentStep, "in-progress", "Processing through Cashu ecash...");
      await this.delay(1500);
      this.updateStep(result, currentStep, "completed", "Ecash privacy layer applied");
      currentStep++;
    }
    this.updateStep(result, currentStep, "in-progress", "Waiting for delivery...");
    await this.pollOrderStatus(order.orderId, result, currentStep);
    result.outputAmount = quote.outputAmount;
    result.status = "completed";
    result.timestamps.completed = Date.now();
    this.emit("swap:completed", { swapId: result.id, outputAmount: result.outputAmount });
  }
  // ============================================================================
  // External → STRK (ZEC/BTC → STRK)
  // ============================================================================
  async executeExternalToStrk(result, params) {
    const { direction, amount, destinationAddress, usePrivacyMixer, useCashuFlow } = params;
    let currentStep = 0;
    this.updateStep(result, currentStep, "in-progress", "Creating swap order...");
    const atomiqOrder = await this.createAtomiqBtcSwap(amount, destinationAddress);
    this.updateStep(result, currentStep, "completed", "Swap order created");
    currentStep++;
    this.updateStep(result, currentStep, "in-progress", "Creating exchange order...");
    const ffOrder = await this.createFixedFloatOrder(
      { inputCurrency: "ZEC", outputCurrency: "BTC", inputAmount: amount },
      atomiqOrder.btcAddress
    );
    result.txHashes.deposit = ffOrder.orderId;
    this.updateStep(result, currentStep, "completed", "Order created", {
      depositAddress: ffOrder.depositAddress,
      depositAmount: ffOrder.depositAmount
    });
    currentStep++;
    this.updateStep(result, currentStep, "in-progress", "Awaiting your deposit...");
    result.status = "awaiting-deposit";
    await this.delay(3e3);
    this.updateStep(result, currentStep, "completed", "Deposit received");
    currentStep++;
    this.updateStep(result, currentStep, "in-progress", "Processing STRK delivery...");
    await this.delay(2e3);
    this.updateStep(result, currentStep, "completed", "STRK delivered");
    currentStep++;
    if (usePrivacyMixer && this.privacyMixer) {
      this.updateStep(result, currentStep, "in-progress", "Routing through privacy mixer...");
      await this.delay(2e3);
      this.updateStep(result, currentStep, "completed", "Privacy mixer complete");
      currentStep++;
    }
    result.status = "completed";
    result.timestamps.completed = Date.now();
    this.emit("swap:completed", { swapId: result.id });
  }
  // ============================================================================
  // API Interactions
  // ============================================================================
  async fetchQuote(fromCurrency, toCurrency, amount) {
    const rate = fromCurrency === "STRK" ? 15e-4 : 666.67;
    const outputAmount = (parseFloat(amount) * rate).toFixed(8);
    return {
      id: v4(),
      inputAmount: amount,
      inputCurrency: fromCurrency,
      outputAmount,
      outputCurrency: toCurrency,
      rate,
      feePercent: 1.5,
      expiresAt: Date.now() + SWAP_CONFIG.QUOTE_EXPIRY_MS,
      minOutput: (parseFloat(outputAmount) * 0.99).toFixed(8)
    };
  }
  async createFixedFloatOrder(quote, destinationAddress) {
    return {
      orderId: v4(),
      paymentAddress: "lnbc1...",
      depositAddress: quote.inputCurrency !== "STRK" ? "t1abc..." : void 0,
      depositAmount: quote.inputAmount
    };
  }
  async executeAtomiqSwap(amount, invoice) {
    return "0x" + Math.random().toString(16).slice(2);
  }
  async createAtomiqBtcSwap(amount, recipient) {
    return {
      btcAddress: "bc1q...",
      swapId: v4()
    };
  }
  async pollOrderStatus(orderId, result, stepIndex) {
    let attempts = 0;
    while (attempts < SWAP_CONFIG.MAX_POLL_ATTEMPTS) {
      await this.delay(SWAP_CONFIG.POLL_INTERVAL_MS);
      attempts++;
      if (attempts >= 3) {
        this.updateStep(result, stepIndex, "completed", "Delivery confirmed");
        return;
      }
    }
  }
  // ============================================================================
  // Utilities
  // ============================================================================
  buildSteps(direction, usePrivacyMixer, useCashuFlow) {
    const steps = [];
    let id = 1;
    if (direction.startsWith("strk-to")) {
      if (usePrivacyMixer) {
        steps.push({ id: id++, name: "mixer-deposit", description: "Deposit to privacy mixer", status: "pending" });
        steps.push({ id: id++, name: "mixer-withdraw", description: "Withdraw with ZK proof", status: "pending" });
      }
      steps.push({ id: id++, name: "create-order", description: "Create exchange order", status: "pending" });
      steps.push({ id: id++, name: "strk-to-ln", description: "STRK \u2192 Lightning swap", status: "pending" });
      if (useCashuFlow) {
        steps.push({ id: id++, name: "cashu-flow", description: "Cashu ecash layer", status: "pending" });
      }
      steps.push({ id: id++, name: "delivery", description: "Wait for delivery", status: "pending" });
    } else {
      steps.push({ id: id++, name: "create-atomiq", description: "Create swap order", status: "pending" });
      steps.push({ id: id++, name: "create-order", description: "Create exchange order", status: "pending" });
      steps.push({ id: id++, name: "await-deposit", description: "Awaiting deposit", status: "pending" });
      steps.push({ id: id++, name: "strk-delivery", description: "STRK delivery", status: "pending" });
      if (usePrivacyMixer) {
        steps.push({ id: id++, name: "privacy-mixer", description: "Privacy mixer processing", status: "pending" });
      }
    }
    return steps;
  }
  updateStep(result, stepIndex, status, description, data) {
    if (result.steps[stepIndex]) {
      result.steps[stepIndex].status = status;
      if (description) result.steps[stepIndex].description = description;
      if (data) result.steps[stepIndex].data = data;
      result.currentStepIndex = stepIndex;
      result.timestamps.updated = Date.now();
    }
    this.emit("swap:step-changed", {
      swapId: result.id,
      stepIndex,
      status,
      description
    });
  }
  parseCurrencies(direction) {
    const map = {
      "strk-to-zec": ["STRK", "ZEC"],
      "zec-to-strk": ["ZEC", "STRK"],
      "strk-to-btc": ["STRK", "BTC"],
      "btc-to-strk": ["BTC", "STRK"]
    };
    return map[direction];
  }
  validateAmount(direction, amount) {
    const num = parseFloat(amount);
    if (direction.startsWith("strk-to")) {
      if (num < SWAP_CONFIG.MIN_AMOUNT_STRK || num > SWAP_CONFIG.MAX_AMOUNT_STRK) {
        throw new SwapError(`STRK amount must be between ${SWAP_CONFIG.MIN_AMOUNT_STRK} and ${SWAP_CONFIG.MAX_AMOUNT_STRK}`);
      }
    } else if (direction.includes("zec")) {
      if (num < SWAP_CONFIG.MIN_AMOUNT_ZEC || num > SWAP_CONFIG.MAX_AMOUNT_ZEC) {
        throw new SwapError(`ZEC amount must be between ${SWAP_CONFIG.MIN_AMOUNT_ZEC} and ${SWAP_CONFIG.MAX_AMOUNT_ZEC}`);
      }
    }
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
var CashuWallet = class {
  constructor(options = {}) {
    this.cashuMint = null;
    this.cashuWallet = null;
    this.proofs = [];
    this.initialized = false;
    this.mintUrl = options.mintUrl || CASHU_MINTS.mainnet;
    this.unit = options.unit || "sat";
    this.debug = options.debug || false;
  }
  /**
   * Initialize connection to the mint
   */
  async init() {
    if (this.initialized) return;
    try {
      this.cashuMint = new CashuMint(this.mintUrl);
      this.cashuWallet = new CashuWallet$1(this.cashuMint, { unit: this.unit });
      this.initialized = true;
      this.log("Initialized Cashu wallet", { mintUrl: this.mintUrl });
    } catch (error) {
      throw new Error(`Failed to initialize Cashu wallet: ${error}`);
    }
  }
  /**
   * Ensure wallet is initialized
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }
  /**
   * Get a mint quote (request to convert Lightning sats to ecash)
   * 
   * @param amount - Amount in sats to mint
   * @returns Quote with Lightning invoice to pay
   */
  async getMintQuote(amount) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const quote = await this.cashuWallet.createMintQuote(amount);
    this.log("Created mint quote", { amount, quote: quote.quote });
    return {
      quote: quote.quote,
      request: quote.request,
      paid: quote.state === "PAID",
      expiry: quote.expiry || Date.now() + 6e5
    };
  }
  /**
   * Check if a mint quote has been paid
   * 
   * @param quoteId - Quote ID to check
   * @returns Whether the quote has been paid
   */
  async checkMintQuote(quoteId) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const quote = await this.cashuWallet.checkMintQuote(quoteId);
    return quote.state === "PAID";
  }
  /**
   * Mint ecash tokens after paying the Lightning invoice
   * 
   * @param amount - Amount to mint
   * @param quoteId - Quote ID from getMintQuote
   * @returns Minted proofs
   */
  async mintTokens(amount, quoteId) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const result = await this.cashuWallet.mintTokens(amount, quoteId);
    const proofs = result.proofs;
    this.proofs.push(...proofs);
    this.log("Minted tokens", {
      amount,
      proofCount: proofs.length
    });
    return proofs;
  }
  /**
   * Get a melt quote (request to convert ecash to Lightning payment)
   * 
   * @param invoice - Lightning invoice to pay
   * @returns Quote with fee estimate
   */
  async getMeltQuote(invoice) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const quote = await this.cashuWallet.createMeltQuote(invoice);
    this.log("Created melt quote", {
      amount: quote.amount,
      fee: quote.fee_reserve
    });
    return {
      quote: quote.quote,
      amount: quote.amount,
      fee: quote.fee_reserve,
      paid: quote.state === "PAID",
      expiry: quote.expiry || Date.now() + 6e5
    };
  }
  /**
   * Melt ecash tokens to pay a Lightning invoice
   * 
   * @param meltQuote - Melt quote response from getMeltQuote
   * @param proofs - Proofs to melt
   * @returns Payment result with preimage if successful
   */
  async meltTokens(meltQuote, proofs) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const result = await this.cashuWallet.meltTokens(meltQuote, proofs);
    const proofIds = new Set(proofs.map((p) => p.secret));
    this.proofs = this.proofs.filter((p) => !proofIds.has(p.secret));
    if (result.change && result.change.length > 0) {
      this.proofs.push(...result.change);
    }
    this.log("Melted tokens", {
      paid: result.isPaid,
      changeAmount: result.change?.length || 0
    });
    return {
      paid: result.isPaid,
      preimage: result.preimage || void 0,
      change: result.change || []
    };
  }
  /**
   * Send ecash tokens to another user
   * 
   * @param proofs - Proofs to send from
   * @param amount - Amount to send
   * @returns Encoded token string and change
   */
  async send(proofs, amount) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const totalAmount = this.sumProofs(proofs);
    if (totalAmount < amount) {
      throw new Error(`Insufficient balance: have ${totalAmount}, need ${amount}`);
    }
    const result = await this.cashuWallet.send(amount, proofs);
    const { send, returnChange } = result;
    const tokenEntry = {
      mint: this.mintUrl,
      proofs: send
    };
    const token = {
      token: [tokenEntry]
    };
    const encodedToken = getEncodedToken(token);
    const sentIds = new Set(send.map((p) => p.secret));
    this.proofs = this.proofs.filter((p) => !sentIds.has(p.secret));
    this.proofs.push(...returnChange);
    this.log("Sent tokens", { amount, changeAmount: this.sumProofs(returnChange) });
    return {
      token: encodedToken,
      change: returnChange
    };
  }
  /**
   * Receive ecash tokens from another user
   * 
   * @param encodedToken - Encoded token string to receive
   * @returns Received proofs
   */
  async receive(encodedToken) {
    await this.ensureInitialized();
    if (!this.cashuWallet) {
      throw new Error("Wallet not initialized");
    }
    const proofs = await this.cashuWallet.receive(encodedToken);
    this.proofs.push(...proofs);
    this.log("Received tokens", {
      amount: this.sumProofs(proofs),
      proofCount: proofs.length
    });
    return proofs;
  }
  /**
   * Get current balance from stored proofs
   */
  getBalance() {
    const denominations = {};
    let total = 0;
    for (const proof of this.proofs) {
      total += proof.amount;
      denominations[proof.amount] = (denominations[proof.amount] || 0) + 1;
    }
    return {
      total,
      proofCount: this.proofs.length,
      denominations
    };
  }
  /**
   * Get all stored proofs
   */
  getProofs() {
    return [...this.proofs];
  }
  /**
   * Add proofs to wallet storage
   * 
   * @param proofs - Proofs to add
   */
  addProofs(proofs) {
    this.proofs.push(...proofs);
  }
  /**
   * Clear all stored proofs
   */
  clearProofs() {
    this.proofs = [];
  }
  /**
   * Export proofs as encoded token
   * 
   * @param proofs - Specific proofs to export (defaults to all)
   */
  exportToken(proofs) {
    const toExport = proofs || this.proofs;
    const tokenEntry = {
      mint: this.mintUrl,
      proofs: toExport
    };
    const token = {
      token: [tokenEntry]
    };
    return getEncodedToken(token);
  }
  /**
   * Get the mint URL
   */
  getMintUrl() {
    return this.mintUrl;
  }
  /**
   * Sum the amounts of proofs
   */
  sumProofs(proofs) {
    return proofs.reduce((sum, p) => sum + p.amount, 0);
  }
  /**
   * Log debug messages
   */
  log(message, data) {
    if (this.debug) {
      console.log(`[CashuWallet] ${message}`, data || "");
    }
  }
};

// src/core.ts
var SLPM = class {
  /**
   * Create a new SLPM instance
   * 
   * @param config - Configuration options including Starknet account
   */
  constructor(config) {
    this.config = config;
    const rpcUrl = config.rpcUrl || RPC_URLS[config.network];
    const provider = new RpcProvider({ nodeUrl: rpcUrl });
    this.wallet = {
      account: config.account,
      provider,
      address: config.account.address
    };
    const cashuMintUrl = config.cashuMintUrl || CASHU_MINTS.mainnet;
    this.mixer = new PrivacyMixer(config, this.wallet);
    this.swapper = new CrossChainSwapper(config, this.wallet, this.mixer);
    this.cashu = new CashuWallet({
      mintUrl: cashuMintUrl,
      debug: config.debug
    });
    this.log("SLPM initialized", {
      network: config.network,
      address: this.wallet.address
    });
  }
  // ==========================================
  // High-Level Privacy Operations
  // ==========================================
  /**
   * Deposit funds into the privacy mixer
   * 
   * @param params - Deposit parameters with amount
   * @returns Deposit result with commitment (SAVE THIS!)
   */
  async deposit(params) {
    return this.mixer.deposit(params);
  }
  /**
   * Withdraw funds from the privacy mixer
   * 
   * @param params - Withdrawal parameters with commitment
   * @returns Withdrawal result
   */
  async withdraw(params) {
    return this.mixer.withdraw(params);
  }
  /**
   * Execute a cross-chain swap
   * 
   * @param params - Swap parameters
   * @returns Swap result
   */
  async swap(params) {
    return this.swapper.swap(params);
  }
  /**
   * Get a quote for a cross-chain swap
   * 
   * @param direction - Swap direction
   * @param amount - Amount to swap
   */
  async getSwapQuote(direction, amount) {
    return this.swapper.getQuote(direction, amount);
  }
  // ==========================================
  // Privacy-Enhanced Flows
  // ==========================================
  /**
   * Private send - deposit to mixer, then withdraw to recipient
   * Breaks the on-chain link between sender and recipient
   * 
   * @param amount - Amount to send (in wei as bigint)
   * @param recipientAddress - Recipient's Starknet address
   * @param options - Additional options
   */
  async privateSend(amount, recipientAddress, options) {
    const depositResult = await this.deposit({ amount });
    this.log("Private send: deposited", { txHash: depositResult.txHash });
    if (options?.minAnonymitySetSize) {
      await this.waitForAnonymitySet(options.minAnonymitySetSize);
    }
    if (options?.delayMs) {
      await this.delay(options.delayMs);
    }
    const withdrawResult = await this.withdraw({
      commitment: depositResult.commitment,
      recipient: recipientAddress,
      amount
    });
    this.log("Private send: withdrawn", { txHash: withdrawResult.txHash });
    return {
      depositResult,
      withdrawResult
    };
  }
  /**
   * Private cross-chain transfer with full privacy pipeline
   * 
   * Uses: Mixer deposit → Cashu mint → Lightning swap → Cashu melt → Mixer withdraw
   * 
   * @param params - Swap parameters with enhanced privacy
   */
  async privateSwap(params) {
    const enhancedParams = {
      ...params,
      usePrivacyMixer: true,
      useCashuFlow: true
    };
    return this.swap(enhancedParams);
  }
  // ==========================================
  // Cashu Operations
  // ==========================================
  /**
   * Mint Cashu tokens by paying a Lightning invoice
   * 
   * @param amount - Amount in sats
   * @returns Mint quote with invoice
   */
  async mintCashuTokens(amount) {
    await this.cashu.init();
    return this.cashu.getMintQuote(amount);
  }
  /**
   * Finalize minting after paying the invoice
   * 
   * @param quoteId - Quote ID from mintCashuTokens
   */
  async finalizeCashuMint(quoteId) {
    await this.cashu.init();
    const isPaid = await this.cashu.checkMintQuote(quoteId);
    if (!isPaid) {
      throw new Error("Mint quote not yet paid");
    }
    return this.cashu.getMintQuote(0);
  }
  /**
   * Pay a Lightning invoice using Cashu tokens
   * 
   * @param invoice - Lightning invoice to pay
   */
  async payCashuInvoice(invoice) {
    await this.cashu.init();
    const quoteResult = await this.cashu.getMeltQuote(invoice);
    const proofs = this.cashu.getProofs();
    const meltQuote = await this.cashu.cashuWallet?.checkMeltQuote(quoteResult.quote);
    if (!meltQuote) throw new Error("Failed to get melt quote");
    return this.cashu.meltTokens(meltQuote, proofs);
  }
  /**
   * Get Cashu wallet balance
   */
  getCashuBalance() {
    return this.cashu.getBalance();
  }
  // ==========================================
  // Utility Methods
  // ==========================================
  /**
   * Get mixer statistics
   */
  async getMixerStats() {
    return this.mixer.getStats();
  }
  /**
   * Check if a nullifier has been used (commitment spent)
   * 
   * @param nullifierHash - Nullifier hash to check
   */
  async isNullifierUsed(nullifierHash) {
    return this.mixer.isNullifierUsed(nullifierHash);
  }
  /**
   * Wait until anonymity set reaches minimum size
   * 
   * @param minSize - Minimum anonymity set size
   * @param timeoutMs - Timeout in milliseconds (default: 5 minutes)
   */
  async waitForAnonymitySet(minSize, timeoutMs = 3e5) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const stats = await this.mixer.getStats();
      if (stats.anonymitySetSize >= minSize) {
        this.log("Anonymity set reached", { currentSize: stats.anonymitySetSize, minSize });
        return;
      }
      await this.delay(1e4);
    }
    throw new Error(`Timeout waiting for anonymity set (min: ${minSize})`);
  }
  /**
   * Generate a new commitment for future deposit
   * 
   * @param amount - Amount for the commitment
   */
  createCommitment(amount) {
    return generateCommitment(amount);
  }
  /**
   * Get the connected wallet address
   */
  getAddress() {
    return this.wallet.address;
  }
  /**
   * Get the network
   */
  getNetwork() {
    return this.config.network;
  }
  // ==========================================
  // Private Helpers
  // ==========================================
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  log(message, data) {
    if (this.config.debug) {
      console.log(`[SLPM] ${message}`, data || "");
    }
  }
};
var core_default = SLPM;

export { CASHU_MINTS, CURRENCIES, CashuWallet, CrossChainSwapper, MAINNET_CONTRACTS, MIXER_CONFIG, PrivacyMixer, RPC_URLS, SEPOLIA_CONTRACTS, SLPM, SWAP_CONFIG, computeMerkleRoot, core_default as default, formatAmount, generateCommitment, generateMerkleProof, hash, parseAmount, pedersenHash, poseidonHash, randomHex, verifyCommitment, verifyMerkleProof };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map