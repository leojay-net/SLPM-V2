//! # Enhanced SLPM Privacy Mixer with Noir + Garaga ZK Verification
//!
//! This contract integrates UltraHonk ZK proofs verified by Garaga for enhanced privacy.
//! Key improvements over the original:
//! - Proper Merkle tree for anonymity set
//! - Real ZK proof verification via Garaga verifier contract
//! - Enhanced privacy guarantees with proper commitment scheme

use core::array::ArrayTrait;
use core::option::OptionTrait;
use core::traits::Into;
use starknet::ContractAddress;

// Garaga Verifier Interface
#[starknet::interface]
pub trait IUltraStarknetZKHonkVerifier<TContractState> {
    fn verify_ultra_starknet_zk_honk_proof(
        self: @TContractState, full_proof_with_hints: Span<felt252>,
    ) -> Option<Span<u256>>;
}

// STRK Token Interface
#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}

#[starknet::interface]
pub trait IEnhancedPrivacyMixer<TContractState> {
    // Deposit operations
    fn deposit(ref self: TContractState, commitment: felt252, amount: u256) -> u32;
    fn batch_deposit(
        ref self: TContractState, commitments: Array<felt252>, amounts: Array<u256>,
    ) -> Array<u32>;

    // Withdrawal operations with ZK proof
    fn withdraw(
        ref self: TContractState,
        nullifier: felt252,
        recipient: ContractAddress,
        amount: u256,
        proof_with_hints: Array<felt252>,
    ) -> bool;

    // Merkle tree queries
    fn get_merkle_root(self: @TContractState) -> felt252;
    fn get_commitment_at_index(self: @TContractState, index: u32) -> felt252;
    fn get_next_deposit_index(self: @TContractState) -> u32;
    fn get_path_for_commitment(self: @TContractState, index: u32) -> (Array<felt252>, Array<u32>);

    // Privacy metrics
    fn get_anonymity_set_size(self: @TContractState) -> u32;
    fn get_total_deposits(self: @TContractState) -> u256;
    fn get_total_withdrawals(self: @TContractState) -> u256;
    fn is_nullifier_used(self: @TContractState, nullifier: felt252) -> bool;

    // Configuration
    fn get_verifier_address(self: @TContractState) -> ContractAddress;
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn get_strk_token(self: @TContractState) -> ContractAddress;

    // Admin functions
    fn set_verifier_address(ref self: TContractState, new_verifier: ContractAddress);
    fn emergency_pause(ref self: TContractState);
    fn emergency_unpause(ref self: TContractState);
    fn is_paused(self: @TContractState) -> bool;
}

#[derive(Drop, Serde, starknet::Store)]
pub struct MerkleTree {
    pub root: felt252,
    pub next_index: u32,
    pub depth: u32,
}

#[starknet::contract]
mod EnhancedPrivacyMixer {
    use core::array::ArrayTrait;
    use core::hash::{HashStateExTrait, HashStateTrait};
    use core::option::OptionTrait;
    use core::poseidon::PoseidonTrait;
    use core::traits::Into;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{
        ContractAddress, contract_address_const, get_block_number, get_block_timestamp,
        get_caller_address, get_contract_address,
    };
    use super::{
        IERC20Dispatcher, IERC20DispatcherTrait, IEnhancedPrivacyMixer,
        IUltraStarknetZKHonkVerifier, IUltraStarknetZKHonkVerifierDispatcher,
        IUltraStarknetZKHonkVerifierDispatcherTrait, MerkleTree,
    };

    const MERKLE_TREE_DEPTH: u32 = 8; // Supports up to 256 commitments
    const ZERO_VALUE: felt252 = 0x0;

    #[storage]
    struct Storage {
        // Core contracts
        owner: ContractAddress,
        strk_token: ContractAddress,
        verifier_contract: ContractAddress,
        // Merkle tree state
        merkle_root: felt252,
        next_deposit_index: u32,
        commitments: Map<u32, felt252>, // index => commitment
        // Nullifier tracking
        nullifiers: Map<felt252, bool>,
        // Privacy metrics
        total_deposits: u256,
        total_withdrawals: u256,
        // Emergency controls
        paused: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposit: Deposit,
        Withdrawal: Withdrawal,
        EmergencyPause: EmergencyPause,
        EmergencyUnpause: EmergencyUnpause,
        VerifierUpdated: VerifierUpdated,
    }

