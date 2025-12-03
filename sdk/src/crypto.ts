/**
 * SLPM SDK Cryptographic Utilities
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils';

/**
 * Generate random hex string
 */
export function randomHex(bytes: number = 32): string {
    return bytesToHex(randomBytes(bytes));
}

/**
 * Hash data using SHA256
 */
export function hash(data: string | Uint8Array): string {
    const input = typeof data === 'string' ? hexToBytes(data.replace('0x', '')) : data;
    return '0x' + bytesToHex(sha256(input));
}

/**
 * Pedersen hash (simplified - in production use actual Pedersen)
 * For compatibility with Starknet/Cairo
 */
export function pedersenHash(a: string, b: string): string {
    const combined = a.replace('0x', '') + b.replace('0x', '');
    return hash(combined);
}

/**
 * Poseidon hash (simplified - in production use actual Poseidon)
 * For compatibility with Noir circuits
 */
export function poseidonHash(inputs: string[]): string {
    const combined = inputs.map(x => x.replace('0x', '')).join('');
    return hash(combined);
}

/**
 * Generate a commitment for the privacy mixer
 */
export function generateCommitment(amount: bigint): {
    commitment: string;
    secret: string;
    nullifier: string;
    nullifierHash: string;
} {
    // Generate random secret and nullifier
    const secret = '0x' + randomHex(32);
    const nullifier = '0x' + randomHex(32);

    // Compute nullifier hash
    const nullifierHash = poseidonHash([nullifier]);

    // Compute commitment = hash(secret, nullifier, amount)
    const amountHex = '0x' + amount.toString(16).padStart(64, '0');
    const commitment = poseidonHash([secret, nullifier, amountHex]);

    return {
        commitment,
        secret,
        nullifier,
        nullifierHash,
    };
}

/**
 * Verify a commitment
 */
export function verifyCommitment(
    secret: string,
    nullifier: string,
    amount: bigint,
    expectedCommitment: string
): boolean {
    const amountHex = '0x' + amount.toString(16).padStart(64, '0');
    const computed = poseidonHash([secret, nullifier, amountHex]);
    return computed.toLowerCase() === expectedCommitment.toLowerCase();
}

/**
 * Compute Merkle root from leaves
 */
export function computeMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) return '0x' + '0'.repeat(64);
    if (leaves.length === 1) return leaves[0];

    const nextLevel: string[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
        const left = leaves[i];
        const right = leaves[i + 1] || left; // Duplicate if odd
        nextLevel.push(pedersenHash(left, right));
    }

    return computeMerkleRoot(nextLevel);
}

/**
 * Generate Merkle proof for a leaf
 */
export function generateMerkleProof(
    leaves: string[],
    leafIndex: number
): {
    pathElements: string[];
    pathIndices: number[];
    root: string;
} {
    const pathElements: string[] = [];
    const pathIndices: number[] = [];

    let currentLevel = [...leaves];
    let currentIndex = leafIndex;

    while (currentLevel.length > 1) {
        const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
        const sibling = currentLevel[siblingIndex] || currentLevel[currentIndex];

        pathElements.push(sibling);
        pathIndices.push(currentIndex % 2);

        // Move to next level
        const nextLevel: string[] = [];
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
        root: currentLevel[0],
    };
}

/**
 * Verify a Merkle proof
 */
export function verifyMerkleProof(
    leaf: string,
    pathElements: string[],
    pathIndices: number[],
    root: string
): boolean {
    let current = leaf;

    for (let i = 0; i < pathElements.length; i++) {
        const sibling = pathElements[i];
        const isLeft = pathIndices[i] === 0;

        current = isLeft
            ? pedersenHash(current, sibling)
            : pedersenHash(sibling, current);
    }

    return current.toLowerCase() === root.toLowerCase();
}

/**
 * Format amount for display
 */
export function formatAmount(amount: bigint, decimals: number = 18): string {
    const str = amount.toString().padStart(decimals + 1, '0');
    const intPart = str.slice(0, -decimals) || '0';
    const decPart = str.slice(-decimals).replace(/0+$/, '');
    return decPart ? `${intPart}.${decPart}` : intPart;
}

/**
 * Parse amount from string
 */
export function parseAmount(amount: string, decimals: number = 18): bigint {
    const [intPart, decPart = ''] = amount.split('.');
    const paddedDec = decPart.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(intPart + paddedDec);
}
