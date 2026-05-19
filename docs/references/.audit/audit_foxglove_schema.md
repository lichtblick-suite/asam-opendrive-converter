# Audit of `Foxglove_SceneUpdate_Schema.md`

## Scope
Audited: `/docs/references/Foxglove_SceneUpdate_Schema.md`

Verification sources used:
- Proto schemas from `foxglove/schemas` / generated from `foxglove/foxglove-sdk`
- Foxglove schema docs (`docs.foxglove.dev/docs/sdk/schemas/...`)
- Installed npm types from `node_modules/@foxglove/schemas/dist/types/*.d.ts`
- Foxglove 3D panel docs (`docs.foxglove.dev/docs/visualization/panels/3d`)

## PASS/FAIL by requested item

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | SceneUpdate fields / field numbers | PASS | `deletions = 1`, `entities = 2`, and those are the only fields. |
| 2 | SceneEntity fields / order | FAIL | Primitive arrays are correct and in the right relative order, but overall field order in the document is wrong. |
| 3 | TriangleListPrimitive fields / types / semantics | PASS | `pose`, `points`, `color`, `colors`, `indices` are correct; `indices` is `fixed32` in proto / `uint32[]` in docs. |
| 4 | "Points interpreted as triples" claim | PASS | Core claim is supported; exact proto/doc text is: `interpreted as a list of triples (0-1-2, 3-4-5, ...)`. |
| 5 | LinePrimitive.type enum | PASS | Values are `LINE_STRIP=0`, `LINE_LOOP=1`, `LINE_LIST=2`. |
| 6 | Color range / numeric type | PASS | Range comments are `between 0 and 1`; proto type is `double` (`float64`). |
| 7 | Quaternion identity / `w` field | PASS | `w` is field 4; `{x:0,y:0,z:0,w:1}` is the standard identity quaternion. |
| 8 | Pose structure | FAIL | `Pose.position` uses `Vector3`, not `Point3`; the document also incorrectly says `Vector3` is semantically the same as `Point3`. |
| 9 | "ROS REP-103 conventions" claim | FAIL | Not verified by the Foxglove 3D panel docs reviewed; unsupported as a Foxglove schema/doc claim. |
| 10 | `scale_invariant` semantics | FAIL | `true = screen pixels` is correct; `false` is documented as world coordinates, not specifically meters. |
| 11 | `frame_locked` semantics | PASS | `true = follow frame`, `false = keep location in fixed frame`. |
| 12 | `lifetime {0,0} = persistent` | PASS | Zero lifetime means visible until replaced or deleted. |
| 13 | `indices` field type / empty semantics | PASS | Proto type is `repeated fixed32`; empty/omitted means implicit `[0, 1, ..., N-1]`. |
| 14 | Color precedence rule | PASS | Documented: `color` is ignored if `colors` is non-empty. |
| 15 | "No backface culling" claim | FAIL | Not verified in official Foxglove 3D panel docs reviewed; unsupported. |

## Exact specification text found

### Item 4: triangles interpreted as triples
From `TriangleListPrimitive.proto` and the Foxglove schema docs:

> `Vertices to use for triangles, interpreted as a list of triples (0-1-2, 3-4-5, ...)`

## Errors found

### 1) SceneEntity field order is wrong
- **Incorrect text** (`Foxglove_SceneUpdate_Schema.md`, lines 53-69): document lists `id` first, then `timestamp`, `frame_id`, `lifetime`, `frame_locked`, `metadata`, followed by primitive arrays.
- **Correct text**: actual schema order is:
  1. `timestamp = 1`
  2. `frame_id = 2`
  3. `id = 3`
  4. `lifetime = 4`
  5. `frame_locked = 5`
  6. `metadata = 6`
  7. `arrows = 7`
  8. `cubes = 8`
  9. `spheres = 9`
  10. `cylinders = 10`
  11. `lines = 11`
  12. `triangles = 12`
  13. `texts = 13`
  14. `models = 14`
- **Source URL/file**:
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/SceneEntity.proto
  - https://docs.foxglove.dev/docs/sdk/schemas/scene-entity
  - `/home/q413005/workspace/asam-opendrive-converter/node_modules/@foxglove/schemas/dist/types/SceneEntity.d.ts`
- **Suggested correction**: reorder the `SceneEntity` interface to match the actual schema; keep the primitive arrays as `arrows, cubes, spheres, cylinders, lines, triangles, texts, models`.

### 2) Pose typing is obscured, and `Vector3` is not semantically the same as `Point3`
- **Incorrect text** (`Foxglove_SceneUpdate_Schema.md`, line 193): `interface Vector3 { x: number; y: number; z: number; }  // Semantically same as Point3`
- **Correct text**:
  - `Pose.position` is `Vector3`, not `Point3`.
  - `Point3` = `A point representing a position in 3D space`.
  - `Vector3` = `A vector in 3D space that represents a direction only`.
