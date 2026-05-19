# Audit of `ASAM_OSI_Coordinate_System.md`

Audited file: `/home/q413005/workspace/asam-opendrive-converter/docs/references/ASAM_OSI_Coordinate_System.md`

## Sources checked
- OSI common proto: https://raw.githubusercontent.com/OpenSimulationInterface/open-simulation-interface/master/osi_common.proto
- OSI ground truth proto: https://raw.githubusercontent.com/OpenSimulationInterface/open-simulation-interface/master/osi_groundtruth.proto
- betterosi `MapAsamOpenDrive`: https://raw.githubusercontent.com/ika-rwth-aachen/betterosi/main/osi-proto/osi_mapasamopendrive.proto
- OMEGA-PRIME spec: https://raw.githubusercontent.com/ika-rwth-aachen/omega-prime/main/docs/omega_prime_specification.md
- OMEGA-PRIME site: https://ika-rwth-aachen.github.io/omega-prime/omega_prime_specification/
- OSI docs: https://opensimulationinterface.github.io/osi-antora-generator/asamosi/latest/specification/index.html
- OSI trace-file docs: https://opensimulationinterface.github.io/osi-antora-generator/asamosi/current/interface/architecture/trace_file_formats.html
- OpenDRIVE inertial coordinate system: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/latest/specification/08_coordinate_systems/08_02_inertial_coordinate_system.html
- OpenDRIVE georeferencing: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/latest/specification/08_coordinate_systems/08_05_geo_referencing.html

## PASS/FAIL summary
| # | Item | Verdict | Notes |
|---|------|---------|-------|
| 1 | OSI coordinate system x/y/z | **FAIL** | OSI proto only says right-handed; it does **not** itself state east/north/up. |
| 2 | `Orientation3d` rotation order | **PASS** | Yaw → pitch → roll, z-y'-x''. |
| 3 | `Vector3d` proto excerpt exactness | **FAIL** | Field numbers/types are right, but comments are not exact proto text. |
| 4 | `Orientation3d` proto excerpt exactness | **FAIL** | Field numbers/types are right, but comments are not exact proto text. |
| 5 | `Timestamp` field names/numbers | **PASS** | `seconds = 1`, `nanos = 2`. |
| 6 | `Identifier` MAX-value note | **FAIL** | Source says reserved and indicates invalid ID or error; not “invalid/unset”. |
| 7 | `MapAsamOpenDrive` proto | **PASS** | `proto2`, package `osi3`, fields match. |
| 8 | `GroundTruth.ProjFrameOffset` | **PASS** | `position: Vector3d = 1`, `yaw: double = 2`. |
| 9 | `GroundTruth.proj_string` field number | **PASS** | `proj_string = 14`. |
| 10 | OMEGA-PRIME topic name `/ground_truth_map` vs no slash | **FAIL** | Source supports `/ground_truth_map`; no source found for bare `ground_truth_map`. |
| 11 | OMEGA-PRIME MCAP structure | **FAIL** | Channel names should be slash-prefixed for Option A, and Option B allows no map channel in MCAP. |
| 12 | “Harmonized/identical” claim source | **PASS** | Exact supporting source exists in OMEGA-PRIME spec. |
| 13 | Superelevation formula | **FAIL** | No OSI / OMEGA-PRIME / betterosi source found. |
| 14 | ISO 8855 citation edition | **PASS** | Proto cites `DIN ISO 8855:2013-11`. |
| 15 | OSI version `V3.7.0` | **PASS** | Latest stable release is `v3.7.0`; `v3.8.0-rc1` exists as prerelease. |

## Detailed findings

### 1) OSI coordinate system — FAIL
**Incorrect text**
> “The OSI global (world) coordinate system is defined in `osi_common.proto` as a right-handed 3D Cartesian system compliant with ISO 8855:2013-11: x=East, y=North, z=Up.”

**Correct text**
OSI `osi_common.proto` defines the coordinate system only as **right-handed**. It does **not** explicitly assign global OSI axes to east/north/up. The east/north/up convention appears on the ASAM OpenDRIVE inertial-coordinate page under **geographic reference**; OMEGA-PRIME says OpenDRIVE inertial and OSI global coordinate systems are harmonized.

