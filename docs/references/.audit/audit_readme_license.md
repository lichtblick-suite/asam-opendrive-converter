# Audit of `docs/references/README.md`

Audit date: 2026-05-19

## Item-by-item result

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | ASAM OpenDRIVE license text | FAIL | Substantively correct, but the README does **not** reproduce the quoted clause exactly: the source ends `ASAM OpenDRIVE".` while the README renders the period inside the quote. |
| 2 | ASAM OpenDRIVE current version | FAIL | README says `V1.8.1 (released 21 Nov 2024)`. ASAM's publications `latest` page serves **ASAM OpenDRIVE BS 1.9.0 Specification, 2026-05-08**. ASAM's standards detail page still says `Current Version 1.8.1`, so ASAM's own pages are inconsistent. |
| 3 | ASAM OpenDRIVE trademark claim | PASS | The spec page says exactly: `ASAM OpenDRIVE is a registered trade mark of ASAM e.V.` |
| 4 | ASAM address / ownership attribution | FAIL | Official ASAM pages use `ASAM e.V., Altlaufstr. 40, 85635 Höhenkirchen, Germany`. README says `Altlaufstraße 40, 85635 Höhenkirchen-Siegertsbrunn, Germany`. The full organization name on ASAM's site is also `Association for Standardization...`, not `Standardisation...`. |
| 5 | ASAM OSI license | PASS | `open-simulation-interface/LICENSE` is MPL-2.0. |
| 6 | ASAM OSI current version | PASS | Latest stable release/tag is **v3.7.0**. There is a newer **v3.8.0-rc1** prerelease, but not a newer stable release. |
| 7 | OMEGA PRIME license | FAIL | `omega-prime/LICENSE` is **MPL-2.0**, not MIT. |
| 8 | betterosi license | FAIL | `betterosi/LICENSE` is **MPL-2.0**, not MIT. |
| 9 | Foxglove SDK license | PASS | `foxglove-sdk/LICENSE` is MIT. |
| 10 | `foxglove/schemas` → `foxglove/foxglove-sdk` | PASS | `https://github.com/foxglove/schemas` returns `301` redirect to `https://github.com/foxglove/foxglove-sdk`; Foxglove docs now point schema assets into `foxglove-sdk`. |
| 11 | ISO 8855 edition claim | FAIL | ASAM OSI docs explicitly cite **DIN ISO 8855:2013-11**. I did **not** find equally explicit accessible OpenDRIVE source text proving that exact edition. The README overstates this as a shared OpenDRIVE/OSI citation. |
| 12 | All URLs in README | FAIL | All **7 external URLs** in the README resolved successfully with HTTP 200, but one local Markdown link is broken: `./ASAM_OpenDRIVE_V1.8.md` does not exist. |
| 13 | XSD schema claim | PASS | `docs/references/opendrive/xsd/` exists and contains the expected XSD files. |
| 14 | `SYNERGIES project` claim | FAIL | The betterosi README supports that `MapAsamOpenDrive` is an extension to OSI 3.7.0 and that the package is developed as part of the SYNERGIES project, but I found no direct source for the stronger wording `a proposed extension developed under the SYNERGIES project`. |
| 15 | Citation convention table | FAIL | The actual docs use `[BOSI]`, but the README table duplicates `[OMEGA]` and omits `[BOSI]`. It also labels `[ODR]` as `V1.8` while other docs use `V1.8.1`. |

## Errors found

### 1) OpenDRIVE license quote is not exact
- **Incorrect claim:** `"The licensor grants everyone a basic, non-exclusive and unlimited license to use the standard ASAM OpenDRIVE."`
- **Correct information:** The source clause ends `"The licensor grants everyone a basic, non-exclusive and unlimited license to use the standard ASAM OpenDRIVE".`
- **Source URL:** <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/index.html>
- **Suggested correction:** Move the final period **outside** the closing quotation mark if you want to quote the source exactly.

### 2) OpenDRIVE current-version claim is outdated / inconsistent with current ASAM publications
- **Incorrect claim:** `Current version: V1.8.1 (released 21 Nov 2024)`
- **Correct information:** ASAM's publications `latest` page currently serves **ASAM OpenDRIVE BS 1.9.0 Specification, 2026-05-08**. ASAM's standards detail page still says `Current Version 1.8.1 / Release Date 21 Nov 2024`, so official ASAM pages are inconsistent.
- **Source URLs:**
  - <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/latest/specification/index.html>
  - <https://www.asam.net/standards/detail/opendrive/>
- **Suggested correction:** Do not call `V1.8.1` the current version without qualification. Safer wording: `ASAM's standards detail page lists 1.8.1 (21 Nov 2024), but ASAM's publications latest page serves BS 1.9.0 (2026-05-08).`

### 3) ASAM ownership attribution uses the wrong official name spelling and a non-matching postal locality
- **Incorrect claim:** `ASAM e.V. (Association for Standardisation of Automation and Measuring Systems), Altlaufstraße 40, 85635 Höhenkirchen-Siegertsbrunn, Germany`
- **Correct information:** Official ASAM pages use `Association for Standardization of Automation and Measuring Systems` and postal address `ASAM e.V., Altlaufstr. 40, 85635 Höhenkirchen, Germany`.
- **Source URLs:**
  - <https://report.asam.net/contact>
  - <https://report.asam.net/imprint>
- **Suggested correction:** Use the official ASAM wording and postal form from the imprint/contact pages.

