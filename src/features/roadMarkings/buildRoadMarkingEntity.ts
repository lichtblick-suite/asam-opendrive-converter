/**
 * Build road marking line entities.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [ODR §11.8]   Road markings — per-lane <roadMark> elements with sOffset,
 *               type (e_roadMarkType), weight, color (e_roadMarkColor), width
 * [FG-SCENE]    LinePrimitive — LINE_STRIP (type=0) for continuous polylines
 *
 * IMPLEMENTATION LIMITATIONS:
 * - All marking types (solid, broken, solid solid, etc.) are rendered as a
 *   single continuous LINE_STRIP — dashed/broken patterns are NOT implemented.
 * - mark.sOffset affects only the entity ID, not the rendered start position.
 * - weight, laneChange, <type>/<line>, <explicit>, and <sway> are not parsed.
 * - Center-lane (lane 0) road marks are not rendered — only left/right lanes
 *   are processed (see laneGeometry.ts).
 *
 * Z-OFFSET: Markings are at z + 0.02m (above both surface and boundaries).
 *
 * COLOR MAPPING: Partial V1.8.1 e_roadMarkColor support — standard, white,
 * yellow, blue, green, red are mapped. orange, violet, black are NOT mapped.
 * ============================================================================
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
