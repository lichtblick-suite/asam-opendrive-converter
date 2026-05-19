---
sidebar_position: 1
---

# Architecture Overview

## Current vs Future Architecture

This extension currently uses a **pure TypeScript geometry engine** that reimplements OpenDRIVE geometry evaluation. The [libOpenDRIVE](https://github.com/pageldev/libOpenDRIVE/) C++ library is the reference implementation we validated against — a future version may integrate it as a **WASM module** to gain full feature coverage without reimplementing complex algorithms.

### Current Architecture (Pure TypeScript)

```mermaid
graph TD
    MCAP[MCAP File<br/>OMEGA PRIME recording] -->|protobuf channel| DESER[Proto Deserializer<br/><code>src/utils/proto.ts</code>]
    DESER -->|OpenDRIVE XML string| PARSER[XML Parser<br/><code>fast-xml-parser</code>]
    PARSER -->|Typed OpenDriveMap| GEOM[TypeScript Geometry Engine<br/><code>src/geometry/*.ts</code>]
    GEOM -->|3D points & meshes| FEAT[Feature Builders<br/><code>src/features/*.ts</code>]
    FEAT -->|SceneEntity array| SCENE[SceneUpdate<br/>Foxglove schema]
    SCENE -->|render| PANEL[Lichtblick 3D Panel]

    style GEOM fill:#ffe0b2,stroke:#e65100
    style PANEL fill:#c8e6c9,stroke:#2e7d32
```

**Limitation:** Our TypeScript engine only covers ~41% of OpenDRIVE features (no superelevation, no objects/signals, no adaptive sampling, no dashed markings).

### Future Architecture (with libOpenDRIVE WASM)

```mermaid
graph TD
    MCAP[MCAP File<br/>OMEGA PRIME recording] -->|protobuf channel| DESER[Proto Deserializer<br/><code>src/utils/proto.ts</code>]
    DESER -->|OpenDRIVE XML string| WASM[libOpenDRIVE WASM Module<br/><code>C++ compiled to WebAssembly</code>]

    WASM -->|Mesh3D vertices/indices| ADAPTER[Schema Adapter<br/><code>TypeScript</code>]
    WASM -->|Line3D border points| ADAPTER
    WASM -->|RoadMark meshes| ADAPTER
    WASM -->|RoadObject meshes| ADAPTER
    WASM -->|RoadSignal meshes| ADAPTER

    ADAPTER -->|SceneEntity array| SCENE[SceneUpdate<br/>Foxglove schema]
    SCENE -->|render| PANEL[Lichtblick 3D Panel]

    style WASM fill:#bbdefb,stroke:#1565c0
    style ADAPTER fill:#ffe0b2,stroke:#e65100
    style PANEL fill:#c8e6c9,stroke:#2e7d32
```

**Benefit:** libOpenDRIVE handles ALL geometry computation in optimized C++ — we only need a thin TypeScript adapter to map its output meshes to Foxglove schema.

## Why libOpenDRIVE WASM Would Be Useful

```mermaid
graph LR
    subgraph "Current: TypeScript Engine (41% coverage)"
        A1[Line ✅]
        A2[Arc ✅]
        A3[Spiral ✅]
        A4[Poly3 ✅]
        A5[ParamPoly3 ✅]
        A6[Elevation ✅]
        A7[Lane Width ✅]
        A8[Superelevation ❌]
        A9[Lane Offset ❌]
        A10[Road Objects ❌]
        A11[Signals ❌]
        A12[Dashed Marks ❌]
    end

    subgraph "libOpenDRIVE WASM (100% coverage)"
        B1[All geometry types ✅]
        B2[Adaptive sampling ✅]
        B3[Superelevation/crossfall ✅]
        B4[Lane offset ✅]
        B5[Road objects → Mesh3D ✅]
        B6[Signals → Mesh3D ✅]
        B7[Dashed road marks ✅]
        B8[Surface normals ✅]
        B9[Cubic Bezier ✅]
    end
```

| Aspect | Current (TypeScript) | Future (WASM) |
|--------|---------------------|---------------|
| **Feature coverage** | 41% of OpenDRIVE | ~95% |
| **Performance** | JS numeric integration | Compiled C++ (5-10× faster) |
| **Sampling** | Fixed 1m steps | Adaptive error-bounded |
| **Maintenance** | We maintain geometry code | Community-maintained library |
| **Bundle size** | ~15KB (source only) | ~200-400KB (WASM binary) |
| **Accuracy** | Simpson's rule approximation | Native double precision |

## How WASM Integration Would Work

```mermaid
sequenceDiagram
    participant LB as Lichtblick Panel
    participant TS as TypeScript Adapter
    participant WASM as libOpenDRIVE.wasm
    participant EM as Emscripten Bindings

    LB->>TS: onMessage(MapAsamOpenDrive)
    TS->>TS: Extract OpenDRIVE XML
    TS->>WASM: OpenDriveMap(xml, options)
    Note over WASM: C++ parses XML,<br/>builds road network

    loop For each Road
        TS->>WASM: road.get_lane_mesh(lane, eps)
        WASM-->>TS: Mesh3D {vertices, indices, normals}
        TS->>TS: Convert to TriangleListPrimitive

        TS->>WASM: road.get_lane_border_line(lane, eps)
        WASM-->>TS: Line3D (point array)
        TS->>TS: Convert to LinePrimitive

        TS->>WASM: road.get_roadmark_mesh(lane, mark, eps)
        WASM-->>TS: Mesh3D
        TS->>TS: Convert to TriangleListPrimitive
    end

    TS->>TS: Assemble SceneUpdate
    TS-->>LB: SceneUpdate {entities[]}
```

The C++ library does all the heavy computation (geometry evaluation, tessellation, mesh generation). TypeScript only:
1. Passes in the XML string
2. Calls the C++ API via Emscripten bindings
3. Maps the returned `Mesh3D`/`Line3D` data to Foxglove schema types

## Current Module Structure

```mermaid
graph TD
    subgraph Entry
        INDEX[src/index.ts<br/>registerConverters]
    end

    subgraph Converters
        CONV[sceneUpdateConverter.ts<br/>Main pipeline + caching]
    end

    subgraph Parser
        PARSE[parseOpenDriveXml.ts<br/>XML → typed model]
        TYPES[types.ts<br/>OpenDRIVE data model]
    end

    subgraph "Geometry Engine (would be replaced by WASM)"
        REF[referenceLineGeometry.ts<br/>5 geometry types + elevation]
        FRES[fresnel.ts<br/>Euler spiral integration]
        LANE[laneGeometry.ts<br/>Width accumulation]
        TESS[tessellation.ts<br/>Triangle strip meshing]
    end

    subgraph Features
        FL[buildLaneEntity.ts<br/>→ TriangleListPrimitive]
        FB[buildLaneBoundaryEntity.ts<br/>→ LinePrimitive]
        FM[buildRoadMarkingEntity.ts<br/>→ LinePrimitive]
    end

    subgraph Utils
        SCENE_U[scene.ts<br/>Foxglove primitive factories]
        PROTO[proto.ts<br/>Protobuf handling]
    end

    INDEX --> CONV
    CONV --> PARSE
    CONV --> REF
    CONV --> LANE
    CONV --> TESS
    CONV --> FL
    CONV --> FB
    CONV --> FM
    REF --> FRES
    LANE --> REF
    FL --> SCENE_U
    FB --> SCENE_U
    FM --> SCENE_U
    CONV --> PROTO

    style REF fill:#ffe0b2,stroke:#e65100
    style FRES fill:#ffe0b2,stroke:#e65100
    style LANE fill:#ffe0b2,stroke:#e65100
    style TESS fill:#ffe0b2,stroke:#e65100
```

The orange-highlighted modules (`src/geometry/*`) are the ones that would be **replaced** by libOpenDRIVE WASM calls. Everything else (parser, features, utils) stays as TypeScript.

## Design Principles

1. **Standards-based** — Every implementation references ASAM OpenDRIVE V1.8.1 section numbers
2. **WASM-ready** — Geometry engine is isolated so it can be swapped for C++ WASM module
3. **Stateless conversion** — Each `SceneUpdate` is self-contained (no incremental state)
4. **Cache-friendly** — Identical maps produce identical output (memoized by reference)
5. **Foxglove-native** — Direct mapping to `SceneEntity` primitives without intermediate formats
