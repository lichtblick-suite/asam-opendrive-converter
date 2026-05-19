# Audit of `docs/references/INTERFACE_MAPPING.md`

## Overall assessment

**Verdict: FAIL / not fully trustworthy.**

The document gets much of the implemented math right, but it is **not reliable as a standards-accurate mapping document** because:

- its **OpenDRIVE section references are obsolete** for v1.8.1,
- several **line-number citations are stale**,
- the **SceneEntity / road-marking claims overstate what the code actually does**, and
- the **gap analysis is incomplete**.

## Validation summary

| # | Item | Result | Summary |
|---|------|--------|---------|
| 1 | Section references | **FAIL** | `[ODR §5.x]`, `[ODR §7.3.x]`, `[ODR §9.5.x]`, etc. use old numbering, not OpenDRIVE v1.8.1. |
| 2 | Feature mapping table (§3.1) | **FAIL** | Most named helpers exist, but `computeLaneGroupGeometry()` is mischaracterized; it is a private `void` helper, not an output-producing API. |
| 3 | Compliance audit tables (§3.2) | **FAIL** | Most formulas match code, but line references are wrong and the spiral/Fresnel row overstates active behavior. |
| 4 | Line numbers | **FAIL** | All explicit line-number references checked are stale. |
| 5 | TriangleListPrimitive mapping (§4.2) | **PASS** | Pipeline is indexed tessellation -> flatten -> non-indexed triangles with `indices: []`. |
| 6 | LinePrimitive mapping (§4.3) | **PASS** | Boundary values match code: `type=0`, `thickness=0.08`, `scale_invariant=false`, white color, `z+0.01`. |
| 7 | Color values (§4.4) | **PASS** | Road-mark color table matches `src/config/constants.ts`. |
| 8 | SceneEntity mapping (§4.5) | **FAIL** | `frame_id/lifetime/frame_locked` are correct, but `id` format and `metadata` claims are over-generalized. |
| 9 | Coordinate transformation proof (§6) | **PASS (with caveat)** | Code does pass inertial coordinates through directly, but `<geoReference>` / `<offset>` are parsed and then ignored. |
| 10 | Gap analysis (§5) | **FAIL** | Several missing features are not listed at all, especially lane borders and real road-mark semantics. |
| 11 | “Non-indexed output” design decision | **PASS** | Output primitives are emitted with `indices: []`. |
| 12 | Z-offset values | **PASS (with caveat)** | Boundary `z+0.01` is correct; markings are actually `z+0.02`. |
| 13 | Simpson’s rule claim | **PASS** | `N` is clamped to `[64, 256]`. |
| 14 | Caching claim | **PASS (with caveat)** | Cache is closure-based, but keyed by `map_reference` + settings hash, not by XML content. |
| 15 | Cross-reference consistency | **FAIL** | `[FG-SCENE]` and `[OSI]` are broadly consistent with sibling docs; `[ODR]` is consistently outdated across docs. |

---

## 1. Section references — FAIL

### Incorrect claim
`INTERFACE_MAPPING.md` cites OpenDRIVE sections such as `[ODR §5.1]`, `[ODR §5.2]`, `[ODR §7.3.1]`, `[ODR §9.5.2]`, `[ODR §10]`, `[ODR §11]` as if they were current v1.8.1 chapter numbers (`docs/references/INTERFACE_MAPPING.md:42, 85-87, 107-119, 123-205, 229-245, 341-350, 362`).

### Actual truth
OpenDRIVE **v1.8.1** uses a different structure:

