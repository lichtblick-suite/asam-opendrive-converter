/**
 * TypeScript types for the osi3.MapAsamOpenDrive protobuf message
 * as used in OMEGA PRIME MCAP recordings.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [OMEGA]     OMEGA PRIME — Open Ground Truth for Perception Research
 *             https://github.com/ika-rwth-aachen/omega-prime
 * [OSI]       ASAM OSI V3.7.0
 *
 * Proto definition (from OMEGA PRIME):
 *   message MapAsamOpenDrive {
 *     optional string map_reference         = 1;
 *     optional string open_drive_xml_content = 2;
 *   }
 *
 * - map_reference: must match GroundTruth.map_reference per [OSI] to link
 *   dynamic object data to the static road network map.
 * - open_drive_xml_content: complete .xodr XML as UTF-8 string.
 * ============================================================================
 */
export interface MapAsamOpenDrive {
  map_reference?: string;
  open_drive_xml_content?: string;
}
