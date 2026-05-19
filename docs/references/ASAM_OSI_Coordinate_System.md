# ASAM OSI & OMEGA PRIME Coordinate System Reference

> **Standard:** ASAM OSI (Open Simulation Interface) V3.7.0
> **Publisher:** ASAM e.V.
> **Repository:** <https://github.com/OpenSimulationInterface/open-simulation-interface>
> **OMEGA PRIME:** <https://github.com/ika-rwth-aachen/omega-prime>

This document defines the coordinate system conventions used in the OSI
protobuf layer that wraps the OpenDRIVE map data in OMEGA PRIME recordings.

---

## 1. OSI Global Coordinate System

The OSI global (world) coordinate system is defined in `osi_common.proto`
as a **right-handed 3D Cartesian system**. The proto comments specify
right-handedness but do not explicitly assign axis directions to geographic
cardinal directions.

However, the OMEGA PRIME specification states that the OSI global frame is
**harmonized with OpenDRIVE's inertial frame**, which in its geographic-
reference convention [ODR §8.2] defines:

| Axis | Direction  | Unit |
|------|------------|------|
| x    | East       | m    |
| y    | North      | m    |
| z    | Up         | m    |

In the harmonized convention (as used in OMEGA PRIME recordings), these
axis assignments apply to both the OSI global frame and the OpenDRIVE
inertial frame.

### 1.1 Orientation Convention (Tait-Bryan z-y'-x'')

From `osi_common.proto`, message `Orientation3d`:

> *"The rotations are to be performed YAW FIRST (around the z-axis),
> PITCH SECOND (around the new y-axis) and ROLL THIRD (around the new
> x-axis) to follow the definition according to [1] using Tait-Bryan /
> Euler convention z-y'-x''."*
>
> — Reference [1]: DIN ISO 8855:2013-11

```
vector_global = Rotation(yaw, pitch, roll) · vector_local + position
```

### 1.2 Alignment with OpenDRIVE

The OSI global frame and the OpenDRIVE inertial frame are **explicitly
harmonized and identical**. From the OMEGA PRIME specification:

> *"ASAM OSI and ASAM OpenDRIVE are harmonized in terms of their inertial
> coordinate system specification (handedness, axis directions and rotation
> order). The OpenDRIVE 'inertial coordinate system' is defined in the same
> way as OSI's 'global coordinate system', relying on the ISO 8855 standard."*

**→ No coordinate transformation is required** between OpenDRIVE inertial
coordinates and OSI global coordinates.

---

## 2. Proto Definitions

### 2.1 Core Types (`osi_common.proto`) — Summary

The following are **summarized excerpts**; see the actual proto files for
complete comment blocks and field documentation.

```protobuf
// Summary of osi_common.proto Vector3d
// (actual proto includes detailed comment block about right-handed system)
message Vector3d {
    optional double x = 1;  // Unit: m, m/s, or m/s²
    optional double y = 2;  // Unit: m, m/s, or m/s²
    optional double z = 3;  // Unit: m, m/s, or m/s²
}

// Summary of osi_common.proto Orientation3d
// Rotation order: yaw (z) → pitch (new y) → roll (new x)
// Convention: Tait-Bryan z-y'-x'' per DIN ISO 8855:2013-11
// Preferred ranges: roll [-π,π], pitch [-π/2,π/2], yaw [-π,π]
message Orientation3d {
    optional double roll  = 1;  // Unit: rad
    optional double pitch = 2;  // Unit: rad
    optional double yaw   = 3;  // Unit: rad
}

message Timestamp {
    optional int64  seconds = 1;  // Since simulation start
    optional uint32 nanos   = 2;  // [0, 999,999,999]
}

message Identifier {
    optional uint64 value = 1;
    // MAX(uint64) = 2^64 − 1 is reserved and indicates an invalid ID or error.
}
```

### 2.2 MapAsamOpenDrive (`osi_mapasamopendrive.proto`)

Defined as part of the OMEGA PRIME project for embedding OpenDRIVE maps
in OSI-compatible MCAP recordings:

```protobuf
syntax = "proto2";
package osi3;

message MapAsamOpenDrive {
    // Opaque reference string; must match GroundTruth.map_reference
    optional string map_reference         = 1;
    // Full OpenDRIVE XML (.xodr) file content embedded as a string
    optional string open_drive_xml_content = 2;
}
```

**Usage in OMEGA PRIME MCAP:**
- Stored on topic `/ground_truth_map`
- Schema name: `osi3.MapAsamOpenDrive`
- Typically a single message per recording (static map)
- The `map_reference` field links to `GroundTruth.map_reference`

### 2.3 GroundTruth Geo-Referencing (`osi_groundtruth.proto`)

```protobuf
message GroundTruth {
    // ...
    optional string proj_string         = 14;  // PROJ library string
    optional string map_reference       = 15;  // opaque map reference
    optional ProjFrameOffset proj_frame_offset = 20;

    message ProjFrameOffset {
        optional Vector3d position = 1;  // Translation (x, y, z)
        optional double   yaw     = 2;   // Rotation around z-axis
    }
}
```

**Transformation chain (OSI → geographic CRS):**
```
Step 1: Apply ProjFrameOffset (affine transform)
  x_proj = x_osi · cos(yaw) − y_osi · sin(yaw) + x_offset
  y_proj = x_osi · sin(yaw) + y_osi · cos(yaw) + y_offset
  z_proj = z_osi + z_offset

Step 2: Apply proj_string via PROJ library
  (x_proj, y_proj) → (lon, lat) or projected CRS coordinates
```

**Note:** The OMEGA PRIME specification recommends `yaw = 0` (pure
translation), which is also the convention used by OpenDRIVE `<offset>`.

### 2.4 Superelevation Note

When roads have superelevation (banking), the OpenDRIVE t-coordinate is
tilted with the road surface, but OSI t is always in the horizontal XY plane:

```
t_osi = t_opendrive · cos(α)
```

where α is the superelevation angle. This converter currently does not
implement superelevation and assumes flat roads (α = 0).

---

## 3. OMEGA PRIME MCAP Structure

An OMEGA PRIME recording is an MCAP container with:

| Channel             | Schema                     | Count    | Description           |
|---------------------|----------------------------|----------|-----------------------|
| `ground_truth`      | `osi3.GroundTruth`         | Many     | Dynamic objects per frame |
| `ground_truth_map`  | `osi3.MapAsamOpenDrive`    | 1        | Static map (t=0)      |

The map message contains the full `.xodr` XML content as a protobuf string
field, making it self-contained for parsing.

---

## References

1. ASAM e.V. (2023). *ASAM OSI (Open Simulation Interface) V3.7.0*.
   <https://opensimulationinterface.github.io/osi-antora-generator/asamosi/latest/specification/index.html>

2. ISO 8855:2013-11. *Road vehicles — Vehicle dynamics and road-holding
   ability — Vocabulary*.

3. IKA RWTH Aachen (2024). *OMEGA PRIME — Open, Modular, Exchangeable Ground
   truth Annotations for Perception Research In Modular Environments*.
   <https://ika-rwth-aachen.github.io/omega-prime/>

4. IKA RWTH Aachen (2024). *OMEGA PRIME — Open Ground Truth Format*.
   <https://github.com/ika-rwth-aachen/omega-prime>
