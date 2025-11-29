// Mock Garaga verifier for testing EnhancedPrivacyMixer
use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockVerifier<TContractState> {
    fn verify_ultra_starknet_zk_honk_proof(
        self: @TContractState, full_proof_with_hints: Span<felt252>,
    ) -> Option<Span<u256>>;

    // Test helpers to configure mock behavior
    fn set_should_verify(ref self: TContractState, should_verify: bool);
    fn set_mock_outputs(ref self: TContractState, outputs: Array<u256>);
}

#[starknet::contract]
pub mod MockVerifier {
    use starknet::storage::{
        MutableVecTrait, StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait,
    };

    #[storage]
    struct Storage {
        should_verify: bool,
        mock_outputs: Vec<u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.should_verify.write(true);
    }

    #[abi(embed_v0)]
    impl MockVerifierImpl of super::IMockVerifier<ContractState> {
        fn verify_ultra_starknet_zk_honk_proof(
            self: @ContractState, full_proof_with_hints: Span<felt252>,
        ) -> Option<Span<u256>> {
            if !self.should_verify.read() {
                return Option::None;
            }

            // Return the mock outputs as public inputs
            let len = self.mock_outputs.len();
            if len == 0 {
                return Option::None;
            }

            let mut result: Array<u256> = ArrayTrait::new();
            let mut i: u64 = 0;
            while i < len {
                result.append(self.mock_outputs.at(i).read());
                i += 1;
            }

            Option::Some(result.span())
        }

        fn set_should_verify(ref self: ContractState, should_verify: bool) {
            self.should_verify.write(should_verify);
        }

        fn set_mock_outputs(ref self: ContractState, outputs: Array<u256>) {
            // Clear existing outputs
            // Note: Vec doesn't have clear(), so we recreate by just writing new values
            let mut i: u32 = 0;
            let len = outputs.len();
            while i < len {
                let val = *outputs.at(i);
                if i.into() < self.mock_outputs.len() {
                    self.mock_outputs.at(i.into()).write(val);
                } else {
                    self.mock_outputs.append().write(val);
                }
                i += 1;
            };
        }
    }
}
