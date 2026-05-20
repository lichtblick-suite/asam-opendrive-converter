# Feature Mapping: OpenDRIVE Standard → libOpenDRIVE C++ → WASM Adapter → Foxglove Schema

> **Version:** 2.0
> **Last Updated:** 2026-05-19
> **Audit Status:** Updated for the current libOpenDRIVE WASM pipeline

This document maps OpenDRIVE features across four layers:

1. **OpenDRIVE Standard** — normative definition from ASAM OpenDRIVE V1.8.1
2. **libOpenDRIVE C++ API** — reference implementation compiled to WebAssembly
3. **This Converter (WASM adapter)** — `sceneUpdateConverter.ts` plus related TypeScript glue
4. **Foxglove Output** — `SceneUpdate` primitives emitted to the 3D panel

---

## 1. Geometry Primitives (Reference Line)

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 1.1 | **Straight line** | [ODR §9.3] `<line>` | `GeomLine` | Included in `get_road_network_mesh(eps)` | Internal mesh generation | ✅ | |
| 1.2 | **Arc** | [ODR §9.5] `<arc curvature="κ">` | `GeomArc` | Included in mesh generation | Internal mesh generation | ✅ | |
| 1.3 | **Spiral (clothoid)** | [ODR §9.4] `<spiral>` | `GeomSpiral` | Included in mesh generation with spiral edge-case fixes enabled | Internal mesh generation | ✅ | |
| 1.4 | **Cubic polynomial** | [ODR §9.7] `<poly3>` | `GeomPoly3` | Included in mesh generation | Internal mesh generation | ✅ | |
| 1.5 | **Parametric cubic** | [ODR §9.6] `<paramPoly3>` | `GeomParamPoly3` | Included in mesh generation | Internal mesh generation | ✅ | |
| 1.6 | **Cubic bezier** | [ODR §9.8] `<cubicBezier>` | `CubicBezier` support | Included in mesh generation | Internal mesh generation | ✅ | |
| 1.7 | **Local→global transform** | [ODR §9.2] inertial transform | Built into geometry evaluation | Returned vertices are already in global coordinates | Absolute `Point3` coordinates | ✅ | |
| 1.8 | **Adaptive linearization** | Approximation quality | `approximate_linear(eps)` | Exposed as panel tessellation tolerance | Affects all generated meshes | ✅ | |

---

## 2. Road Elevation & Lateral Profile

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 2.1 | **Elevation profile** | [ODR §10.5.1] `<elevation>` | `CubicProfile` support | Enabled via `createFromXml()` | z-coordinate in all features | ✅ | |
| 2.2 | **Superelevation** | [ODR §10.5.2] `<superelevation>` | Lateral banking support | Enabled with `withLateralProfile=true` | Baked into meshes | ✅ | |
| 2.3 | **Crossfall** | [ODR §10.5.3] `<crossfall>` | Crossfall support | Enabled with `withLateralProfile=true` | Baked into meshes | ✅ | |
| 2.4 | **Lateral shape** | [ODR §10.5.3] `<shape>` | Controlled by `with_lateral_profile` | Current converter enables the flag | Baked into meshes when present | ✅ | Flag-dependent in libOpenDRIVE |
| 2.5 | **Surface CRG** | [ODR §10.6] `<surface><CRG>` | Not supported by libOpenDRIVE | Not exposed | — | ❌ | |

---

## 3. Lane Model

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 3.1 | **Lane sections** | [ODR §11.3] `<laneSection>` | Piecewise lane-section model | Reflected in returned lane chunks | `SceneEntity` per lane chunk | ✅ | |
| 3.2 | **Lane numbering** | [ODR §11.1] center=0, left=+, right=− | `Lane::id` | Preserved in entity IDs and metadata | `lane_id` metadata | ✅ | |
| 3.3 | **Lane width** | [ODR §11.6.1] `<width>` | Width profiles | Used during mesh generation | Surface and outline geometry | ✅ | |
| 3.4 | **Lane border** | [ODR §11.6.2] `<border>` | Border profiles | Used during mesh generation | Surface and outline geometry | ✅ | |
| 3.5 | **Lane offset** | [ODR §11.4] `<laneOffset>` | Cubic lane-offset support | Enabled via `createFromXml()` | Surface and outline geometry | ✅ | |
| 3.6 | **Lane height** | [ODR §11.6.3] `<height>` | Lane-height support | Enabled via `withLaneHeight=true` | Surface and object placement geometry | ✅ | |
| 3.7 | **Lane type** | [ODR §11.7.1] `e_laneType` | Lane type enum/string | Mapped to colors including `walking`, `slipLane`, `shared`, `tram`, `rail`, `bus`, `taxi`, `hov` | Colored lane surfaces | ✅ | |
| 3.8 | **Lane material** | [ODR §11.7.2] `<material>` | Not surfaced as a visual layer | Not rendered separately | — | ❌ | |
| 3.9 | **Width accumulation** | [ODR §11.6.1] center-out accumulation | Handled inside libOpenDRIVE | Reflected in returned meshes | Surface and outline geometry | ✅ | |
| 3.10 | **Lateral offset** | [ODR §8.3] s/t/h frame | `get_xyz(s,t,h)`-style evaluation | Reflected in returned vertices | Absolute `Point3` coordinates | ✅ | |