| Used in document | Correct v1.8.1 location |
|---|---|
| `§5.1` inertial frame | **§8.2** Inertial coordinate systems |
| `§5.2` road reference line coordinates | **§8.3** Road reference line coordinate systems |
| `§7.3` geometry umbrella | **§9.2** Road reference line, plus **§9.3–§9.7** primitives |
| `§7.3.1` line | **§9.3** Straight line |
| `§7.3.2` arc | **§9.5** Arc |
| `§7.3.3` spiral | **§9.4** Spiral |
| `§7.3.4` poly3 | **§9.7** Cubic polynom (deprecated) |
| `§7.3.5` paramPoly3 | **§9.6** Parametric cubic curve |
| `§8` elevation | **§10.5** Road elevation methods (esp. **§10.5.1** Road elevation) |
| `§8.4` superelevation | **§10.5.2** Superelevation |
| `§8.5` crossfall | no standalone 8.5 equivalent; closest current topic is **§10.5.3 Shape definition** |
| `§8.6` lateral profile | **§10.5.3** / **§10.5.4** depending on meaning |
| `§8.7` road surface material | not a current 8.7 topic; if lane material is intended, use **§11.7.2 Lane material** |
| `§9.2` lane sections | **§11.3** Lane sections |
| `§9.3` lane numbering convention | **§11.2** Lane groups |
| `§9.4` lane offset | **§11.4** Lane offset |
| `§9.5.1` lane types | **§11.7.1** Lane type / Annex A `e_laneType` |
| `§9.5.2` lane width | **§11.6.1** Lane width |
| `§9.5.3` road markings | **§11.8** Road markings |
| `§9.5.5` lane height | **§11.6.3** Lane height |
| `§10` junctions | **§12** Junctions |
| `§11` signals | **§14** Signals |

### Evidence
- OpenDRIVE v1.8.1 TOC fetched from ASAM publication site: chapter 8 = Coordinate systems, 9 = Geometries, 10 = Roads, 11 = Lanes, 12 = Junctions, 13 = Objects, 14 = Signals.
- Specific pages fetched during audit: `08_02_inertial_coordinate_system.html`, `08_03_reference_line_coordinate_system.html`, `11_03_lane_sections.html`, `11_04_lane_offset.html`, `11_06_lane_geometry.html`, `11_07_lane_properties.html`, `11_08_road_markings.html`.
- The code comments already reflect the newer numbering: `src/geometry/referenceLineGeometry.ts:10-17, 25, 47-54, 170, 179, 203, 222, 255, 283`.

---

## 2. Feature mapping table (§3.1) — FAIL

### Incorrect claim
The table presents `computeLaneGroupGeometry()` as the engine function for lane-offset accumulation with output `LaneSurfaceData[]` (`docs/references/INTERFACE_MAPPING.md:117`).

### Actual truth
`computeLaneGroupGeometry()` exists, but it is a **private helper with `void` return type**. It mutates a `results` array passed in from `computeLaneSectionGeometry()`.

### Evidence
- `src/geometry/laneGeometry.ts:37-99` — `computeLaneSectionGeometry()` is the function that returns `LaneSurfaceData[]`.
- `src/geometry/laneGeometry.ts:101-149` — `computeLaneGroupGeometry(...): void`.

### Notes
Other named functions do exist:
- `evaluateLine` — `src/geometry/referenceLineGeometry.ts:175-177`
- `evaluateArc` — `src/geometry/referenceLineGeometry.ts:187-201`
- `evaluatePoly3` — `src/geometry/referenceLineGeometry.ts:210-220`
- `evaluateParamPoly3` — `src/geometry/referenceLineGeometry.ts:230-253`
- `evaluateReferenceLineAtS` — `src/geometry/referenceLineGeometry.ts:55-81`
- `evaluateElevation` — `src/geometry/referenceLineGeometry.ts:261-280`
- `evaluateLaneWidth` — `src/geometry/laneGeometry.ts:154-179`
- `offsetPoint` — `src/geometry/referenceLineGeometry.ts:293-300`
- `fresnelIntegral` — `src/geometry/fresnel.ts:40-63`
- `evaluateSpiral` — `src/geometry/fresnel.ts:137-170`

---

## 3. Compliance audit tables (§3.2) — FAIL overall

### What is correct
These formula claims do match the current implementation:
- line: `src/geometry/referenceLineGeometry.ts:175-177`
- arc: `src/geometry/referenceLineGeometry.ts:187-201`
- poly3: `src/geometry/referenceLineGeometry.ts:210-220`
- paramPoly3: `src/geometry/referenceLineGeometry.ts:230-253`
- elevation cubic: `src/geometry/referenceLineGeometry.ts:261-280`
- lane width cubic: `src/geometry/laneGeometry.ts:172-178`
- lateral offset formula: `src/geometry/referenceLineGeometry.ts:293-300`

### Errors

#### 3.1 Stale line references inside the audit tables
- Incorrect claim: local-to-global transform is on “Line 39/40/41” (`docs/references/INTERFACE_MAPPING.md:183-185`)
- Actual truth: it is on `src/geometry/referenceLineGeometry.ts:73-75`

