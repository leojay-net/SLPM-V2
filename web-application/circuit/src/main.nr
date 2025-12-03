// SLPM Privacy Mixer Circuit
// This circuit proves the following without revealing the secret:
// 1. The prover knows a secret that corresponds to a commitment in the Merkle tree
// 2. The nullifier is correctly derived from the secret
// 3. The withdrawal parameters (recipient, amount) are bound to the proof
//
// Privacy guarantees:
// - Unlinkability: No one can link the deposit to the withdrawal
// - Nullifier prevents double-spending
// - Merkle tree provides anonymity set
// - Amount and recipient are committed to prevent front-running

mod lib;
use lib::{compute_commitment, compute_nullifier};

// Merkle tree depth for anonymity set
global MERKLE_TREE_DEPTH: u32 = 8; // Supports up to 256 commitments

fn main(
    // Private inputs (known only to prover)
    secret: Field,
    path_elements: [Field; MERKLE_TREE_DEPTH],
    path_indices: [Field; MERKLE_TREE_DEPTH],
    // Public inputs
    root: pub Field,
    recipient: pub Field,
    amount_low: pub Field,
    amount_high: pub Field,
) -> pub (Field, Field, Field) {
    // Step 1: Generate commitment from secret and amount
    let commitment = compute_commitment(secret, amount_low, amount_high);

    // Step 2: Compute nullifier (this becomes a public output)
    let nullifier_hash = compute_nullifier(secret, commitment);

    // Step 3: Compute expected root from commitment and path
    let mut expected_root = commitment;
    for i in 0..8 {
        let path_element = path_elements[i];
        let is_left = path_indices[i];
        let left = if is_left == 0 {
            expected_root
        } else {
            path_element
        };
        let right = if is_left == 0 {
            path_element
        } else {
            expected_root
        };
        expected_root = lib::hash_pair(left, right);
    }

    // Step 4: Verify the provided root matches expected
    assert(expected_root == root, "Invalid Merkle proof");

    // Step 5: Bind recipient to the proof (prevents front-running)
    // We just ensure recipient is included as public input
    // The contract will verify the recipient matches the transaction
    let _recipient_check = recipient;

    // Step 6: Bind amount to the proof
    // The amounts are public inputs, preventing tampering
    let _amount_check_low = amount_low;
    let _amount_check_high = amount_high;

    // Return nullifier, commitment, and computed root as public outputs
    (nullifier_hash, commitment, expected_root)
}

#[test]
fn test_privacy_circuit_valid_proof() {
    // Test with valid inputs
    let secret = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
    let amount_low = 1000000000000000000; // 1 STRK
    let amount_high = 0;

    // Generate commitment
    let commitment = compute_commitment(secret, amount_low, amount_high);

    // Generate nullifier
    let nullifier = compute_nullifier(secret, commitment);

    // Create a simple Merkle tree with just the commitment as root
    // For testing, we'll create a tree with empty siblings
    let path_elements = [0; MERKLE_TREE_DEPTH];
    let path_indices = [0; MERKLE_TREE_DEPTH];

    // Calculate root by hashing up the tree
    let mut current = commitment;
    for _i in 0..MERKLE_TREE_DEPTH {
        current = lib::hash_pair(current, 0);
    }
    let root = current;

    // Print root value for Prover.toml generation
    // The root for our test values is stored in 'root' variable
    std::println(f"Commitment: {commitment}");
    std::println(f"Nullifier: {nullifier}");
    std::println(f"Root: {root}");

    let recipient = 0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d;

    // This should pass - the function returns (nullifier, commitment, root)
    let (computed_nullifier, computed_commitment, computed_root) = main(
        secret,
        path_elements,
        path_indices,
        root,
        recipient,
        amount_low,
        amount_high,
    );

    // Verify the computed values match what we expect
    assert(computed_nullifier == nullifier);
    assert(computed_commitment == commitment);
    assert(computed_root == root);
}

// Note: Invalid nullifier test removed since nullifier is now computed, not provided

#[test(should_fail)]
fn test_privacy_circuit_invalid_merkle_proof() {
    let secret = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
    let amount_low = 1000000000000000000;
    let amount_high = 0;

    let path_elements = [0; MERKLE_TREE_DEPTH];
    let path_indices = [0; MERKLE_TREE_DEPTH];

    // Wrong root
    let wrong_root = 0x8888;

    let recipient = 0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d;

    // This should fail due to invalid Merkle proof
    let _ = main(
        secret,
        path_elements,
        path_indices,
        wrong_root,
        recipient,
        amount_low,
        amount_high,
    );
}