### 4) OMEGA PRIME license is wrong
- **Incorrect claim:** `License: MIT License`
- **Correct information:** `omega-prime/LICENSE` is **Mozilla Public License 2.0 (MPL-2.0)**.
- **Source URL:** <https://raw.githubusercontent.com/ika-rwth-aachen/omega-prime/main/LICENSE>
- **Suggested correction:** Change the OMEGA PRIME license entry to `MPL-2.0 (Mozilla Public License 2.0)`.

### 5) betterosi license is wrong
- **Incorrect claim:** `License: MIT License`
- **Correct information:** `betterosi/LICENSE` is **Mozilla Public License 2.0 (MPL-2.0)**.
- **Source URL:** <https://raw.githubusercontent.com/ika-rwth-aachen/betterosi/main/LICENSE>
- **Suggested correction:** Change the betterosi license entry to `MPL-2.0 (Mozilla Public License 2.0)`.

### 6) ISO 8855 edition statement is too broad
- **Incorrect claim:** `ISO 8855:2013-11` is presented as the edition referenced by both ASAM OpenDRIVE and ASAM OSI.
- **Correct information:** ASAM OSI documentation explicitly cites **DIN ISO 8855:2013-11**. I did not verify that exact edition from an accessible OpenDRIVE source page in this audit.
- **Source URLs:**
  - <https://www.asam.net/static_downloads/ASAM_OSI_reference-documentation_v3.5.0/structosi3_1_1SensorView.html>
  - <https://www.asam.net/static_downloads/ASAM_OSI_reference-documentation_v3.5.0/structosi3_1_1MovingObject_1_1VehicleAttributes.html>
- **Suggested correction:** Split the claim: `ASAM OSI explicitly cites DIN ISO 8855:2013-11`; for OpenDRIVE, cite the exact edition only if you can point to a direct OpenDRIVE source.

### 7) One README link is broken
- **Incorrect claim / link target:** `./ASAM_OpenDRIVE_V1.8.md`
- **Correct information:** That file does not exist in `docs/references/`. The local file present is `ASAM_OpenDRIVE_Standard.md`.
- **Source reference:** repository paths `docs/references/README.md` and `docs/references/ASAM_OpenDRIVE_Standard.md`
- **Suggested correction:** Update the Document Index link to the real file path.

### 8) SYNERGIES wording is stronger than the evidence found
- **Incorrect claim:** `It is a proposed extension developed under the SYNERGIES project.`
- **Correct information:** The betterosi README says the proto definitions extend OSI 3.7.0 by adding `MapAsamOpenDrive`, and separately says the package is developed as part of the SYNERGIES project. I did not find a direct source for the exact phrase `proposed extension developed under the SYNERGIES project`.
- **Source URLs:**
  - <https://raw.githubusercontent.com/ika-rwth-aachen/betterosi/main/README.md>
  - <https://raw.githubusercontent.com/ika-rwth-aachen/omega-prime/main/README.md>
- **Suggested correction:** Soften to something directly supported, e.g. `betterosi extends OSI 3.7.0 with a MapAsamOpenDrive message; the betterosi package is developed as part of the SYNERGIES project.`

### 9) Citation convention table is wrong
- **Incorrect claim:** The table defines `[OMEGA]` twice and does not define `[BOSI]`.
- **Correct information:** Other docs actually use `[BOSI]` (for betterosi), and the table should include it instead of the duplicate `[OMEGA]` row.
- **Source reference:**
  - `docs/references/README.md`
  - `docs/references/INTERFACE_MAPPING.md`
- **Suggested correction:** Replace the duplicate `[OMEGA]` row with `[BOSI] | betterosi proto definitions`.

### 10) `[ODR]` version label is inconsistent
- **Incorrect claim:** `[ODR]` is labeled `ASAM OpenDRIVE V1.8` in the citation table.
- **Correct information:** Other docs in this folder cite **V1.8.1**.
- **Source reference:**
  - `docs/references/README.md`
  - `docs/references/INTERFACE_MAPPING.md`
- **Suggested correction:** Change the citation-table description to `ASAM OpenDRIVE V1.8.1`.

## URL accessibility results

### External URLs in README
All of these returned HTTP 200 during the audit:
- <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/index.html>
- <https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/>
- <https://github.com/OpenSimulationInterface/open-simulation-interface>
- <https://github.com/ika-rwth-aachen/omega-prime>
- <https://github.com/ika-rwth-aachen/betterosi>
- <https://github.com/foxglove/foxglove-sdk>
- <https://docs.foxglove.dev/docs/sdk/schemas/>

### Local Markdown links in README
- `./ASAM_OpenDRIVE_V1.8.md` — **broken**
- `./ASAM_OSI_Coordinate_System.md` — OK
- `./Foxglove_SceneUpdate_Schema.md` — OK
- `./INTERFACE_MAPPING.md` — OK

## XSD files present

Verified in `docs/references/opendrive/xsd/`:
- `OpenDRIVE_Core.xsd`
- `OpenDRIVE_Junction.xsd`
- `OpenDRIVE_Lane.xsd`
- `OpenDRIVE_Object.xsd`
- `OpenDRIVE_Railroad.xsd`
- `OpenDRIVE_Road.xsd`
- `OpenDRIVE_Signal.xsd`

## Overall assessment

**No**: the README's license and attribution section is **not fully accurate**.

Major issues:
- wrong licenses for **OMEGA PRIME** and **betterosi**
- stale / disputed `current version` wording for **ASAM OpenDRIVE**
- incorrect ASAM address/name formatting
- one broken local document link
- citation table error (`[BOSI]` missing)

What is accurate:
- ASAM OSI is MPL-2.0
- Foxglove SDK is MIT
- the OpenDRIVE trademark line matches the spec page
- the referenced external URLs are reachable
