// Merkle tree utilities for SLPM Privacy Mixer

use std::hash::poseidon2;

// Compute parent hash in Merkle tree
pub fn hash_pair(left: Field, right: Field) -> Field {
    poseidon2::Poseidon2::hash([left, right], 2)
}

// Compute commitment from secret and amount
pub fn compute_commitment(secret: Field, amount_low: Field, amount_high: Field) -> Field {
    poseidon2::Poseidon2::hash([secret, amount_low, amount_high], 3)
}

// Compute nullifier from secret and commitment
pub fn compute_nullifier(secret: Field, commitment: Field) -> Field {
    poseidon2::Poseidon2::hash([secret, commitment], 2)
}

// Verify Merkle proof with fixed depth
pub fn verify_merkle_proof(
    leaf: Field,
    path_elements: [Field; 8],
    path_indices: [Field; 8],
    expected_root: Field,
) -> bool {
    let mut current = leaf;

    for i in 0..8 {
        let path_element = path_elements[i];
        let is_left = path_indices[i];

        let left = if is_left == 0 { current } else { path_element };
        let right = if is_left == 0 { path_element } else { current };

        current = hash_pair(left, right);
    }

    current == expected_root
}
