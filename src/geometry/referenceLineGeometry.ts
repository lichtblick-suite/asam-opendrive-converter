/**
 * Evaluate reference line geometry at a given s-coordinate.
 * Supports: line, arc, spiral (clothoid), poly3, paramPoly3.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [ODR]       ASAM OpenDRIVE V1.8.1
 *             https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/
 * [ODR §8.3]  Road reference line coordinate system (s/t/h)
 * [ODR §9.2]  Road reference line — planView geometry elements
 * [ODR §9.3]  Straight line geometry primitive
 * [ODR §9.4]  Spiral (Euler spiral / clothoid) geometry primitive
 * [ODR §9.5]  Arc geometry primitive
 * [ODR §9.6]  Parametric cubic curve (paramPoly3) geometry primitive
 * [ODR §9.7]  Cubic polynomial (poly3) geometry primitive (deprecated)
 * [ODR §10.5] Road elevation methods
 * [ISO8855]   ISO 8855:2013-11 — right-handed inertial frame (x=East, y=North, z=Up)
 *
 * COORDINATE SYSTEM
 * ============================================================================
 * All geometry types are evaluated in a LOCAL coordinate frame (origin at the
 * geometry start point, x-axis along the initial heading direction).
 * The local result is then transformed to the INERTIAL coordinate frame
 * [ODR §8.2] using a 2D rotation by the geometry's start heading [ODR §9.2]:
 *
 *   x_global = x₀ + cos(hdg₀)·x_local − sin(hdg₀)·y_local
 *   y_global = y₀ + sin(hdg₀)·x_local + cos(hdg₀)·y_local
 *   hdg_global = hdg₀ + hdg_local
 *
 * This inertial frame is identical to the OSI global frame and the Foxglove
 * world frame — no further coordinate transformation is required.
 * See docs/references/INTERFACE_MAPPING.md §6 "Coordinate Transformation Proof".
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
 * [ODR §9.2] Evaluate the reference line position and heading at parameter `s`
 * given the planView geometry elements and elevation profile.
 *
 * Each geometry element defines a local curve starting at (s₀, x₀, y₀, hdg₀).
 * The curve is evaluated at ds = s − s₀ in the local frame, then transformed
 * to inertial coordinates via the rotation matrix R(hdg₀).
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
 * [ODR §9.2] Sample the reference line at regular intervals, returning a polyline.
 * Ensures the endpoint at s=roadLength is always included to avoid gaps.
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
 * [ODR §9.2] Evaluate geometry in local coordinate frame.
 * Origin is at geometry start, x-axis along initial heading direction.
 * Each geometry type returns (x_local, y_local, hdg_local).
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

// ─── Line [ODR §9.3] ─────────────────────────────────────────────
// [ODR §9.3] A straight line in the local u/v coordinate system.
// x_local = ds, y_local = 0, hdg_local = 0.
// The simplest geometry type — zero lateral deviation, zero heading change.

function evaluateLine(ds: number): { x: number; y: number; hdg: number } {
  return { x: ds, y: 0, hdg: 0 };
}

// ─── Arc [ODR §9.5] ──────────────────────────────────────────────
// [ODR §9.5] A circular arc with constant curvature κ = 1/r.
// Positive curvature = curve turning left; negative = right.
//   θ(ds) = ds · κ
//   x_local = r · sin(θ)
//   y_local = r · (1 − cos(θ))
//   hdg_local = θ

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

// ─── Poly3 [ODR §9.7] (deprecated since OpenDRIVE 1.6) ──────────
// [ODR §9.7] Cubic polynomial lateral offset: v(ds) = a + b·ds + c·ds² + d·ds³.
// x_local = ds (arc-length approximation), y_local = v(ds).
// Heading derived from tangent: hdg = atan2(dv/ds, 1).
// DEPRECATION NOTE: [ODR §9.7] states this type is deprecated in favor of
// paramPoly3 [ODR §9.6]. Retained for backward compatibility with ≤1.5 files.

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

// ─── ParamPoly3 [ODR §9.6] ────────────────────────────────────────
// [ODR §9.6] Parametric cubic curve with two independent polynomials:
//   u(p) = aU + bU·p + cU·p² + dU·p³   (longitudinal)
//   v(p) = aV + bV·p + cV·p² + dV·p³   (lateral)
// Parameter p depends on pRange attribute [ODR §9.6]:
//   "arcLength"  → p = ds (arc length from geometry start)
//   "normalized" → p = ds / L (normalized to [0, 1])

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

// ─── Elevation [ODR §10.5] ────────────────────────────────────────
// [ODR §10.5] Road elevation is defined by cubic polynomials along the
// reference line. Each record starts at a given s-coordinate:
//   z(s) = a + b·ds + c·ds² + d·ds³, where ds = s − s_elevation
// Multiple records are piecewise: the last record where s_rec ≤ s applies.

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
 * [ODR §8.3] Compute a point offset laterally from a reference line position.
 * In the road reference line coordinate system [ODR §8.3]:
 *   - Positive t = left (in direction of increasing s)
 *   - Negative t = right
 * The normal direction is hdg + π/2, which points to the left of travel.
 *
 * This function maps from (s,t) road coordinates to (x,y,z) inertial
 * coordinates [ODR §8.2], which pass directly to Foxglove Point3 without
 * further transformation (see INTERFACE_MAPPING.md §6).
 */
export function offsetPoint(pose: PoseAtS, t: number): Vec3 {
  const normalHdg = pose.hdg + Math.PI / 2;
  return {
    x: pose.x + t * Math.cos(normalHdg),
    y: pose.y + t * Math.sin(normalHdg),
    z: pose.z,
  };
}
