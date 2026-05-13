/**
 * Build lane surface scene entities (TriangleListPrimitive).
 */

import type { RgbaColor } from "../../config/constants";
import {
  DEFAULT_LANE_COLOR,
  GLOBAL_FRAME_ID,
  LANE_COLORS,
} from "../../config/constants";
import { generateEntityId, PREFIX_LANE_SURFACE } from "../../config/entityPrefixes";
import type { LaneSurfaceData } from "../../geometry/laneGeometry";
import { flattenTriangleMesh, tessellateLaneStrip } from "../../geometry/tessellation";
import type { Time } from "@foxglove/schemas";
import type { PartialSceneEntity } from "../../utils/scene";
import { IDENTITY_POSE, makeSceneEntity } from "../../utils/scene";

export function buildLaneSurfaceEntities(
  laneSurfaces: LaneSurfaceData[],
  roadId: string,
  sectionIdx: number,
  timestamp: Time,
): PartialSceneEntity[] {
  const entities: PartialSceneEntity[] = [];

  for (const lane of laneSurfaces) {
    if (lane.innerBoundary.length < 2 || lane.outerBoundary.length < 2) {
      continue;
    }

    const mesh = tessellateLaneStrip(lane.innerBoundary, lane.outerBoundary);
    if (mesh.indices.length === 0) {
      continue;
    }

    const flatPositions = flattenTriangleMesh(mesh);
    const numTriangleVerts = flatPositions.length / 3;

    const points: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < numTriangleVerts; i++) {
      points.push({
        x: flatPositions[i * 3 + 0]!,
        y: flatPositions[i * 3 + 1]!,
        z: flatPositions[i * 3 + 2]!,
      });
    }

    const color = getLaneColor(lane.laneType);
    const entityId = generateEntityId(
      PREFIX_LANE_SURFACE,
      roadId,
      sectionIdx,
      lane.laneId,
    );

    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.triangles = [
      {
        pose: IDENTITY_POSE,
        points,
        color,
        colors: [],
        indices: [],
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "lane_id", value: String(lane.laneId) },
      { key: "lane_type", value: lane.laneType },
    ];

    entities.push(entity);
  }

  return entities;
}

function getLaneColor(laneType: string): RgbaColor {
  return LANE_COLORS[laneType] ?? DEFAULT_LANE_COLOR;
}