- Incorrect claim: lateral offset x/y are on “Line 228/229” (`docs/references/INTERFACE_MAPPING.md:210-211`)
- Actual truth: they are on `src/geometry/referenceLineGeometry.ts:296-297`

#### 3.2 Spiral/Fresnel row is misleading
- Incorrect claim: the spiral implementation row reads as if the geometry engine uses both Simpson integration and a Fresnel special-case path (`docs/references/INTERFACE_MAPPING.md:146-150`).
- Actual truth: `evaluateSpiral()` **always** uses Simpson’s rule; the separate `fresnelIntegral()` helper exists, but `evaluateSpiral()` does not call it.
- Evidence: `src/geometry/fresnel.ts:147-167` vs. `src/geometry/fresnel.ts:40-63`

---

## 4. Line numbers — FAIL

| Document claim | Actual location |
|---|---|
| `Line 39` for `x_global` | `src/geometry/referenceLineGeometry.ts:73` |
| `Line 40` for `y_global` | `src/geometry/referenceLineGeometry.ts:74` |
| `Line 41` for `hdg_global` | `src/geometry/referenceLineGeometry.ts:75` |
| `Line 228` for `x_offset` | `src/geometry/referenceLineGeometry.ts:296` |
| `Line 229` for `y_offset` | `src/geometry/referenceLineGeometry.ts:297` |
| `src/geometry/referenceLineGeometry.ts:225-231` in §6 | should be `src/geometry/referenceLineGeometry.ts:293-299` |

Evidence: `docs/references/INTERFACE_MAPPING.md:183-185, 210-211, 377` and `src/geometry/referenceLineGeometry.ts` current line numbers above.

---

## 5. TriangleListPrimitive mapping (§4.2) — PASS

### Verified behavior
The tessellation pipeline is exactly:
1. build indexed strip mesh,
2. flatten indexed mesh into sequential triangle triples,
3. emit Foxglove triangles with `indices: []`.

### Evidence
- Indexed mesh creation: `src/geometry/tessellation.ts:18-66`
- Flattening: `src/geometry/tessellation.ts:74-88`
- Non-indexed Foxglove output: `src/features/lanes/buildLaneEntity.ts:31-64`

This matches the document’s “indexed -> flattened -> non-indexed triples” description.

---

## 6. LinePrimitive mapping (§4.3, lane boundaries) — PASS

