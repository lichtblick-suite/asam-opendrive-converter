/**
 * Shared frame convention between asam-opendrive-converter and asam-osi-converter.
 *
 * ============================================================================
 * CONVENTION: "proj_frame"
 * ============================================================================
 *
 * Both plugins agree on a shared frame called "proj_frame" which represents
 * the geographic CRS world coordinates as defined by the PROJ string.
 *
 * Frame tree (rooted at "global"):
 *
 *   global (root — OSI inertial frame)
 *   ├── ego_vehicle_bb_center
 *   │     └── ego_vehicle_rear_axle
 *   └── proj_frame (CRS world — OpenDRIVE map entities live here)
 *
 * - The OSI converter publishes a FrameTransform with
 *   parent_frame_id="global" and child_frame_id="proj_frame",
 *   using the INVERTED GroundTruth.proj_frame_offset (when available).
 *
 * - The OpenDRIVE converter publishes map geometry (un-baked) in
 *   frame_id="proj_frame" AND emits the same FrameTransform
 *   (parent="global", child="proj_frame") from the INVERTED <offset>
 *   element per [ODR §8.5]. The <offset> is NOT baked into vertices.
 *
 * This allows Lichtblick to chain the transforms and align both datasets
 * without either plugin needing to read the other's topic.
 *
 * ============================================================================
 * STANDARDS REFERENCES
 * ============================================================================
 * [ODR §8.5]  ASAM OpenDRIVE Georeferencing
 *             submodule/asam-openx-standards/standards/asam-opendrive/08-05-geo-referencing.md
 *
 *             <geoReference> defines the CRS (PROJ string).
 *             <offset x= y= z= hdg=> defines the affine transform:
 *               xWorld = xODR * cos(hdg) - yODR * sin(hdg) + xOffset
 *               yWorld = xODR * sin(hdg) + yODR * cos(hdg) + yOffset
 *               zWorld = zODR + zOffset
 *
 * [OSI §GT]   ASAM OSI GroundTruth.proj_frame_offset + proj_string
 *             open-simulation-interface/osi_groundtruth.proto (fields 14, 20)
 *
 *             proj_string defines the CRS (PROJ string).
 *             proj_frame_offset defines the affine transform:
 *               xWorld = xOSI * cos(yaw) - yOSI * sin(yaw) + xOffset
 *               yWorld = xOSI * sin(yaw) + yOSI * cos(yaw) + yOffset
 *               zWorld = zOSI + zOffset
 *
 * Both formulas are structurally identical.
 * ============================================================================
 */

/**
 * The shared frame name for the geographic CRS world.
 * Used by both the OpenDRIVE converter (publishes geometry here) and
 * the OSI converter (publishes FrameTransform: parent=global, child=proj_frame).
 */
export const PROJ_FRAME_ID = "proj_frame";

/**
 * The shared root frame name (OSI simulation inertial frame).
 *
 * "proj_frame" is published as a CHILD of this frame. The OpenDRIVE converter
 * emits a FrameTransform(parent=ROOT_FRAME_ID, child=PROJ_FRAME_ID) built from
 * the INVERTED <offset> [ODR §8.5], mirroring the OSI converter which emits the
 * same transform from the inverted GroundTruth.proj_frame_offset. Keeping
 * "global" as the tree root lets Lichtblick resolve OpenDRIVE map geometry
 * (in "proj_frame") alongside OSI objects (in "global").
 */
export const ROOT_FRAME_ID = "global";
