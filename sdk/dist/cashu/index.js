'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cashuTs = require('@cashu/cashu-ts');

// src/cashu/wallet.ts

// src/constants.ts
var CASHU_MINTS = {
  mainnet: "https://mint.minibits.cash/Bitcoin"};
({
  MIN_DEPOSIT: BigInt("1000000000000000000"),
  // 1 STRK
  MAX_DEPOSIT: BigInt("1000000000000000000000")});

// src/cashu/wallet.ts
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
      this.cashuMint = new cashuTs.CashuMint(this.mintUrl);
      this.cashuWallet = new cashuTs.CashuWallet(this.cashuMint, { unit: this.unit });
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
    const encodedToken = cashuTs.getEncodedToken(token);
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
    return cashuTs.getEncodedToken(token);
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
var wallet_default = CashuWallet;

exports.CashuWallet = CashuWallet;
exports.default = wallet_default;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map