/**
 * Georeferencing utilities for OpenDRIVE maps.
 *
 * Parses <geoReference> and <offset> from OpenDRIVE XML [ODR §8.5]. The
 * <offset> is NOT baked into geometry; instead it is published as a
 * FrameTransform placing "proj_frame" as a child of the root "global" frame
 * (mirroring the OSI converter's proj_frame_offset handling).
 *
 * See: submodule/asam-openx-standards/standards/asam-opendrive/08-05-geo-referencing.md
 */

import type { FrameTransform, Time } from "@foxglove/schemas";
import proj4 from "proj4";

import { PROJ_FRAME_ID, ROOT_FRAME_ID } from "../config/projFrame";

/**
 * Parsed georeferencing information from OpenDRIVE <header>.
 */
export interface GeoReference {
  /** PROJ string from <geoReference> element (CRS definition) */
  projString: string | undefined;
  /** Offset from <offset> element [ODR §8.5] */
  offset: GeoOffset | undefined;
}

/**
 * The <offset> element from OpenDRIVE header [ODR §8.5].
 * Defines an affine transform from map-local to CRS world.
 */
export interface GeoOffset {
  x: number;
  y: number;
  z: number;
  hdg: number;
}

/**
 * Parse georeferencing info from OpenDRIVE XML string.
 * Extracts <geoReference> and <offset> from the <header> element.
 */
export function parseGeoReference(xmlContent: string): GeoReference {
  // Use DOMParser-compatible regex extraction for lightweight parsing
  // (the full XML is already parsed by libOpenDRIVE for geometry;
  //  we only need these two header elements)
  let projString: string | undefined;
  let offset: GeoOffset | undefined;

  // Extract <geoReference> content (may be wrapped in CDATA)
  const geoRefMatch =
    /<geoReference[^>]*>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/geoReference>/.exec(
      xmlContent,
    );
  if (geoRefMatch?.[1]) {
    projString = geoRefMatch[1].trim();
  }

  // Extract <offset> attributes
  const offsetMatch = /<offset\s([^/>]*)\/?>/.exec(xmlContent);
  if (offsetMatch?.[1]) {
    const attrs = offsetMatch[1];
    const x = parseAttr(attrs, "x");
    const y = parseAttr(attrs, "y");
    const z = parseAttr(attrs, "z");
    const hdg = parseAttr(attrs, "hdg");
    if (x != null && y != null) {
      offset = { x, y, z: z ?? 0, hdg: hdg ?? 0 };
    }
  }

  return { projString, offset };
}

function parseAttr(attrs: string, name: string): number | undefined {
  const match = new RegExp(`${name}\\s*=\\s*"([^"]*)"`).exec(attrs);
  if (match?.[1]) {
    const val = parseFloat(match[1]);
    return isNaN(val) ? undefined : val;
  }
  return undefined;
}

/**
 * Build a FrameTransform placing "proj_frame" (CRS world) as a child of the
 * root "global" frame [ODR §8.5]. Mirrors the OSI converter's handling of
 * GroundTruth.proj_frame_offset.
 *
 * The <offset> defines the affine that maps map-local ODR coordinates to CRS
 * world coordinates:
 *   world = R(hdg) * odr + offset
 *
 * OpenDRIVE map geometry is published UN-BAKED in "proj_frame". To place
 * "proj_frame" under "global", we publish the INVERTED offset — the pose of
 * proj_frame's origin expressed in the global frame:
 *   rotation    = R(-hdg)           (inverse rotation about z)
 *   translation = -R(-hdg) * offset
 *
 * A point p in "proj_frame" then resolves to "global" as:
 *   p_global = rotation * p + translation
 */
export function buildProjFrameTransform(
  offset: GeoOffset,
  timestamp: Time,
): FrameTransform {
  const hdg = offset.hdg;
  const cosH = Math.cos(hdg);
  const sinH = Math.sin(hdg);

  // Inverse rotation quaternion: rotation about z-axis by -hdg
  // (+ 0 normalizes IEEE signed zero so identity compares cleanly)
  const half = -hdg / 2;
  const rotation = {
    x: 0,
    y: 0,
    z: Math.sin(half) + 0,
    w: Math.cos(half),
  };

  // Inverse translation: t_inv = -R(-hdg) * offset
  //   R(-hdg): x' =  cosH * x + sinH * y ; y' = -sinH * x + cosH * y
  const rx = cosH * offset.x + sinH * offset.y;
  const ry = -sinH * offset.x + cosH * offset.y;

  return {
    timestamp,
    parent_frame_id: ROOT_FRAME_ID,
    child_frame_id: PROJ_FRAME_ID,
    translation: { x: -rx, y: -ry, z: -offset.z },
    rotation,
  };
}

/**
 * Normalize a PROJ/CRS string to a canonical form for equivalence comparison.
 * Uses proj4 to parse and re-serialize, handling EPSG codes, PROJ4 strings, etc.
 * Returns undefined if the string cannot be parsed.
 */
export function normalizeCrsString(crsString: string): string | undefined {
  try {
    // Register the string as a custom definition, then retrieve and serialize it
    proj4.defs("__crs_normalize__", crsString);
    const def = proj4.defs("__crs_normalize__");
    return JSON.stringify(def);
  } catch {
    return undefined;
  }
}

/**
 * Check if two CRS strings define the same coordinate reference system.
 */
export function areCrsEquivalent(
  crs1: string | undefined,
  crs2: string | undefined,
): boolean {
  if (!crs1 || !crs2) {
    return false;
  }
  // Quick string comparison first
  if (crs1.trim() === crs2.trim()) {
    return true;
  }
  // Normalize and compare
  const n1 = normalizeCrsString(crs1);
  const n2 = normalizeCrsString(crs2);
  return n1 != null && n2 != null && n1 === n2;
}
