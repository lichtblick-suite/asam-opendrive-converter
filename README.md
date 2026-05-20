# ASAM OpenDRIVE Converter — Lichtblick Extension

Visualizes ASAM OpenDRIVE road network maps from [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime) MCAP recordings in Lichtblick's 3D panel.

## Overview

This extension registers a **message converter** that transforms `osi3.MapAsamOpenDrive` protobuf messages into `foxglove.SceneUpdate` scene entities. The OpenDRIVE map is rendered as:

- **Lane surfaces** — color-coded triangle meshes (24 lane types)
- **Lane boundaries** — white line segments along lane outlines
- **Road markings** — filled polygon meshes with natural dash/gap patterns
- **Road objects** — triangle meshes for OpenDRIVE road objects
- **Road signals** — triangle meshes for OpenDRIVE signals

The map is static — it is processed once per unique `map_reference` + panel settings combination and then served from cache.

## Supported Input

| Format | Details |
|--------|---------|
| **Container** | MCAP files following the OMEGA PRIME specification |
| **Topic** | `ground_truth_map` or `/ground_truth_map` |
| **Schema** | `osi3.MapAsamOpenDrive` (protobuf) |
| **Content** | OpenDRIVE XML embedded as a UTF-8 string |

## Supported OpenDRIVE Elements