---

## 4. Road Markings

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 4.1 | **Road mark group** | [ODR §11.8] `<roadMark>` | Grouped road-mark support | Adapted from `roadmarks_mesh` chunks | `TriangleListPrimitive` | ✅ | |
| 4.2 | **Mark type** | [ODR §11.8] solid, broken, etc. | Type-aware road-mark mesh generation | Preserved as per-chunk metadata | Filled meshes with natural gaps | ✅ | |
| 4.3 | **Mark color** | [ODR §11.8] 9 colors | Color-aware road-mark data | Color mapping covers `standard`, `white`, `yellow`, `blue`, `green`, `red`, `orange`, `violet`, `black` | Colored road-mark meshes | ✅ | |
| 4.4 | **Mark weight** | [ODR §11.8] standard/bold | Width and weight contribute to generated geometry | Consumed through libOpenDRIVE mesh generation | Mesh width | ✅ | |
| 4.5 | **Explicit marks** | [ODR §11.8] `<explicit><line>` | Explicit mark line support | Consumed as generated mesh chunks | Filled meshes | ✅ | Adapted at mesh level |
| 4.6 | **Mark mesh** | Visualization layer | `roadmarks_mesh` | Adapted directly to Foxglove triangles | `TriangleListPrimitive` | ✅ | |
| 4.7 | **Center lane marks** | [ODR §11.8] lane 0 markings | Included if present in mesh output | Adapted like any other chunk | Filled meshes | ✅ | |

---

## 5. Lane Surfaces (Tessellation)

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 5.1 | **Lane mesh** | Visualization layer | `lanes_mesh` | Adapted per lane chunk | `TriangleListPrimitive` | ✅ | |
| 5.2 | **Lane border line** | Visualization layer | Outline indices from lane mesh | Adapted to Foxglove line geometry | `LinePrimitive` | ✅ | |
| 5.3 | **Outline indices** | Visualization layer | `get_lane_outline_indices()` | Used to build lane-boundary overlay | `LinePrimitive` indices | ✅ | |
| 5.4 | **Full network mesh** | Visualization layer | `get_road_network_mesh(eps)` | Single mesh-generation entry point | Multiple scene entities | ✅ | |

---

## 6. Junctions

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 6.1 | **Junction connections** | [ODR §12.3] `<connection>` | Junction topology support | Junction road IDs used for surface coloring | Junction lanes rendered with distinct color | ✅ | |
| 6.2 | **Junction groups** | [ODR §12.5] `<junctionGroup>` | Not exposed | Not adapted | — | ❌ | |
| 6.3 | **Virtual junctions** | [ODR §12.6] type="virtual" | Not exposed | Not adapted | — | ❌ | |

---

## 7. Road Objects & Signals

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 7.1 | **Road objects** | [ODR §13] `<object>` | `road_objects_mesh` | Adapted per object chunk | `TriangleListPrimitive` | ✅ | |
| 7.2 | **Road signals** | [ODR §14] `<signal>` | `road_signals_mesh` | Adapted per signal chunk | `TriangleListPrimitive` | ✅ | |
| 7.3 | **Object outlines** | [ODR §13.4] `<outline>` | Used during object mesh generation | Represented by generated mesh geometry | `TriangleListPrimitive` | ✅ | |
| 7.4 | **Object repeat** | [ODR §13.5] `<repeat>` | Expanded during object mesh generation | Represented by generated mesh geometry | `TriangleListPrimitive` | ✅ | |

---