- **Source URL/file**:
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/Pose.proto
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/Point3.proto
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/Vector3.proto
  - https://docs.foxglove.dev/docs/sdk/schemas/pose
  - https://docs.foxglove.dev/docs/sdk/schemas/point-3
  - https://docs.foxglove.dev/docs/sdk/schemas/vector-3
- **Suggested correction**: add an explicit `Pose` definition:
  ```typescript
  interface Pose {
    position: Vector3;
    orientation: Quaternion;
  }
  ```
  and remove the comment claiming `Vector3` is semantically the same as `Point3`.

### 3) REP-103 / ENU wording is not supported by the Foxglove docs reviewed
- **Incorrect text** (`Foxglove_SceneUpdate_Schema.md`, lines 16-27):
  - `Foxglove's 3D panel uses ROS REP-103 conventions:`
  - axis notes such as `Also East in map frame` / `Also North in map frame`
  - `Compatible with OpenDRIVE/OSI when the fixed frame corresponds to the East-North-Up inertial frame`
- **Correct text**: the Foxglove 3D panel docs reviewed do not explicitly state REP-103/FLU/ENU as a general `SceneUpdate` schema rule. If you want to keep this section, label it as a project convention or assumption, not as a Foxglove-documented schema fact.
- **Source URL/file**:
  - https://docs.foxglove.dev/docs/visualization/panels/3d/
  - https://docs.foxglove.dev/docs/sdk/schemas/scene-update
  - https://docs.foxglove.dev/docs/sdk/schemas/scene-entity
- **Suggested correction**: rephrase to something like: `Project convention: this converter emits coordinates assuming an ENU-style world frame compatible with the consuming application.`

### 4) `scale_invariant` says world coordinates, not specifically meters
- **Incorrect text** (`Foxglove_SceneUpdate_Schema.md`, lines 123, 141-143): `true=screen px, false=world meters`
- **Correct text**: `Indicates whether thickness is a fixed size in screen pixels (true), or specified in world coordinates and scales with distance from the camera (false)`.
- **Source URL/file**:
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/LinePrimitive.proto
  - https://docs.foxglove.dev/docs/sdk/schemas/line-primitive
  - `/home/q413005/workspace/asam-opendrive-converter/node_modules/@foxglove/schemas/dist/types/LinePrimitive.d.ts`
- **Suggested correction**: replace `world meters` with `world coordinates`. If your converter uses meters, say that separately as a converter-specific assumption.

### 5) Backface-culling claim is unsupported
- **Incorrect text** (`Foxglove_SceneUpdate_Schema.md`, lines 109-110): `The Foxglove 3D panel does not perform backface culling by default, so triangle winding order does not affect visibility.`
- **Correct text**: no such statement was found in the official Foxglove schema docs or 3D panel docs reviewed. This claim should be removed unless it is tied to a specific verified Foxglove implementation/version.
- **Source URL/file**:
  - https://docs.foxglove.dev/docs/visualization/panels/3d/
  - https://raw.githubusercontent.com/foxglove/schemas/main/schemas/proto/foxglove/TriangleListPrimitive.proto
  - https://docs.foxglove.dev/docs/sdk/schemas/triangle-list-primitive
- **Suggested correction**: remove the statement, or replace it with a version-specific implementation note backed by a source-code citation.

## Notes on items that are correct
- `SceneUpdate` fields are exactly:
  - `repeated SceneEntityDeletion deletions = 1`
  - `repeated SceneEntity entities = 2`
- `SceneEntity` primitive arrays are indeed in this order:
  - `arrows, cubes, spheres, cylinders, lines, triangles, texts, models`
- `TriangleListPrimitive.indices` is `repeated fixed32 indices = 5`; Foxglove docs present this as `uint32[]`.
- Empty/omitted `indices` means implicit sequential indexing `[0, 1, ..., N-1]`.
- `LinePrimitive.Type` / `LineType` values are:
  - `LINE_STRIP = 0`
  - `LINE_LOOP = 1`
  - `LINE_LIST = 2`
- `Color` channels are `double` / `float64` with comments `between 0 and 1`.
- `frame_locked = true` means the entity follows the frame named by `frame_id`; `false` means it stays in the fixed frame.
- Zero `lifetime` means the entity remains visible until replaced or deleted.
- `color` is ignored when `colors` is non-empty for both line and triangle primitives.

## Overall assessment
The document is **partially accurate but not publication-ready as a schema reference**. Core schema names and many field-level details are correct, but there are several factual or unsupported statements in important areas: `SceneEntity` field order, `Pose`/`Vector3` semantics, REP-103/ENU claims, `scale_invariant` wording, and backface-culling behavior. It should be revised before being treated as an authoritative Foxglove schema reference.
