/**
 * Entity ID prefix strings for stable, unique scene entity identification.
 */

export const PREFIX_LANE_SURFACE = "odr_lane";
export const PREFIX_LANE_BOUNDARY = "odr_boundary";
export const PREFIX_ROAD_MARKING = "odr_marking";
export const PREFIX_JUNCTION = "odr_junction";
export const PREFIX_ROAD_OBJECT = "odr_object";

export function generateEntityId(
  prefix: string,
  roadId: string,
  sectionIdx: number,
  laneId: number,
): string {
  return `${prefix}_r${roadId}_s${sectionIdx}_l${laneId}`;
}

export function generateBoundaryEntityId(
  roadId: string,
  sectionIdx: number,
  laneId: number,
  side: string,
): string {
  return `${PREFIX_LANE_BOUNDARY}_r${roadId}_s${sectionIdx}_l${laneId}_${side}`;
}
