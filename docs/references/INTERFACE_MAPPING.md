# Interface Mapping: OpenDRIVE → Geometry Engine → Foxglove SceneUpdate

> **Deep Analysis Document**
> **Version:** 1.0
> **Last Updated:** 2025-07-25

# ============================================================================
# SPECIFICATION REFERENCES
# ============================================================================
# [ODR]       ASAM OpenDRIVE V1.8.1
#             https://www.asam.net/standards/detail/opendrive/
# [OSI]       ASAM OSI (Open Simulation Interface) V3.7.0
#             https://github.com/OpenSimulationInterface/open-simulation-interface
# [FG-SCENE]  Foxglove SceneUpdate / SceneEntity Schema
#             https://docs.foxglove.dev/docs/sdk/schemas/
# [FG-SDK]    foxglove/foxglove-sdk (canonical proto + TypeScript definitions)
#             https://github.com/foxglove/foxglove-sdk
# [OMEGA]     OMEGA PRIME — Open Ground Truth for Perception Research
#             https://github.com/ika-rwth-aachen/omega-prime
#             (defines osi3.MapAsamOpenDrive proto)
# [ISO8855]   ISO 8855:2011 — Road vehicles — Vehicle dynamics vocabulary
# [A&S]       Abramowitz, M. & Stegun, I.A. (1964). Handbook of Mathematical
#             Functions. NBS Applied Mathematics Series 55.
#             (External math reference — not cited by OpenDRIVE spec)
# [REP103]    ROS REP-103 — Standard Units and Coordinate Conventions
#             https://www.ros.org/reps/rep-0103.html

---

## 1. Architecture Overview

