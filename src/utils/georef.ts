/**
 * Georeferencing utilities for OpenDRIVE maps.
 *
 * Parses <geoReference> and <offset> from OpenDRIVE XML and applies
 * the affine transformation per [ODR §8.5] to convert map-local
 * coordinates into CRS world coordinates.
 *
 * See: submodule/asam-openx-standards/standards/asam-opendrive/08-05-geo-referencing.md
 */

import proj4 from "proj4";

import type { Point3 } from "../utils/scene";

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
 * Apply the <offset> affine transform to a point [ODR §8.5]:
 *   xWorld = xODR * cos(hdg) - yODR * sin(hdg) + xOffset
 *   yWorld = xODR * sin(hdg) + yODR * cos(hdg) + yOffset
 *   zWorld = zODR + zOffset
 */
export function applyGeoOffset(point: Point3, offset: GeoOffset): Point3 {
  const cosH = Math.cos(offset.hdg);
  const sinH = Math.sin(offset.hdg);
  return {
    x: point.x * cosH - point.y * sinH + offset.x,
    y: point.x * sinH + point.y * cosH + offset.y,
    z: point.z + offset.z,
  };
}

/**
 * Apply the offset transform to all points in an array (in-place mutation for performance).
 */
export function applyGeoOffsetToPoints(
  points: Point3[],
  offset: GeoOffset,
): void {
  const cosH = Math.cos(offset.hdg);
  const sinH = Math.sin(offset.hdg);
  for (const p of points) {
    const x = p.x * cosH - p.y * sinH + offset.x;
    const y = p.x * sinH + p.y * cosH + offset.y;
    p.x = x;
    p.y = y;
    p.z = p.z + offset.z;
  }
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
