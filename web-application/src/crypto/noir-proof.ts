/**
 * SLPM Privacy Mixer - Zero-Knowledge Proof Generation Utilities
 * 
 * This module provides TypeScript utilities for generating Noir proofs
 * for the SLPM privacy mixer using UltraHonk backend and Garaga integration.
 */

import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import { getZKHonkCallData, init as initGaraga } from 'garaga';
import { poseidon } from 'starknet';

export interface PrivacyMixerInputs {
    // Private inputs
    secret: string;
    pathElements: string[];
    pathIndices: number[];

    // Public inputs
    nullifierHash: string;
    root: string;
    recipient: string;
    amountLow: string;
    amountHigh: string;
}

export interface CommitmentData {
    commitment: string;
    nullifier: string;
    secret: string;
}

export interface MerkleProof {
    pathElements: string[];
    pathIndices: number[];
    root: string;
}

export interface GeneratedProof {
    proof: Uint8Array;
    publicInputs: string[];
    calldata: string[];
}

/**
 * Generate a commitment from secret and amount
 */
export function generateCommitment(secret: string, amountLow: bigint, amountHigh: bigint): string {
    return poseidon([secret, amountLow.toString(), amountHigh.toString()]);
}

/**
 * Generate a nullifier from secret and commitment
 */
export function generateNullifier(secret: string, commitment: string): string {
    return poseidon([secret, commitment]);
}

/**
 * Generate random secret for privacy
 */
export function generateSecret(): string {
    // Generate a random 256-bit secret
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    // Convert to hex string
    return '0x' + Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Create commitment data for deposit
 */
export function createCommitmentData(amount: bigint): CommitmentData {
    const secret = generateSecret();
    const amountLow = amount & ((1n << 128n) - 1n);
    const amountHigh = amount >> 128n;

    const commitment = generateCommitment(secret, amountLow, amountHigh);
    const nullifier = generateNullifier(secret, commitment);

    return {
        commitment,
        nullifier,
        secret,
    };
}

/**
 * Build Merkle tree from commitments
 */
export function buildMerkleTree(commitments: string[], depth: number = 8): string {
    const maxSize = 2 ** depth;

    // Pad with zeros
    const paddedCommitments = [...commitments];
    while (paddedCommitments.length < maxSize) {
        paddedCommitments.push('0x0');
    }

    // Build tree level by level
    let currentLevel = paddedCommitments;

    for (let level = 0; level < depth; level++) {
        const nextLevel: string[] = [];

        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = currentLevel[i + 1];
            const parent = poseidon([left, right]);
            nextLevel.push(parent);
        }

        currentLevel = nextLevel;
    }

    return currentLevel[0]; // Root
}

/**
 * Generate Merkle proof for a commitment at given index
 */
export function generateMerkleProof(
    commitments: string[],
    index: number,
    depth: number = 8
): MerkleProof {
    const maxSize = 2 ** depth;

    // Pad with zeros
    const paddedCommitments = [...commitments];
    while (paddedCommitments.length < maxSize) {
        paddedCommitments.push('0x0');
    }

    const pathElements: string[] = [];
    const pathIndices: number[] = [];

    let currentIndex = index;
    let currentLevel = paddedCommitments;

    for (let level = 0; level < depth; level++) {
        const isRight = currentIndex % 2;
        const siblingIndex = isRight === 1 ? currentIndex - 1 : currentIndex + 1;

        pathElements.push(currentLevel[siblingIndex]);
        pathIndices.push(isRight);

        // Build next level
        const nextLevel: string[] = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = currentLevel[i + 1];
            nextLevel.push(poseidon([left, right]));
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
 * Generate ZK proof for withdrawal
 */
export async function generateWithdrawalProof(
    circuitBytecode: Uint8Array,
    circuitAbi: any,
    vk: Uint8Array,
    inputs: PrivacyMixerInputs,
    threads: number = 1
): Promise<GeneratedProof> {
    // Initialize Noir circuit
    const noir = new Noir({
        bytecode: circuitBytecode,
        abi: circuitAbi,
        debug_symbols: '',
        file_map: {}
    });

    // Execute circuit to generate witness
    const witness = await noir.execute(inputs);

    // Generate proof using UltraHonk backend
    const backend = new UltraHonkBackend(circuitBytecode, { threads });
    const proof = await backend.generateProof(witness.witness, { starknetZK: true });
    backend.destroy();

    // Initialize Garaga
    await initGaraga();

    // Flatten public inputs
    const flattenedPublicInputs = flattenFieldsAsArray(proof.publicInputs);

    // Generate calldata for Starknet
    const callData = getZKHonkCallData(
        proof.proof,
        flattenedPublicInputs,
        vk,
        1 // HonkFlavor.STARKNET
    );

    return {
        proof: proof.proof,
        publicInputs: proof.publicInputs,
        calldata: callData,
    };
}

/**
 * Helper function to flatten field arrays
 */
function flattenFieldsAsArray(fields: string[]): Uint8Array {
    const flattenedPublicInputs = fields.map(hexToUint8Array);
    return flattenUint8Arrays(flattenedPublicInputs);
}

function flattenUint8Arrays(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((acc, val) => acc + val.length, 0);
    const result = new Uint8Array(totalLength);

    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}

function hexToUint8Array(hex: string): Uint8Array {
    const sanitisedHex = BigInt(hex).toString(16).padStart(64, '0');

    const len = sanitisedHex.length / 2;
    const u8 = new Uint8Array(len);

    let i = 0;
    let j = 0;
    while (i < len) {
        u8[i] = parseInt(sanitisedHex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }

    return u8;
}

/**
 * Convert amount to low/high parts for 256-bit representation
 */
export function splitAmount(amount: bigint): { low: bigint; high: bigint } {
    const low = amount & ((1n << 128n) - 1n);
    const high = amount >> 128n;
    return { low, high };
}

/**
 * Prepare inputs for Noir circuit
 */
export function prepareCircuitInputs(
    secret: string,
    merkleProof: MerkleProof,
    recipient: string,
    amount: bigint
): PrivacyMixerInputs {
    const { low: amountLow, high: amountHigh } = splitAmount(amount);

    const commitment = generateCommitment(secret, amountLow, amountHigh);
    const nullifier = generateNullifier(secret, commitment);

    return {
        secret,
        pathElements: merkleProof.pathElements,
        pathIndices: merkleProof.pathIndices,
        nullifierHash: nullifier,
        root: merkleProof.root,
        recipient,
        amountLow: amountLow.toString(),
        amountHigh: amountHigh.toString(),
    };
}

/**
 * Complete workflow: Generate proof for withdrawal
 */
export async function createWithdrawalProof(
    circuitBytecode: Uint8Array,
    circuitAbi: any,
    vk: Uint8Array,
    secret: string,
    commitments: string[],
    depositIndex: number,
    recipient: string,
    amount: bigint
): Promise<GeneratedProof> {
    // Generate Merkle proof
    const merkleProof = generateMerkleProof(commitments, depositIndex);

    // Prepare circuit inputs
    const inputs = prepareCircuitInputs(secret, merkleProof, recipient, amount);

    // Generate ZK proof
    return generateWithdrawalProof(circuitBytecode, circuitAbi, vk, inputs);
}