This converter implements a three-layer data transformation pipeline:

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: PROTOCOL / CONTAINER                                     │
│  MCAP + osi3.MapAsamOpenDrive → XML string extraction              │
│  Standards: [OMEGA], [OSI]                                         │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 2: GEOMETRY ENGINE ("WASM KERNEL" EQUIVALENT)               │
│  XML → OpenDRIVE types → reference line → lane boundaries → mesh  │
│  Standards: [ODR] §8–§12, [ISO8855], [A&S] §7.3                  │
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 3: VISUALIZATION OUTPUT                                     │
│  Geometry → foxglove.SceneUpdate (SceneEntity, primitives)         │
│  Standards: [FG-SCENE], [FG-SDK], [REP103]                        │
└─────────────────────────────────────────────────────────────────────┘
```

Each layer has precisely defined input/output interfaces and every
transformation is justified by specific standard sections.

---

## 2. Layer 1: Protocol Interface (MCAP → XML String)

### 2.1 Input: osi3.MapAsamOpenDrive

**Source standard:** [OMEGA] `osi3.MapAsamOpenDrive` proto definition

```protobuf
message MapAsamOpenDrive {
    optional string map_reference         = 1;
    optional string open_drive_xml_content = 2;
}
```

**Mapping rationale:**
- [OMEGA] specifies that OpenDRIVE map data is stored as the complete
  `.xodr` XML content in `open_drive_xml_content` (string field).
- [OMEGA] requires a single `MapAsamOpenDrive` message on topic
  `/ground_truth_map` at `log_time = 0` (static map over trace duration).
- `map_reference` must match `GroundTruth.map_reference` per [OSI] to
  link dynamic data to the static map.

**Implementation:** `src/utils/proto.ts`
→ TypeScript interface mirrors the proto exactly.

### 2.2 Coordinate System Identity

**Critical finding:** No coordinate transformation is needed between layers.

| Frame                    | Standard   | x     | y     | z  | Handedness |
|--------------------------|------------|-------|-------|----|------------|
| OpenDRIVE inertial       | [ODR] §8.2 | East  | North | Up | Right      |
| OSI global               | [OSI] §3   | East  | North | Up | Right      |
| Foxglove 3D panel (map)  | [FG-SCENE] | East* | North*| Up | Right      |

\* When `frame_id = "global"` or `"map"` and no frame transform is applied.

**Justification:** [OMEGA] specification §Coordinate Systems explicitly
states: *"ASAM OSI and ASAM OpenDRIVE are harmonized in terms of their
inertial coordinate system specification [...] relying on the ISO 8855
standard."* Therefore, OpenDRIVE (x,y,z) coordinates pass through to
Foxglove Point3 (x,y,z) without rotation or scaling.

---

## 3. Layer 2: Geometry Engine (XML → Road Geometry)

This layer is the mathematical core — equivalent to what libOpenDRIVE's
C++/WASM module would compute. Every function maps to a specific standard
section.

### 3.1 Feature Mapping Table

| OpenDRIVE Feature           | Standard Section | Engine Function                    | Output Type        |
|-----------------------------|------------------|------------------------------------|--------------------|
| Reference line: line        | [ODR] §9.3       | `evaluateLine(ds)`                 | `{x, y, hdg}`      |
| Reference line: arc         | [ODR] §9.5       | `evaluateArc(ds, κ)`              | `{x, y, hdg}`      |
| Reference line: spiral      | [ODR] §9.4       | `evaluateSpiral(ds, κ₀, κ₁, L)`  | `{x, y, hdg}`      |
| Reference line: poly3       | [ODR] §9.7       | `evaluatePoly3(ds, a,b,c,d)`     | `{x, y, hdg}`      |
| Reference line: paramPoly3  | [ODR] §9.6       | `evaluateParamPoly3(ds, ...)`     | `{x, y, hdg}`      |
| Local→global transform      | [ODR] §9.2       | `evaluateReferenceLineAtS()`      | `PoseAtS`           |
| Elevation profile           | [ODR] §10.5.1    | `evaluateElevation(profile, s)`   | `z: number`         |
| Lane width polynomial       | [ODR] §11.6.1    | `evaluateLaneWidth(entries, ds)`  | `w: number`         |
| Lane offset accumulation    | [ODR] §11.4      | `computeLaneSectionGeometry()`    | `LaneSurfaceData[]` |
| Lateral offset point        | [ODR] §8.3       | `offsetPoint(pose, t)`            | `Vec3`              |
| Fresnel integrals           | [A&S] §7.3       | `fresnelIntegral(t)`              | `{c, s}`            |

### 3.2 Geometry Formulas — Standard Compliance Audit

#### 3.2.1 Line [ODR §9.3]

| Property        | Standard                   | Implementation                | ✅/❌ |
|-----------------|----------------------------|-------------------------------|-------|
| x_local         | ds                         | `ds`                          | ✅    |
| y_local         | 0                          | `0`                           | ✅    |
| hdg_local       | 0                          | `0`                           | ✅    |

#### 3.2.2 Arc [ODR §9.5]

| Property        | Standard                   | Implementation                | ✅/❌ |
|-----------------|----------------------------|-------------------------------|-------|
| Radius          | r = 1/κ                    | `r = 1/curvature`             | ✅    |
| Angle           | θ = ds·κ                   | `theta = ds * curvature`      | ✅    |
| x_local         | r·sin(θ)                   | `r * Math.sin(theta)`         | ✅    |
| y_local         | r·(1−cos(θ))               | `r * (1 - Math.cos(theta))`   | ✅    |
| hdg_local       | θ                          | `theta`                       | ✅    |
| Zero-curvature  | Degenerate → line          | Guard: `abs(κ) < 1e-10`      | ✅    |

#### 3.2.3 Spiral [ODR §9.4]

| Property        | Standard                        | Implementation              | ✅/❌ |
|-----------------|---------------------------------|-----------------------------|-------|
| Curvature rate  | (κ₁−κ₀)/L                      | `curvRate = (curvEnd-curvStart)/length` | ✅ |
| Heading         | κ₀·s + ½·rate·s²               | `curvStart*s + 0.5*curvRate*s*s`        | ✅ |
| x integral      | ∫cos(θ(s))ds                    | Simpson's rule, N∈[64,256]             | ✅ |
| y integral      | ∫sin(θ(s))ds                    | Simpson's rule, N∈[64,256]             | ✅ |
| Fresnel (κ₀=0)  | [A&S] §7.3 eqs 7.3.1–7.3.4    | Taylor + rational approx               | ✅ (alt. path) |

**Design decision:** Simpson's rule numerical integration is used for all
spiral evaluation (`evaluateSpiral()`). The separate `fresnelIntegral()`
helper exists as an alternative for the pure clothoid case (κ₀ = 0) but
is not currently called by the main evaluation path. This matches the
approach used by libOpenDRIVE (`odrSpiral.c`).

#### 3.2.4 Poly3 [ODR §9.7] (deprecated)

| Property        | Standard                   | Implementation                | ✅/❌ |
|-----------------|----------------------------|-------------------------------|-------|
| y_local         | a + b·ds + c·ds² + d·ds³  | `a + b*ds + c*ds*ds + d*ds*ds*ds` | ✅ |
| x_local         | ds (aligned-frame approx.) | `ds`                         | ✅    |
| hdg_local       | atan2(dy/ds, 1)            | `Math.atan2(dvds, 1)`         | ✅    |
| Derivative      | b + 2c·ds + 3d·ds²        | `b + 2*c*ds + 3*d*ds*ds`     | ✅    |

**Note:** [ODR] §9.7 defines poly3 in local u/v coordinates as `v(u) = a + b*u + c*u² + d*u³`.
The implementation assumes the aligned-frame case where u=ds. This is an
implementation simplification — the spec's general definition allows a
shifted/rotated local frame. Poly3 is **deprecated** since OpenDRIVE 1.6.

#### 3.2.5 ParamPoly3 [ODR §9.6]

| Property        | Standard                       | Implementation            | ✅/❌ |
|-----------------|--------------------------------|---------------------------|-------|
| Parameter p     | [0, @length] (arcLength) or [0, 1] (normalized) | Conditional on `pRange` | ✅ |
| u(p)            | aU + bU·p + cU·p² + dU·p³    | Cubic evaluation          | ✅    |
| v(p)            | aV + bV·p + cV·p² + dV·p³    | Cubic evaluation          | ✅    |
| hdg_local       | atan2(dv/dp, du/dp)            | `Math.atan2(dvDp, duDp)`  | ✅    |

**Note on `pRange`:** Per [ODR] §9.6, when `pRange="arcLength"`, `p` ranges
over `[0, @length]` — but this is NOT the actual arc length for intermediate
points. The spec explicitly states: *"there is a non-linear relation between
p and actual arc length in general."* The implementation maps `ds` to `p`
as if they were equivalent, which is an approximation.

#### 3.2.6 Local-to-Global Transform [ODR §9.2]

| Property        | Standard Formula                                    | Implementation | ✅/❌ |
|-----------------|-----------------------------------------------------|----------------|-------|
| x_global        | x₀ + cos(hdg₀)·x_local − sin(hdg₀)·y_local        | `referenceLineGeometry.ts:73` | ✅ |
| y_global        | y₀ + sin(hdg₀)·x_local + cos(hdg₀)·y_local        | `referenceLineGeometry.ts:74` | ✅ |
| hdg_global      | hdg₀ + hdg_local                                    | `referenceLineGeometry.ts:75` | ✅ |

This is a standard 2D rotation matrix applied at the geometry start pose.

#### 3.2.7 Elevation [ODR §10.5.1]

| Property        | Standard                        | Implementation              | ✅/❌ |
|-----------------|---------------------------------|-----------------------------|-------|
| z(s)            | a + b·ds + c·ds² + d·ds³       | Cubic polynomial eval       | ✅    |
| ds              | s − s_elevation                 | `s - elev.s`                | ✅    |
| Record lookup   | Last record where s_rec ≤ s     | Linear scan with tolerance  | ✅    |

#### 3.2.8 Lane Width [ODR §11.6.1]

| Property        | Standard                        | Implementation              | ✅/❌ |
|-----------------|---------------------------------|-----------------------------|-------|
| w(ds)           | a + b·ds + c·ds² + d·ds³       | Cubic polynomial eval       | ✅    |
| ds              | s − (s_section + sOffset)       | `ds - entry.sOffset`        | ✅    |
| Accumulation    | Sum widths from center outward  | Incremental `cumulativeOffsets` | ✅ |

#### 3.2.9 Lateral Offset [ODR §8.3]

| Property        | Standard                        | Implementation              | ✅/❌ |
|-----------------|---------------------------------|-----------------------------|-------|
| Normal direction| hdg + π/2                       | `pose.hdg + Math.PI / 2`   | ✅    |
| x_offset        | x_ref + t·cos(hdg + π/2)       | `referenceLineGeometry.ts:296` | ✅ |
| y_offset        | y_ref + t·sin(hdg + π/2)       | `referenceLineGeometry.ts:297` | ✅ |
| Sign convention | t > 0 = left, t < 0 = right    | Enforced by lane ordering   | ✅    |

---

## 4. Layer 3: Visualization Output (Geometry → Foxglove)

### 4.1 Feature-to-Primitive Mapping

| Road Feature      | OpenDRIVE Source      | Foxglove Primitive           | Justification                    |
|-------------------|-----------------------|------------------------------|----------------------------------|
| Lane surface      | Lane boundary pairs   | `TriangleListPrimitive`      | [FG-SCENE] — filled mesh for area|
| Lane boundary     | Lane outer edge       | `LinePrimitive` (LINE_STRIP) | [FG-SCENE] — continuous polyline |
| Road marking      | Lane road mark def    | `LinePrimitive` (LINE_STRIP) | [FG-SCENE] — colored line strip  |
| Road/lane metadata| Road ID, lane type    | `KeyValuePair[]` metadata    | [FG-SCENE] — entity annotations  |

### 4.2 TriangleListPrimitive Mapping (Lane Surfaces)

**OpenDRIVE source:** Lane inner + outer boundary polylines from
[ODR] §9.4 lane offset computation.

**Foxglove target:** [FG-SCENE] `TriangleListPrimitive`

```
Transformation: (innerBoundary[], outerBoundary[]) → TriangleListPrimitive
```

| Step | Operation | Standard Reference |
|------|-----------|-------------------|
| 1    | Sample reference line at s intervals | [ODR] §9.2 |
| 2    | Compute inner/outer boundary polylines | [ODR] §11.4, §11.6.1 |
| 3    | Tessellate strip into indexed triangles | Standard quad tessellation |
| 4    | Flatten indexed mesh to sequential triples | [FG-SCENE] TriangleListPrimitive.points |
| 5    | Assign lane-type color | [ODR] §11.7.1 lane type enum → RGBA |

**Design decision — Non-indexed output:**
[FG-SCENE] supports both indexed (via `indices[]`) and non-indexed (flat
triples) rendering. We use non-indexed (flat) because:
1. It avoids potential renderer issues with `indices` field support.
2. The vertex duplication overhead is minimal (2× vertices for quads).
3. Lane strips share no vertices between different lane entities.

**Pose strategy:**
All primitives use `IDENTITY_POSE` (position=0, orientation=identity
quaternion). Points contain absolute inertial coordinates per [ODR] §8.2.
This is correct because the OpenDRIVE inertial frame maps directly to the
Foxglove `frame_id = "global"` frame with no rotation needed (both are
right-handed, Z-up per [ISO8855]).

### 4.3 LinePrimitive Mapping (Lane Boundaries)

**OpenDRIVE source:** Outer boundary polyline of each lane from
[ODR] §11.6.1 width computation.

**Foxglove target:** [FG-SCENE] `LinePrimitive`

| Field           | Value              | Justification                          |
|-----------------|--------------------|----------------------------------------|
| `type`          | `0` (LINE_STRIP)   | Continuous polyline along road         |
| `thickness`     | `0.08` m           | Renderer constant (not spec-derived)   |
| `scale_invariant` | `false`          | World-coordinate width                 |
| `color`         | White (0.9, 0.9, 0.9, 0.9) | Standard lane marking color    |
| `pose`          | IDENTITY_POSE      | Absolute inertial coordinates          |
| `points`        | outer boundary + z-offset | [ODR] §11.6.1 boundary points |

**Z-offset strategy:**
Lane boundaries are rendered at `z + 0.01m` above the lane surface to
prevent z-fighting in the Foxglove 3D renderer. Road markings use `z + 0.02m`.
These are visualization artifacts — the actual road surface and markings are
coplanar per [ODR].

### 4.4 LinePrimitive Mapping (Road Markings)

**OpenDRIVE source:** `<roadMark>` elements per lane from [ODR] §11.8.

**Foxglove target:** [FG-SCENE] `LinePrimitive`

| Field           | Value                  | Justification                      |
|-----------------|------------------------|------------------------------------|
| `type`          | `0` (LINE_STRIP)       | Continuous marking line            |
| `thickness`     | Per-mark `width` attr  | [ODR] §11.8 marking width         |
| `color`         | Per-mark `color` attr  | [ODR] §11.8 → RGBA mapping        |

**Implementation limitations:**
- All marking types (solid, broken, solid solid, etc.) are rendered as a
  single continuous LINE_STRIP — dashed/broken patterns are not implemented.
- `mark.sOffset` affects only the entity ID, not the rendered start position.
- `weight`, `laneChange`, `<type>/<line>`, `<explicit>`, and `<sway>`
  elements are not parsed or rendered.
- Center-lane (lane 0) road marks are not rendered — only left/right lanes
  are processed.

**Color mapping per [ODR] §11.8 (partial — not all V1.8.1 colors implemented):**

| OpenDRIVE `color` | Foxglove RGBA              |
|--------------------|----------------------------|
| `"standard"`       | (1.0, 1.0, 1.0, 1.0) white|
| `"white"`          | (1.0, 1.0, 1.0, 1.0)      |
| `"yellow"`         | (1.0, 0.85, 0.0, 1.0)     |
| `"blue"`           | (0.0, 0.4, 1.0, 1.0)      |
| `"green"`          | (0.0, 0.8, 0.2, 1.0)      |
| `"red"`            | (1.0, 0.2, 0.2, 1.0)      |

### 4.5 SceneEntity Mapping

**Foxglove target:** [FG-SCENE] `SceneEntity`

| Field          | Value                     | Justification                    |
|----------------|---------------------------|----------------------------------|
| `id`           | See per-type patterns below | Unique per entity type          |
| `timestamp`    | `receiveTime` from MCAP   | Static map — any valid time      |
| `frame_id`     | `"global"`                | [ODR] §8.2 inertial frame        |
| `lifetime`     | `{sec:0, nsec:0}`         | [FG-SCENE] — persistent entity   |
| `frame_locked` | `true`                    | Map follows frame transforms     |
| `metadata`     | Per-type (see below)      | Enables panel inspection         |

**Entity ID patterns by type:**
- Lane surfaces: `odr_lane_r{roadId}_s{sectionIdx}_l{laneId}`
- Lane boundaries: `odr_boundary_r{roadId}_s{sectionIdx}_l{laneId}_outer`
- Road markings: `odr_marking_r{roadId}_s{sectionIdx}_l{laneId}_{sOffset}`

**Metadata:** Only lane surface entities carry metadata (road_id, lane_id,
lane_type). Lane boundary and road marking entities do not include metadata.

### 4.6 SceneUpdate Composition

**Foxglove target:** [FG-SCENE] `SceneUpdate`

```typescript
{
  deletions: [],      // Static map — no deletions needed
  entities: [         // All road geometry entities
    // Per road × per section × per lane:
    //   1 × TriangleListPrimitive (lane surface)
    //   1 × LinePrimitive (lane boundary)
    //   0..n × LinePrimitive (road markings, if defined)
  ]
}
```

The converter uses **closure-based caching**: the map XML is parsed and
geometry computed once on first message, then cached for subsequent calls.
The cache key is `map_reference` + `JSON.stringify(config)` (panel settings),
not the XML content itself. This matches the [OMEGA] convention of a single
static map message per `map_reference` value.

---

## 5. Features NOT Implemented (Gap Analysis)

| OpenDRIVE Feature       | Standard Section | Status         | Reason / Impact              |
|-------------------------|------------------|----------------|------------------------------|
| Superelevation          | [ODR] §10.5.2    | ❌ Not impl.   | Flat road assumption OK for MVP |
| Crossfall / shape       | [ODR] §10.5.3    | ❌ Not impl.   | Minor visual impact          |
| Lane height             | [ODR] §11.6.3    | ❌ Not impl.   | Curb height rendering        |
| Lane offset (center)    | [ODR] §11.4      | ❌ Not impl.   | Center lane lateral shift    |
| Lane borders            | [ODR] §11.6.2    | ❌ Not impl.   | Alternative to width (not parsed) |
| Center-lane road marks  | [ODR] §11.8      | ❌ Not impl.   | Lane 0 not processed for markings |
| Road mark semantics     | [ODR] §11.8      | ⚠️ Partial     | Only color; type (broken/solid) rendered as continuous LINE_STRIP |
| Signals / signs         | [ODR] §14        | ❌ Not impl.   | Requires 3D model assets     |
| Objects (barriers, etc) | [ODR] §13        | ❌ Not impl.   | Requires 3D model assets     |
| Multiple lane sections  | [ODR] §11.3      | ✅ Implemented | Piecewise section processing |
| Road surface material   | [ODR] §11.7.2    | ❌ Not impl.   | Visual enhancement only      |
| Lateral profile (shape) | [ODR] §10.5.3    | ❌ Not impl.   | Cross-section curvature      |
| Geo-reference / offset  | [ODR] §8.5       | ⚠️ Parsed only | `<geoReference>` and `<offset>` parsed but not applied |
| V1.8.1 lane types       | [ODR] §11.7.1    | ⚠️ Partial     | `walking`, `slipLane` not in enum; deprecated `sidewalk` still used |

---

## 6. Coordinate Transformation Proof

**Claim:** OpenDRIVE inertial coordinates can be passed directly to Foxglove
Point3 without any rotation, mirroring, or scaling.

**Proof:**

1. [ODR] §8.2 defines the inertial frame as right-handed with x=East,
   y=North, z=Up, compliant with [ISO8855].

2. [OSI] `osi_common.proto` defines Vector3d in a right-handed system,
   and [OMEGA] §Coordinate Systems confirms it matches [ODR].

3. [FG-SCENE] renders in a right-handed, z=Up frame. When the
   `frame_id` has no rotation relative to the world origin, x maps to
   East and y to North.

4. Therefore: `Point3{x: odr.x, y: odr.y, z: odr.z}` is the correct
   mapping with no additional transform.

**Caveat:** `<geoReference>` and `<header><offset>` are parsed but NOT
applied in the current implementation. The "no transform" argument holds
for OpenDRIVE inertial → Foxglove world coordinates, but georeferencing
is not fully handled.

**Implementation verification:**
```typescript
// src/geometry/referenceLineGeometry.ts:293-299
export function offsetPoint(pose: PoseAtS, t: number): Vec3 {
  const normalHdg = pose.hdg + Math.PI / 2;
  return {
    x: pose.x + t * Math.cos(normalHdg),  // → Foxglove Point3.x
    y: pose.y + t * Math.sin(normalHdg),  // → Foxglove Point3.y
    z: pose.z,                              // → Foxglove Point3.z
  };
}
```

The Vec3 output flows directly into `TriangleListPrimitive.points[]` and
`LinePrimitive.points[]` without any intermediate transformation. ∎

---

## References

See `docs/references/ASAM_OpenDRIVE_Standard.md` for [ODR] details.
See `docs/references/ASAM_OSI_Coordinate_System.md` for [OSI]/[OMEGA] details.
See `docs/references/Foxglove_SceneUpdate_Schema.md` for [FG-SCENE] details.
