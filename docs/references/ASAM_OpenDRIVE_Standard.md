# ASAM OpenDRIVE Standard Reference

> **Standard:** ASAM OpenDRIVE V1.8.1 (21 Nov 2024)
> **Publisher:** ASAM e.V. (Association for Standardization of Automation and Measuring Systems)
> **URL:** <https://www.asam.net/standards/detail/opendrive/>
> **File format:** `.xodr` (XML), `.xodrz` (compressed)
> **License:** Unrestricted distribution ("ASAM allows unrestricted distribution of this standard")

This document summarizes the mathematical definitions and coordinate system
conventions from the ASAM OpenDRIVE standard that are implemented in this
converter. All section references use the notation `[ODR §X.Y]` referring to
the OpenDRIVE specification chapters.

---

## 1. Coordinate Systems

### 1.1 Inertial (Global) Coordinate System [ODR §8.2]

OpenDRIVE defines a right-handed Cartesian coordinate system for the inertial
(world) frame:

| Axis | Direction | Unit |
|------|-----------|------|
| x    | East      | m    |
| y    | North     | m    |
| z    | Up        | m    |

- Heading (hdg) is measured counter-clockwise from the positive x-axis (East).
- The coordinate system complies with **ISO 8855:2011** ("Road vehicles —
  Vehicle dynamics and road-holding ability — Vocabulary").

### 1.2 Road Reference Line (s/t/h) Coordinate System [ODR §8.3]

Each road defines a curvilinear coordinate system along its reference line:

| Coordinate | Description                                         | Sign Convention         |
|------------|-----------------------------------------------------|-------------------------|
| s          | Arc length along the reference line in the x/y plane (elevation does not change s) | Always ≥ 0 |
| t          | Lateral offset perpendicular to reference line at s | + left, − right         |
| h          | Coordinate orthogonal to the s/t plane              | + up                    |

The reference line is defined in `<planView>` as a sequence of geometry
primitives, each starting at a specific `s` value.

---

## 2. Reference Line Geometry Primitives [ODR §9.2–§9.7]

Each `<geometry>` element in `<planView>` has attributes:
- `s` — start position along the road (arc length from road start, x/y plane)
- `x`, `y` — start position in inertial coordinates
- `hdg` — start heading (radians, counter-clockwise from x-axis)
- `length` — arc length of this geometry segment

### Local-to-Global Transformation [ODR §9.2]

All geometry types are first evaluated in a **local coordinate frame**
(origin at the geometry start point, x-axis along the initial heading),
then transformed to global (inertial) coordinates:

```
x_global = x₀ + cos(hdg₀) · x_local − sin(hdg₀) · y_local
y_global = y₀ + sin(hdg₀) · x_local + cos(hdg₀) · y_local
hdg_global = hdg₀ + hdg_local
```

Where `(x₀, y₀, hdg₀)` are the geometry element's start attributes.

### 2.1 Line [ODR §9.3]

A straight line segment. The simplest geometry type.

```
x_local(ds) = ds
y_local(ds) = 0
hdg_local(ds) = 0
```

### 2.2 Arc [ODR §9.5]

A circular arc with constant curvature κ (1/radius).
Positive curvature = left turn; negative = right turn.

```
r = 1/κ
θ(ds) = ds · κ

x_local(ds) = r · sin(θ)
y_local(ds) = r · (1 − cos(θ))
hdg_local(ds) = θ
```

### 2.3 Spiral (Euler Spiral / Clothoid) [ODR §9.4]

A curve with linearly varying curvature from κ_start to κ_end over length L.
This is the standard clothoid transition curve used in road design.

```
κ(s) = κ_start + (κ_end − κ_start)/L · s
θ(s) = κ_start · s + ½ · (κ_end − κ_start)/L · s²

x_local(ds) = ∫₀^ds cos(θ(s)) ds
y_local(ds) = ∫₀^ds sin(θ(s)) ds
hdg_local(ds) = θ(ds)
```

The integrals have no closed-form solution in general and require numerical
integration. For the special case κ_start = 0, these reduce to **Fresnel
integrals**:

```
C(t) = ∫₀ᵗ cos(π/2 · u²) du
S(t) = ∫₀ᵗ sin(π/2 · u²) du
```

**External mathematical references** (not cited by the OpenDRIVE spec, but
useful for implementation):
- Abramowitz, M. & Stegun, I.A. (1964). *Handbook of Mathematical Functions*,
  National Bureau of Standards, §7.3 (Fresnel Integrals).
- Abramowitz & Stegun formulas 7.3.26, 7.3.27 (rational approximations for
  auxiliary functions f(x) and g(x)).

### 2.4 Cubic Polynomial (poly3) [ODR §9.7]

**Deprecated since OpenDRIVE 1.6** in favor of paramPoly3. The spec defines
poly3 in local u/v coordinates:

```
v(u) = a + b·u + c·u² + d·u³
```

where u/v is a local coordinate system at the geometry start. In the
aligned-frame case (which is the typical usage):

```
x_local(ds) = ds
y_local(ds) = v(ds)
hdg_local(ds) = atan2(dv/ds, 1)

where dv/ds = b + 2c·ds + 3d·ds²
```

**Note:** The spec's general definition allows a shifted/rotated local frame
(`a != 0`, `b != 0`). The `x_local = ds` simplification is an implementation
convention for the aligned case only.

### 2.5 Parametric Cubic Polynomial (paramPoly3) [ODR §9.6]

Two independent cubic polynomials define the u (longitudinal) and v (lateral)
local coordinates as functions of parameter p:

```
u(p) = aU + bU·p + cU·p² + dU·p³
v(p) = aV + bV·p + cV·p² + dV·p³

hdg_local = atan2(dv/dp, du/dp)
```

The parameter p depends on the `pRange` attribute:
- `"arcLength"`: p ∈ [0, @length] — p ranges from 0 to the geometry's
  length attribute. **Note:** There is a non-linear relation between p and
  actual arc length in general; only the start and end values coincide.
- `"normalized"`: p ∈ [0, 1]

---

## 3. Elevation Profile [ODR §10.5.1]

The elevation of the reference line is defined by a sequence of cubic
polynomial records, each starting at a specific `s` value:

```
z(s) = a + b·ds + c·ds² + d·ds³
where ds = s − s_elevation
```

---

## 4. Lane Geometry [ODR §11]

### 4.1 Lane Sections [ODR §11.3]

Roads are divided into **lane sections** along the s-axis. Each lane section
defines the lane configuration for a range of s values.

### 4.2 Lane Numbering Convention [ODR §11.1, §11.2]

- Center lane: id = 0 (the reference line itself; always zero width)
- Left lanes: id > 0 (1, 2, 3, ... increasing outward from center)
- Right lanes: id < 0 (−1, −2, −3, ... increasing outward from center)

### 4.3 Lane Width Polynomial [ODR §11.6.1]

Lane width is defined as a cubic polynomial of the local s-coordinate within
the lane section:

```
w(ds) = a + b·ds + c·ds² + d·ds³
where ds = s − (s_section + sOffset)
```

Multiple width records per lane are supported (piecewise polynomials).

### 4.4 Lane Offset from Reference Line [ODR §11.4, §11.6.1]

The lateral position (t-coordinate) of a lane boundary is computed by
accumulating widths from the center lane outward:

- **Left lanes (id > 0):** t_outer(lane_k) = Σᵢ₌₁ᵏ w(lane_i)
- **Right lanes (id < 0):** t_outer(lane_k) = −Σᵢ₌₁ᵏ w(lane_i)

**Note:** If `<laneOffset>` is present ([ODR] §11.4), the center lane is
shifted relative to the road reference line by a cubic polynomial:
```
offset(ds) = a + b·ds + c·ds² + d·ds³
```
This offset must be added to the accumulated widths. The current
implementation does NOT apply `<laneOffset>`.

A point at lateral offset t from the reference line at position (x_ref,
y_ref) with heading hdg:

```
x = x_ref + t · cos(hdg + π/2)
y = y_ref + t · sin(hdg + π/2)
```

This uses the fact that the lane normal direction is perpendicular to the
reference line heading, rotated by +π/2 (pointing left).

### 4.5 Lane Types [ODR §11.7.1]

Selected lane types from V1.8.1 `e_laneType` enumeration (non-exhaustive):

| Type             | Description                              |
|------------------|------------------------------------------|
| `driving`        | Normal traffic lane                      |
| `stop`           | Emergency stop lane                      |
| `shoulder`       | Soft border at the edge of the road      |
| `biking`         | Bicycle lane                             |
| `walking`        | Pedestrian walkway (replaces deprecated `sidewalk`) |
| `sidewalk`       | **Deprecated** — use `walking` instead   |
| `border`         | Non-traversable border strip             |
| `restricted`     | Restricted area                          |
| `parking`        | Parking area                             |
| `median`         | Central reservation / median strip       |
| `curb`           | Curb element                             |
| `none`           | Space on the outermost edge; placeholder with no actual content |
| `entry`/`exit`   | Highway entry/exit                       |
| `onRamp`/`offRamp` | Highway on/off ramp                    |
| `connectingRamp` | Ramp connecting roads                    |
| `slipLane`       | Slip lane (new in V1.8.1)                |
| `bus`/`taxi`/`HOV` | Dedicated-use lanes                    |

See [ODR] Annex A `e_laneType` for the complete enumeration.

---

## 5. Road Markings [ODR §11.8]

Road markings are defined per lane with:
- `sOffset` — start position within lane section
- `type` — marking pattern from `e_roadMarkType`: `none`, `solid`, `broken`,
  `solid solid`, `solid broken`, `broken solid`, `broken broken`, `botts dots`,
  `grass`, `curb`, `custom`, `edge`
- `weight` — standard or bold
- `color` — from `e_roadMarkColor`: `standard` (=white), `white`, `yellow`,
  `blue`, `green`, `red`, `orange`, `violet`, `black`
- `width` — marking width in meters

---

## 6. Junctions [ODR §12]

Junctions define intersection areas where roads connect. Each junction
contains connections specifying:
- `incomingRoad` — road approaching the junction
- `connectingRoad` — road within the junction
- `contactPoint` — which end of the connecting road meets the junction
- `laneLink` — mapping of lanes between incoming and connecting roads

Junction connecting roads are normal roads with their own geometry and lane
definitions, but they are flagged with `junction != "-1"`.

---

## 7. Geo-Referencing [ODR §8.5]

The `<header>` element may contain:
- `<geoReference>` — PROJ string defining the geographic projection
  (e.g., `+proj=utm +zone=32 +ellps=WGS84`)
- `<offset>` — Affine transform from local OpenDRIVE coordinates to
  world/projected coordinates before PROJ conversion:
  ```
  xWorld = xODR·cos(hdg) − yODR·sin(hdg) + xOffset
  yWorld = xODR·sin(hdg) + yODR·cos(hdg) + yOffset
  zWorld = zODR + zOffset
  ```
  - `x`, `y`, `z` — translation offset
  - `hdg` — rotation around z-axis (recommended to be 0)

---

## References

1. ASAM e.V. (2024). *ASAM OpenDRIVE V1.8.1 — Open Dynamic Road Information
   for Vehicle Environment*. <https://www.asam.net/standards/detail/opendrive/>

2. ISO 8855:2011. *Road vehicles — Vehicle dynamics and road-holding
   ability — Vocabulary*. International Organization for Standardization.

3. Abramowitz, M. & Stegun, I.A. (1964). *Handbook of Mathematical Functions
   with Formulas, Graphs, and Mathematical Tables*. National Bureau of
   Standards, Applied Mathematics Series 55. Chapter 7: Error Function and
   Fresnel Integrals. (**External mathematical reference** — not cited by the
   OpenDRIVE specification bibliography.)

4. Remondi, B.W. (2004). "Computing Clothoid Segments for Geometric Design."
   *Journal of Surveying Engineering*, 130(4), pp. 158–163.

5. Meek, D.S. & Walton, D.J. (2004). "An arc spline approximation to a
   clothoid." *Journal of Computational and Applied Mathematics*, 170(1),
   pp. 59–77.
