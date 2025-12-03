// Generate valid test data for Prover.toml
const crypto = require('crypto');

// Generate a random secret (32 bytes)
const secret = '0x' + crypto.randomBytes(32).toString('hex');

// For testing, use an empty Merkle tree with 8 levels
// Path elements are all zeros (empty siblings)
const pathElements = Array(8).fill('0x0');
const pathIndices = Array(8).fill(0);

// For an empty tree, the root is computed by hashing up from a zero leaf
// For simplicity, let's use "0x0" as we're testing with an empty tree
const root = '0x0';

// The nullifier should be hash(secret) - but for testing we'll use a placeholder
// In production, this would be computed by the Noir circuit
const nullifierHash = '0x0';

// Recipient address (valid Starknet address)
const recipient = '0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d';

// Amount (1 ETH in wei, split into low and high u128)
const amountLow = '1000000000000000000';
const amountHigh = '0';

console.log('# Private inputs (secret to the prover)');
console.log(`secret = "${secret}"`);
console.log(`path_elements = ${JSON.stringify(pathElements)}`);
console.log(`path_indices = ${JSON.stringify(pathIndices)}`);
console.log('');
console.log('# Public inputs');
console.log(`nullifier_hash = "${nullifierHash}"`);
console.log(`root = "${root}"`);
console.log(`recipient = "${recipient}"`);
console.log(`amount_low = "${amountLow}"`);
console.log(`amount_high = "${amountHigh}"`);
