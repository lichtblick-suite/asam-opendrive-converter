/**
 * Build lane boundary line entities.
 */

import {
  BOUNDARY_Z_OFFSET,
  GLOBAL_FRAME_ID,
  LANE_BOUNDARY_COLOR,
  LANE_BOUNDARY_WIDTH,
} from "../../config/constants";
import {
  generateBoundaryEntityId,
} from "../../config/entityPrefixes";
import type { LaneSurfaceData } from "../../geometry/laneGeometry";
import type { Time } from "@foxglove/schemas";
import type { PartialSceneEntity } from "../../utils/scene";
import { IDENTITY_POSE, makeSceneEntity } from "../../utils/scene";

/**
 * Build line entities for lane boundaries (outer edges of each lane).
 */
export function buildLaneBoundaryEntities(
  laneSurfaces: LaneSurfaceData[],
  roadId: string,
  sectionIdx: number,
  timestamp: Time,
): PartialSceneEntity[] {
  const entities: PartialSceneEntity[] = [];

  for (const lane of laneSurfaces) {
    // Outer boundary line
    if (lane.outerBoundary.length >= 2) {
      const entityId = generateBoundaryEntityId(
        roadId,
        sectionIdx,
        lane.laneId,
        "outer",
      );

      const points = lane.outerBoundary.map((p) => ({
        x: p.x,
        y: p.y,
        z: p.z + BOUNDARY_Z_OFFSET,
      }));

      const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
      entity.lines = [
        {
          type: 0, // LINE_STRIP
          pose: IDENTITY_POSE,
          thickness: LANE_BOUNDARY_WIDTH,
          scale_invariant: false,
          points,
          color: LANE_BOUNDARY_COLOR,
          colors: [],
          indices: [],
        },
      ];

      entities.push(entity);
    }
  }

  return entities;
}
