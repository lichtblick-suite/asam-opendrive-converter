# ASAM OpenDRIVE Converter — Lichtblick Extension

Visualizes ASAM OpenDRIVE road network maps from [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime) MCAP recordings in Lichtblick's 3D panel.

## Overview

This extension registers a **message converter** that transforms `osi3.MapAsamOpenDrive` protobuf messages into `foxglove.SceneUpdate` scene entities. The OpenDRIVE map is rendered as:

- **Lane surfaces** — Color-coded triangle meshes (driving=dark gray, sidewalk=light gray, etc.)
- **Lane boundaries** — White lines along lane edges
- **Road markings** — White/yellow lines matching marking type and color

The map is static — it is parsed once from the first message and cached for the duration of the recording.

## Supported Input

| Format | Details |
|--------|---------|
| **Container** | MCAP files following the OMEGA PRIME specification |
| **Topic** | `ground_truth_map` or `/ground_truth_map` |
| **Schema** | `osi3.MapAsamOpenDrive` (protobuf) |
| **Content** | OpenDRIVE 1.4+ XML embedded as a UTF-8 string |

## Supported OpenDRIVE Elements

| Element | Status |
|---------|--------|
| Road reference lines (line, arc, spiral, poly3, paramPoly3) | ✅ |
| Lane sections & lanes | ✅ |
| Lane width polynomials | ✅ |
| Lane types (driving, sidewalk, shoulder, etc.) | ✅ |
| Road markings (solid, broken, colors) | ✅ |
| Lane boundaries | ✅ |
| Elevation profile | ✅ |
| Junctions | ✅ |
| Traffic signals & signs | ❌ (planned) |
| Road objects (barriers, poles) | ❌ (planned) |
| Superelevation/crossfall | ❌ (planned) |

## Installation

### Prerequisites

- **Node.js** ≥ 20.19, **npm** ≥ 10
- **Emscripten SDK** (for building the WASM module)

```bash
# Install emsdk (one-time)
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk && ./emsdk install latest && ./emsdk activate latest
source emsdk_env.sh
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
| `npm run build:wasm` | Compile libOpenDRIVE C++ → WASM via Emscripten (outputs `src/wasm/`) |
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
│  + src/Embind.cpp         →  src/wasm/*.{js,wasm}  │
└────────────────────────────────────────────────────┘
  Cache key: submodule commit hash + CMakeLists.txt + Embind.cpp

Phase 2: TypeScript → Extension (fast, always runs)
┌────────────────────────────────────────────────────┐
│  src/**/*.ts + src/wasm/*  →  dist/extension.js    │
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
- **Show Lane Surfaces** — Toggle lane surface mesh rendering
- **Show Lane Boundaries** — Toggle boundary line rendering
- **Show Road Markings** — Toggle road marking rendering
- **Tessellation Step Size** — Adjust geometry resolution (smaller = smoother, default: 1.0m)

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

Download test files from the [OMEGA PRIME repository](https://github.com/ika-rwth-aachen/omega-prime):

```bash
# Pre-built MCAP with embedded OpenDRIVE
curl -LO https://raw.githubusercontent.com/ika-rwth-aachen/omega-prime/main/example_files/osi_centerline_example.mcap

# OpenDRIVE map files
curl -LO https://raw.githubusercontent.com/ika-rwth-aachen/omega-prime/main/example_files/fabriksgatan.xodr
```

To generate OMEGA PRIME MCAP files from OSI traces + OpenDRIVE maps:

```bash
pip install omega-prime
python -c "
import omega_prime
r = omega_prime.Recording.from_file('pedestrian.osi', map_path='fabriksgatan.xodr')
r.to_mcap('test.mcap')
"
```

## Architecture

```
asam-opendrive-converter/
├── submodule/libOpenDRIVE/     # C++ geometry kernel (git submodule)
│   └── src/Embind.cpp          # Emscripten bindings for WASM export
├── CMakeLists.txt              # WASM build configuration
├── scripts/
│   ├── build-wasm.sh           # Build WASM module (Phase 1)
│   └── check-wasm.js           # Verify artifacts exist
├── src/
│   ├── wasm/                   # WASM artifacts + TS types/loader
│   │   ├── types.ts            # TypeScript interface for WASM module
│   │   ├── index.ts            # Lazy-loading wrapper
│   │   ├── libOpenDRIVE.js     # [generated] Emscripten glue
│   │   └── libOpenDRIVE.wasm   # [generated] Compiled binary
│   ├── index.ts                # Extension entry point (activate)
│   ├── converters/             # Message converter registration + caching
│   ├── parser/                 # OpenDRIVE XML → typed data (interim, to be replaced)
│   ├── geometry/               # TS geometry engine (interim, to be replaced by WASM)
│   ├── features/               # Scene entity builders (lanes, boundaries, markings)
│   ├── config/                 # Constants, colors, entity ID prefixes
│   └── utils/                  # Shared utilities (scene helpers, proto types)
└── .github/workflows/check.yaml  # 2-phase CI (build-wasm → check)
```

The C++ library (libOpenDRIVE) handles **all geometry computation** — reference line evaluation, lane boundaries, tessellation, road marks. TypeScript only maps the output meshes to Foxglove `SceneUpdate` schema.

## License

Apache-2.0