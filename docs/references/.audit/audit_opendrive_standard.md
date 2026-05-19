# Audit of `ASAM_OpenDRIVE_Standard.md`

## Scope and method
- Audited file: `docs/references/ASAM_OpenDRIVE_Standard.md`
- Reference baseline: **ASAM OpenDRIVE V1.8.1** official online specification
- Verification method: compared the document against the official ASAM V1.8.1 pages for coordinate systems, geometries, road elevation, lanes, junctions, georeferencing, and annex enumerations/bibliography where needed.

## Overall assessment
**UNSAFE TO PUBLISH as a standards reference in its current form.**

The document has several high-severity issues:
1. **Systematic section-numbering errors** (old chapter numbering is used throughout)
2. **A wrong interpretation of `paramPoly3/@pRange="arcLength"`**
3. **An incorrect/generalized `poly3` definition** (uses `ds` instead of the spec’s local `u` parameter)
4. **Outdated/incomplete lane-type and road-marking enumerations**
5. **An incorrect ISO citation year**
6. **Unsupported attribution of Abramowitz & Stegun references as if they were part of the spec**

## Summary of requested checks

| # | Check item | Result | Notes |
|---|---|---|---|
| 1 | Section numbering | **FAIL** | The file uses pre-1.8 numbering (`§5`, `§7.3`, `§9`, `§10`, `§4.2`) instead of V1.8.1 chapter numbers (`§8`, `§9`, `§11`, `§12`, `§8.5`, etc.). |
| 2 | Mathematical formulas | **FAIL / MIXED** | Arc, spiral-heading, lane-width, lateral-normal, and elevation formulas are broadly consistent; `poly3` and `paramPoly3 pRange` are not. |
| 3 | Arc formula `y_local = r·(1−cos θ)` | **PASS** | Consistent with positive-left `t` convention and positive-left curvature. |
| 4 | Spiral heading formula `θ(s)=κ_start·s + 1/2·rate·s²` | **PASS** | Correct as the integral of linearly varying curvature; derived from spec, not printed verbatim. |
| 5 | `paramPoly3 pRange` meaning | **FAIL** | `arcLength` does **not** mean “actual arc-length parameter `ds`”; the spec says only that `p ∈ [0, @length]` and explicitly warns the relation to actual arc length is non-linear in general. |
| 6 | Lane numbering convention | **PASS** | Positive = left, negative = right, center = 0. |
| 7 | Lane width formula and `sOffset` | **PASS** | Formula matches §11.6.1; `s = sSection + sOffset + ds`. |
| 8 | Lateral offset formula `x = x_ref + t·cos(hdg+π/2)` | **PASS (derived)** | Correct left-normal formula; however the document omits the separate `<laneOffset>` polynomial from lane-placement discussion. |
| 9 | Coordinate system `x=East, y=North, z=Up` | **PASS** | Matches the geographic-reference convention in §8.2. |
| 10 | Elevation profile polynomial | **PASS** | Cubic formula matches §10.5.1; only the section reference is wrong. |
| 11 | Lane types enumeration | **FAIL** | Includes deprecated `sidewalk`, omits `walking` and `slipLane`, and is not a correct V1.8.1 reference list. |
| 12 | Road marking types | **FAIL** | Type and color lists are incomplete. |
| 13 | Junction structure terminology | **PASS / MIXED** | `incomingRoad` / `connectingRoad` terminology is correct; section numbering is wrong. |
| 14 | Geo-referencing and offset | **FAIL** | Section reference is wrong and the `<offset>` description reverses/misstates the transform direction. |
| 15 | Abramowitz & Stegun references | **FAIL** | Not cited by the V1.8.1 spiral section or bibliography. |

## Detailed findings

### 1) Systematic section-numbering errors

The document uses obsolete chapter references from older OpenDRIVE versions.

| Incorrect text in audited file | Correct V1.8.1 reference | Source URL |
|---|---|---|
| `Coordinate Systems [ODR §5.1]` | Coordinate systems are chapter **8**; inertial coordinates are **§8.2** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_02_inertial_coordinate_system.html |
| `Road Reference Line (s/t/h) Coordinate System [ODR §5.2]` | Road reference line coordinates are **§8.3** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_03_reference_line_coordinate_system.html |
| `Reference Line Geometry Primitives [ODR §7.3]` | Geometries are chapter **9** (`§9.2`–`§9.7`) | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_01_introduction.html |
| `Line [ODR §7.3.1]` | **§9.3 Straight line** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_03_straight_line.html |
| `Arc [ODR §7.3.2]` | **§9.5 Arc** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_05_arc.html |
| `Spiral [ODR §7.3.3]` | **§9.4 Spiral** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_04_spiral.html |
| `poly3 [ODR §7.3.4]` | **§9.7 Cubic polynom (deprecated)** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_07_poly3.html |
| `paramPoly3 [ODR §7.3.5]` | **§9.6 Parametric cubic curve** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_06_param_poly3.html |
| `Elevation Profile [ODR §8]` | Road elevation is **§10.5.1** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/10_roads/10_05_elevation.html |
| `Lane Geometry [ODR §9]` | Lanes are chapter **11** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_01_introduction.html |
| `Lane Sections [ODR §9.2]` | **§11.3 Lane sections** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_03_lane_sections.html |
| `Lane Numbering Convention [ODR §9.3]` | **§11.1 / §11.2** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_01_introduction.html |
| `Lane Width Polynomial [ODR §9.5.2]` | **§11.6.1 Lane width** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_06_lane_geometry.html |
| `Lane Offset from Reference Line [ODR §9.4]` | **§11.4 Lane offset** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_04_lane_offset.html |
| `Lane Types [ODR §9.5.1]` | **§11.7 Lane type** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_07_lane_properties.html |
| `Road Markings [ODR §9.5.3]` | **§11.8 Road markings** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_08_road_markings.html |
| `Junctions [ODR §10]` | Junctions are chapter **12** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/12_junctions/12_01_introduction.html |
| `Geo-Referencing [ODR §4.2]` | Georeferencing is **§8.5** | https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_05_geo_referencing.html |

