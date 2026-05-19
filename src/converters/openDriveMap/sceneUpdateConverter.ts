/**
 * Main converter: osi3.MapAsamOpenDrive → foxglove.SceneUpdate
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [OMEGA]     OMEGA PRIME — defines osi3.MapAsamOpenDrive proto
 *             https://github.com/ika-rwth-aachen/omega-prime
 * [ODR]       ASAM OpenDRIVE V1.8.1
 * [FG-SCENE]  Foxglove SceneUpdate / SceneEntity Schema
 *
 * PIPELINE:
 * 1. Extract XML string from osi3.MapAsamOpenDrive [OMEGA]
 * 2. Parse XML → OpenDriveMap data structure [ODR]
 * 3. Compute lane geometry per road/section [ODR §9, §10, §11]
 * 4. Build SceneEntity primitives [FG-SCENE]
 * 5. Return SceneUpdate with all entities
 *
 * CACHING: The map is static per [OMEGA] convention (single message on
 * /ground_truth_map topic). Results are cached by map_reference +
 * panel settings hash and returned on subsequent converter calls.
 * ============================================================================
 */

import type { Time } from "@foxglove/schemas";

import { DEFAULT_STEP_SIZE } from "../../config/constants";
import { computeLaneSectionGeometry } from "../../geometry/laneGeometry";
import { buildLaneBoundaryEntities } from "../../features/laneBoundaries/buildLaneBoundaryEntity";
import { buildLaneSurfaceEntities } from "../../features/lanes/buildLaneEntity";
import { buildRoadMarkingEntities } from "../../features/roadMarkings/buildRoadMarkingEntity";
import { parseOpenDriveXml } from "../../parser/parseOpenDriveXml";
import type { OpenDriveMap, RoadMark } from "../../parser/types";
import type { MapAsamOpenDrive } from "../../utils/proto";
import type { PartialSceneEntity } from "../../utils/scene";

import type {
  OpenDriveConverterSettings,
} from "./context";
import {
  createOpenDriveConverterContext,
  DEFAULT_SETTINGS,
} from "./context";

/**
 * Register the converter — creates a persistent context (cache)
 * and returns the converter closure.
 */
export function registerOpenDriveMapConverter(): (
  msg: MapAsamOpenDrive,
  event: { receiveTime: Time; topicConfig?: unknown },
) => { deletions: []; entities: PartialSceneEntity[] } {
  const ctx = createOpenDriveConverterContext();

  return (msg, event) => {
    const config =
      (event.topicConfig as OpenDriveConverterSettings | undefined) ??
      DEFAULT_SETTINGS;
    const settingsHash = JSON.stringify(config);

    // Return cached result if map and settings haven't changed
    if (
      ctx.cachedEntities &&
      ctx.previousMapReference === (msg.map_reference ?? "") &&
      ctx.previousSettingsHash === settingsHash
    ) {
      return { deletions: [], entities: ctx.cachedEntities };
    }

    const xmlContent = msg.open_drive_xml_content;
    if (!xmlContent) {
      return { deletions: [], entities: [] };
    }

    try {
      const odrMap = parseOpenDriveXml(xmlContent);
      const timestamp: Time = event.receiveTime ?? { sec: 0, nsec: 0 };
      const entities = generateMapEntities(odrMap, config, timestamp);

      // Cache the result
      ctx.cachedEntities = entities;
      ctx.previousMapReference = msg.map_reference ?? "";
      ctx.previousSettingsHash = settingsHash;

      return { deletions: [], entities };
    } catch (error) {
      console.error("[OpenDRIVE Converter] Failed to parse map:", error);
      return { deletions: [], entities: [] };
    }
  };
}

/**
 * Generate all scene entities from a parsed OpenDRIVE map.
 */
function generateMapEntities(
  odrMap: OpenDriveMap,
  config: OpenDriveConverterSettings,
  timestamp: Time,
): PartialSceneEntity[] {
  const entities: PartialSceneEntity[] = [];
  const stepSize = config.stepSize > 0 ? config.stepSize : DEFAULT_STEP_SIZE;

  // Build set of junction road IDs for distinct coloring
  const junctionRoadIds = new Set<string>();
  for (const junction of odrMap.junctions) {
    for (const conn of junction.connections) {
      junctionRoadIds.add(conn.connectingRoad);
    }
  }

  for (const road of odrMap.roads) {
    for (let sIdx = 0; sIdx < road.lanes.length; sIdx++) {
      const section = road.lanes[sIdx]!;
      const nextSection = road.lanes[sIdx + 1];
      const nextSectionS = nextSection?.s;

      // Compute lane geometry for this section
      const laneSurfaces = computeLaneSectionGeometry(
        section,
        road.planView,
        road.elevationProfile,
        road.length,
        nextSectionS,
        stepSize,
      );

      // Build lane surface entities
      if (config.showLaneSurfaces) {
        entities.push(
          ...buildLaneSurfaceEntities(laneSurfaces, road.id, sIdx, timestamp),
        );
      }

      // Build lane boundary entities
      if (config.showLaneBoundaries) {
        entities.push(
          ...buildLaneBoundaryEntities(laneSurfaces, road.id, sIdx, timestamp),
        );
      }

      // Build road marking entities
      if (config.showRoadMarkings) {
        const roadMarks = new Map<number, RoadMark[]>();
        for (const lane of section.lanes) {
          if (lane.roadMark.length > 0) {
            roadMarks.set(lane.id, lane.roadMark);
          }
        }
        if (roadMarks.size > 0) {
          entities.push(
            ...buildRoadMarkingEntities(
              laneSurfaces,
              roadMarks,
              road.id,
              sIdx,
              timestamp,
            ),
          );
        }
      }
    }
  }

  return entities;
}
