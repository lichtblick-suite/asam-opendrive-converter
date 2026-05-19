# Feature Mapping: OpenDRIVE Standard → libOpenDRIVE C++ → This Converter → Foxglove Schema

> **Version:** 1.0
> **Last Updated:** 2025-07-25
> **Audit Status:** All technical mappings verified against source code

This document maps every OpenDRIVE feature across four layers:

1. **OpenDRIVE Standard** — normative definition from ASAM OpenDRIVE V1.8.1
2. **libOpenDRIVE C++ API** — reference WASM-capable implementation (pageldev/libOpenDRIVE)
3. **This Converter (TypeScript)** — our implementation
4. **Foxglove Output** — SceneUpdate primitive produced

---

## 1. Geometry Primitives (Reference Line)

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 1.1 | **Straight line** | [ODR §9.3] `<line>` | `RoadGeometry::get_xy(s)` → `GeomLine` subclass | `evaluateLine(ds)` → `{x:ds, y:0, hdg:0}` | Internal — feeds lane mesh | ✅ PASS | Trivial identity |
| 1.2 | **Arc** | [ODR §9.5] `<arc curvature="κ">` | `GeomArc::get_xy(s)` — r=1/κ, θ=s·κ | `evaluateArc(ds, κ)` — same formula + zero-κ guard | Internal | ✅ PASS | Zero-curvature fallback to line |
| 1.3 | **Spiral (clothoid)** | [ODR §9.4] `<spiral curvStart curvEnd>` — linearly varying κ | `GeomSpiral::get_xy(s)` — uses odrSpiral.c (numerical integration) | `evaluateSpiral(ds, κ₀, κ₁, L)` — Simpson's rule, N∈[64,256] | Internal | ⚠️ PASS* | *Bug: N depends on `ds` not `length` — over-samples short distances, under-samples at large ds near geometry end |
| 1.4 | **Cubic polynomial** | [ODR §9.7] `<poly3>` (deprecated) — v(u) = a+bu+cu²+du³ | `GeomPoly3::get_xy(s)` | `evaluatePoly3(ds, a,b,c,d)` — assumes u=ds (aligned frame) | Internal | ✅ PASS | Implementation simplification: u≡ds |
| 1.5 | **Parametric cubic** | [ODR §9.6] `<paramPoly3>` — u(p), v(p) with pRange | `GeomParamPoly3::get_xy(s)` | `evaluateParamPoly3(ds, ...)` — p=ds or ds/L | Internal | ✅ PASS | pRange approximation (p≠true arc length) |
| 1.6 | **Cubic Bezier** | [ODR §9.8] `<cubicBezier>` (V1.8.1) | `CubicBezier.hpp` — full implementation | ❌ Not implemented | — | ❌ GAP | New in V1.8.1 |
| 1.7 | **Local→global transform** | [ODR §9.2] 2D rotation by (x₀,y₀,hdg₀) | Built into `RoadGeometry::get_xy()` base class | `evaluateReferenceLineAtS()` lines 73-75 | Internal | ✅ PASS | Standard rotation matrix |
| 1.8 | **Adaptive linearization** | Implicit — approximation quality | `RoadGeometry::approximate_linear(eps)` — error-bounded adaptive sampling | Fixed step size (1m default) | Internal | ⚠️ DIFF | libOpenDRIVE uses error-bounded; we use fixed step — causes over/under-sampling |

---

## 2. Road Elevation & Lateral Profile

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 2.1 | **Elevation profile** | [ODR §10.5.1] `<elevation>` — z(s) = a+b·ds+c·ds²+d·ds³ | `RefLine::elevation_profile` (CubicProfile) | `evaluateElevation(profile, s)` — same cubic | z-coordinate on all points | ✅ PASS | |
| 2.2 | **Superelevation** | [ODR §10.5.2] `<superelevation>` — road banking | `Road::superelevation` (CubicProfile) | ❌ Not implemented | — | ❌ GAP | Flat assumption |
| 2.3 | **Crossfall** | [ODR §10.5.3] `<crossfall>` — left/right/both | `Road::crossfall` — `Crossfall::get_crossfall(s, side)` | ❌ Not implemented | — | ❌ GAP | |
| 2.4 | **Lateral shape** | [ODR §10.5.3] `<shape>` — cross-section curvature | `with_lateral_profile` constructor flag | ❌ Not implemented | — | ❌ GAP | |
| 2.5 | **Surface CRG** | [ODR §10.6] `<surface><CRG>` | Not in libOpenDRIVE | ❌ Not implemented | — | ❌ GAP | Detailed surface |

