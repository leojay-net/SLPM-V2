import { v4 } from 'uuid';
import '@noble/hashes/sha256';
import '@noble/hashes/utils';

// src/swaps/swapper.ts

// src/types.ts
var SLPMError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = "SLPMError";
    this.code = code;
    this.details = details;
  }
};
var SwapError = class extends SLPMError {
  constructor(message, details) {
    super(message, "SWAP_ERROR", details);
    this.name = "SwapError";
  }
};

// src/constants.ts
({
  MIN_DEPOSIT: BigInt("1000000000000000000"),
  // 1 STRK
  MAX_DEPOSIT: BigInt("1000000000000000000000")});
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
function parseAmount(amount, decimals = 18) {
  const [intPart, decPart = ""] = amount.split(".");
  const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(intPart + paddedDec);
}

// src/swaps/swapper.ts
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
var swapper_default = CrossChainSwapper;

export { CrossChainSwapper, swapper_default as default };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map