// Snforge integration tests for EnhancedPrivacyMixer
// Tests deployment, deposits, withdrawals with proof verification, and admin functions

use contract::enhanced_privacy_mixer::{
    IEnhancedPrivacyMixer, IEnhancedPrivacyMixerDispatcher, IEnhancedPrivacyMixerDispatcherTrait,
};
use contract_tests::mock_erc20_simple::{IMockERC20Dispatcher, IMockERC20DispatcherTrait};
use contract_tests::mock_verifier::{IMockVerifierDispatcher, IMockVerifierDispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, EventSpyTrait, declare,
    spy_events, start_cheat_caller_address, stop_cheat_caller_address,
};
use starknet::{ContractAddress, contract_address_const};

// Helper to deploy mock ERC20
fn deploy_mock_erc20() -> ContractAddress {
    let contract = declare("MockERC20").unwrap().contract_class();
    let (address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    address
}

// Helper to deploy mock verifier
fn deploy_mock_verifier() -> ContractAddress {
    let contract = declare("MockVerifier").unwrap().contract_class();
    let (address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    address
}

// Helper to deploy EnhancedPrivacyMixer
fn deploy_enhanced_mixer(
    owner: ContractAddress, strk_token: ContractAddress, verifier: ContractAddress,
) -> ContractAddress {
    let contract = declare("EnhancedPrivacyMixer").unwrap().contract_class();
    let mut calldata = ArrayTrait::new();
    calldata.append(owner.into());
    calldata.append(strk_token.into());
    calldata.append(verifier.into());
    let (address, _) = contract.deploy(@calldata).unwrap();
    address
}

// Test addresses
fn owner() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn user1() -> ContractAddress {
    contract_address_const::<'user1'>()
}

fn user2() -> ContractAddress {
    contract_address_const::<'user2'>()
}

#[test]
fn test_deploy_enhanced_mixer() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };

    // Verify initialization
    assert!(mixer.get_owner() == owner(), "Owner should be set");
    assert!(mixer.get_strk_token() == token, "Token should be set");
    assert!(mixer.get_verifier_address() == verifier, "Verifier should be set");
    assert!(mixer.get_next_deposit_index() == 0, "Next index should be 0");
    assert!(mixer.get_anonymity_set_size() == 0, "Anonymity set should be 0");
    assert!(!mixer.is_paused(), "Should not be paused initially");
}

#[test]
fn test_deposit() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };

    // Mint tokens to user1
    let deposit_amount: u256 = 1000000000000000000; // 1 STRK
    erc20.mint(user1(), deposit_amount);

    // User1 deposits
    let commitment: felt252 = 0x1234567890abcdef;
    start_cheat_caller_address(mixer_address, user1());
    let leaf_index = mixer.deposit(commitment, deposit_amount);
    stop_cheat_caller_address(mixer_address);

    // Verify deposit
    assert!(leaf_index == 0, "First deposit should be at index 0");
    assert!(mixer.get_next_deposit_index() == 1, "Next index should be 1");
    assert!(mixer.get_commitment_at_index(0) == commitment, "Commitment should be stored");
    assert!(mixer.get_anonymity_set_size() == 1, "Anonymity set should be 1");
    assert!(mixer.get_total_deposits() == deposit_amount, "Total deposits should match");
}

#[test]
fn test_batch_deposit() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };

    // Mint tokens to user1
    let amount: u256 = 1000000000000000000; // 1 STRK each
    erc20.mint(user1(), amount * 3);

    // Prepare batch
    let mut commitments: Array<felt252> = ArrayTrait::new();
    commitments.append(0x111);
    commitments.append(0x222);
    commitments.append(0x333);

    let mut amounts: Array<u256> = ArrayTrait::new();
    amounts.append(amount);
    amounts.append(amount);
    amounts.append(amount);

    // Batch deposit
    start_cheat_caller_address(mixer_address, user1());
    let indices = mixer.batch_deposit(commitments, amounts);
    stop_cheat_caller_address(mixer_address);

    // Verify
    assert!(indices.len() == 3, "Should have 3 indices");
    assert!(mixer.get_next_deposit_index() == 3, "Next index should be 3");
    assert!(mixer.get_anonymity_set_size() == 3, "Anonymity set should be 3");
}

#[test]
fn test_withdraw_with_valid_proof() {
    let token = deploy_mock_erc20();
    let verifier_address = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier_address);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };
    let verifier = IMockVerifierDispatcher { contract_address: verifier_address };

    // Setup: deposit first
    let deposit_amount: u256 = 1000000000000000000; // 1 STRK
    erc20.mint(user1(), deposit_amount);

    let commitment: felt252 = 0x1234567890abcdef;
    start_cheat_caller_address(mixer_address, user1());
    mixer.deposit(commitment, deposit_amount);
    stop_cheat_caller_address(mixer_address);

    // Fund the mixer contract for withdrawal
    erc20.mint(mixer_address, deposit_amount);

    // Get merkle root for proof
    let merkle_root = mixer.get_merkle_root();

    // Setup mock verifier to return valid proof outputs
    // Public inputs order: [nullifier, root, recipient, amount_low, amount_high]
    let nullifier: felt252 = 0xdeadbeef;
    let recipient_felt: felt252 = user2().into();

    let mut mock_outputs: Array<u256> = ArrayTrait::new();
    mock_outputs.append(nullifier.into()); // nullifier
    mock_outputs.append(merkle_root.into()); // root
    mock_outputs.append(recipient_felt.into()); // recipient
    mock_outputs.append(deposit_amount.low.into()); // amount_low
    mock_outputs.append(deposit_amount.high.into()); // amount_high

    verifier.set_mock_outputs(mock_outputs);
    verifier.set_should_verify(true);

    // Withdraw
    let proof_data: Array<felt252> = ArrayTrait::new(); // Mock doesn't check this
    start_cheat_caller_address(mixer_address, user2());
    let success = mixer.withdraw(nullifier, user2(), deposit_amount, proof_data);
    stop_cheat_caller_address(mixer_address);

    // Verify withdrawal
    assert!(success, "Withdrawal should succeed");
    assert!(mixer.is_nullifier_used(nullifier), "Nullifier should be marked used");
    assert!(mixer.get_total_withdrawals() == deposit_amount, "Total withdrawals should match");
    assert!(erc20.balance_of(user2()) == deposit_amount, "User should receive tokens");
}