---

## 3. Lane Model

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 3.1 | **Lane sections** | [ODR §11.3] `<laneSection>` — piecewise along s | `Road::s_to_lanesection` map | `road.lanes[]` array sorted by s | Entities per section | ✅ PASS | |
| 3.2 | **Lane numbering** | [ODR §11.1] center=0, left=+, right=− | `Lane::id` (int) | `lane.id` (number) | — | ✅ PASS | |
| 3.3 | **Lane width** | [ODR §11.6.1] `<width>` — cubic polynomial | `Lane::lane_width` (CubicProfile) | `evaluateLaneWidth(entries, ds)` — same cubic | Determines boundary positions | ✅ PASS | |
| 3.4 | **Lane border** | [ODR §11.6.2] `<border>` — alternative to width | `Lane::outer_border` (CubicProfile) | ❌ Not parsed | — | ❌ GAP | Alternative approach |
| 3.5 | **Lane offset** | [ODR §11.4] `<laneOffset>` — center shift | `Road::lane_offset` (CubicProfile) | ❌ Parsed but not applied | — | ❌ GAP | Center lane stays on ref line |
| 3.6 | **Lane height** | [ODR §11.6.3] `<height>` inner/outer offset | `Lane::s_to_height_offset` map | ❌ Not implemented | — | ❌ GAP | Curb modeling |
| 3.7 | **Lane type** | [ODR §11.7.1] `e_laneType` enum | `Lane::type` (string) | `lane.type` (LaneType union) | Color mapping in constants.ts | ⚠️ PARTIAL | Missing: `walking`, `slipLane`, `shared`, etc. |
| 3.8 | **Lane material** | [ODR §11.7.2] `<material>` | Not modeled | ❌ Not implemented | — | ❌ GAP | |
| 3.9 | **Width accumulation** | [ODR §11.6.1] Sum from center outward | Implicit in `get_lane_border_line()` | `computeLaneGroupGeometry()` — `cumulativeOffsets[]` | Inner/outer boundary polylines | ✅ PASS | |
| 3.10 | **Lateral offset** | [ODR §8.3] t·cos(hdg+π/2), t·sin(hdg+π/2) | `Road::get_xyz(s, t, h)` | `offsetPoint(pose, t)` — same formula | Point3 coordinates | ✅ PASS | |

---

## 4. Road Markings

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 4.1 | **Road mark group** | [ODR §11.8] `<roadMark>` per lane | `RoadMarkGroup` — type, weight, color, width, height | `RoadMark` type — sOffset, type, color, width | `LinePrimitive` (LINE_STRIP) | ⚠️ PARTIAL | Only color and width used |
| 4.2 | **Mark type** | [ODR §11.8] `e_roadMarkType` — solid, broken, etc. | `RoadMarkGroup::type` + `RoadMarksLine` (length, space, t_offset) | Skips `type="none"`, all others → continuous LINE_STRIP | Continuous line only | ⚠️ PARTIAL | No dashed/broken patterns |
| 4.3 | **Mark color** | [ODR §11.8] `e_roadMarkColor` — 9 values | `RoadMarkGroup::color` | 6 of 9 mapped (missing orange, violet, black) | `LinePrimitive.color` | ⚠️ PARTIAL | |
| 4.4 | **Mark weight** | [ODR §11.8] standard (0.12m) / bold (0.25m) | `ROADMARK_WEIGHT_STANDARD_WIDTH/BOLD_WIDTH` | ❌ Not used | — | ❌ GAP | |
| 4.5 | **Explicit marks** | [ODR §11.8] `<explicit><line>` | `RoadMarksLine` — width, length, space, s/t offsets | ❌ Not parsed | — | ❌ GAP | |
| 4.6 | **Mark mesh** | N/A — visualization | `Road::get_roadmark_mesh(lane, roadmark, eps)` → Mesh3D | Boundary polyline with z+0.02m offset | `LinePrimitive` | ⚠️ DIFF | libOpenDRIVE: 3D mesh; we: line only |
| 4.7 | **Center lane marks** | [ODR §11.8] lane 0 `<roadMark>` | Accessible via `Lane` id=0 | ❌ Lane 0 not processed | — | ❌ GAP | Only left/right lanes rendered |

---

