#!/usr/bin/env node
// Compute the correct Merkle root for our test inputs
// Since we can't easily compute Poseidon in Node.js, we'll use Noir to compute it

console.log("To compute the correct Merkle root, we need to:");
console.log("1. Run the circuit with a known commitment");
console.log("2. Extract the computed root from the witness");
console.log("");
console.log("For testing purposes, let's use a simple approach:");
console.log("Set root = commitment for a tree with depth 0");
console.log("Or compute the root by running nargo execute and checking the output");
console.log("");
console.log("Let's use an alternative approach: modify Prover.toml to use valid tree data");
console.log("");
console.log("For a commitment in a tree with all zeros as siblings,");
console.log("we need to compute: root = hash(hash(...hash(commitment, 0), 0...), 0)");
console.log("");
console.log("The easiest solution: Let's use the circuit test values which are known to work");
