---
sidebar_position: 1
---

# Architecture Overview

## High-Level Pipeline

```
MCAP Channel (protobuf)
    │
    ▼
┌─────────────────────┐
│  Proto Deserializer │  src/utils/proto.ts
│  (MapAsamOpenDrive) │
└─────────┬───────────┘
          │ OpenDRIVE XML string
          ▼
┌─────────────────────┐
│   XML Parser        │  src/parser/parseOpenDriveXml.ts
│   (fast-xml-parser) │
└─────────┬───────────┘
          │ OpenDriveMap typed object
          ▼
┌─────────────────────┐
│   Geometry Engine   │  src/geometry/*.ts
│   (reference line,  │
│    lane boundaries, │
│    tessellation)    │
└─────────┬───────────┘
          │ 3D points & meshes
          ▼
┌─────────────────────┐
│   Feature Builders  │  src/features/*.ts
│   (lanes, bounds,   │
│    road markings)   │
└─────────┬───────────┘
          │ SceneEntity[]
          ▼
┌─────────────────────┐
│   SceneUpdate       │  Foxglove schema output
│   (cached result)   │
└─────────────────────┘
```

## Module Structure

```
src/
├── index.ts                    # Extension entry point (registerConverters)
├── config/
│   ├── constants.ts            # Colors, z-offsets, step size
│   └── entityPrefixes.ts       # SceneEntity ID generation
├── converters/
│   ├── index.ts                # Converter registry
│   └── openDriveMap/
│       ├── context.ts          # Converter context type
│       ├── panelSettings.ts    # Panel settings (future)
│       └── sceneUpdateConverter.ts  # Main pipeline
├── features/
│   ├── lanes/                  # Lane surface triangulation
│   ├── laneBoundaries/         # Lane edge polylines
│   └── roadMarkings/           # Road marking lines
├── geometry/
│   ├── referenceLineGeometry.ts # 5 geometry types + elevation
│   ├── fresnel.ts              # Euler spiral (clothoid)
│   ├── laneGeometry.ts         # Width accumulation & boundaries
│   ├── tessellation.ts         # Triangle mesh generation
│   └── math.ts                 # Vector utilities
├── parser/
│   ├── parseOpenDriveXml.ts    # XML → typed OpenDriveMap
│   └── types.ts                # OpenDRIVE data model
└── utils/
    ├── proto.ts                # Protobuf message handling
    └── scene.ts                # Foxglove primitive factories
```

## Design Principles

1. **Standards-based** — Every implementation references ASAM OpenDRIVE V1.8.1 section numbers
2. **Pure TypeScript** — No WASM dependencies; geometry computed in-browser
3. **Stateless conversion** — Each `SceneUpdate` is self-contained (no incremental state)
4. **Cache-friendly** — Identical maps produce identical output (memoized by reference)
5. **Foxglove-native** — Direct mapping to `SceneEntity` primitives without intermediate formats
