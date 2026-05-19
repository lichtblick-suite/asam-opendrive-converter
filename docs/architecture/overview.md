---
sidebar_position: 1
---

# Architecture Overview

## libOpenDRIVE WASM Architecture

This extension uses [libOpenDRIVE](https://github.com/pageldev/libOpenDRIVE/) compiled to **WebAssembly** as the only geometry engine. TypeScript extracts the OpenDRIVE XML, loads the WASM module, adapts the returned meshes to Foxglove `SceneUpdate`, and caches the result per map/settings combination.

### High-Level Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fontSize': '14px', 'primaryColor': '#bbdefb', 'primaryTextColor': '#1a1a1a', 'primaryBorderColor': '#1565c0', 'lineColor': '#546e7a', 'secondaryColor': '#ffe0b2', 'tertiaryColor': '#c8e6c9'}}}%%
graph TD
    MCAP["MCAP File\nOMEGA PRIME recording"] -->|"protobuf channel"| DESER["Proto Deserializer\nutils/proto.ts"]
    DESER -->|"OpenDRIVE XML string"| WASM["libOpenDRIVE WASM\nwasm/libOpenDRIVE.js"]
    SETTINGS["Panel Settings\npanelSettings.ts"] --> ADAPTER
    WASM -->|"RoadNetworkMesh"| ADAPTER["Schema Adapter\nsceneUpdateConverter.ts"]
    ADAPTER -->|"SceneEntity entities + deletions"| SCENE["SceneUpdate"]
    ADAPTER <-->|"cache hit/miss"| CACHE["Converter Context Cache\ncontext.ts"]
    SCENE --> PANEL["Lichtblick 3D Panel"]

    style MCAP fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    style DESER fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    style WASM fill:#bbdefb,stroke:#0d47a1,stroke-width:2px,color:#0d47a1
    style SETTINGS fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
    style ADAPTER fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#bf360c
    style CACHE fill:#ede7f6,stroke:#5e35b1,color:#311b92
    style SCENE fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
    style PANEL fill:#c8e6c9,stroke:#1b5e20,stroke-width:2px,color:#1b5e20
```

### Why libOpenDRIVE

1. **Standards-aligned geometry** — libOpenDRIVE handles line, arc, spiral, poly3, paramPoly3, and cubic bezier reference-line geometry together with elevation, superelevation, crossfall, lane offset, and lane height.
2. **Feature-complete meshes** — the WASM pipeline returns lane surfaces, lane outlines, road markings, road objects, and road signals as ready-to-adapt mesh data.
3. **Adaptive tessellation** — `get_road_network_mesh(eps)` uses an error-bounded tolerance instead of fixed-distance sampling.
4. **Single geometry kernel** — road topology and mesh generation live in one C++ codebase instead of being split across multiple TypeScript implementations.

### Runtime Responsibilities

- **`src/utils/proto.ts`** — defines the `MapAsamOpenDrive` message shape used by the converter.
- **`src/wasm/`** — lazy-loads the generated libOpenDRIVE module and exposes TypeScript typings for the Emscripten bindings.
- **`src/converters/openDriveMap/sceneUpdateConverter.ts`** — drives the XML → WASM → `SceneUpdate` conversion and builds Foxglove entities for all feature layers.
- **`src/converters/openDriveMap/context.ts`** — stores the cache key (`map_reference` + settings hash) and cached entities.
- **`src/converters/openDriveMap/panelSettings.ts`** — exposes layer toggles plus tessellation tolerance.
- **`src/utils/scene.ts`** — provides Foxglove primitive helpers and shared entity defaults.

## Current Module Structure

```text
src/
├── index.ts
├── config/
│   └── constants.ts
├── converters/
│   ├── index.ts
│   └── openDriveMap/
│       ├── context.ts
│       ├── panelSettings.ts
│       └── sceneUpdateConverter.ts
├── utils/
│   ├── proto.ts
│   └── scene.ts
└── wasm/
    ├── index.ts
    ├── types.ts
    └── libOpenDRIVE.js
```

## Design Principles

1. **Standards-based** — implementation and documentation reference ASAM OpenDRIVE V1.8.1 sections.
2. **WASM-first** — libOpenDRIVE performs geometry parsing, topology handling, and mesh generation.
3. **Thin TypeScript adapter** — the extension focuses on deserialization, schema mapping, and panel integration.
4. **Cache-aware** — identical `map_reference` and rendering settings reuse the same generated entities.
5. **Foxglove-native output** — the final artifact is a `SceneUpdate` with stable entity IDs and explicit deletions on settings changes.