## 5. Lane Surfaces (Tessellation)

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 5.1 | **Lane mesh** | N/A — visualization | `Road::get_lane_mesh(lane, eps)` → `Mesh3D` (indexed) | `tessellateLaneStrip()` → indexed → `flattenTriangleMesh()` → non-indexed | `TriangleListPrimitive` | ✅ PASS | Different tessellation strategy but same result |
| 5.2 | **Lane border line** | N/A — visualization | `Road::get_lane_border_line(lane, eps)` → `Line3D` | `lane.outerBoundary[]` + z-offset | `LinePrimitive` | ✅ PASS | |
| 5.3 | **Outline indices** | N/A — visualization | `get_lane_mesh()` optional `outline_indices` | Not used (separate boundary entities) | — | N/A | Different approach |
| 5.4 | **Full network mesh** | N/A — visualization | `OpenDriveMap::get_road_network_mesh(eps)` → `RoadNetworkMesh` | Per-road, per-section, per-lane iteration | Multiple SceneEntities | ✅ PASS | We produce individual entities with metadata |

---

## 6. Junctions

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 6.1 | **Junction connections** | [ODR §12.3] `<connection>` incomingRoad/connectingRoad | `Junction` — connections with lane links | Parsed: `junction.connections[]` | Junction roads rendered as normal lanes | ✅ PASS | |
| 6.2 | **Junction groups** | [ODR §12.5] `<junctionGroup>` | Not in libOpenDRIVE | ❌ Not parsed | — | ❌ GAP | |
| 6.3 | **Virtual junctions** | [ODR §12.6] type="virtual" | Not in libOpenDRIVE | ❌ Not parsed | — | ❌ GAP | |

---

## 7. Road Objects & Signals

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 7.1 | **Road objects** | [ODR §13] `<object>` — barriers, poles, etc. | `Road::get_road_objects()` → `RoadObject` + `get_road_object_mesh()` → `Mesh3D` | ❌ Not implemented | — | ❌ GAP | Would need CubePrimitive/ModelPrimitive |
| 7.2 | **Road signals** | [ODR §14] `<signal>` — traffic signs, lights | `Road::get_road_signals()` → `RoadSignal` + `get_road_signal_mesh()` → `Mesh3D` | ❌ Not implemented | — | ❌ GAP | Would need CubePrimitive/ModelPrimitive |
| 7.3 | **Object outlines** | [ODR §13.4] `<outline><cornerLocal>` | `RoadObject::outlines` → `RoadObjectOutline` → `RoadObjectCorner` | ❌ Not implemented | — | ❌ GAP | Complex 3D geometry |
| 7.4 | **Object repeat** | [ODR §13.5] `<repeat>` — periodic placement | `RoadObject::repeats` → `RoadObjectRepeat` | ❌ Not implemented | — | ❌ GAP | |

---

## 8. Coordinate Systems & Geo-Referencing

| # | Feature | ODR Standard | libOpenDRIVE C++ | This Converter (TS) | Foxglove Output | Status | Notes |
|---|---------|-------------|-----------------|---------------------|-----------------|--------|-------|
| 8.1 | **Inertial frame** | [ODR §8.2] x=East, y=North, z=Up | Used as output frame | Used as output frame | `frame_id="global"` | ✅ PASS | Direct pass-through |
| 8.2 | **s/t/h frame** | [ODR §8.3] curvilinear road coords | Internal computation | Internal computation | — | ✅ PASS | |
| 8.3 | **geoReference** | [ODR §8.5] PROJ string | `OpenDriveMap::proj4` | Parsed but NOT applied | — | ⚠️ PARSED | Not projected |
| 8.4 | **Header offset** | [ODR §8.5] `<offset>` affine transform | `OpenDriveMap::x_offs, y_offs` + `center_map` option | Parsed but NOT applied | — | ⚠️ PARSED | No affine transform |
| 8.5 | **Map centering** | N/A — visualization | `center_map` constructor flag | ❌ Not implemented | — | ❌ GAP | Useful for large-offset maps |

---

## 9. Foxglove SceneUpdate Output

