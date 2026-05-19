#!/usr/bin/env node
/**
 * Checks that the libOpenDRIVE WASM artifacts exist.
 * Run `npm run build:wasm` first if they're missing.
 */
const fs = require("fs");
const path = require("path");

const wasmDir = path.join(__dirname, "..", "src", "wasm");
const jsFile = path.join(wasmDir, "libOpenDRIVE.js");

const jsExists = fs.existsSync(jsFile);

if (jsExists) {
  const jsSize = fs.statSync(jsFile).size;
  console.log(
    `✓ WASM artifact present (js+wasm: ${(jsSize / 1024).toFixed(0)}KB)`,
  );
  process.exit(0);
}

console.error("✗ WASM artifact missing:");
console.error(`  - ${jsFile}`);
console.error("");
console.error("Run: npm run build:wasm");
console.error("");
console.error("Prerequisites: emsdk installed and activated");
console.error("  git clone https://github.com/emscripten-core/emsdk.git");
console.error("  cd emsdk && ./emsdk install latest && ./emsdk activate latest");
console.error('  source emsdk_env.sh"');
process.exit(1);
