# Standards Reference Documentation

## Ownership & Origin

The reference documents in this folder describe technical standards
developed and maintained by their respective standards organizations.
**This project does not claim ownership of any of these standards.**

### ASAM OpenDRIVE

- **Owner:** ASAM e.V. (Association for Standardization of Automation
  and Measuring Systems), Altlaufstr. 40, 85635 Höhenkirchen, Germany
- **Standard:** ASAM OpenDRIVE — Open Dynamic Road Information for Vehicle
  Environment
- **Current version:** V1.8.1 (released 21 Nov 2024). Note: ASAM's
  publications page may also serve a newer draft (V1.9.0-RC2). This project
  targets V1.8.1 as the latest stable release.
- **License:** In alteration to the regular ASAM license terms, ASAM allows
  **unrestricted distribution** of this standard. §2 (1) of ASAM's regular
  license terms is substituted by: *"The licensor grants everyone a basic,
  non-exclusive and unlimited license to use the standard ASAM OpenDRIVE."*
  Source: <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/index.html>
- **Specification:** <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/>
- **XSD Schema:** Included in `opendrive/xsd/` (downloaded from the official
  ASAM deliverables).
- **Copyright:** © ASAM e.V. ASAM OpenDRIVE is a registered trade mark of
  ASAM e.V.

### ASAM OSI (Open Simulation Interface)

- **Owner:** ASAM e.V.
- **Standard:** ASAM OSI — Open Simulation Interface
- **Current version:** V3.7.0
- **Repository:** <https://github.com/OpenSimulationInterface/open-simulation-interface>
- **License:** MPL-2.0 (Mozilla Public License 2.0)
- **Proto definitions:** Open source, freely available in the repository.

### OMEGA PRIME

- **Owner:** IKA, RWTH Aachen University
- **Standard:** OMEGA PRIME — Open, Modular, Exchangeable Ground truth
  Annotations for Perception Research In Modular Environments
- **Repository:** <https://github.com/ika-rwth-aachen/omega-prime>
- **License:** MPL-2.0 (Mozilla Public License 2.0)

### Foxglove / Lichtblick Schemas

- **Owner:** Foxglove Technologies Inc.
- **Schemas:** foxglove-sdk (formerly foxglove/schemas)
- **Repository:** <https://github.com/foxglove/foxglove-sdk>
- **npm package:** `@foxglove/schemas`
- **License:** MIT License
- **Documentation:** <https://docs.foxglove.dev/docs/sdk/schemas/>

### ISO 8855

- **Owner:** International Organization for Standardization (ISO)
- **Standard:** ISO 8855:2011 — Road vehicles — Vehicle dynamics and
  road-holding ability — Vocabulary
- **License:** Proprietary. Available for purchase from ISO or national
  standards bodies (e.g., DIN, BSI, ANSI).
- **Note:** This standard defines the vehicle dynamics coordinate system
  conventions referenced by both ASAM OpenDRIVE (§8.2) and ASAM OSI.

---

## Document Index

| File | Content | Primary Standard |
|------|---------|------------------|
| [`ASAM_OpenDRIVE_Standard.md`](./ASAM_OpenDRIVE_Standard.md) | Complete OpenDRIVE technical reference | ASAM OpenDRIVE V1.8.1 |
| [`ASAM_OSI_Coordinate_System.md`](./ASAM_OSI_Coordinate_System.md) | OSI coordinate system & proto definitions | ASAM OSI V3.7.0, OMEGA PRIME |
| [`Foxglove_SceneUpdate_Schema.md`](./Foxglove_SceneUpdate_Schema.md) | Foxglove visualization schema reference | foxglove-sdk |
| [`INTERFACE_MAPPING.md`](./INTERFACE_MAPPING.md) | Deep analysis: OpenDRIVE → Engine → Foxglove | All standards |
| [`FEATURE_MAPPING_TABLE.md`](./FEATURE_MAPPING_TABLE.md) | Full feature mapping: Standard → libOpenDRIVE → TS → Foxglove | All standards + libOpenDRIVE |

---

## Purpose

These reference documents serve as the **authoritative technical basis**
for all geometry computations, coordinate transformations, and data model
mappings implemented in this converter. Every function in the codebase
references the relevant standard section using bracket notation (e.g.,
`[ODR §9.5]`) to trace the implementation back to the specification.

**These documents are NOT a substitute for the official standards.**
They are technical reference summaries for developer use. For the
authoritative text, consult the original standards from their respective
publishers.

---

## Citation Convention

Throughout the codebase and documentation, the following citation keys
are used:

| Key          | Standard                                          |
|--------------|---------------------------------------------------|
| `[ODR]`      | ASAM OpenDRIVE V1.8.1                              |
| `[ODR §X.Y]` | Specific section of the OpenDRIVE specification  |
| `[OSI]`      | ASAM OSI V3.7.0                                   |
| `[OMEGA]`    | OMEGA PRIME specification & proto definitions     |
| `[FG-SCENE]` | Foxglove SceneUpdate / SceneEntity schemas         |
| `[FG-SDK]`   | foxglove-sdk repository                            |
| `[ISO8855]`  | ISO 8855:2011                                      |
| `[A&S]`      | Abramowitz & Stegun, Handbook of Mathematical Functions (external math ref, not part of OpenDRIVE spec) |
| `[REP103]`   | ROS REP-103 coordinate conventions                 |
