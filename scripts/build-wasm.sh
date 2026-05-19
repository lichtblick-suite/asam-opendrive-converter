#!/usr/bin/env bash
# Build libOpenDRIVE as a WASM module
# Prerequisites: emsdk installed and activated (source emsdk_env.sh)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
BUILD_DIR="${PROJECT_DIR}/build-wasm"
OUTPUT_DIR="${PROJECT_DIR}/src/wasm"

echo "=== Building libOpenDRIVE WASM module ==="

# Check emscripten is available
if ! command -v emcmake &> /dev/null; then
    echo "ERROR: emcmake not found. Install and activate emsdk first:"
    echo "  git clone https://github.com/emscripten-core/emsdk.git"
    echo "  cd emsdk && ./emsdk install latest && ./emsdk activate latest"
    echo "  source emsdk_env.sh"
    exit 1
fi

# Ensure submodule is initialized
if [ ! -f "${PROJECT_DIR}/submodule/libOpenDRIVE/CMakeLists.txt" ]; then
    echo "Initializing git submodule..."
    git -C "${PROJECT_DIR}" submodule update --init --recursive
fi

# Clean and create build directory
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Configure with Emscripten
echo "Configuring..."
cd "${BUILD_DIR}"
emcmake cmake -DCMAKE_BUILD_TYPE=Release "${PROJECT_DIR}"

# Build
echo "Compiling..."
emmake make -j"$(nproc)"

# Copy output to src/wasm/
mkdir -p "${OUTPUT_DIR}"
cp "${BUILD_DIR}/libOpenDRIVE.js" "${OUTPUT_DIR}/"
cp "${BUILD_DIR}/libOpenDRIVE.wasm" "${OUTPUT_DIR}/"

echo ""
echo "=== Build complete ==="
echo "Output files:"
ls -lh "${OUTPUT_DIR}/libOpenDRIVE.js" "${OUTPUT_DIR}/libOpenDRIVE.wasm"
echo ""
echo "WASM module ready at: ${OUTPUT_DIR}/"
