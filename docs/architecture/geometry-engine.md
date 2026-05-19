---
sidebar_position: 3
---

# Geometry Engine (Interim)

> **Note:** This TypeScript geometry engine is an interim implementation. It will be replaced by the [libOpenDRIVE](https://github.com/pageldev/libOpenDRIVE/) WASM module which handles all geometry types with guaranteed continuity and adaptive error-bounded sampling. See [Architecture Overview](/architecture/overview).

The geometry engine evaluates OpenDRIVE reference line geometry types and produces 3D coordinates. All implementations follow ASAM OpenDRIVE V1.8.1 Chapter 9.

## Reference Line Geometry Types

### Line [ODR §9.3]

Trivial — the local coordinate is `(ds, 0)` with heading 0.

### Arc [ODR §9.5]

Circular arc with constant curvature κ:

```
x = sin(ds · κ) / κ
y = (1 - cos(ds · κ)) / κ
hdg = ds · κ
```

Special case: when κ → 0, falls back to straight line.

### Spiral (Clothoid) [ODR §9.4]

Euler spiral with linearly varying curvature from `curvStart` to `curvEnd`:

```
κ(s) = curvStart + (curvEnd - curvStart) · s / length
θ(s) = curvStart · s + 0.5 · curvRate · s²
x = ∫₀ˢ cos(θ(t)) dt
y = ∫₀ˢ sin(θ(t)) dt
```

Evaluated using Simpson's rule with N ∈ [64, 256] steps (scaled by geometry length).

### Cubic Polynomial [ODR §9.7]

Deprecated geometry type. Local v(u) = a + b·u + c·u² + d·u³ in aligned frame (u ≡ ds).

### Parametric Cubic [ODR §9.6]

```
u(p) = aU + bU·p + cU·p² + dU·p³
v(p) = aV + bV·p + cV·p² + dV·p³
```

With `pRange`:
- `"normalized"` → p = ds / length ∈ [0, 1]
- `"arcLength"` → p = ds ∈ [0, length]

## Elevation [ODR §10.5.1]

Cubic polynomial along s: `z(s) = a + b·ds + c·ds² + d·ds³`

Each elevation record has an `s` start position. The engine finds the applicable record for a given s-coordinate and evaluates the cubic.

## Lateral Offset

Points are offset perpendicular to the reference line heading:

```
x_offset = x + t · cos(hdg + π/2)
y_offset = y + t · sin(hdg + π/2)
```

Where `t` is the accumulated lane width (positive left, negative right) per [ODR §8.3].

## Lane Width Accumulation [ODR §11.6.1]

Lane widths are cubic polynomials evaluated at local ds within the lane section:

```
width(ds) = a + b·ds + c·ds² + d·ds³
```

Widths accumulate from center (lane 0) outward. Left lanes: cumulative positive offset. Right lanes: cumulative negative offset.