#[test]
#[should_panic(expected: "Proof verification failed")]
fn test_withdraw_with_invalid_proof() {
    let token = deploy_mock_erc20();
    let verifier_address = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier_address);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };
    let verifier = IMockVerifierDispatcher { contract_address: verifier_address };

    // Setup: deposit first
    let deposit_amount: u256 = 1000000000000000000;
    erc20.mint(user1(), deposit_amount);

    start_cheat_caller_address(mixer_address, user1());
    mixer.deposit(0x123, deposit_amount);
    stop_cheat_caller_address(mixer_address);

    // Make verifier reject proof
    verifier.set_should_verify(false);

    // Try to withdraw - should fail
    let nullifier: felt252 = 0xdeadbeef;
    let proof_data: Array<felt252> = ArrayTrait::new();
    start_cheat_caller_address(mixer_address, user2());
    mixer.withdraw(nullifier, user2(), deposit_amount, proof_data);
    stop_cheat_caller_address(mixer_address);
}

#[test]
#[should_panic(expected: "Nullifier already used")]
fn test_double_spend_prevention() {
    let token = deploy_mock_erc20();
    let verifier_address = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier_address);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };
    let verifier = IMockVerifierDispatcher { contract_address: verifier_address };

    // Setup
    let deposit_amount: u256 = 1000000000000000000;
    erc20.mint(user1(), deposit_amount);
    erc20.mint(mixer_address, deposit_amount * 2); // Fund mixer

    start_cheat_caller_address(mixer_address, user1());
    mixer.deposit(0x123, deposit_amount);
    stop_cheat_caller_address(mixer_address);

    let merkle_root = mixer.get_merkle_root();
    let nullifier: felt252 = 0xdeadbeef;
    let recipient_felt: felt252 = user2().into();

    // Setup valid proof
    let mut mock_outputs: Array<u256> = ArrayTrait::new();
    mock_outputs.append(nullifier.into());
    mock_outputs.append(merkle_root.into());
    mock_outputs.append(recipient_felt.into());
    mock_outputs.append(deposit_amount.low.into());
    mock_outputs.append(deposit_amount.high.into());
    verifier.set_mock_outputs(mock_outputs);

    // First withdrawal succeeds
    let proof_data: Array<felt252> = ArrayTrait::new();
    start_cheat_caller_address(mixer_address, user2());
    mixer.withdraw(nullifier, user2(), deposit_amount, proof_data);

    // Second withdrawal with same nullifier should fail
    mixer.withdraw(nullifier, user2(), deposit_amount, proof_data);
    stop_cheat_caller_address(mixer_address);
}

#[test]
fn test_pause_unpause() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };

    // Initially not paused
    assert!(!mixer.is_paused(), "Should not be paused");

    // Owner pauses
    start_cheat_caller_address(mixer_address, owner());
    mixer.emergency_pause();
    stop_cheat_caller_address(mixer_address);

    assert!(mixer.is_paused(), "Should be paused");

    // Owner unpauses
    start_cheat_caller_address(mixer_address, owner());
    mixer.emergency_unpause();
    stop_cheat_caller_address(mixer_address);

    assert!(!mixer.is_paused(), "Should be unpaused");
}

#[test]
#[should_panic(expected: "Contract is paused")]
fn test_deposit_when_paused() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };

    // Pause
    start_cheat_caller_address(mixer_address, owner());
    mixer.emergency_pause();
    stop_cheat_caller_address(mixer_address);

    // Try to deposit - should fail
    erc20.mint(user1(), 1000000000000000000);
    start_cheat_caller_address(mixer_address, user1());
    mixer.deposit(0x123, 1000000000000000000);
    stop_cheat_caller_address(mixer_address);
}

#[test]
fn test_update_verifier_address() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };

    // Deploy a new verifier
    let new_verifier = deploy_mock_verifier();

    // Owner updates verifier
    start_cheat_caller_address(mixer_address, owner());
    mixer.set_verifier_address(new_verifier);
    stop_cheat_caller_address(mixer_address);

    assert!(mixer.get_verifier_address() == new_verifier, "Verifier should be updated");
}

#[test]
fn test_merkle_root_updates_on_deposit() {
    let token = deploy_mock_erc20();
    let verifier = deploy_mock_verifier();
    let mixer_address = deploy_enhanced_mixer(owner(), token, verifier);

    let mixer = IEnhancedPrivacyMixerDispatcher { contract_address: mixer_address };
    let erc20 = IMockERC20Dispatcher { contract_address: token };

    let initial_root = mixer.get_merkle_root();

    // Deposit
    erc20.mint(user1(), 1000000000000000000);
    start_cheat_caller_address(mixer_address, user1());
    mixer.deposit(0x123, 1000000000000000000);
    stop_cheat_caller_address(mixer_address);

    let new_root = mixer.get_merkle_root();

    // Root should change after deposit
    assert!(initial_root != new_root, "Merkle root should change after deposit");
}
