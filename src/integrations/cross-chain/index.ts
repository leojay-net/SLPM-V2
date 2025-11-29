/**
 * Cross-Chain Integration Module
 * Enables ZEC ↔ STRK private transfers
 */

export * from './types';
export { CrossChainBridge, createCrossChainBridge } from './bridge';
export { CrossChainBridge as default } from './bridge';
