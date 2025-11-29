// Minimal mock ERC20 for tests
use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockERC20<TContractState> {
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}

#[starknet::contract]
pub mod MockERC20 {
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {// no-op
    }

    #[abi(embed_v0)]
    impl MockERC20Impl of super::IMockERC20<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            let bal = self.balances.read(to);
            self.balances.write(to, bal + amount);
        }

        fn transfer(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
            let caller = get_caller_address();
            let from_bal = self.balances.read(caller);
            assert!(from_bal >= amount, "insufficient balance");
            self.balances.write(caller, from_bal - amount);
            let to_bal = self.balances.read(recipient);
            self.balances.write(recipient, to_bal + amount);
            true
        }

        fn transfer_from(
            ref self: ContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            let caller = get_caller_address();
            let allowed = self.allowances.read((sender, caller));
            assert!(allowed >= amount, "insufficient allowance");
            let from_bal = self.balances.read(sender);
            assert!(from_bal >= amount, "insufficient balance");
            self.allowances.write((sender, caller), allowed - amount);
            self.balances.write(sender, from_bal - amount);
            let to_bal = self.balances.read(recipient);
            self.balances.write(recipient, to_bal + amount);
            true
        }

        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            let caller = get_caller_address();
            self.allowances.write((caller, spender), amount);
            true
        }

        fn allowance(self: @ContractState, owner: ContractAddress, spender: ContractAddress) -> u256 {
            self.allowances.read((owner, spender))
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }
    }
}