**Suggested correction:** update every `[ODR §…]` reference to V1.8.1 numbering before publication.

### 2) Incorrect ISO citation year
- **Incorrect text:** `The coordinate system complies with ISO 8855:2013-11`
- **Correct text:** The V1.8.1 spec cites **ISO 8855:2011** in bibliography entry `[6]`.
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/bibliography.html
- **Suggested correction:** Replace `ISO 8855:2013-11` with `ISO 8855:2011` (or simply cite `ISO 8855` without an edition if you do not intend to maintain edition-specific references).

### 3) `h` coordinate is described inaccurately
- **Incorrect text:** `h | Height above the road surface | + up`
- **Correct text:** `h` is the coordinate **orthogonal to the s/t plane in a right-handed coordinate system**.
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_03_reference_line_coordinate_system.html
- **Suggested correction:** Replace “Height above the road surface” with “Coordinate orthogonal to the s/t plane (+up)”.

### 4) `s` is not just a generic 3D arc length
- **Incorrect text:** `s | Arc length along the reference line from road start`
- **Correct text:** `s` is measured from the start of the road reference line **in the x/y plane**, i.e. not taking the elevation profile into account.
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_03_reference_line_coordinate_system.html
- **Suggested correction:** Add “calculated in the x/y plane (elevation does not change s)”.

### 5) `poly3` is defined incorrectly / too narrowly
- **Incorrect text:**
  ```
  Deprecated since OpenDRIVE 1.6 in favor of paramPoly3. The lateral offset
  is a cubic function of arc length:

  v(ds) = a + b·ds + c·ds² + d·ds³
  x_local(ds) = ds
  y_local(ds) = v(ds)
  hdg_local(ds) = atan2(dv/ds, 1)
  ```
- **Correct text:** The spec defines `poly3` in local **u/v** coordinates:
  ```
  v(u) = a + b*u + c*u² + d*u³
  ```
  `u` is **not generally the same thing as `ds`**. The page explicitly states that the local `u/v` system may be shifted/rotated (`a != 0`, `b != 0`) and only *usually* aligns with the start point/orientation.
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_07_poly3.html
- **Suggested correction:** Rewrite the section so it matches the spec’s `v(u)` definition and clearly label `x_local=ds` / `hdg_local=atan2(...)` as a special aligned-frame implementation case only, not as the normative definition.

### 6) `paramPoly3/@pRange` is misinterpreted
- **Incorrect text:**
  ```
  The parameter p depends on the `pRange` attribute:
  - "arcLength": p = ds (arc length from geometry start)
  - "normalized": p = ds / L (normalized to [0, 1])
  ```
- **Correct text:** The spec says:
  - `arcLength`: **`p` is chosen in `[0, @length of <geometry>]`**
  - `normalized`: **`p` is chosen in `[0, 1]`**

  The spec also states: **there is a non-linear relation between `p` and actual arc length in general**, and for `pRange="arcLength"` only the start and end parameter values coincide with actual arc length.
- **Source URLs:**
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_06_param_poly3.html
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/16_annexes/enumerations/map_uml_enumerations.html
- **Suggested correction:** Replace the bullet list with the actual range definitions above and explicitly note that `p` is **not** a guaranteed actual arclength parameter for intermediate points.

### 7) Lane placement discussion omits the normative `<laneOffset>` polynomial
- **Incorrect text:** `The lateral position (t-coordinate) of a lane boundary is computed by accumulating widths from the center lane outward`
- **Correct text:** The spec defines `<laneOffset>` separately as:
  ```
  offset(ds) = a + b*ds + c*ds² + d*ds³
  ```
  Width accumulation is only part of lane placement. If `<laneOffset>` is present, the center lane itself is shifted relative to the road reference line.
- **Source URLs:**
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_04_lane_offset.html
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_06_lane_geometry.html
- **Suggested correction:** Keep the width-accumulation explanation, but add that final lane-boundary `t` values must also include any applicable `<laneOffset>`.

