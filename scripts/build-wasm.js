#!/usr/bin/env node
/**
 * Cross-platform build script for the libOpenDRIVE WASM module.
 * Replaces the bash-only build-wasm.sh to support Windows, Linux, and macOS.
 *
 * Prerequisites: emsdk installed and activated (emcmake/emmake in PATH or EMSDK set)
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PROJECT_DIR = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(PROJECT_DIR, "build-wasm");
const OUTPUT_DIR = path.join(PROJECT_DIR, "src", "wasm");
const SUBMODULE_CMAKE = path.join(
  PROJECT_DIR,
  "submodule",
  "libOpenDRIVE",
  "CMakeLists.txt",
);

const isWindows = os.platform() === "win32";

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    cwd: opts.cwd ?? PROJECT_DIR,
    env: { ...process.env, ...opts.env },
    shell: isWindows ? "cmd.exe" : "/bin/sh",
  });
}

function commandExists(cmd) {
  try {
    const where = isWindows ? "where" : "which";
    execSync(`${where} ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function findEmsdk() {
  // Already in PATH?
  if (commandExists("emcmake")) {
    return null; // no sourcing needed
  }

  const candidates = [
    process.env.EMSDK,
    path.join(PROJECT_DIR, "emsdk"),
    path.join(PROJECT_DIR, "..", "emsdk"),
    path.join(os.homedir(), "emsdk"),
    path.join(os.homedir(), ".emsdk"),
    "/opt/emsdk",
    "C:\\emsdk",
    "C:\\repositories\\emsdk",
  ].filter(Boolean);

  for (const loc of candidates) {
    const envScript = isWindows
      ? path.join(loc, "emsdk_env.bat")
      : path.join(loc, "emsdk_env.sh");
    if (fs.existsSync(envScript)) {
      return loc;
    }
  }

  return undefined;
}

function sourceEmsdk(emsdkDir) {
  if (isWindows) {
    // On Windows, run emsdk_env.bat and capture the modified PATH
    const envScript = path.join(emsdkDir, "emsdk_env.bat");
    console.log(`Sourcing emsdk from: ${emsdkDir}`);
    // Add emsdk paths directly to process.env
    const upstreamEmscripten = path.join(emsdkDir, "upstream", "emscripten");
    process.env.PATH = `${emsdkDir};${upstreamEmscripten};${process.env.PATH}`;
    process.env.EMSDK = emsdkDir;
  } else {
    // On Unix, we can't truly source, but we can add to PATH
    const envScript = path.join(emsdkDir, "emsdk_env.sh");
    console.log(`Sourcing emsdk from: ${emsdkDir}`);
    const upstreamEmscripten = path.join(emsdkDir, "upstream", "emscripten");
    process.env.PATH = `${emsdkDir}:${upstreamEmscripten}:${process.env.PATH}`;
    process.env.EMSDK = emsdkDir;
  }

  if (!commandExists("emcmake")) {
    console.error("ERROR: emcmake still not found after sourcing emsdk.");
    process.exit(1);
  }
}

// --- Main ---

console.log("=== Building libOpenDRIVE WASM module ===\n");

// 1. Find and activate emsdk
const emsdkDir = findEmsdk();
if (emsdkDir === undefined) {
  console.error("ERROR: emcmake not found. Install and activate emsdk first:\n");
  console.error("  git clone https://github.com/emscripten-core/emsdk.git");
  console.error(
    "  cd emsdk && ./emsdk install latest && ./emsdk activate latest",
  );
  if (isWindows) {
    console.error("  emsdk_env.bat");
  } else {
    console.error("  source emsdk_env.sh");
  }
  console.error("\nOr set the EMSDK environment variable to your emsdk directory.");
  process.exit(1);
} else if (emsdkDir !== null) {
  sourceEmsdk(emsdkDir);
}

// 2. Ensure submodule is initialized
if (!fs.existsSync(SUBMODULE_CMAKE)) {
  console.log("Initializing git submodule...");
  run("git submodule update --init --recursive");
}

// 3. Clean and create build directory
if (fs.existsSync(BUILD_DIR)) {
  try {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true, maxRetries: 3, retryDelay: 1000 });
  } catch {
    // Fallback to native rm for locked files (Windows EPERM)
    if (isWindows) {
      run(`rmdir /s /q "${BUILD_DIR}"`, { cwd: PROJECT_DIR });
    } else {
      run(`rm -rf "${BUILD_DIR}"`, { cwd: PROJECT_DIR });
    }
  }
}
fs.mkdirSync(BUILD_DIR, { recursive: true });

// 4. Configure with Emscripten
console.log("\nConfiguring...");
const useNinja = commandExists("ninja");
const generator = useNinja ? "-G Ninja" : "";
run(`emcmake cmake ${generator} -DCMAKE_BUILD_TYPE=Release "${PROJECT_DIR}"`, {
  cwd: BUILD_DIR,
});

// 5. Build
console.log("\nCompiling...");
if (useNinja) {
  run("emmake ninja", { cwd: BUILD_DIR });
} else {
  const jobs = os.cpus().length;
  run(`emmake make -j${jobs}`, { cwd: BUILD_DIR });
}

// 6. Copy output to src/wasm/
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const builtJs = path.join(BUILD_DIR, "libOpenDRIVE.js");
const destJs = path.join(OUTPUT_DIR, "libOpenDRIVE.js");
fs.copyFileSync(builtJs, destJs);

// Remove stale .wasm file if present from prior builds (SINGLE_FILE=1 embeds it)
const staleWasm = path.join(OUTPUT_DIR, "libOpenDRIVE.wasm");
if (fs.existsSync(staleWasm)) {
  fs.unlinkSync(staleWasm);
}

// 7. Report success
const jsSize = fs.statSync(destJs).size;
console.log("\n=== Build complete ===");
console.log(
  `Output: ${destJs} (${(jsSize / 1024 / 1024).toFixed(1)} MB)`,
);
