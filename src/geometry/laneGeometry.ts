/**
 * Compute lane boundary polylines by offsetting from the road reference line.
 */

import type {
  ElevationElement,
  GeometryElement,
  Lane,
  LaneSection,
  LaneWidth,
  Vec3,
} from "../parser/types";

import {
  evaluateReferenceLineAtS,
  offsetPoint,
} from "./referenceLineGeometry";

export interface LaneBoundaryPolyline {
  laneId: number;
  laneType: string;
  side: "inner" | "outer";
  points: Vec3[];
}

export interface LaneSurfaceData {
  laneId: number;
  laneType: string;
  innerBoundary: Vec3[];
  outerBoundary: Vec3[];
}

/**
 * Compute lane boundary polylines for a single lane section.
 * Returns boundary data for each lane (inner + outer edge).
 */
export function computeLaneSectionGeometry(
  laneSection: LaneSection,
  planView: GeometryElement[],
  elevationProfile: ElevationElement[],
  roadLength: number,
  nextSectionS: number | undefined,
  stepSize: number,
): LaneSurfaceData[] {
  const sectionStart = laneSection.s;
  const sectionEnd = nextSectionS ?? roadLength;
  const sectionLength = sectionEnd - sectionStart;

  if (sectionLength <= 0) {
    return [];
  }

  // Sample s-coordinates within this lane section
  const sValues: number[] = [];
  for (let ds = 0; ds <= sectionLength; ds += stepSize) {
    sValues.push(sectionStart + ds);
  }
  if (
    sValues.length > 0 &&
    Math.abs(sValues[sValues.length - 1]! - sectionEnd) > 0.01
  ) {
    sValues.push(sectionEnd);
  }

  // Sort lanes: positive IDs (left) descending, negative IDs (right) ascending
  // Lane 0 is the center lane (reference line)
  const leftLanes = laneSection.lanes
    .filter((l) => l.id > 0)
    .sort((a, b) => a.id - b.id); // 1, 2, 3... (closest to center first)
  const rightLanes = laneSection.lanes
    .filter((l) => l.id < 0)
    .sort((a, b) => b.id - a.id); // -1, -2, -3... (closest to center first)

  const results: LaneSurfaceData[] = [];

  // Compute left lanes (positive t offset)
  computeLaneGroupGeometry(
    leftLanes,
    sValues,
    sectionStart,
    planView,
    elevationProfile,
    1, // positive offset direction
    results,
  );

  // Compute right lanes (negative t offset)
  computeLaneGroupGeometry(
    rightLanes,
    sValues,
    sectionStart,
    planView,
    elevationProfile,
    -1, // negative offset direction
    results,
  );

  return results;
}

function computeLaneGroupGeometry(
  lanes: Lane[],
  sValues: number[],
  sectionStart: number,
  planView: GeometryElement[],
  elevationProfile: ElevationElement[],
  direction: 1 | -1,
  results: LaneSurfaceData[],
): void {
  // Pre-compute reference line poses for all s-values (shared across lanes)
  const poses = sValues.map((s) =>
    evaluateReferenceLineAtS(planView, elevationProfile, s),
  );

  // Accumulate offsets incrementally across lanes (inner→outer)
  // cumulativeOffsets[i] = offset from reference line to the inner edge of the current lane at sValues[i]
  const cumulativeOffsets = new Float64Array(sValues.length); // starts at 0

  for (const lane of lanes) {
    if (lane.width.length === 0) {
      continue;
    }

    const innerBoundary: Vec3[] = [];
    const outerBoundary: Vec3[] = [];

    for (let i = 0; i < sValues.length; i++) {
      const ds = sValues[i]! - sectionStart;
      const pose = poses[i]!;

      const innerOffset = cumulativeOffsets[i]!;
      const laneW = evaluateLaneWidth(lane.width, ds);
      const outerOffset = innerOffset + direction * laneW;

      innerBoundary.push(offsetPoint(pose, innerOffset));
      outerBoundary.push(offsetPoint(pose, outerOffset));

      // Update cumulative offset for next lane
      cumulativeOffsets[i] = outerOffset;
    }

    results.push({
      laneId: lane.id,
      laneType: lane.type,
      innerBoundary,
      outerBoundary,
    });
  }
}

/**
 * Evaluate lane width polynomial at a given ds (offset within lane section).
 */
export function evaluateLaneWidth(
  widthEntries: LaneWidth[],
  ds: number,
): number {
  if (widthEntries.length === 0) {
    return 0;
  }

  // Find the applicable width entry
  let entry = widthEntries[0]!;
  for (const w of widthEntries) {
    if (w.sOffset <= ds + 1e-9) {
      entry = w;
    } else {
      break;
    }
  }

  const localDs = ds - entry.sOffset;
  return (
    entry.a +
    entry.b * localDs +
    entry.c * localDs * localDs +
    entry.d * localDs * localDs * localDs
  );
}