**Source URL/file**
- `osi_common.proto`: “The coordinate system is defined as right-handed.”
- OMEGA-PRIME spec: “ASAM OSI and ASAM OpenDRIVE are harmonized…” / “defined in the same way…”
- OpenDRIVE inertial coordinate system page: geographic convention `x ⇒ east`, `y ⇒ north`, `z ⇒ up`

**Suggested correction**
Replace the table claim with wording such as:
> “OSI proto comments define a right-handed global coordinate system. OMEGA-PRIME states this is harmonized with OpenDRIVE’s inertial system; in OpenDRIVE’s geographic-reference convention, x=east, y=north, z=up.”

### 2) `Orientation3d` rotation order — PASS
Matches `osi_common.proto`: yaw first around z, pitch second around new y, roll third around new x, Tait-Bryan/Euler `z-y'-x''`.

### 3) `Vector3d` proto excerpt — FAIL
**Incorrect text**
```protobuf
// Right-handed 3D Cartesian coordinates
message Vector3d {
    optional double x = 1;  // m, m/s, or m/s²
    optional double y = 2;
    optional double z = 3;
}
```

**Correct text**
The actual proto comment block is longer and the field comments for `y` and `z` also include units. The exact source begins:
```protobuf
// \brief A cartesian 3D vector for positions, velocities or accelerations or
// its uncertainties.
//
// The coordinate system is defined as right-handed.
//
// Units are m for positions, m/s for velocities, and m/s^2 for
// accelerations.
message Vector3d
```
and fields are:
```protobuf
optional double x = 1;
optional double y = 2;
optional double z = 3;
```
with unit comments on all three fields.

**Source URL/file**
- `osi_common.proto` (`Vector3d`)

**Suggested correction**
Either quote the proto verbatim or label the block as a **summary/paraphrase**, not an exact definition.

### 4) `Orientation3d` proto excerpt — FAIL
**Incorrect text**
```protobuf
// Euler angles (Tait-Bryan z-y'-x'', ISO 8855)
message Orientation3d {
    optional double roll  = 1;  // rad
    optional double pitch = 2;  // rad
    optional double yaw   = 3;  // rad
}
```

**Correct text**
Field numbers/types are correct, but the real comment block also includes:
- right-hand-rule wording,
- the exact yaw/pitch/roll order text,
- preferred angle ranges,
- the rotation formula,
- the note that the definition changed in OSI 3.0.0,
- the full DIN ISO 8855 citation.

**Source URL/file**
- `osi_common.proto` (`Orientation3d`)

**Suggested correction**
Quote the real proto block or explicitly say this is a shortened summary.

### 5) `Timestamp` proto — PASS
`osi_common.proto` uses:
```protobuf
optional int64 seconds = 1;
optional uint32 nanos = 2;
```
The document is correct on field names and field numbers.

### 6) `Identifier` MAX-value note — FAIL
**Incorrect text**
```protobuf
optional uint64 value = 1;  // MAX(uint64) = invalid/unset
```

**Correct text**
Source text:
> “The value MAX(uint64) = 2^(64) -1 = 0b111...111 is reserved and indicates an invalid ID or error.”

**Source URL/file**
- `osi_common.proto` (`Identifier`)

**Suggested correction**
Change the note to:
> `MAX(uint64)` is reserved and indicates an invalid ID or error.

### 7) `MapAsamOpenDrive` proto — PASS
Verified against betterosi:
```protobuf
syntax = "proto2";
package osi3;
message MapAsamOpenDrive {
    optional string map_reference = 1;
    optional string open_drive_xml_content = 2;
}
```
(Actual file also contains `option optimize_for = SPEED;`.)

### 8) `GroundTruth.ProjFrameOffset` — PASS
Verified against `osi_groundtruth.proto`:
- `optional ProjFrameOffset proj_frame_offset = 20;`
- nested message `ProjFrameOffset`
- `optional Vector3d position = 1;`
- `optional double yaw = 2;`

### 9) `GroundTruth.proj_string` field number — PASS
Verified: `optional string proj_string = 14;`

### 10) OMEGA-PRIME topic name `/ground_truth_map` — FAIL
**Incorrect text**
> “Stored on topic `/ground_truth_map` (or `ground_truth_map`)”

**Correct text**
The OMEGA-PRIME spec explicitly says:
> “The OpenDRIVE map should be stored in the MCAP topic `/ground_truth_map` …”
No supporting source was found for the bare topic name `ground_truth_map`.

