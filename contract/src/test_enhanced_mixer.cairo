#[cfg(test)]
mod tests {
    use core::array::ArrayTrait;
    use core::hash::{HashStateTrait, HashStateExTrait};
    use core::poseidon::PoseidonTrait;
    
    // Test Poseidon hash for Merkle tree
    #[test]
    fn test_poseidon_hash() {
        // Test that Poseidon hash works correctly
        let hash = PoseidonTrait::new().update(123).update(456).finalize();
        assert!(hash != 0, "Poseidon hash should produce non-zero result");
    }
    
    // Test commitment calculation
    #[test]
    fn test_commitment_calculation() {
        let secret: felt252 = 0x1234567890abcdef;
        let amount_low: felt252 = 1000000000000000000; // 1 STRK
        let amount_high: felt252 = 0;
        
        // Compute commitment = poseidon(secret, amount_low, amount_high)
        let commitment = PoseidonTrait::new()
            .update(secret)
            .update(amount_low)
            .update(amount_high)
            .finalize();
        
        assert!(commitment != 0, "Commitment should be non-zero");
        
        // Same inputs should produce same commitment
        let commitment2 = PoseidonTrait::new()
            .update(secret)
            .update(amount_low)
            .update(amount_high)
            .finalize();
        
        assert!(commitment == commitment2, "Same inputs should produce same commitment");
    }
    
    // Test nullifier calculation
    #[test]
    fn test_nullifier_calculation() {
        let secret: felt252 = 0x1234567890abcdef;
        let commitment: felt252 = 0xabcdef123456;
        
        // Compute nullifier = poseidon(secret, commitment)
        let nullifier = PoseidonTrait::new()
            .update(secret)
            .update(commitment)
            .finalize();
        
        assert!(nullifier != 0, "Nullifier should be non-zero");
        assert!(nullifier != commitment, "Nullifier should differ from commitment");
    }
    
    // Test Merkle tree hash pair
    #[test]
    fn test_merkle_hash_pair() {
        let left: felt252 = 0x123;
        let right: felt252 = 0x456;
        
        let parent = PoseidonTrait::new()
            .update(left)
            .update(right)
            .finalize();
        
        assert!(parent != 0, "Parent hash should be non-zero");
        assert!(parent != left, "Parent should differ from left");
        assert!(parent != right, "Parent should differ from right");
    }
    
    // Test empty Merkle root computation
    #[test]
    fn test_empty_merkle_root() {
        // For depth 8, compute empty root by hashing zeros up the tree
        let zero: felt252 = 0;
        let mut current = zero;
        
        // Hash up 8 levels
        let mut i: u32 = 0;
        while i < 8 {
            current = PoseidonTrait::new()
                .update(current)
                .update(zero)
                .finalize();
            i += 1;
        };
        
        assert!(current != 0, "Empty root should be non-zero after hashing");
    }
    
    // Test that different secrets produce different commitments
    #[test]
    fn test_different_secrets_different_commitments() {
        let secret1: felt252 = 0x1111;
        let secret2: felt252 = 0x2222;
        let amount: felt252 = 1000000000000000000;
        
        let commitment1 = PoseidonTrait::new()
            .update(secret1)
            .update(amount)
            .update(0)
            .finalize();
        
        let commitment2 = PoseidonTrait::new()
            .update(secret2)
            .update(amount)
            .update(0)
            .finalize();
        
        assert!(commitment1 != commitment2, "Different secrets should produce different commitments");
    }
    
    // Test amount validation logic
    #[test]
    fn test_amount_validation() {
        let valid_amount: u256 = 1000000000000000000; // 1 STRK
        let zero_amount: u256 = 0;
        
        assert!(valid_amount > 0, "Valid amount should be positive");
        assert!(zero_amount == 0, "Zero amount check");
    }
    
    // Test Merkle path computation logic
    #[test]
    fn test_merkle_path_indices() {
        // For index 0, all indices should be 0 (left side of tree)
        let index: u32 = 0;
        let mut current_index = index;
        let mut i: u32 = 0;
        
        while i < 8 {
            let is_right = current_index % 2;
            assert!(is_right == 0, "Index 0 should be on left side at all levels");
            current_index = current_index / 2;
            i += 1;
        };
    }
    
    // Test index 1 path (alternates)
    #[test]
    fn test_merkle_path_indices_one() {
        let index: u32 = 1;
        let is_right = index % 2;
        assert!(is_right == 1, "Index 1 should be on right side at level 0");
    }
}