### 8) Lane-type table is not accurate for V1.8.1
- **Incorrect text:**
  - Includes `sidewalk`
  - Describes `shoulder` as `Hard shoulder`
  - Describes `none` as `No physical lane (center lane, dividers)`
  - Omits `walking` and `slipLane`
- **Correct text:**
  - `sidewalk` is **deprecated**; use **`walking`** instead
  - `shoulder` = **Soft border at the edge of the road**
  - `none` = **Space on the outermost edge of the road; placeholder with no actual content**
  - V1.8.1 lane types also include `walking`, `slipLane`, and further enumerated values in Annex A (`rail`, `tram`, `shared`, `roadWorks`, `HOV`, `bus`, `taxi`, deprecated values, etc.)
- **Source URLs:**
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_07_lane_properties.html
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/16_annexes/enumerations/map_uml_enumerations.html
- **Suggested correction:** Rebuild the lane-type section from §11.7 + Annex A instead of using a shortened legacy list.

### 9) Road-marking type list is incomplete
- **Incorrect text:** `type — marking pattern (solid, broken, solid solid, etc.)`
- **Correct text:** V1.8.1 `e_roadMarkType` includes:
  - `botts dots`
  - `broken broken`
  - `broken solid`
  - `broken`
  - `curb`
  - `custom`
  - `edge`
  - `grass`
  - `none`
  - `solid broken`
  - `solid solid`
  - `solid`
- **Source URLs:**
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/11_lanes/11_08_road_markings.html
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/16_annexes/enumerations/map_uml_enumerations.html
- **Suggested correction:** Either provide the full enum list or explicitly label the examples as non-exhaustive.

### 10) Road-marking color list is incomplete and slightly misleading
- **Incorrect text:** `color — standard (white), yellow, blue, green, red`
- **Correct text:** V1.8.1 `e_roadMarkColor` includes:
  - `black`
  - `blue`
  - `green`
  - `orange`
  - `red`
  - `standard` (**equivalent to `white`**)
  - `violet`
  - `white`
  - `yellow`
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/16_annexes/enumerations/map_uml_enumerations.html
- **Suggested correction:** Expand the list and avoid collapsing `standard` and `white` into a single normative value.

### 11) `<offset>` is described in the wrong direction / too loosely
- **Incorrect text:** `<offset> — Translation and rotation from projected to inertial frame`
- **Correct text:** The spec says to **apply `<offset>` to local ASAM OpenDRIVE coordinates to get world coordinates before converting with PROJ**. It gives the formulas:
  ```
  xWorld = xODR*cos(hdg) - yODR*sin(hdg) + xOffset
  yWorld = xODR*sin(hdg) + yODR*cos(hdg) + yOffset
  zWorld = zODR + zOffset
  ```
  and separately states that rotation around the z-axis should be avoided.
- **Source URL:** https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/08_coordinate_systems/08_05_geo_referencing.html
- **Suggested correction:** Rephrase as “`<offset>` applies an affine transform from local ASAM OpenDRIVE coordinates to world/projected coordinates before PROJ conversion.”

### 12) Abramowitz & Stegun references are not part of the cited 1.8.1 spec
- **Incorrect text:**
  - `Abramowitz & Stegun formulas 7.3.26, 7.3.27`
  - the implication that these are spec-backed references for OpenDRIVE V1.8.1
- **Correct text:** The fetched V1.8.1 spiral page and bibliography do **not** cite Abramowitz & Stegun at all.
- **Source URLs:**
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/09_geometries/09_04_spiral.html
  - https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/bibliography.html
- **Suggested correction:** If these references are useful for implementation, keep them only as **external mathematical references**, clearly separated from normative ASAM references.

## Items checked and found correct (or acceptable as derived formulas)
- `x = east, y = north, z = up` for geographic reference in the inertial frame — matches §8.2.
- Heading measured counter-clockwise from the positive x-axis / east — matches §8.2 (`heading=+π/2` points toward north).
- Lane numbering convention (center `0`, left positive, right negative) — matches §11.1/§11.2.
- Lane width cubic polynomial and `sOffset` meaning — matches §11.6.1.
- Elevation cubic polynomial — matches §10.5.1.
- Junction terminology `incomingRoad` / `connectingRoad` — matches §§12.2–12.4.
- Arc local formula `x=r sin θ`, `y=r(1-cos θ)` — consistent with the spec’s positive-left curvature / positive-left lateral convention.
- Spiral heading formula `θ(s)=∫κ(s)ds = κ_start s + 1/2 ((κ_end-κ_start)/L) s²` — consistent with the spec statement that curvature changes linearly from `curvStart` to `curvEnd`.
- Lateral normal transform using `hdg + π/2` — consistent with the spec’s definition that positive `t` points left of the reference line.

## Recommended publication decision
**Do not publish this file as a standards reference until the FAIL items above are corrected.**

At minimum, correct:
1. all section references
2. the `poly3` and `paramPoly3` sections
3. the lane-type and road-marking enumerations
4. the georeferencing/offset wording
5. the unsupported Abramowitz & Stegun attribution
6. the ISO citation year