All geometry computation is handled by [libOpenDRIVE](https://github.com/lichtblick-suite/libOpenDRIVE) (fork of [pageldev/libOpenDRIVE](https://github.com/pageldev/libOpenDRIVE), targets **OpenDRIVE 1.4**).

| Element | Status |
|---------|--------|
| Road reference lines (line, arc, spiral, poly3, paramPoly3, cubic bezier) | ✅ |
| Lane sections & lanes | ✅ |
| Lane width, border, offset, and height | ✅ |
| Lane types (driving, sidewalk, shoulder, walking, shared, tram, rail, bus, taxi, hov, etc.) | ✅ |
| Road markings (solid, broken, colors) | ✅ |
| Lane boundaries | ✅ |
| Elevation profile | ✅ |
| Superelevation/crossfall | ✅ |
| Junctions | ✅ |
| Traffic signals & signs | ✅ |
| Road objects (barriers, poles, etc.) | ✅ |

## Installation

### Prerequisites

- **Node.js** ≥ 20.19, **npm** ≥ 10
- **CMake** ≥ 3.14
- **Ninja** (recommended) or Make
- **Emscripten SDK** (for building the WASM module)

#### Linux / macOS

```bash
# Install CMake and Ninja (if not already installed)
# Ubuntu/Debian:
sudo apt-get install cmake ninja-build
# macOS:
brew install cmake ninja

# Install emsdk (one-time)
git clone https://github.com/emscripten-core/emsdk.git ~/emsdk
cd ~/emsdk && ./emsdk install latest && ./emsdk activate latest
source ~/emsdk/emsdk_env.sh
```

#### Windows

```powershell
# Install prerequisites via winget
winget install OpenJS.NodeJS.LTS
winget install Kitware.CMake
winget install Ninja-build.Ninja

# Install emsdk (one-time)
git clone https://github.com/emscripten-core/emsdk.git C:\emsdk
cd C:\emsdk
.\emsdk.bat install latest
.\emsdk.bat activate latest --permanent

# Set EMSDK env var (for the build script to auto-detect)
[Environment]::SetEnvironmentVariable("EMSDK", "C:\emsdk", "User")
```

### Local Development

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter

# Install npm dependencies
npm install

# Build the WASM module (cached — only needed once unless libOpenDRIVE changes)
npm run build:wasm

# Build the extension (checks WASM artifacts, then bundles TypeScript)
npm run build

# Install into local Lichtblick
npm run local-install
```

### From Package

```bash
npm run package
# Install the generated .foxe file via Lichtblick's extension manager
```

## Build Commands

All build commands are centralized in `package.json` — **CI and developers use the same scripts**:

| Command | Description |
|---------|-------------|
| `npm run build:wasm` | Compile libOpenDRIVE C++ → single-file WASM JS bundle in `src/wasm/` |
| `npm run build:wasm:check` | Verify WASM artifacts exist (fails fast if missing) |
| `npm run build` | Full build: check WASM + bundle TypeScript extension |
| `npm test` | Run Jest unit tests |
| `npm run lint` | ESLint with auto-fix |
| `npm run lint:ci` | ESLint without auto-fix (CI mode) |
| `npm run package` | Build production `.foxe` package |
| `npm run local-install` | Install extension into local Lichtblick |

### Two-Phase Build

```
Phase 1: C++ → WASM (slow, cached)
┌────────────────────────────────────────────────────┐
│  submodule/libOpenDRIVE/  →  emcmake/emmake        │
│  + src/Embind.cpp         →  src/wasm/libOpenDRIVE.js │
└────────────────────────────────────────────────────┘
  Cache key: submodule commit hash + CMakeLists.txt + Embind.cpp

Phase 2: TypeScript → Extension (fast, always runs)
┌────────────────────────────────────────────────────┐
│  src/**/*.ts + src/wasm/libOpenDRIVE.js → dist/extension.js │
└────────────────────────────────────────────────────┘
```

The WASM build is cached both locally (artifacts persist in `src/wasm/`) and in CI (via `actions/cache` keyed on the submodule commit). It only needs to rebuild when:
- `submodule/libOpenDRIVE` is updated to a new commit
- `CMakeLists.txt` or `Embind.cpp` bindings change

## Usage

1. Open an OMEGA PRIME MCAP file in Lichtblick
2. Add a **3D panel** to your layout
3. The road map will automatically render when a `ground_truth_map` topic is present

### Panel Settings

In the 3D panel topic settings, you can toggle:
- **Show Lane Surfaces** — toggle lane surface mesh rendering
- **Show Lane Boundaries** — toggle boundary line rendering
- **Show Road Markings** — toggle road marking rendering
- **Show Road Objects** — toggle road object rendering
- **Show Road Signals** — toggle road signal rendering
- **Tessellation Tolerance (m)** — adjust libOpenDRIVE mesh density (smaller = smoother, default: `0.1`)

## Development

```bash
# Run tests
npm test

# Type-check
npx tsc --noEmit

# Rebuild WASM (after updating submodule/libOpenDRIVE)
npm run build:wasm

# Full build
npm run build
```

## Test Data

Example MCAP files are included in `test-data/` (see [`test-data/README.md`](test-data/README.md) for details and licenses):

- **`pedestrian_fabriksgatan.mcap`** — full playback scenario with pedestrian OSI trace + map
- **`combined_example.mcap`** — feature-rich merged map (highway + intersection + signals)
- **`tunnels.mcap`** — tunnels, barriers, lane emergence, elevation
- **`multi_intersections.mcap`** — dynamic traffic lights, pedestrian signals, complex junctions

To generate your own MCAP from OpenDRIVE + OSI traces:

```bash
pip install omega-prime
python -c "
import omega_prime
r = omega_prime.Recording.from_file('pedestrian.osi', map_path='fabriksgatan.xodr')
r.to_mcap('test.mcap')
"
```

Or use the standalone script for map-only MCAPs (no OSI trace needed):

```bash
pip install mcap
python test-data/create_mcap.py my_map.xodr -o output.mcap
```

## Architecture

```
asam-opendrive-converter/
├── submodule/libOpenDRIVE/     # C++ geometry kernel (git submodule)
│   └── src/Embind.cpp          # Emscripten bindings for WASM export
├── CMakeLists.txt              # WASM build configuration
├── scripts/
│   ├── build-wasm.js           # Build WASM module (Phase 1, cross-platform)
│   └── check-wasm.js           # Verify artifacts exist
├── src/
│   ├── index.ts                # Extension entry point (activate)
│   ├── config/
│   │   └── constants.ts        # Colors, z-offsets, spec references
│   ├── converters/
│   │   ├── index.ts            # Re-exports
│   │   └── openDriveMap/
│   │       ├── context.ts      # Settings interface, caching context
│   │       ├── meshUtils.ts    # Vertex extraction, index partitioning, remapping
│   │       ├── panelSettings.ts # Panel UI toggles + handler
│   │       └── sceneUpdateConverter.ts # Main: XML → WASM → SceneUpdate
│   ├── utils/
│   │   ├── proto.ts            # MapAsamOpenDrive interface
│   │   └── scene.ts            # Foxglove SceneEntity helpers
│   └── wasm/
│       ├── index.ts            # Eager WASM loader (singleton, starts at activate())
│       ├── types.ts            # TypeScript interfaces for WASM module
│       └── libOpenDRIVE.js     # [generated] WASM+JS (SINGLE_FILE)
└── .github/workflows/check.yaml  # 2-phase CI (build-wasm → check)
```

The C++ library (libOpenDRIVE) handles **all geometry computation** — reference lines, lane surfaces, boundaries, road markings, objects, signals, and lateral profiles. TypeScript loads the WASM module, adapts the returned mesh data, and publishes Foxglove `SceneUpdate` entities.

## License

Apache-2.0