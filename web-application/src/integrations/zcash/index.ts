/**
 * ZEC Integration Module
 * Provides ZEC ↔ Lightning swap functionality for SLPM cross-chain transfers
 */

// Types
export * from './types';

// Clients
export { FixedFloatClient } from './fixedfloat-client';
export { ZecSwapService, type ZecSwapServiceConfig } from './swap-service';

// Default export
export { ZecSwapService as default } from './swap-service';
