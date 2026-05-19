---
sidebar_position: 2
---

# Converter Pipeline

The converter pipeline transforms an OMEGA PRIME protobuf message into a Foxglove `SceneUpdate`. This page describes each stage.

## Stage 1: Message Deserialization

**File:** `src/utils/proto.ts`

The MCAP message arrives as a protobuf-encoded `MapAsamOpenDrive` containing:
- `map_reference` — identifier string for caching
- `map_opendrive_xml` — the full OpenDRIVE XML document

Reference: [OMEGA PRIME specification](https://github.com/ika-rwth-aachen/omega-prime)

## Stage 2: XML Parsing

**File:** `src/parser/parseOpenDriveXml.ts`

Uses `fast-xml-parser` to parse the XML into a typed `OpenDriveMap` object:

```typescript
interface OpenDriveMap {
  header: Header;
  roads: Road[];
  junctions: Junction[];
}
```

Each `Road` contains geometry records, elevation profiles, lane sections, and road markings — all typed per [ODR §9–§11].

## Stage 3: Geometry Computation

**File:** `src/geometry/referenceLineGeometry.ts`

For each road, the reference line is evaluated at regular intervals (default 1m):

1. **Geometry evaluation** — Line/Arc/Spiral/Poly3/ParamPoly3 → local (x, y, hdg)
2. **Local→global transform** — Rotate by start heading, translate to start position
3. **Elevation** — Apply cubic elevation profile for z-coordinate
4. **Lateral offset** — Offset perpendicular to heading by lane width accumulation

Spiral geometry uses Simpson's rule numerical integration ([A&S §7.3]).

## Stage 4: Feature Building

**Files:** `src/features/lanes/`, `src/features/laneBoundaries/`, `src/features/roadMarkings/`

Each feature builder produces `SceneEntity` objects:

| Builder | Input | Output Primitive |
|---------|-------|-----------------|
| `buildLaneEntity` | Inner/outer boundary points | `TriangleListPrimitive` |
| `buildLaneBoundaryEntity` | Boundary polyline | `LinePrimitive` (LINE_STRIP) |
| `buildRoadMarkingEntity` | Mark polyline + color/width | `LinePrimitive` (LINE_STRIP) |

## Stage 5: Assembly & Caching

**File:** `src/converters/openDriveMap/sceneUpdateConverter.ts`

All entities are assembled into a single `SceneUpdate`:

```typescript
{
  deletions: [],
  entities: [...laneEntities, ...boundaryEntities, ...markingEntities]
}
```

The result is cached by `map_reference` so subsequent messages with the same map skip all computation.