**Source URL/file**
- `omega_prime_specification.md` (Option A)

**Suggested correction**
Remove the parenthetical alternative and use only `/ground_truth_map`.

### 11) OMEGA-PRIME MCAP structure — FAIL
**Incorrect text**
> The document presents OMEGA-PRIME as an MCAP container with channels `ground_truth` and `ground_truth_map`.

**Correct text**
- For the self-contained **Option A**, source material shows slash-prefixed topics: `/ground_truth` (figure) and `/ground_truth_map`.
- The OMEGA-PRIME spec also defines **Option B**, where the map is an external `.xodr` file, so a map channel is **not mandatory** for every OMEGA-PRIME recording.
- Schema names in the figure are `osi3.GroundTruth` and `osi3.MapAsamOpenDrive`.

**Source URL/file**
- `omega_prime_specification.md` lines defining Option A and Option B
- `docs/omega_prime/omega_specification.svg` in omega-prime repo (shows `/ground_truth`, `/ground_truth_map`, `osi3.GroundTruth`, `osi3.MapAsamOpenDrive`)

**Suggested correction**
Rewrite Section 3 as:
- **Option A (self-contained):** `/ground_truth` → `osi3.GroundTruth`, `/ground_truth_map` → `osi3.MapAsamOpenDrive`
- **Option B:** `/ground_truth` in MCAP, map stored separately as an OpenDRIVE `.xodr` file

### 12) “Harmonized” claim — PASS
The exact supporting source exists in OMEGA-PRIME:
> “ASAM OSI and ASAM OpenDRIVE are harmonized…”
> “The OpenDRIVE 'inertial coordinate system' is defined in the same way as OSI’s 'global coordinate system'…”

### 13) Superelevation formula — FAIL
**Incorrect text**
```text
t_osi = t_opendrive · cos(α)
```

**Correct text**
No such formula was found in:
- `osi_common.proto`
- `osi_groundtruth.proto`
- betterosi `osi_mapasamopendrive.proto`
- OMEGA-PRIME specification
- the checked OSI/OpenDRIVE documentation pages

**Source URL/file**
- All sources listed above; no match found

**Suggested correction**
Remove the formula unless you can cite a normative source. If it is an implementation assumption, label it explicitly as a converter-specific note rather than an OSI/OMEGA-PRIME rule.

### 14) ISO 8855 reference — PASS
`osi_common.proto` cites:
> `DIN ISO 8855:2013-11`
The document’s orientation quote is aligned with that edition.

### 15) OSI version `V3.7.0` — PASS
- Latest stable GitHub release: `v3.7.0`
- A prerelease tag `v3.8.0-rc1` exists
- For the audited definitions here, current `master` and `v3.7.0` match on the relevant fields/comments

## Additional findings outside the 15 requested checks

### A) `yaw = 0` wording is too strong
**Incorrect text**
> “The OMEGA PRIME specification recommends `yaw = 0` (pure translation), which is also the convention used by OpenDRIVE `<offset>`.”

**Correct text**
- OMEGA-PRIME says: “It is recommended by both standards to set the orientation offset to 0.”
- OSI says: “If no yaw is provided (recommended)…”
- OpenDRIVE says: “If no heading is supplied (recommended)…” and also that rotation around z-axis should be avoided.

**Suggested correction**
Rephrase to:
> “OMEGA-PRIME recommends zero orientation offset; OSI/OpenDRIVE describe the recommended case as omitting yaw/heading or using no z-axis rotation.”

### B) `log_time = 0` for the map message is unsupported
**Incorrect text**
> “Typically a single message at `log_time = 0` (static map)”

**Correct text**
No checked OMEGA-PRIME or OSI source states `log_time = 0` for the map message.

**Suggested correction**
Remove the `log_time = 0` claim unless you can cite an implementation-specific source.

## Overall assessment
The document is **partially accurate but not publication-ready as a factual reference**. Core proto field numbers are mostly correct, and the harmonization claim is well sourced. However, several statements over-claim normative support, especially the direct OSI axis-direction claim, the MCAP channel naming/structure, the `Identifier` MAX-value note, and the unsourced superelevation formula. Recommended status: **revise before relying on this document as a standards reference**.
