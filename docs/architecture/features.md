---
sidebar_position: 4
---

# Features

The converter produces three types of visual features from the OpenDRIVE map.

## Lane Surfaces

**Builder:** `src/features/lanes/buildLaneEntity.ts`

Each lane in each lane section produces a `SceneEntity` with a `TriangleListPrimitive`:

1. Compute inner boundary (cumulative width of lanes closer to center)
2. Compute outer boundary (inner + this lane's width)
3. Tessellate the strip between inner and outer into triangles
4. Flatten indexed mesh to non-indexed (Foxglove requirement)

**Color:** Determined by `e_laneType` — see [Panel Settings](/user-guide/panel-settings).

**Metadata:** Each lane entity carries:
- `road_id` — OpenDRIVE road identifier
- `lane_id` — Lane number (positive=left, negative=right)
- `lane_type` — Lane type string

**Entity ID pattern:** `odr_lane_r{roadId}_s{sectionIdx}_l{laneId}`

## Lane Boundaries

**Builder:** `src/features/laneBoundaries/buildLaneBoundaryEntity.ts`

Each lane's outer boundary is rendered as a `LinePrimitive` (LINE_STRIP):

- White color, 0.1m width
- Z-offset of +0.01m above lane surface (prevents z-fighting)
- `scale_invariant: false` — width is in world coordinates

**Entity ID pattern:** `odr_boundary_r{roadId}_s{sectionIdx}_l{laneId}_outer`

## Road Markings

**Builder:** `src/features/roadMarkings/buildRoadMarkingEntity.ts`

Road markings from `<roadMark>` elements on each lane:

- Filtered: `type="none"` is skipped
- Rendered along the lane boundary between `sOffset` and next mark's start
- Color from `e_roadMarkColor` mapping
- Width from mark's `width` attribute (fallback: 0.15m)
- Z-offset of +0.02m (above boundaries)

**Entity ID pattern:** `odr_marking_r{roadId}_s{sectionIdx}_l{laneId}_{sOffset}`

## Current Limitations

| Feature | Limitation |
|---------|-----------|
| Dashed markings | Rendered as continuous lines (no length/space pattern) |
| Center lane marks | Lane 0 road marks not processed |
| Road objects | Not implemented (barriers, poles, buildings) |
| Road signals | Not implemented (signs, traffic lights) |
| Superelevation | Not applied (roads appear flat) |

See [Feature Mapping Table](/references/FEATURE_MAPPING_TABLE) for the complete gap analysis.