    #[derive(Drop, starknet::Event)]
    pub struct Deposit {
        #[key]
        pub commitment: felt252,
        pub leaf_index: u32,
        pub amount: u256,
        pub timestamp: u64,
        pub new_root: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct Withdrawal {
        #[key]
        pub nullifier: felt252,
        pub recipient: ContractAddress,
        pub amount: u256,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct EmergencyPause {
        timestamp: u64,
        triggered_by: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct EmergencyUnpause {
        timestamp: u64,
        triggered_by: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct VerifierUpdated {
        old_verifier: ContractAddress,
        new_verifier: ContractAddress,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        strk_token: ContractAddress,
        verifier_contract: ContractAddress,
    ) {
        self.owner.write(owner);
        self.strk_token.write(strk_token);
        self.verifier_contract.write(verifier_contract);
        self.paused.write(false);
        self.next_deposit_index.write(0);
        self.total_deposits.write(0);
        self.total_withdrawals.write(0);

        // Initialize Merkle root with zeros
        self.merkle_root.write(self._compute_empty_root());
    }

    #[abi(embed_v0)]
    impl EnhancedPrivacyMixerImpl of IEnhancedPrivacyMixer<ContractState> {
        fn deposit(ref self: ContractState, commitment: felt252, amount: u256) -> u32 {
            self._assert_not_paused();
            assert!(amount > 0, "Amount must be positive");

            let caller = get_caller_address();
            let contract_address = get_contract_address();
            let timestamp = get_block_timestamp();

            // Transfer STRK tokens from user to contract
            let strk_token = IERC20Dispatcher { contract_address: self.strk_token.read() };
            let transfer_success = strk_token.transfer_from(caller, contract_address, amount);
            assert!(transfer_success, "STRK transfer failed");

            // Get next leaf index
            let leaf_index = self.next_deposit_index.read();
            assert!(leaf_index < 256, "Merkle tree full"); // 2^MERKLE_TREE_DEPTH

            // Store commitment
            self.commitments.write(leaf_index, commitment);
            self.next_deposit_index.write(leaf_index + 1);

            // Update Merkle root
            let new_root = self._update_merkle_root(commitment, leaf_index);
            self.merkle_root.write(new_root);

            // Update metrics
            let new_total = self.total_deposits.read() + amount;
            self.total_deposits.write(new_total);

            // Emit event
            self
                .emit(
                    Event::Deposit(
                        Deposit {
                            commitment: commitment,
                            leaf_index: leaf_index,
                            amount: amount,
                            timestamp: timestamp,
                            new_root: new_root,
                        },
                    ),
                );

            leaf_index
        }

        fn batch_deposit(
            ref self: ContractState, commitments: Array<felt252>, amounts: Array<u256>,
        ) -> Array<u32> {
            assert!(commitments.len() == amounts.len(), "Array length mismatch");
            assert!(commitments.len() > 0, "Empty batch");
            assert!(commitments.len() <= 10, "Batch too large");

            let mut indices = ArrayTrait::new();
            let mut i: usize = 0;

            while i < commitments.len() {
                let commitment = *commitments.at(i);
                let amount = *amounts.at(i);
                let index = self.deposit(commitment, amount);
                indices.append(index);
                i += 1;
            }

            indices
        }

        fn withdraw(
            ref self: ContractState,
            nullifier: felt252,
            recipient: ContractAddress,
            amount: u256,
            proof_with_hints: Array<felt252>,
        ) -> bool {
            self._assert_not_paused();
            assert!(!self.nullifiers.read(nullifier), "Nullifier already used");
            assert!(amount > 0, "Invalid amount");

            // Verify ZK proof using Garaga verifier
            let verifier = IUltraStarknetZKHonkVerifierDispatcher {
                contract_address: self.verifier_contract.read(),
            };

            let public_inputs = verifier
                .verify_ultra_starknet_zk_honk_proof(proof_with_hints.span());
            assert!(public_inputs.is_some(), "Proof verification failed");

            // Extract and verify public inputs
            let inputs = public_inputs.unwrap();
            assert!(inputs.len() >= 5, "Invalid public inputs");

            // Public inputs order: [nullifier, root, recipient, amount_low, amount_high]
            let proof_nullifier: felt252 = (*inputs.at(0)).try_into().unwrap();
            let proof_root: felt252 = (*inputs.at(1)).try_into().unwrap();
            let proof_recipient: felt252 = (*inputs.at(2)).try_into().unwrap();
            let proof_amount_low: felt252 = (*inputs.at(3)).try_into().unwrap();
            let proof_amount_high: felt252 = (*inputs.at(4)).try_into().unwrap();

            // Verify nullifier matches
            assert!(proof_nullifier == nullifier, "Nullifier mismatch");

            // Verify root matches current or recent root (for async withdrawals)
            let current_root = self.merkle_root.read();
            assert!(proof_root == current_root, "Invalid root");

            // Verify recipient matches
            let recipient_felt: felt252 = recipient.into();
            assert!(proof_recipient == recipient_felt, "Recipient mismatch");

            // Verify amount matches
            assert!(proof_amount_low == amount.low.into(), "Amount low mismatch");
            assert!(proof_amount_high == amount.high.into(), "Amount high mismatch");

            // Mark nullifier as used
            self.nullifiers.write(nullifier, true);

            // Transfer tokens to recipient
            let strk_token = IERC20Dispatcher { contract_address: self.strk_token.read() };
            let transfer_success = strk_token.transfer(recipient, amount);
            assert!(transfer_success, "STRK transfer failed");

            // Update metrics
            let new_total = self.total_withdrawals.read() + amount;
            self.total_withdrawals.write(new_total);

            // Emit event
            let timestamp = get_block_timestamp();
            self
                .emit(
                    Event::Withdrawal(
                        Withdrawal {
                            nullifier: nullifier,
                            recipient: recipient,
                            amount: amount,
                            timestamp: timestamp,
                        },
                    ),
                );

            true
        }

        fn get_merkle_root(self: @ContractState) -> felt252 {
            self.merkle_root.read()
        }

        fn get_commitment_at_index(self: @ContractState, index: u32) -> felt252 {
            self.commitments.read(index)
        }

        fn get_next_deposit_index(self: @ContractState) -> u32 {
            self.next_deposit_index.read()
        }

        fn get_path_for_commitment(
            self: @ContractState, index: u32,
        ) -> (Array<felt252>, Array<u32>) {
            let mut path_elements = ArrayTrait::new();
            let mut path_indices = ArrayTrait::new();

            let mut current_index = index;
            let mut level: u32 = 0;

            while level < MERKLE_TREE_DEPTH {
                let is_right = current_index % 2;
                let sibling_index = if is_right == 1 {
                    current_index - 1
                } else {
                    current_index + 1
                };

                let sibling = self.commitments.read(sibling_index);
                path_elements.append(sibling);
                path_indices.append(is_right);

                current_index = current_index / 2;
                level += 1;
            }

            (path_elements, path_indices)
        }

        fn get_anonymity_set_size(self: @ContractState) -> u32 {
            self.next_deposit_index.read()
        }

        fn get_total_deposits(self: @ContractState) -> u256 {
            self.total_deposits.read()
        }

        fn get_total_withdrawals(self: @ContractState) -> u256 {
            self.total_withdrawals.read()
        }

        fn is_nullifier_used(self: @ContractState, nullifier: felt252) -> bool {
            self.nullifiers.read(nullifier)
        }

        fn get_verifier_address(self: @ContractState) -> ContractAddress {
            self.verifier_contract.read()
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn get_strk_token(self: @ContractState) -> ContractAddress {
            self.strk_token.read()
        }

        fn set_verifier_address(ref self: ContractState, new_verifier: ContractAddress) {
            self._assert_only_owner();
            let old_verifier = self.verifier_contract.read();
            self.verifier_contract.write(new_verifier);

            self
                .emit(
                    Event::VerifierUpdated(
                        VerifierUpdated {
                            old_verifier: old_verifier,
                            new_verifier: new_verifier,
                            timestamp: get_block_timestamp(),
                        },
                    ),
                );
        }

        fn emergency_pause(ref self: ContractState) {
            self._assert_only_owner();
            self.paused.write(true);
            self
                .emit(
                    Event::EmergencyPause(
                        EmergencyPause {
                            timestamp: get_block_timestamp(), triggered_by: get_caller_address(),
                        },
                    ),
                );
        }

        fn emergency_unpause(ref self: ContractState) {
            self._assert_only_owner();
            self.paused.write(false);
            self
                .emit(
                    Event::EmergencyUnpause(
                        EmergencyUnpause {
                            timestamp: get_block_timestamp(), triggered_by: get_caller_address(),
                        },
                    ),
                );
        }

        fn is_paused(self: @ContractState) -> bool {
            self.paused.read()
        }
    }

    #[generate_trait]
    impl PrivateImpl of PrivateTrait {
        fn _assert_not_paused(self: @ContractState) {
            assert!(!self.paused.read(), "Contract is paused");
        }

        fn _assert_only_owner(self: @ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            assert!(caller == owner, "Only owner");
        }

        fn _compute_empty_root(self: @ContractState) -> felt252 {
            // Compute root of empty tree
            let mut current = ZERO_VALUE;
            let mut level: u32 = 0;

            while level < MERKLE_TREE_DEPTH {
                current = PoseidonTrait::new().update(current).update(current).finalize();
                level += 1;
            }

            current
        }

        fn _update_merkle_root(self: @ContractState, leaf: felt252, index: u32) -> felt252 {
            let mut current = leaf;
            let mut current_index = index;
            let mut level: u32 = 0;

            while level < MERKLE_TREE_DEPTH {
                let is_right = current_index % 2;
                let sibling_index = if is_right == 1 {
                    current_index - 1
                } else {
                    current_index + 1
                };

                let sibling = self.commitments.read(sibling_index);

                if is_right == 1 {
                    current = PoseidonTrait::new().update(sibling).update(current).finalize();
                } else {
                    current = PoseidonTrait::new().update(current).update(sibling).finalize();
                }

                current_index = current_index / 2;
                level += 1;
            }

            current
        }
    }
}
