#!/bin/bash
# Deploy SLPM Verifier Contract to Ztarknet

set -e

cd "$(dirname "$0")"

URL="https://ztarknet-madara.d.karnot.xyz"
ACCOUNT_NAME="ztarknet"

echo "🚀 Deploying SLPM Verifier Contract..."

# Check if verifier contract is built
if [ ! -d "slpm_verifier/target/release" ]; then
    echo "❌ Error: Verifier contract not built. Run ./build-circuit.sh first."
    exit 1
fi

# Declare the contract
echo "📢 Declaring verifier contract..."
cd slpm_verifier
DECLARE_OUTPUT=$(sncast declare --contract-name UltraStarknetZKHonkVerifier --url "$URL" --account "$ACCOUNT_NAME")
echo "$DECLARE_OUTPUT"

# Extract class hash from output
CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oP 'class_hash: \K0x[0-9a-fA-F]+' | head -1)

if [ -z "$CLASS_HASH" ]; then
    echo "❌ Error: Failed to extract class hash from declare output"
    exit 1
fi

echo "✅ Class hash: $CLASS_HASH"

# Deploy via UDC
echo "📦 Deploying contract via Universal Deployer..."
UDC_ADDRESS="0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf"

DEPLOY_OUTPUT=$(sncast invoke \
  --contract-address "$UDC_ADDRESS" \
  --function "deployContract" \
  --calldata "$CLASS_HASH" 0x0 0x0 0x0 \
  --url "$URL" \
  --account "$ACCOUNT_NAME")

echo "$DEPLOY_OUTPUT"

# Extract transaction hash
TX_HASH=$(echo "$DEPLOY_OUTPUT" | grep -oP 'transaction_hash: \K0x[0-9a-fA-F]+')

echo ""
echo "✅ Deployment transaction sent!"
echo "Transaction Hash: $TX_HASH"
echo ""
echo "🔍 Check the transaction in the explorer:"
echo "https://explorer-zstarknet.d.karnot.xyz/tx/$TX_HASH"
echo ""
echo "📝 Look for the 'ContractDeployed' event to get the contract address"
echo ""
echo "💾 Save the contract address to use in your privacy_mixer.cairo"
