---
sidebar_position: 4
---

# Features

All feature builders live in `src/converters/openDriveMap/sceneUpdateConverter.ts` and operate on mesh data returned by libOpenDRIVE WASM.

## Lane Surfaces

**Builder:** `buildLaneSurfaceEntities()`

This builder iterates `lanes_mesh.lane_start_indices` and creates one `SceneEntity` per lane chunk.

For each chunk it:

1. collects the vertices and triangle indices that belong to the lane
2. looks up the lane type for color selection
3. applies junction coloring when the road is part of a junction
4. emits a `TriangleListPrimitive`

**Entity ID pattern:** `odr_lane_r{roadId}_s{s0}_l{laneId}`

**Metadata:** `road_id`, `lane_id`, `lane_type`, `junction`

## Lane Boundaries

**Builder:** `buildLaneBoundaryEntities()`

This builder uses `lanes_mesh.get_lane_outline_indices()` to extract the lane outline graph and remaps it into a compact Foxglove `LinePrimitive`.

Current rendering characteristics:

- one `SceneEntity` per lane chunk with ID `odr_boundary_r{roadId}_s{s0}_l{laneId}`
- `type = LINE_LIST`
- thickness `0.08 m`
- z-offset `+0.01 m` to avoid z-fighting with lane surfaces

**Metadata:** `road_id`, `lane_id`

## Road Markings

**Builder:** `buildRoadMarkEntities()`

This builder iterates `roadmarks_mesh.roadmark_type_start_indices` and emits one `TriangleListPrimitive` per road-mark mesh chunk.

Because the geometry comes from libOpenDRIVE, dashed and broken markings appear naturally as separate filled mesh segments with gaps between them.

**Entity ID pattern:** `odr_mark_r{roadId}_{chunkIndex}`

**Metadata:** `road_id`, `mark_type`

## Road Objects

**Builder:** `buildRoadObjectEntities()`

This builder iterates `road_objects_mesh.road_object_start_indices` and emits one `TriangleListPrimitive` per road object.

Objects are rendered from libOpenDRIVE-generated meshes derived from OpenDRIVE object geometry and repeats.

**Entity ID pattern:** `odr_obj_r{roadId}_{objectId}`

**Metadata:** `road_id`, `object_id`

## Road Signals

**Builder:** `buildRoadSignalEntities()`

This builder iterates `road_signals_mesh.road_signal_start_indices` and emits one `TriangleListPrimitive` per road signal.

Signals are rendered as libOpenDRIVE-generated meshes with their pose already baked into the returned vertices.

**Entity ID pattern:** `odr_signal_r{roadId}_{signalId}`

**Metadata:** `road_id`, `signal_id`

## Shared Rendering Conventions

All generated entities use:

- `frame_id="global"`
- `frame_locked=true`
- `lifetime={sec: 0, nsec: 0}`
- `IDENTITY_POSE` with absolute OpenDRIVE inertial coordinates
