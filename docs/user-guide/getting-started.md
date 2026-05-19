---
sidebar_position: 1
---

# Getting Started

## Prerequisites

- [Lichtblick](https://github.com/lichtblick-suite/lichtblick) (desktop or web)
- An MCAP file with an OpenDRIVE map channel (e.g., from [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime))
- Node.js 20+ and npm 10+ (for building from source)
- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) (for building the WASM module)

## Installation

### From Source

```bash
# Clone with submodules (includes libOpenDRIVE C++ library)
git clone --recurse-submodules https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter
npm install

# Build WASM module (one-time, cached unless libOpenDRIVE changes)
npm run build:wasm

# Build the extension and install to local Lichtblick
npm run build
npm run local-install
```

> **Note:** `npm run build:wasm` requires `emcmake` in PATH. See [Emscripten setup](https://emscripten.org/docs/getting_started/downloads.html).

### From Release

Download the `.foxe` file from the [Releases page](https://github.com/lichtblick-suite/asam-opendrive-converter/releases) and install it via Lichtblick's extension manager.

## Usage

1. Open Lichtblick
2. Load an MCAP file containing an OpenDRIVE map channel
   - The channel schema must be `asam.osi.v3.StreamingUpdate` or contain `map_reference` with embedded OpenDRIVE XML
3. Add a **3D (Scene)** panel to your layout
4. The road network map renders automatically as a static overlay

## Supported Data Sources

| Source | Format | Channel |
|--------|--------|---------|
| OMEGA PRIME | MCAP + protobuf | `map` channel with `MapAsamOpenDrive` |
| Custom | MCAP + protobuf | Any channel with schema `asam_opendrive_map` |

## What Gets Rendered

The converter produces `SceneUpdate` messages with:

- **Lane surfaces**: Triangle meshes colored by `e_laneType` (driving=gray, sidewalk=light blue, shoulder=green, etc.)
- **Lane boundaries**: Line primitives at lane edges (white, 2px)
- **Road markings**: Line primitives with colors per `e_roadMarkColor` (white, yellow, blue, green, red, orange)

All entities use `frame_id="global"` (OpenDRIVE inertial frame = Foxglove world frame).
