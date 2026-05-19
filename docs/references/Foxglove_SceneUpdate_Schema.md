# Foxglove SceneUpdate Schema Reference

> **Source:** foxglove/foxglove-sdk (formerly foxglove/schemas)
> **Repository:** <https://github.com/foxglove/foxglove-sdk>
> **npm package:** `@foxglove/schemas`
> **Docs:** <https://docs.foxglove.dev/docs/sdk/schemas/>

This document defines the Foxglove schema structures used as the output
format of this converter. All scene geometry is emitted as
`foxglove.SceneUpdate` messages for the Lichtblick/Foxglove 3D panel.

---

## 1. Coordinate System

The Foxglove 3D panel does not prescribe a specific axis convention at the
schema level — it renders whatever coordinate frame the data uses. In
practice, when used with ROS-based systems, the convention follows
**ROS REP-103** (X-forward, Y-left, Z-up).

**Project convention:** This converter emits coordinates in the OpenDRIVE/OSI
inertial frame (right-handed, Z-up). When the Foxglove 3D panel's fixed
frame corresponds to this inertial frame, x maps to East and y to North.

---

## 2. SceneUpdate

Top-level message returned by the converter.

```typescript
interface SceneUpdate {
  deletions: SceneEntityDeletion[];  // Entities to remove
  entities:  SceneEntity[];          // Entities to add/replace
}
```

- Publishing an entity with the same `id` on the same topic **replaces**
  the previous entity (upsert semantics).
- Deletion is scoped per-topic.

---

## 3. SceneEntity

A single visual object that may contain multiple primitives.

```typescript
interface SceneEntity {
  timestamp:    Time;            // Field 1 — entity time
  frame_id:     string;          // Field 2 — coordinate frame reference
  id:           string;          // Field 3 — unique identifier (upsert key)
  lifetime:     Duration;        // Field 4 — {sec:0, nsec:0} = persistent
  frame_locked: boolean;         // Field 5 — true = follow frame, false = fixed
  metadata:     KeyValuePair[];  // Field 6 — optional annotations

  // Primitive arrays (fields 7–14, any combination):
  arrows:    ArrowPrimitive[];       // Field 7
  cubes:     CubePrimitive[];        // Field 8
  spheres:   SpherePrimitive[];      // Field 9
  cylinders: CylinderPrimitive[];    // Field 10
  lines:     LinePrimitive[];        // Field 11 ← Lane boundaries, road markings
  triangles: TriangleListPrimitive[];// Field 12 ← Lane surfaces
  texts:     TextPrimitive[];        // Field 13
  models:    ModelPrimitive[];       // Field 14
}
```

### Key Semantics

| Field          | Value Used           | Rationale                        |
|----------------|----------------------|----------------------------------|
| `lifetime`     | `{sec:0, nsec:0}`   | Static map persists indefinitely |
| `frame_locked` | `true`               | Map follows its coordinate frame |
| `frame_id`     | `"global"`           | Matches OSI/OpenDRIVE inertial   |

---

## 4. TriangleListPrimitive

Used for lane surface rendering (filled polygons).

```typescript
interface TriangleListPrimitive {
  pose:    Pose;      // Local-to-frame transform
  points:  Point3[];  // Vertex positions
  color:   Color;     // Uniform color (ignored if colors[] non-empty)
  colors:  Color[];   // Per-vertex colors
  indices: number[];  // Optional index buffer (uint32)
}
```

### Points Interpretation

- **Without indices:** Points consumed as sequential triples.
  Points `[0,1,2]` = triangle 1; `[3,4,5]` = triangle 2; etc.
  `points.length` must be divisible by 3.
- **With indices:** Standard indexed mesh rendering.
  `indices.length` must be divisible by 3.
  Triangle i uses `points[indices[3i]]`, `points[indices[3i+1]]`,
  `points[indices[3i+2]]`.

### Winding Order

The Foxglove schema does not specify triangle winding order requirements.
In practice, both sides of triangles are rendered, so winding order does
not affect visibility in current implementations.

---

## 5. LinePrimitive

Used for lane boundaries and road markings.

```typescript
interface LinePrimitive {
  type:            LineType;  // 0=LINE_STRIP, 1=LINE_LOOP, 2=LINE_LIST
  pose:            Pose;      // Local-to-frame transform
  thickness:       number;    // Line width
  scale_invariant: boolean;   // true=screen px, false=world meters
  points:          Point3[];  // Control points
  color:           Color;     // Uniform color
  colors:          Color[];   // Per-point colors
  indices:         number[];  // Optional index buffer
}
```

### Line Types

| Enum Value | Name         | Connectivity                           | Use Case              |
|------------|--------------|----------------------------------------|-----------------------|
| 0          | `LINE_STRIP` | 0→1, 1→2, ..., (n-1)→n               | Lane boundaries       |
| 1          | `LINE_LOOP`  | 0→1, ..., n→0 (auto-close)           | Closed contours       |
| 2          | `LINE_LIST`  | 0→1, 2→3, 4→5, ... (pairs)           | Dashed markings       |

### Scale Invariant

- `false` — Thickness in world coordinates. Line scales with distance
  from the camera. This converter uses meters as the world unit.
- `true` — Thickness in screen pixels. Constant visual width regardless
  of zoom. Useful for annotations.

---

## 6. Pose Transform Model

The `pose` field on each primitive acts as a local-to-frame transform:

```
world_position = frame_transform(frame_id) × pose × point
```

- `pose.position` — Translation applied to all points
- `pose.orientation` — Rotation (quaternion) applied around origin

**For this converter:** All primitives use `IDENTITY_POSE` (position=origin,
orientation=identity quaternion). Points contain absolute inertial
coordinates directly in the OpenDRIVE/OSI global frame.

---

## 7. Color Model

All color values are **floating-point in [0.0, 1.0]**:

```typescript
interface Color {
  r: number;  // Red   [0.0, 1.0]
  g: number;  // Green [0.0, 1.0]
  b: number;  // Blue  [0.0, 1.0]
  a: number;  // Alpha [0.0, 1.0]  (0=transparent, 1=opaque)
}
```

### Color Precedence

- If `colors[]` is **non-empty**, it provides per-vertex/per-point colors
  and the uniform `color` field is **ignored**.
- If `colors[]` is **empty**, the uniform `color` applies to all vertices.

---

## 8. Common Types

```typescript
interface Time     { sec: number; nsec: number; }
interface Duration { sec: number; nsec: number; }

// A point representing a position in 3D space
interface Point3     { x: number; y: number; z: number; }

// A vector in 3D space that represents a direction or translation
// Note: structurally identical to Point3 but semantically different
interface Vector3    { x: number; y: number; z: number; }

interface Quaternion { x: number; y: number; z: number; w: number; }
// Identity (no rotation): { x: 0, y: 0, z: 0, w: 1 }

// Pose uses Vector3 for position (translation), not Point3
interface Pose {
  position:    Vector3;
  orientation: Quaternion;
}

interface KeyValuePair { key: string; value: string; }
```

---

## References

1. Foxglove (2024). *Foxglove SDK — Message Schemas*.
   <https://docs.foxglove.dev/docs/sdk/schemas/>

2. Foxglove (2024). *foxglove-sdk* GitHub repository.
   <https://github.com/foxglove/foxglove-sdk>

3. ROS REP-103 (2010). *Standard Units of Measure and Coordinate Conventions*.
   <https://www.ros.org/reps/rep-0103.html>
