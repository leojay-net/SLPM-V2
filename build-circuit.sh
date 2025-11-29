#!/bin/bash
# SLPM Privacy Mixer - Noir Circuit Build and Garaga Verifier Generation Script

set -e

echo "🔨 Building SLPM Privacy Mixer Circuit..."

# Navigate to circuit directory
cd "$(dirname "$0")/circuit"

# Check if nargo is installed
if ! command -v nargo &> /dev/null; then
    echo "❌ Error: Nargo is not installed. Please install Noir toolchain first."
    echo "Run: curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash"
    echo "Then: noirup --version 1.0.0-beta.5"
    exit 1
fi

# Check if bb (barretenberg) is installed
if ! command -v bb &> /dev/null; then
    echo "❌ Error: Barretenberg (bb) is not installed. Please install it first."
    echo "Run: curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash"
    echo "Then: bbup --version 0.87.4-starknet.1"
    exit 1
fi

# Check if garaga is installed
if ! command -v garaga &> /dev/null; then
    echo "❌ Error: Garaga is not installed. Please install it first."
    echo "Run: pip install garaga==0.18.1"
    echo "Note: Python 3.10 is required"
    exit 1
fi

# Check Noir project
echo "📋 Checking Noir project..."
nargo check

# Execute circuit to generate witness
echo "🔍 Generating witness..."
nargo execute witness

# Generate proof with UltraHonk and Starknet oracle
echo "🔐 Generating ZK proof..."
bb prove --scheme ultra_honk --zk --oracle_hash starknet -b ./target/slpm_privacy_mixer.json -w ./target/witness.gz -o ./target

# Generate verifying key
echo "🔑 Generating verifying key..."
bb write_vk --scheme ultra_honk --oracle_hash starknet -b ./target/slpm_privacy_mixer.json -o ./target

# Generate Cairo verifier contract with Garaga
echo "⚙️ Generating Cairo verifier contract..."
cd ..
garaga gen --system ultra_starknet_zk_honk --vk ./circuit/target/vk --project-name slpm_verifier

# Build the verifier contract
echo "🏗️ Building verifier contract..."
cd slpm_verifier
scarb build

echo "✅ Build complete!"
echo ""
echo "📦 Generated artifacts:"
echo "  - Circuit: circuit/target/slpm_privacy_mixer.json"
echo "  - Proof: circuit/target/proof"
echo "  - Verifying Key: circuit/target/vk"
echo "  - Verifier Contract: slpm_verifier/target/release/"
echo ""
echo "Next steps:"
echo "  1. Deploy the verifier contract to Ztarknet"
echo "  2. Update the privacy_mixer.cairo to use the verifier"
echo "  3. Test the integration"