### Verified values
- `type: 0` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:49`
- `thickness: LANE_BOUNDARY_WIDTH` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:51`
- `LANE_BOUNDARY_WIDTH = 0.08` — `src/config/constants.ts:55`
- `scale_invariant: false` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:52`
- white boundary color `(0.9, 0.9, 0.9, 0.9)` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:54` and `src/config/constants.ts:48-53`
- `pose: IDENTITY_POSE` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:50`
- z-offset applied to outer boundary points — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:40-44`
- `indices: []` — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:56`

### Caveat
The justification text says “Physical lane marking width”; this is not a standards-derived width, just the current renderer constant.

---

## 7. Color values (§4.4) — PASS

The road-mark color table in the document matches `src/config/constants.ts:58-65` exactly:
- `standard`, `white` -> `(1.0, 1.0, 1.0, 1.0)`
- `yellow` -> `(1.0, 0.85, 0.0, 1.0)`
- `blue` -> `(0.0, 0.4, 1.0, 1.0)`
- `green` -> `(0.0, 0.8, 0.2, 1.0)`
- `red` -> `(1.0, 0.2, 0.2, 1.0)`

---

## 8. SceneEntity mapping (§4.5) — FAIL

### Correct parts
- `frame_id = "global"` — `src/config/constants.ts:73`, used in all builders
- `lifetime = {sec:0, nsec:0}` — `src/utils/scene.ts:78-90`
- `frame_locked = true` — `src/utils/scene.ts:90`
- `timestamp = receiveTime` — `src/converters/openDriveMap/sceneUpdateConverter.ts:60`

### Incorrect claims

#### 8.1 ID pattern is not universal
- Incorrect claim: ``odr_{type}_r{roadId}_s{sectionIdx}_l{laneId}`` (`docs/references/INTERFACE_MAPPING.md:310`)
- Actual truth:
  - lane surfaces: `odr_lane_r{roadId}_s{sectionIdx}_l{laneId}` via `generateEntityId()` — `src/config/entityPrefixes.ts:11-18`, `src/features/lanes/buildLaneEntity.ts:49-54`
  - lane boundaries: `odr_boundary_r{roadId}_s{sectionIdx}_l{laneId}_outer` — `src/config/entityPrefixes.ts:20-27`, `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:33-38`
  - road markings: `odr_marking_r{roadId}_s{sectionIdx}_l{laneId}_{mark.sOffset}` — `src/features/roadMarkings/buildRoadMarkingEntity.ts:40`

#### 8.2 Metadata is not attached to all entity types
- Incorrect claim: `metadata = road_id, lane_id, lane_type` as a generic SceneEntity mapping (`docs/references/INTERFACE_MAPPING.md:315`)
- Actual truth: metadata is only set on lane-surface entities.
- Evidence: `src/features/lanes/buildLaneEntity.ts:66-70`; no corresponding metadata in `buildLaneBoundaryEntity.ts` or `buildRoadMarkingEntity.ts`.

---

## 9. Coordinate transformation proof (§6) — PASS with caveat

### What is correct
The code does pass inertial coordinates through to Foxglove point arrays without any axis swap, mirror, or scale transform:
- lateral offset computed directly in inertial x/y/z — `src/geometry/referenceLineGeometry.ts:293-299`
- lane triangles copy x/y/z directly into `Point3` — `src/features/lanes/buildLaneEntity.ts:39-45`
- boundaries copy x/y and add only z-offset — `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:40-44`
- markings copy x/y and add only z-offset — `src/features/roadMarkings/buildRoadMarkingEntity.ts:44-48`
- all use `IDENTITY_POSE` — `src/utils/scene.ts:73-76`

### Caveat / omitted truth
The proof is incomplete because `<geoReference>` and `<header><offset>` are **parsed but never applied**.

### Evidence
- parsed: `src/parser/parseOpenDriveXml.ts:90-112`
- no downstream usage found in geometry or entity builders

So the document’s “no coordinate transformation” argument is sound **for OpenDRIVE inertial -> Foxglove world coordinates**, but it should not be read as “georeferencing/header offset are fully handled”. They are not.

---

## 10. Gap analysis (§5) — FAIL

### Correct entries
These entries are broadly accurate:
- superelevation not implemented
- lane offset not implemented
- lane height not implemented
- signals not implemented
- objects not implemented
- multiple lane sections implemented (`src/converters/openDriveMap/sceneUpdateConverter.ts:95-145`, `src/geometry/laneGeometry.ts:37-99`)

### Missing or inaccurate omissions

#### 10.1 Lane borders are not implemented, but not listed
- Actual truth: parser only reads `width` and `roadMark`; there is no `<border>` parsing or geometry path.
- Evidence: `src/parser/parseOpenDriveXml.ts:274-303`

#### 10.2 Real road-mark semantics are not implemented, but not listed
- Incorrect claim: the document treats road markings as generally mapped from OpenDRIVE lane road marks to Foxglove lines (`docs/references/INTERFACE_MAPPING.md:224, 281-302`).
- Actual truth: implementation ignores most road-mark semantics:
  - `mark.type` is only used to skip `none`; all others are rendered as a single continuous `LINE_STRIP`
  - `mark.sOffset` affects only entity id, not rendered start position
  - `weight`, `laneChange`, explicit `<type>/<line>`, `<explicit>`, and `<sway>` are not implemented
- Evidence: `src/features/roadMarkings/buildRoadMarkingEntity.ts:35-65`, `src/parser/parseOpenDriveXml.ts:295-303`

#### 10.3 Center-lane road marks are not rendered
- Actual truth: lane geometry is built only for left/right lanes, not lane `0`.
- Evidence:
  - only left/right lanes processed: `src/geometry/laneGeometry.ts:67-96`
  - road-mark entities iterate `laneSurfaces`, so no lane-0 entity is possible: `src/features/roadMarkings/buildRoadMarkingEntity.ts:29-35`
- Impact: center lines, which OpenDRIVE defines via the center lane road mark, are missed.

#### 10.4 `<geoReference>` / `<offset>` support is missing from the gap list
- parsed only: `src/parser/parseOpenDriveXml.ts:90-112`
- not applied in rendering pipeline

#### 10.5 Lane-type support is stale relative to v1.8.1
- Actual truth: v1.8.1 `11.7.1 Lane type` prefers `walking` and includes `slipLane`; `sidewalk` is deprecated.
- Code still models `sidewalk` and does not include `walking` / `slipLane` in `LaneType`.
- Evidence: `src/parser/types.ts:115-131`, `src/config/constants.ts:13-30`

---

## 11. “Non-indexed output” design decision — PASS

The implementation does emit non-indexed output:
- triangles: `src/features/lanes/buildLaneEntity.ts:57-64`
- boundary lines: `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:47-56`
- road-mark lines: `src/features/roadMarkings/buildRoadMarkingEntity.ts:55-65`

All three set `indices: []`.

---

## 12. Z-offset values — PASS with caveat

### Correct claim
Boundary z-offset is `+0.01 m`:
- constant: `src/config/constants.ts:77`
- applied: `src/features/laneBoundaries/buildLaneBoundaryEntity.ts:43`

### Caveat
Road markings are **not** `+0.01 m`; they are `+0.02 m`:
- constant: `src/config/constants.ts:78`
- applied: `src/features/roadMarkings/buildRoadMarkingEntity.ts:47`

---

## 13. Simpson’s rule claim — PASS

The document says `N ∈ [64, 256]` for the spiral integrator. That is correct:
- `const N = Math.min(256, Math.max(64, Math.ceil(ds)));`
- Evidence: `src/geometry/fresnel.ts:148`

---

## 14. Caching claim — PASS with caveat

### Correct claim
The converter uses closure-based caching:
- context created once in `registerOpenDriveMapConverter()` — `src/converters/openDriveMap/sceneUpdateConverter.ts:32-37`
- cached reuse path — `src/converters/openDriveMap/sceneUpdateConverter.ts:44-51`
- cache fill — `src/converters/openDriveMap/sceneUpdateConverter.ts:63-66`

### Caveat
The cache key is **not** “XML content”; it is:
- `msg.map_reference`
- `JSON.stringify(config)`

Evidence: `src/converters/openDriveMap/sceneUpdateConverter.ts:42, 47-48, 65-66`

If XML changed while `map_reference` stayed constant, this cache would not detect it.

---

## 15. Cross-reference consistency — FAIL

### `[ODR]`
`INTERFACE_MAPPING.md` is consistent with `ASAM_OpenDRIVE_Standard.md` only in the sense that **both use obsolete section numbering**.
- Evidence: `docs/references/ASAM_OpenDRIVE_Standard.md:18-258`

### `[FG-SCENE]`
Broadly consistent with `Foxglove_SceneUpdate_Schema.md`:
- identity pose / absolute points — `docs/references/Foxglove_SceneUpdate_Schema.md:148-162`
- SceneEntity semantics — `docs/references/Foxglove_SceneUpdate_Schema.md:73-80`
- TriangleList / LinePrimitive semantics — `docs/references/Foxglove_SceneUpdate_Schema.md:83-145`

### `[OSI]`
Broadly consistent with `ASAM_OSI_Coordinate_System.md` on inertial/global-frame identity:
- `docs/references/ASAM_OSI_Coordinate_System.md:40-52`

### Bottom line
Cross-document consistency is acceptable for FG/OSI, but the OpenDRIVE-reference layer is stale across multiple docs.

---

## Recommended corrections

1. Replace all OpenDRIVE section numbers with v1.8.1 numbering.
2. Fix all stale source line references.
3. Rewrite §4.4 and §5 to state the real road-mark limitations:
   - continuous strip only,
   - no center-lane marking rendering,
   - no explicit/detailed patterns,
   - no `sOffset` clipping.
4. Rewrite §4.5 so entity-id and metadata behavior are described per entity type, not generically.
5. Add missing gaps for lane borders and header georeference/offset application.
6. Update lane-type discussion to reflect v1.8.1 (`walking`, `slipLane`, deprecated `sidewalk`).

---

## Repository validation run during audit

- `npm run lint:ci` -> **fails in baseline** because ESLint 9 expects `eslint.config.js` and the repository does not provide one.
- `npm test -- --runInBand` -> **PASS** (5 suites, 42 tests)
- `npm run build` -> **PASS**
