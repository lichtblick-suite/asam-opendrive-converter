---
slug: /
sidebar_position: 1
---

# ASAM OpenDRIVE Converter

A [Lichtblick](https://github.com/lichtblick-suite/lichtblick) extension that converts ASAM OpenDRIVE road network maps into Foxglove `SceneUpdate` messages for 3D visualization.

## Overview

This extension enables visualization of OpenDRIVE road networks stored in [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime) MCAP recordings. It renders:

- **Lane surfaces** — colored by lane type (driving, sidewalk, shoulder, etc.)
- **Lane boundaries** — polyline edges between lanes
- **Road markings** — colored center/edge lines with standard color mapping
- **Road objects** — barriers, poles, buildings, vegetation [ODR §13]
- **Road signals** — traffic signs and signals [ODR §14]

Geometry computation is handled by [libOpenDRIVE](https://github.com/lichtblick-suite/libOpenDRIVE) (fork of [pageldev/libOpenDRIVE](https://github.com/pageldev/libOpenDRIVE)), compiled to WebAssembly for in-browser execution.

## Key Features

| Feature | Description |
|---------|-------------|
| Full geometry support | Line, arc, spiral (clothoid), poly3, paramPoly3 |
| Elevation profiles | Cubic polynomial elevation along reference line |
| Lane model | Multi-section lanes with cubic width polynomials |
| Road markings | Type-filtered with standard color mapping |
| Road objects | Barriers, poles, buildings, vegetation |
| Road signals | Traffic signs and signals |
| WASM geometry | libOpenDRIVE compiled to WebAssembly |
| Caching | Identical maps are computed once and reused |
| Standards-based | Code comments reference ASAM OpenDRIVE V1.8.1 sections; geometry engine targets V1.4 |

## Quick Start

```bash
# Install from source (requires emsdk for WASM build)
git clone --recurse-submodules https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter
yarn install
yarn build:wasm   # compile C++ → WASM (one-time)
yarn build        # bundle extension
yarn local-install
```

Then open Lichtblick, load an OMEGA PRIME MCAP file, and add a 3D panel. The OpenDRIVE map channel will be automatically converted and rendered.

## Standards

This extension implements portions of:

- [ASAM OpenDRIVE V1.8.1](https://www.asam.net/standards/detail/opendrive/) — Road network description
- [ASAM OSI](https://www.asam.net/standards/detail/osi/) — Open Simulation Interface (coordinate frame)
- [OMEGA PRIME](https://github.com/ika-rwth-aachen/omega-prime) — MCAP recording format with OpenDRIVE channel
- [Foxglove SceneUpdate](https://docs.foxglove.dev/docs/sdk/schemas/scene-update) — 3D visualization schema
