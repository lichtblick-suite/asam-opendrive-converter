/**
 * Build road marking line entities.
 */

import {
  GLOBAL_FRAME_ID,
  MARKING_Z_OFFSET,
  ROAD_MARK_COLORS,
  ROAD_MARK_WIDTH,
} from "../../config/constants";
import type { LaneSurfaceData } from "../../geometry/laneGeometry";
import type { RoadMark } from "../../parser/types";
import type { Time } from "@foxglove/schemas";
import type { Color, PartialSceneEntity } from "../../utils/scene";
import { IDENTITY_POSE, makeSceneEntity } from "../../utils/scene";

/**
 * Build road marking entities for lanes that have road mark definitions.
 */
export function buildRoadMarkingEntities(
  laneSurfaces: LaneSurfaceData[],
  roadMarks: Map<number, RoadMark[]>,
  roadId: string,
  sectionIdx: number,
  timestamp: Time,
): PartialSceneEntity[] {
  const entities: PartialSceneEntity[] = [];

  for (const lane of laneSurfaces) {
    const marks = roadMarks.get(lane.laneId);
    if (!marks || marks.length === 0) {
      continue;
    }

    for (const mark of marks) {
      if (mark.type === "none") {
        continue;
      }

      const entityId = `odr_marking_r${roadId}_s${sectionIdx}_l${lane.laneId}_${mark.sOffset}`;
      const color = getRoadMarkColor(mark.color);
      const width = mark.width > 0 ? mark.width : ROAD_MARK_WIDTH;

      const points = lane.outerBoundary.map((p) => ({
        x: p.x,
        y: p.y,
        z: p.z + MARKING_Z_OFFSET,
      }));

      if (points.length < 2) {
        continue;
      }

      const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
      entity.lines = [
        {
          type: 0, // LINE_STRIP
          pose: IDENTITY_POSE,
          thickness: width,
          scale_invariant: false,
          points,
          color,
          colors: [],
          indices: [],
        },
      ];

      entities.push(entity);
    }
  }

  return entities;
}

function getRoadMarkColor(colorName: string): Color {
  return (
    ROAD_MARK_COLORS[colorName] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 }
  );
}
