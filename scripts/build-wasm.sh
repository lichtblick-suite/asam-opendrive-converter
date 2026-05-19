#!/usr/bin/env bash
# Build libOpenDRIVE as a WASM module
# Prerequisites: emsdk installed (auto-detected from common locations)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
BUILD_DIR="${PROJECT_DIR}/build-wasm"
OUTPUT_DIR="${PROJECT_DIR}/src/wasm"

echo "=== Building libOpenDRIVE WASM module ==="

# Auto-detect and source emsdk if not already in PATH
if ! command -v emcmake &> /dev/null; then
    EMSDK_LOCATIONS=(
        "${EMSDK:-}"
        "${HOME}/emsdk"
        "${HOME}/.emsdk"
        "/opt/emsdk"
        "${PROJECT_DIR}/emsdk"
    )
    FOUND=false
    for loc in "${EMSDK_LOCATIONS[@]}"; do
        if [ -n "${loc}" ] && [ -f "${loc}/emsdk_env.sh" ]; then
            echo "Sourcing emsdk from: ${loc}"
            source "${loc}/emsdk_env.sh" 2>/dev/null
            FOUND=true
            break
        fi
    done

    if ! $FOUND || ! command -v emcmake &> /dev/null; then
        echo "ERROR: emcmake not found. Install and activate emsdk first:"
        echo ""
        echo "  git clone https://github.com/emscripten-core/emsdk.git ~/emsdk"
        echo "  cd ~/emsdk && ./emsdk install latest && ./emsdk activate latest"
        echo "  source ~/emsdk/emsdk_env.sh"
        echo ""
        echo "Or set EMSDK env var to your emsdk directory."
        exit 1
    fi
fi

# Ensure submodule is initialized
if [ ! -f "${PROJECT_DIR}/submodule/libOpenDRIVE/CMakeLists.txt" ]; then
    echo "Initializing git submodule..."
    git -C "${PROJECT_DIR}" submodule update --init --recursive
fi

# Clean and create build directory
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Configure with Emscripten (use Ninja for proper dependency handling)
echo "Configuring..."
cd "${BUILD_DIR}"
if command -v ninja &> /dev/null; then
    emcmake cmake -G Ninja -DCMAKE_BUILD_TYPE=Release "${PROJECT_DIR}"
    echo "Compiling..."
    emmake ninja
else
    emcmake cmake -DCMAKE_BUILD_TYPE=Release "${PROJECT_DIR}"
    echo "Compiling..."
    emmake make -j"$(nproc)"
fi

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