| # | Feature | Foxglove Schema | Field Values | Source |
|---|---------|----------------|-------------|--------|
| 9.1 | **SceneUpdate** | `{deletions: [], entities: [...]}` | Static map — no deletions | `sceneUpdateConverter.ts:68` |
| 9.2 | **SceneEntity.id** | Lane: `odr_lane_r{id}_s{idx}_l{lid}` | Unique per road/section/lane | `entityPrefixes.ts:11-18` |
| | | Boundary: `odr_boundary_r{id}_s{idx}_l{lid}_outer` | | `entityPrefixes.ts:20-27` |
| | | Marking: `odr_marking_r{id}_s{idx}_l{lid}_{sOff}` | | `buildRoadMarkingEntity.ts:40` |
| 9.3 | **frame_id** | `"global"` | OpenDRIVE inertial = Foxglove world | `constants.ts:73` |
| 9.4 | **lifetime** | `{sec:0, nsec:0}` | Persistent until replaced | `scene.ts:78` |
| 9.5 | **frame_locked** | `true` | Map follows frame | `scene.ts:90` |
| 9.6 | **timestamp** | `receiveTime` from MCAP | Static map | `sceneUpdateConverter.ts:60` |
| 9.7 | **Pose** | `IDENTITY_POSE` | No rotation/translation — absolute coords | `scene.ts:73-76` |
| 9.8 | **TriangleListPrimitive** | `{pose, points, color, colors:[], indices:[]}` | Non-indexed flat triples | `buildLaneEntity.ts:57-64` |
| 9.9 | **LinePrimitive** | `{type:0, pose, thickness, scale_invariant:false, points, color}` | LINE_STRIP, world-coord thickness | `buildLaneBoundaryEntity.ts:47-56` |
| 9.10 | **Metadata** | `[{key:"road_id"}, {key:"lane_id"}, {key:"lane_type"}]` | Lane surfaces only | `buildLaneEntity.ts:66-70` |

---

## 10. Summary Statistics

| Category | Total Features | ✅ Implemented | ⚠️ Partial/Diff | ❌ Not Implemented |
|----------|---------------|---------------|-----------------|-------------------|
| Geometry primitives | 8 | 6 | 2 | 0 |
| Elevation/profile | 5 | 1 | 0 | 4 |
| Lane model | 10 | 6 | 1 | 3 |
| Road markings | 7 | 0 | 4 | 3 |
| Lane surfaces | 4 | 3 | 0 | 0 |
| Junctions | 3 | 1 | 0 | 2 |
| Objects & signals | 4 | 0 | 0 | 4 |
| Coordinates/geo | 5 | 2 | 2 | 1 |
| **Total** | **46** | **19 (41%)** | **9 (20%)** | **17 (37%)** |
| Foxglove output | 10 | 10 | 0 | 0 |

---

## 11. Key Architectural Differences: libOpenDRIVE vs This Converter

| Aspect | libOpenDRIVE (C++/WASM) | This Converter (TypeScript) |
|--------|------------------------|---------------------------|
| **Sampling** | Error-bounded adaptive linearization (`approximate_linear(eps)`) | Fixed step size (1m default) |
| **Tessellation** | Indexed mesh with outline indices and normals | Indexed → flattened non-indexed (no normals) |
| **Road marks** | Full `RoadMarksLine` with length/space/t_offset → 3D mesh | Continuous LINE_STRIP — no dashed patterns |
| **Lane offset** | `CubicProfile lane_offset` applied in boundary computation | ❌ Not applied (parsed only) |
| **Superelevation** | Applied to surface points via `get_surface_pt()` | ❌ Not implemented |
| **Objects/Signals** | Full 3D mesh generation (cylinder, box, outline) | ❌ Not implemented |
| **Map centering** | Optional `center_map` flag in constructor | ❌ Not implemented |
| **Cubic Bezier** | Dedicated `CubicBezier.hpp` implementation | ❌ Not implemented |
| **Routing graph** | `RoutingGraph` from junction connectivity | ❌ Not implemented |

---

## 12. Identified Bugs

| # | Bug | Severity | Location | Description |
|---|-----|----------|----------|-------------|
| B1 | Spiral step count | Medium | `fresnel.ts:148` | `N = min(256, max(64, ceil(ds)))` — N depends on `ds` (current evaluation point) not `length` (total geometry length). For `ds=1` near the start, N=64 (fine); for `ds=500` near the end of a long spiral, N=256 regardless of needed precision. Should be based on `length` or use adaptive stepping. |
| B2 | paramPoly3 pRange | Low | `referenceLineGeometry.ts:243` | `p = ds` for arcLength range is an approximation — the spec warns p≠actual arc length for intermediate points. Acceptable for visualization but not mathematically exact. |
| B3 | Missing lane types | Low | `parser/types.ts:115-131` | `walking`, `slipLane` not in LaneType union — V1.8.1 files using these types will parse as unknown. |

---

## References

- [ODR] ASAM OpenDRIVE V1.8.1: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/
- [libODR] pageldev/libOpenDRIVE: https://github.com/pageldev/libOpenDRIVE/
- [FG-SCENE] Foxglove SceneUpdate: https://docs.foxglove.dev/docs/sdk/schemas/scene-update
- See `docs/references/` for detailed standard reference documents.
