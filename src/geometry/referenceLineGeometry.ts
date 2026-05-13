/**
 * Evaluate reference line geometry at a given s-coordinate.
 * Supports: line, arc, spiral (clothoid), poly3, paramPoly3.
 */

import type { ElevationElement, GeometryElement, Vec3 } from "../parser/types";

import { evaluateSpiral } from "./fresnel";

export interface PoseAtS {
  x: number;
  y: number;
  z: number;
  hdg: number;
}

/**
 * Evaluate the reference line position and heading at parameter `s`
 * given the planView geometry elements and elevation profile.
 */
export function evaluateReferenceLineAtS(
  planView: GeometryElement[],
  elevationProfile: ElevationElement[],
  s: number,
): PoseAtS {
  // Find the geometry element containing this s
  const geom = findGeometryAtS(planView, s);
  if (!geom) {
    return { x: 0, y: 0, z: 0, hdg: 0 };
  }

  const ds = s - geom.s;
  const local = evaluateGeometryLocal(geom, ds);

  // Transform from local to global
  const cosH = Math.cos(geom.hdg);
  const sinH = Math.sin(geom.hdg);

  const globalX = geom.x + cosH * local.x - sinH * local.y;
  const globalY = geom.y + sinH * local.x + cosH * local.y;
  const globalHdg = geom.hdg + local.hdg;

  // Evaluate elevation
  const z = evaluateElevation(elevationProfile, s);

  return { x: globalX, y: globalY, z, hdg: globalHdg };
}

/**
 * Sample the reference line at regular intervals, returning a polyline.
 */
export function sampleReferenceLine(
  planView: GeometryElement[],
  elevationProfile: ElevationElement[],
  roadLength: number,
  stepSize: number,
): PoseAtS[] {
  const points: PoseAtS[] = [];
  for (let s = 0; s <= roadLength; s += stepSize) {
    points.push(evaluateReferenceLineAtS(planView, elevationProfile, s));
  }
  // Ensure the last point at roadLength is included
  const lastSampled = (points.length - 1) * stepSize;
  if (points.length === 0 || Math.abs(roadLength - lastSampled) > 0.01) {
    points.push(
      evaluateReferenceLineAtS(planView, elevationProfile, roadLength),
    );
  }
  return points;
}

function findGeometryAtS(
  planView: GeometryElement[],
  s: number,
): GeometryElement | undefined {
  let result: GeometryElement | undefined;
  for (const geom of planView) {
    if (geom.s <= s + 1e-9) {
      result = geom;
    } else {
      break;
    }
  }
  return result;
}

/**
 * Evaluate geometry in local coordinate frame (origin at geometry start, x along initial heading).
 */
function evaluateGeometryLocal(
  geom: GeometryElement,
  ds: number,
): { x: number; y: number; hdg: number } {
  switch (geom.type) {
    case "line":
      return evaluateLine(ds);
    case "arc":
      return evaluateArc(ds, geom.curvature ?? 0);
    case "spiral":
      return evaluateSpiral(
        ds,
        geom.curvStart ?? 0,
        geom.curvEnd ?? 0,
        geom.length,
      );
    case "poly3":
      return evaluatePoly3(
        ds,
        geom.a ?? 0,
        geom.b ?? 0,
        geom.c ?? 0,
        geom.d ?? 0,
      );
    case "paramPoly3":
      return evaluateParamPoly3(
        ds,
        geom.length,
        geom.aU ?? 0,
        geom.bU ?? 0,
        geom.cU ?? 0,
        geom.dU ?? 0,
        geom.aV ?? 0,
        geom.bV ?? 0,
        geom.cV ?? 0,
        geom.dV ?? 0,
        geom.pRange ?? "arcLength",
      );
    default:
      return { x: ds, y: 0, hdg: 0 };
  }
}

// ─── Line ────────────────────────────────────────────────────────

function evaluateLine(ds: number): { x: number; y: number; hdg: number } {
  return { x: ds, y: 0, hdg: 0 };
}

// ─── Arc ─────────────────────────────────────────────────────────

function evaluateArc(
  ds: number,
  curvature: number,
): { x: number; y: number; hdg: number } {
  if (Math.abs(curvature) < 1e-10) {
    return { x: ds, y: 0, hdg: 0 };
  }
  const r = 1 / curvature;
  const theta = ds * curvature;
  return {
    x: r * Math.sin(theta),
    y: r * (1 - Math.cos(theta)),
    hdg: theta,
  };
}

// ─── Poly3 ───────────────────────────────────────────────────────

function evaluatePoly3(
  ds: number,
  a: number,
  b: number,
  c: number,
  d: number,
): { x: number; y: number; hdg: number } {
  const v = a + b * ds + c * ds * ds + d * ds * ds * ds;
  const dvds = b + 2 * c * ds + 3 * d * ds * ds;
  return { x: ds, y: v, hdg: Math.atan2(dvds, 1) };
}

// ─── ParamPoly3 ──────────────────────────────────────────────────

function evaluateParamPoly3(
  ds: number,
  length: number,
  aU: number,
  bU: number,
  cU: number,
  dU: number,
  aV: number,
  bV: number,
  cV: number,
  dV: number,
  pRange: "arcLength" | "normalized",
): { x: number; y: number; hdg: number } {
  const p = pRange === "normalized" ? (length > 0 ? ds / length : 0) : ds;

  const u = aU + bU * p + cU * p * p + dU * p * p * p;
  const v = aV + bV * p + cV * p * p + dV * p * p * p;

  const duDp = bU + 2 * cU * p + 3 * dU * p * p;
  const dvDp = bV + 2 * cV * p + 3 * dV * p * p;
  const hdg = Math.atan2(dvDp, duDp);

  return { x: u, y: v, hdg };
}

// ─── Elevation ───────────────────────────────────────────────────

export function evaluateElevation(
  elevationProfile: ElevationElement[],
  s: number,
): number {
  if (elevationProfile.length === 0) {
    return 0;
  }

  let elev: ElevationElement = elevationProfile[0]!;
  for (const e of elevationProfile) {
    if (e.s <= s + 1e-9) {
      elev = e;
    } else {
      break;
    }
  }

  const ds = s - elev.s;
  return elev.a + elev.b * ds + elev.c * ds * ds + elev.d * ds * ds * ds;
}

/**
 * Compute a point offset laterally from a reference line position.
 * Positive t = left (in road coordinates), negative t = right.
 */
export function offsetPoint(pose: PoseAtS, t: number): Vec3 {
  const normalHdg = pose.hdg + Math.PI / 2;
  return {
    x: pose.x + t * Math.cos(normalHdg),
    y: pose.y + t * Math.sin(normalHdg),
    z: pose.z,
  };
}
