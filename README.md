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

### Local Development

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Install into local Lichtblick
npm run local-install
```

### From Package

```bash
npm run package
# Install the generated .foxe file via Lichtblick's extension manager
```

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

# Build
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
src/
├── index.ts                    # Extension entry point (activate)
├── converters/                 # Message converter registration + caching
├── parser/                     # OpenDRIVE XML → typed data structures
├── geometry/                   # Road geometry math (reference lines, lanes, tessellation)
├── features/                   # Scene entity builders (lanes, boundaries, markings)
├── config/                     # Constants, colors, entity ID prefixes
└── utils/                      # Shared utilities (scene helpers, proto types)
```

## License

Apache-2.0