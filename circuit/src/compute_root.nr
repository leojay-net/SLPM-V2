// Helper program to compute the Merkle root for test inputs
use dep::slpm_privacy_mixer::lib::{compute_commitment, hash_pair};

fn main(secret: Field, amount_low: Field, amount_high: Field) -> pub Field {
    // Generate commitment
    let commitment = compute_commitment(secret, amount_low, amount_high);

    // Calculate root by hashing up the tree with 8 levels
    let mut current = commitment;
    for _i in 0..8 {
        current = hash_pair(current, 0);
    }

    current // This is the root
}