## 8. Coordinate Systems & Geo-Referencing

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (WASM adapter) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|-------------------------------|-----------------|--------|-------|
| 8.1 | **Inertial frame** | [ODR §8.2] x=East, y=North, z=Up | Native output frame | Used directly | `frame_id="global"` | ✅ | |
| 8.2 | **s/t/h frame** | [ODR §8.3] curvilinear coordinates | Internal evaluation frame | Consumed inside libOpenDRIVE | Absolute mesh coordinates | ✅ | |
| 8.3 | **geoReference** | [ODR §8.5] PROJ string | Parsed by libOpenDRIVE | Original coordinates preserved; no extra projection in adapter | Absolute mesh coordinates | ⚠️ | Preserved, not reprojected |
| 8.4 | **Header offset** | [ODR §8.5] `<offset>` | Available in map data | Adapter does not apply extra post-transform | Absolute mesh coordinates | ⚠️ | No additional adapter transform |
| 8.5 | **Map centering** | Visualization option | `center_map` flag exists | Converter intentionally passes `false` | — | ❌ | Original coordinates preserved |

---

## 9. Foxglove SceneUpdate Output

| # | Feature | Foxglove Schema | Field Values | Source |
|---|---------|----------------|-------------|--------|
| 9.1 | **SceneUpdate** | `{ deletions, entities }` | Uses `SceneEntityDeletionType.ALL` when settings change | `sceneUpdateConverter.ts` |
| 9.2 | **SceneEntity.id** | Stable upsert keys using dot notation mirroring XODR hierarchy | Lane: `road.{roadId}.lanesection.{s0}.lane.{laneId}`; boundary: `road.{roadId}.lanesection.{s0}.lane.{laneId}.boundary`; marks: `road.{roadId}.roadmark.{chunk}`; objects: `road.{roadId}.object.{objectId}`; signals: `road.{roadId}.signal.{signalId}` | `sceneUpdateConverter.ts` |
| 9.3 | **frame_id** | `"global"` | OpenDRIVE inertial frame maps directly to Foxglove world coordinates | `constants.ts`, `scene.ts` |
| 9.4 | **lifetime** | `{sec:0, nsec:0}` | Persistent until replaced or deleted | `scene.ts` |
| 9.5 | **frame_locked** | `true` | Anchors entities to the selected frame | `scene.ts` |
| 9.6 | **timestamp** | MCAP `receiveTime` | Shared across all entities in one update | `sceneUpdateConverter.ts` |
| 9.7 | **Lane surfaces** | `TriangleListPrimitive` | Indexed triangles, uniform color per lane chunk | `sceneUpdateConverter.ts` |
| 9.8 | **Lane boundaries** | `LinePrimitive` | `type=LINE_LIST`, world-space thickness | `sceneUpdateConverter.ts` |
| 9.9 | **Road marks / objects / signals** | `TriangleListPrimitive` | Indexed triangles with stable per-chunk IDs | `sceneUpdateConverter.ts` |
| 9.10 | **Metadata** | `KeyValuePair[]` | Lane, mark, object, and signal metadata attached per entity type | `sceneUpdateConverter.ts` |

---

## 10. Summary Statistics

| Category | Total Features | ✅ Implemented | ⚠️ Partial / Conditional | ❌ Not Implemented |
|----------|---------------|---------------|--------------------------|-------------------|
| Geometry primitives | 8 | 8 | 0 | 0 |
| Elevation/profile | 5 | 4 | 0 | 1 |
| Lane model | 10 | 9 | 0 | 1 |
| Road markings | 7 | 7 | 0 | 0 |
| Lane surfaces | 4 | 4 | 0 | 0 |
| Junctions | 3 | 1 | 0 | 2 |
| Objects & signals | 4 | 4 | 0 | 0 |
| Coordinates/geo | 5 | 2 | 2 | 1 |
| **Total** | **46** | **39 (85%)** | **2 (4%)** | **5 (11%)** |
| Foxglove output | 10 | 10 | 0 | 0 |

---

## References

- [ODR] ASAM OpenDRIVE V1.8.1: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/
- [libODR] lichtblick-suite/libOpenDRIVE: https://github.com/lichtblick-suite/libOpenDRIVE (fork of https://github.com/pageldev/libOpenDRIVE)
- [FG-SCENE] Foxglove SceneUpdate: https://docs.foxglove.dev/docs/sdk/schemas/scene-update
- See `docs/references/` for detailed standard reference documents.
