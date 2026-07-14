---
sidebar_position: 1
---

# Getting Started

## Prerequisites

- [Lichtblick](https://github.com/lichtblick-suite/lichtblick) (desktop or web)
- An MCAP file with an OpenDRIVE map channel (for example from [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime))
- Node.js 20+ and yarn 1.22+ (for building from source)
- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) (for building the WASM module)

## Installation

### From Source

```bash
# Clone with submodules (includes libOpenDRIVE C++ library)
git clone --recurse-submodules https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter
yarn install

# Build WASM module (one-time, cached unless libOpenDRIVE changes)
yarn build:wasm

# Build the extension and install to local Lichtblick
yarn build
yarn local-install
```

> **Note:** `yarn build:wasm` requires `emcmake` in PATH. See [Emscripten setup](https://emscripten.org/docs/getting_started/downloads.html).

### From Release

Download the `.foxe` file from the [Releases page](https://github.com/lichtblick-suite/asam-opendrive-converter/releases) and install it via Lichtblick's extension manager.

## Usage

1. Open Lichtblick
2. Load an MCAP file containing an OpenDRIVE map channel
   - The channel schema must be `osi3.MapAsamOpenDrive`
3. Add a **3D (Scene)** panel to your layout
4. The road network map renders automatically as a static overlay

## Supported Data Sources

| Source | Format | Channel |
|--------|--------|---------|
| OMEGA PRIME | MCAP + protobuf | map channel carrying `osi3.MapAsamOpenDrive` |
| Custom | MCAP + protobuf | Any channel decoded as `osi3.MapAsamOpenDrive` |

## What Gets Rendered

The converter produces `SceneUpdate` messages with:

- **Lane surfaces**: triangle meshes colored by `e_laneType`
- **Lane boundaries**: line primitives at lane edges
- **Road markings**: filled polygon meshes with natural dash/gap patterns from libOpenDRIVE
- **Road objects**: triangle meshes for OpenDRIVE road objects
- **Road signals**: triangle meshes for OpenDRIVE signals

All entities use `frame_id="proj_frame"` when the map has a `<geoReference>` (enabling alignment with the OSI converter), or `frame_id="map_local"` as fallback for maps without geographic context.
