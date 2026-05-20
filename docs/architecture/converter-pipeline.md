---
sidebar_position: 2
---

# Converter Pipeline

The converter transforms an `osi3.MapAsamOpenDrive` message into a Foxglove `SceneUpdate` in four stages.

## Stage 1: Message Deserialization

**File:** `src/utils/proto.ts`

The incoming MCAP message is interpreted as:

- `map_reference` — stable identifier for cache keys
- `open_drive_xml_content` — embedded OpenDRIVE XML string

The converter uses the XML payload directly; there is no intermediate TypeScript road-model parser.

## Stage 2: WASM Processing

**Files:** `src/wasm/index.ts`, `src/converters/openDriveMap/sceneUpdateConverter.ts`

`sceneUpdateConverter.ts` eagerly loads libOpenDRIVE at registration time and calls:

1. `createFromXml(xml, ...)`
2. `get_road_network_mesh(eps)`

libOpenDRIVE performs:

- OpenDRIVE XML parsing
- reference-line geometry evaluation
- elevation, superelevation, crossfall, and lane offset application
- lane, road marking, road object, and road signal mesh generation

The result is a `RoadNetworkMesh` containing feature-specific mesh chunks plus outline data.

## Stage 3: Schema Adaptation

**File:** `src/converters/openDriveMap/sceneUpdateConverter.ts`

The TypeScript adapter converts WASM output into Foxglove primitives:

- lane meshes → `TriangleListPrimitive`
- lane outline indices → `LinePrimitive`
- road marking meshes → `TriangleListPrimitive`
- road object meshes → `TriangleListPrimitive`
- road signal meshes → `TriangleListPrimitive`

Feature-specific builders group mesh chunks into `SceneEntity` objects with stable IDs, metadata, `frame_id="global"`, and persistent lifetimes.

When panel settings change, the converter emits `SceneEntityDeletionType.ALL` before returning the newly selected layers.

## Stage 4: Caching

**File:** `src/converters/openDriveMap/context.ts`

Generated entities are cached by:

- `map_reference`
- serialized panel settings hash

If both values match the previous invocation, the converter returns the cached `SceneEntity[]` without re-running libOpenDRIVE.

## End-to-End Summary

```text
MapAsamOpenDrive
  → extract open_drive_xml_content
  → createFromXml()
  → get_road_network_mesh(eps)
  → build SceneEntity layers
  → cache by map_reference + settings hash
  → return SceneUpdate
```
