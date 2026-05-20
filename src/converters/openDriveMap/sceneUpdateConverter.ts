/**
 * Main converter: osi3.MapAsamOpenDrive → foxglove.SceneUpdate
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [OMEGA]      OMEGA PRIME — defines osi3.MapAsamOpenDrive proto
 *              https://github.com/ika-rwth-aachen/omega-prime
 * [ODR]        ASAM OpenDRIVE V1.8.1
 *              https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/
 * [ODR §8.2]   Inertial coordinate system — right-handed, x=East, y=North, z=Up
 * [ODR §9]     Reference line geometry — line, spiral, arc, poly3, paramPoly3
 * [ODR §10.5]  Road elevation profile — cubic polynomial z(s)
 * [ODR §10.6]  Road superelevation — lateral tilt angle
 * [ODR §10.7]  Road crossfall — two-sided lateral slope
 * [ODR §11.1]  Lane numbering — center=0, left=+, right=−
 * [ODR §11.3]  Lane sections — piecewise along s-axis
 * [ODR §11.4]  Lane offset — center lane lateral shift (cubic polynomial)
 * [ODR §11.5]  Lane linkage — predecessor/successor across sections
 * [ODR §11.6]  Lane width/border — cubic polynomial profiles
 * [ODR §11.7]  Lane type — e_laneType enumeration (driving, shoulder, etc.)
 * [ODR §11.8]  Road markings — type, color, weight, width
 * [ODR §12]    Junctions — connecting roads linking incoming lanes
 * [ODR §13]    Road objects — physical objects on/near the road
 * [ODR §14]    Road signals — traffic signs and signals
 *
 * [libODR]     libOpenDRIVE v0.6.0 — C++ OpenDRIVE parser & mesh generator
 *              https://github.com/lichtblick-suite/libOpenDRIVE
 *              Handles ALL geometry: adaptive tessellation (eps=chord error),
 *              laneOffset, superelevation, crossfall, lane height, spirals.
 *
 * [FG-SCENE]   Foxglove SceneUpdate / SceneEntity Schema
 *              https://docs.foxglove.dev/docs/visualization/message-schemas/scene-update
 * [FG-TRI]     Foxglove TriangleListPrimitive — indexed triangle mesh
 *              points[]: vertex positions; indices[]: triangle vertex indices (groups of 3)
 *              color: uniform RGBA; colors[]: per-vertex (overrides color if non-empty)
 * [FG-LINE]    Foxglove LinePrimitive — LINE_STRIP(0), LINE_LOOP(1), LINE_LIST(2)
 *              With LINE_LIST + indices: pairs of indices into points[] form line segments
 * [FG-ENTITY]  Foxglove SceneEntity — id (upsert key), frame_id, lifetime, frame_locked
 *              lifetime={0,0} → persist indefinitely; frame_locked=true → follows frame
 *
 * ============================================================================
 * PIPELINE
 * ============================================================================
 * 1. Extract XML string from osi3.MapAsamOpenDrive.open_drive_xml_content [OMEGA]
 * 2. Load libOpenDRIVE WASM module (lazy, singleton) [libODR]
 * 3. createFromXml() → OpenDriveMap instance [libODR Embind.cpp]
 * 4. get_road_network_mesh(eps) → RoadNetworkMesh [libODR]
 *    - LanesMesh: triangle mesh per lane with adaptive tessellation
 *    - RoadmarksMesh: triangle mesh per roadmark segment
 *    - RoadObjectsMesh / RoadSignalsMesh: optional geometry
 * 5. getLaneTypeMap() → per-lane-chunk type for coloring [ODR §11.7]
 * 6. getJunctionRoadIds() → junction identification [ODR §12]
 * 7. Convert to Foxglove SceneUpdate:
 *    - Lane surfaces → TriangleListPrimitive (indexed, per-lane-type color) [FG-TRI]
 *    - Lane boundaries → LinePrimitive LINE_LIST (outline indices) [FG-LINE]
 *    - Road markings → LinePrimitive LINE_LIST (outline indices, per-type color) [FG-LINE]
 *
 * COORDINATE MAPPING [ODR §8.2] → [FG-SCENE]:
 *   OpenDRIVE inertial frame is identical to Foxglove world frame when using
 *   frame_id="global" + IDENTITY_POSE. Both are right-handed with Z-up.
 *   No coordinate transformation is needed.
 *
 * CACHING: The map is static per [OMEGA] convention (single message on the
 * ground_truth_map topic). Results are cached by map_reference + settings hash.
 * ============================================================================
 */

import { SceneEntityDeletionType } from "@foxglove/schemas";
import type { Time } from "@foxglove/schemas";
import type {
  Immutable,
  MessageConverterAlert,
  MessageConverterContext,
  MessageEvent,
  VariableValue,
} from "@lichtblick/suite";

import type { OpenDriveConverterSettings } from "./context";
import { createOpenDriveConverterContext, DEFAULT_SETTINGS } from "./context";
import {
  extractChunkKeys,
  extractVertices,
  partitionIndicesByChunk,
  remapVertex,
  vectorToSet,
} from "./meshUtils";
import {
  BOUNDARY_Z_OFFSET,
  DEFAULT_LANE_COLOR,
  GLOBAL_FRAME_ID,
  JUNCTION_COLOR,
  LANE_BOUNDARY_COLOR,
  LANE_BOUNDARY_WIDTH,
  LANE_COLORS,
  MARKING_Z_OFFSET,
  ROAD_MARK_COLORS,
  ROAD_OBJECT_COLOR,
  ROAD_SIGNAL_COLOR,
} from "../../config/constants";
import type { RgbaColor } from "../../config/constants";
import type { MapAsamOpenDrive } from "../../utils/proto";
import type { PartialSceneEntity, Point3 } from "../../utils/scene";
import { IDENTITY_POSE, makeSceneEntity } from "../../utils/scene";
import { getLibOpenDRIVE } from "../../wasm";
import type {
  EmscriptenMap,
  LanesMesh,
  LibOpenDRIVEModule,
  OpenDriveMap,
  RoadmarksMesh,
  RoadNetworkMesh,
  RoadObjectsMesh,
  RoadSignalsMesh,
} from "../../wasm/types";

/** Default chord error tolerance in meters [libODR eps parameter] */
const DEFAULT_EPS = 0.1;

/**
 * Register the converter — creates a persistent context (cache)
 * and returns the converter closure.
 *
 * WASM loading is async: first invocation triggers loading and returns empty.
 * The module instance is cached as a singleton for all subsequent calls.
 *
 * [OMEGA]: The map message is published once and never changes.
 * [FG-ENTITY]: lifetime={0,0} means entities persist until replaced.
 */
export function registerOpenDriveMapConverter(): (
  msg: MapAsamOpenDrive,
  event: Immutable<MessageEvent<MapAsamOpenDrive>>,
  globalVariables?: Readonly<Record<string, VariableValue>>,
  context?: MessageConverterContext,
) => {
  deletions: { timestamp: Time; type: SceneEntityDeletionType; id: string }[];
  entities: PartialSceneEntity[];
} {
  const ctx = createOpenDriveConverterContext();
  let wasmModule: LibOpenDRIVEModule | undefined;

  // Start WASM loading eagerly at registration time (called during activate()),
  // not lazily on first message. This avoids the race where the first map message
  // arrives before WASM is ready, producing an empty render with no re-delivery.
  getLibOpenDRIVE()
    .then((mod) => {
      wasmModule = mod;
    })
    .catch((err: unknown) => {
      console.error("[OpenDRIVE Converter] WASM load failed:", err);
    });

  return (msg, event, _globalVariables, context) => {
    const emitAlert = context?.emitAlert;
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

    // When settings change, delete all previous entities so toggled-off
    // features are removed from the 3D scene immediately.
    const settingsChanged =
      ctx.previousSettingsHash != undefined &&
      ctx.previousSettingsHash !== settingsHash;
    const timestamp: Time = event.receiveTime;
    const deletions: {
      timestamp: Time;
      type: SceneEntityDeletionType;
      id: string;
    }[] = settingsChanged
      ? [{ timestamp, type: SceneEntityDeletionType.ALL, id: "" }]
      : [];

    const xmlContent = msg.open_drive_xml_content;
    if (!xmlContent) {
      return { deletions, entities: [] };
    }

    // WASM is loaded eagerly at registration time. If it's still loading
    // (e.g., very fast trace open), return empty — the message will be
    // re-delivered via backfill on the next seek/interaction.
    if (!wasmModule) {
      return { deletions, entities: [] };
    }

    try {
      const entities = generateMapEntities(
        wasmModule,
        xmlContent,
        config,
        timestamp,
      );

      ctx.cachedEntities = entities;
      ctx.previousMapReference = msg.map_reference ?? "";
      ctx.previousSettingsHash = settingsHash;

      return { deletions, entities };
    } catch (error) {
      console.error("[OpenDRIVE Converter] Failed to process map:", error);
      const alert: MessageConverterAlert = {
        severity: "error",
        message: "OpenDRIVE map conversion failed",
        error: error instanceof Error ? error : new Error(String(error)),
        tip: "Check if the map XML is valid OpenDRIVE. The WASM module may need rebuilding.",
      };
      emitAlert?.(alert, "opendrive-conversion-error");
      return { deletions, entities: [] };
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Safely call an optional WASM function; returns undefined on any failure.
 *  These are enrichment-only calls (metadata maps) that must not break core rendering.
 *  Failures include: missing Embind function (TypeError), internal WASM errors
 *  (RuntimeError), or C++ exceptions propagated through Emscripten. */
function tryCall<T extends { delete(): void }>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

/**
 * Generate all scene entities using libOpenDRIVE WASM.
 *
 * [libODR] createFromXml: writes XML to Emscripten virtual FS, calls
 *   OpenDriveMap(path, center_map, with_road_objects, with_lateral_profile,
 *   with_lane_height, abs_z, fix_spiral_edge_cases, with_road_signals)
 *
 * [libODR] get_road_network_mesh(eps): adaptive tessellation where eps is the
 *   chord error linearization tolerance in meters. Curves are sampled such that
 *   the maximum deviation between the linearized polyline and the true curve
 *   does not exceed eps. Smaller eps = more vertices = higher fidelity.
 */
function generateMapEntities(
  wasm: LibOpenDRIVEModule,
  xmlContent: string,
  config: OpenDriveConverterSettings,
  timestamp: Time,
): PartialSceneEntity[] {
  const eps = config.stepSize > 0 ? config.stepSize : DEFAULT_EPS;

  // [libODR] Parse OpenDRIVE — handles all geometry types [ODR §9],
  // elevation [ODR §10.5], superelevation [ODR §10.6], crossfall [ODR §10.7],
  // lane offset [ODR §11.4], lane linkage [ODR §11.5], lane width [ODR §11.6],
  // lane height, spiral edge cases, road objects [ODR §13], signals [ODR §14]
  const odrMap: OpenDriveMap = wasm.createFromXml(
    xmlContent,
    /* centerMap */ false, // preserve original coordinates for geo-referencing [ODR §8.5]
    /* withRoadObjects */ true, // [ODR §13]
    /* withLateralProfile */ true, // [ODR §10.6, §10.7] superelevation + crossfall
    /* withLaneHeight */ true, // [ODR §11.6.3] per-lane height offset
    /* absZForLocalRoadObjOutline */ false,
    /* fixSpiralEdgeCases */ true, // [ODR §9.4] degenerate spirals → line/arc
    /* withRoadSignals */ true, // [ODR §14]
  );

  try {
    // [libODR] Generate indexed triangle meshes with adaptive tessellation
    const mesh: RoadNetworkMesh = odrMap.get_road_network_mesh(eps);

    // [ODR §11.7] Get lane type per lane chunk for per-type coloring
    const laneTypeMap = wasm.getLaneTypeMap(odrMap, mesh.lanes_mesh);

    // [ODR §11.8] Get roadmark color per chunk for per-type coloring
    const roadmarkColorMap = wasm.getRoadmarkColorMap(
      odrMap,
      mesh.roadmarks_mesh,
    );

    // Optional metadata maps — gracefully degrade if WASM binary is stale
    // (new Embind functions not yet compiled into the .wasm artifact)
    const roadObjectMetadataMap = tryCall(() =>
      wasm.getRoadObjectMetadataMap(odrMap, mesh.road_objects_mesh),
    );
    const roadSignalMetadataMap = tryCall(() =>
      wasm.getRoadSignalMetadataMap(odrMap, mesh.road_signals_mesh),
    );
    const roadmarkMetadataMap = tryCall(() =>
      wasm.getRoadmarkMetadataMap(odrMap, mesh.roadmarks_mesh),
    );
    const roadMetadataMap = tryCall(() =>
      wasm.getRoadMetadataMap(odrMap, mesh.lanes_mesh),
    );
    const roadLinkageMap = tryCall(() =>
      wasm.getRoadLinkageMap(odrMap, mesh.lanes_mesh),
    );
    const laneLinkageMap = tryCall(() =>
      wasm.getLaneLinkageMap(odrMap, mesh.lanes_mesh),
    );

    // [ODR §12] Identify junction connecting roads for distinct coloring
    const junctionRoadIdsVec = wasm.getJunctionRoadIds(odrMap);
    const junctionRoadIds = vectorToSet(junctionRoadIdsVec);
    junctionRoadIdsVec.delete();

    const entities: PartialSceneEntity[] = [];

    if (config.showLaneSurfaces) {
      entities.push(
        ...buildLaneSurfaceEntities(
          mesh.lanes_mesh,
          laneTypeMap,
          junctionRoadIds,
          roadMetadataMap,
          roadLinkageMap,
          laneLinkageMap,
          timestamp,
        ),
      );
    }

    if (config.showLaneBoundaries) {
      entities.push(...buildLaneBoundaryEntities(mesh.lanes_mesh, timestamp));
    }

    if (config.showRoadMarkings) {
      entities.push(
        ...buildRoadMarkEntities(
          mesh.roadmarks_mesh,
          roadmarkColorMap,
          roadmarkMetadataMap,
          timestamp,
        ),
      );
    }

    if (config.showRoadObjects) {
      entities.push(
        ...buildRoadObjectEntities(
          mesh.road_objects_mesh,
          roadObjectMetadataMap,
          timestamp,
        ),
      );
    }

    if (config.showRoadSignals) {
      entities.push(
        ...buildRoadSignalEntities(
          mesh.road_signals_mesh,
          roadSignalMetadataMap,
          timestamp,
        ),
      );
    }

    // Map-level metadata entity (proj4, coordinate offsets)
    const mapInfoEntity = makeSceneEntity(
      "map.info",
      GLOBAL_FRAME_ID,
      timestamp,
    );
    mapInfoEntity.metadata = [];
    if (odrMap.proj4) {
      mapInfoEntity.metadata.push({ key: "proj4", value: odrMap.proj4 });
    }
    if (odrMap.x_offs !== 0 || odrMap.y_offs !== 0) {
      mapInfoEntity.metadata.push({
        key: "x_offset",
        value: String(odrMap.x_offs),
      });
      mapInfoEntity.metadata.push({
        key: "y_offset",
        value: String(odrMap.y_offs),
      });
    }
    if (mapInfoEntity.metadata.length > 0) {
      entities.push(mapInfoEntity);
    }

    laneTypeMap.delete();
    roadmarkColorMap.delete();
    roadObjectMetadataMap?.delete();
    roadSignalMetadataMap?.delete();
    roadmarkMetadataMap?.delete();
    roadMetadataMap?.delete();
    roadLinkageMap?.delete();
    laneLinkageMap?.delete();
    mesh.delete();
    return entities;
  } finally {
    odrMap.delete();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY ID CONVENTION
// ═══════════════════════════════════════════════════════════════════════════════
// SceneEntity IDs use dot notation mirroring the XODR element hierarchy,
// following the ASAM Quality Checker Framework Rule UID Schema
// (asam-ev/qc-framework doc/manual/rule_uid_schema.md §Rule Full Name):
//   - camelCase XML element names → all-lowercase (e.g. laneSection → lanesection)
//   - dots separate hierarchy levels
//   - dynamic values (IDs, s-coordinates) inserted at their natural position
//
// Examples:
//   road.17.lanesection.0.00.lane.-1           (lane surface)
//   road.17.lanesection.0.00.lane.-1.boundary  (lane boundary)
//   road.17.roadmark.3                         (road marking chunk)
//   road.17.object.guardrail_01                (road object)
//   road.17.signal.sign_274                    (road signal)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// LANE SURFACES → TriangleListPrimitive [FG-TRI]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build indexed TriangleListPrimitive entities from LanesMesh.
 * One entity per lane chunk (grouped by lane_start_indices).
 *
 * [FG-TRI] TriangleListPrimitive:
 *   - pose: IDENTITY_POSE (vertices are absolute inertial coords [ODR §8.2])
 *   - points[]: vertex positions from LanesMesh.vertices
 *   - indices[]: triangle vertex indices from LanesMesh.indices (groups of 3)
 *   - color: determined by lane type [ODR §11.7] or junction [ODR §12]
 *   - colors[]: empty (uniform color per entity)
 *
 * [libODR] Vertex layout: pairs (outer, inner) per s-sample.
 *   Triangle indices form 2-triangle quads. Winding is correct per lane side.
 *
 * [FG-ENTITY] Entity ID: "road.{roadId}.lanesection.{s0}.lane.{laneId}"
 */
function buildLaneSurfaceEntities(
  lanesMesh: LanesMesh,
  laneTypeMap: EmscriptenMap<number, string>,
  junctionRoadIds: Set<string>,
  roadMetadataMap: EmscriptenMap<number, string> | undefined,
  roadLinkageMap: EmscriptenMap<number, string> | undefined,
  laneLinkageMap: EmscriptenMap<number, string> | undefined,
  timestamp: Time,
): PartialSceneEntity[] {
  const entities: PartialSceneEntity[] = [];
  const vertices = lanesMesh.vertices;
  const indices = lanesMesh.indices;
  const numVerts = vertices.size();
  const numIndices = indices.size();

  if (numVerts === 0 || numIndices === 0) {
    return entities;
  }

  // Pre-extract all vertices to avoid repeated WASM calls
  const allPoints = extractVertices(vertices);

  // Partition triangles by lane chunk in O(N+M) time
  const laneKeys = lanesMesh.lane_start_indices.keys();
  const chunkStarts = extractChunkKeys(laneKeys);
  laneKeys.delete();
  const trianglesByChunk = partitionIndicesByChunk(
    indices,
    chunkStarts,
    numVerts,
  );

  for (const startIdx of chunkStarts) {
    const triangles = trianglesByChunk.get(startIdx);
    if (!triangles || triangles.length === 0) {
      continue;
    }

    // Get lane metadata
    const roadId = lanesMesh.get_road_id(startIdx);
    const laneId = lanesMesh.get_lane_id(startIdx);
    const s0 = lanesMesh.get_lanesec_s0(startIdx);
    const laneType = laneTypeMap.get(startIdx) ?? "driving";

    // Remap vertices for this chunk
    const lanePoints: Point3[] = [];
    const laneIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const tri of triangles) {
      const r0 = remapVertex(tri.i0, vertexRemap, allPoints, lanePoints);
      const r1 = remapVertex(tri.i1, vertexRemap, allPoints, lanePoints);
      const r2 = remapVertex(tri.i2, vertexRemap, allPoints, lanePoints);
      if (r0 == undefined || r1 == undefined || r2 == undefined) {
        continue; // skip triangles with out-of-bounds vertices
      }
      laneIndices.push(r0, r1, r2);
    }

    if (laneIndices.length === 0) {
      continue;
    }

    // [ODR §11.7] Color by lane type; [ODR §12] junction roads get distinct color
    const isJunction = junctionRoadIds.has(roadId);
    const color: RgbaColor = isJunction
      ? JUNCTION_COLOR
      : (LANE_COLORS[laneType] ?? DEFAULT_LANE_COLOR);

    // [FG-ENTITY] Dot notation mirrors XODR hierarchy: road → laneSection → lane
    const entityId = `road.${roadId}.lanesection.${s0.toFixed(2)}.lane.${laneId.toString()}`;

    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.triangles = [
      {
        pose: IDENTITY_POSE,
        points: lanePoints,
        color,
        colors: [], // [FG-TRI] empty → uniform color used
        indices: laneIndices, // [FG-TRI] indexed triangles (groups of 3)
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "lane_id", value: String(laneId) },
      { key: "lane_type", value: laneType },
      { key: "junction", value: isJunction ? "yes" : "no" },
    ];

    // Enrich with road-level metadata (name, speed, type)
    const roadMeta = roadMetadataMap?.get(startIdx);
    if (roadMeta) {
      const [roadName, roadLength, , speedMax, speedUnit, roadType] =
        roadMeta.split("\t");
      if (roadName) {
        entity.metadata.push({ key: "road_name", value: roadName });
      }
      if (roadLength) {
        entity.metadata.push({ key: "road_length", value: roadLength });
      }
      if (speedMax) {
        entity.metadata.push({
          key: "speed_limit",
          value: speedUnit ? `${speedMax} ${speedUnit}` : speedMax,
        });
      }
      if (roadType) {
        entity.metadata.push({ key: "road_type", value: roadType });
      }
    }

    // Enrich with road linkage (predecessor/successor)
    const roadLink = roadLinkageMap?.get(startIdx);
    if (roadLink) {
      const parts = roadLink.split("\t");
      const predId = parts[0];
      const predType = parts[1] ?? "";
      const predContact = parts[2] ?? "";
      const succId = parts[3];
      const succType = parts[4] ?? "";
      const succContact = parts[5] ?? "";
      if (predId) {
        entity.metadata.push({
          key: "predecessor",
          value: `${predId} (${predType}, ${predContact})`,
        });
      }
      if (succId) {
        entity.metadata.push({
          key: "successor",
          value: `${succId} (${succType}, ${succContact})`,
        });
      }
    }

    // Enrich with lane linkage (predecessor/successor lane IDs)
    const laneLink = laneLinkageMap?.get(startIdx);
    if (laneLink) {
      const [predLane, succLane] = laneLink.split("\t");
      if (predLane) {
        entity.metadata.push({ key: "lane_predecessor", value: predLane });
      }
      if (succLane) {
        entity.metadata.push({ key: "lane_successor", value: succLane });
      }
    }
    entities.push(entity);
  }

  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANE BOUNDARIES → LinePrimitive LINE_LIST [FG-LINE]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build LINE_LIST entities from lane outline indices, one per lane.
 *
 * [libODR] get_lane_outline_indices() returns pairs of vertex indices:
 *   - Connects outer border vertices along s: (2i)→(2i+2)
 *   - Connects inner border vertices along s: (2i+1)→(2i+3)
 *   - Cross edges at start/end of each lane strip
 *   Result: complete polygon outline for each lane.
 *
 * [FG-LINE] LinePrimitive with type=2 (LINE_LIST):
 *   indices consumed in pairs → segments: points[indices[0]]→points[indices[1]], etc.
 *   thickness: world-space meters (scale_invariant=false)
 *
 * Z-OFFSET: +0.01m above lane surface to prevent z-fighting in WebGL renderer.
 *   Both surfaces and boundaries are coplanar per [ODR]; offset is rendering-only.
 */
function buildLaneBoundaryEntities(
  lanesMesh: LanesMesh,
  timestamp: Time,
): PartialSceneEntity[] {
  const outlineIndices = lanesMesh.get_lane_outline_indices();
  const numOutline = outlineIndices.size();

  if (numOutline < 2) {
    outlineIndices.delete();
    return [];
  }

  const vertices = lanesMesh.vertices;
  const numVerts = vertices.size();

  // Pre-extract all vertices with z-offset
  const allPoints = extractVertices(vertices, BOUNDARY_Z_OFFSET);

  // Pre-extract all outline index pairs
  const outlinePairs: [number, number][] = [];
  for (let i = 0; i + 1 < numOutline; i += 2) {
    outlinePairs.push([outlineIndices.get(i), outlineIndices.get(i + 1)]);
  }
  outlineIndices.delete();

  // Split outline pairs per lane chunk
  const laneKeys = lanesMesh.lane_start_indices.keys();
  const chunkStarts = extractChunkKeys(laneKeys);
  laneKeys.delete();
  const entities: PartialSceneEntity[] = [];

  for (let li = 0; li < chunkStarts.length; li++) {
    const startIdx = chunkStarts[li]!;
    const endIdx = chunkStarts[li + 1] ?? numVerts;

    const lanePoints: Point3[] = [];
    const lineIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const [a, b] of outlinePairs) {
      if (a >= startIdx && a < endIdx && b >= startIdx && b < endIdx) {
        const ra = remapVertex(a, vertexRemap, allPoints, lanePoints);
        const rb = remapVertex(b, vertexRemap, allPoints, lanePoints);
        if (ra != undefined && rb != undefined) {
          lineIndices.push(ra, rb);
        }
      }
    }

    if (lineIndices.length === 0) {
      continue;
    }

    const roadId = lanesMesh.get_road_id(startIdx);
    const laneId = lanesMesh.get_lane_id(startIdx);
    const s0 = lanesMesh.get_lanesec_s0(startIdx);
    const entityId = `road.${roadId}.lanesection.${s0.toFixed(2)}.lane.${laneId.toString()}.boundary`;

    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.lines = [
      {
        type: 2, // [FG-LINE] LINE_LIST: indices consumed in pairs
        pose: IDENTITY_POSE,
        thickness: LANE_BOUNDARY_WIDTH,
        scale_invariant: false,
        points: lanePoints,
        color: LANE_BOUNDARY_COLOR,
        colors: [],
        indices: lineIndices,
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "lane_id", value: String(laneId) },
    ];
    entities.push(entity);
  }

  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROAD MARKINGS → TriangleListPrimitive [FG-TRI]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build TriangleListPrimitive entities from roadmarks mesh.
 * One entity per roadmark segment (grouped by roadmark_type_start_indices).
 *
 * [libODR] RoadmarksMesh: each RoadMark produces a triangle strip mesh.
 *   For broken/dashed marks, libOpenDRIVE generates separate RoadMark objects
 *   per dash segment — gaps have no mesh geometry. Rendering as filled
 *   triangles naturally produces correct dashed appearance.
 *
 * [ODR §11.8] roadmark_type_start_indices maps vertex_start_idx → type string
 *   (solid, broken, solid_solid, broken_solid, etc.)
 *
 * [FG-TRI] TriangleListPrimitive with per-type color from ROAD_MARK_COLORS.
 *   Z-OFFSET: +0.02m above surface to prevent z-fighting.
 */
function buildRoadMarkEntities(
  roadmarksMesh: RoadmarksMesh,
  roadmarkColorMap: EmscriptenMap<number, string>,
  roadmarkMetadataMap: EmscriptenMap<number, string> | undefined,
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = roadmarksMesh.vertices;
  const indices = roadmarksMesh.indices;
  const numVerts = vertices.size();

  if (numVerts === 0 || indices.size() === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices, MARKING_Z_OFFSET);

  // Partition triangles by roadmark chunk in O(N+M) time
  const typeKeys = roadmarksMesh.roadmark_type_start_indices.keys();
  const chunkStarts = extractChunkKeys(typeKeys);
  typeKeys.delete();
  const trianglesByChunk = partitionIndicesByChunk(
    indices,
    chunkStarts,
    numVerts,
  );
  const entities: PartialSceneEntity[] = [];

  for (const startIdx of chunkStarts) {
    const triangles = trianglesByChunk.get(startIdx);
    if (!triangles || triangles.length === 0) {
      continue;
    }

    const markType =
      roadmarksMesh.roadmark_type_start_indices.get(startIdx) ?? "solid";
    const roadId = roadmarksMesh.get_road_id(startIdx);

    const chunkPoints: Point3[] = [];
    const chunkIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const tri of triangles) {
      const r0 = remapVertex(tri.i0, vertexRemap, allPoints, chunkPoints);
      const r1 = remapVertex(tri.i1, vertexRemap, allPoints, chunkPoints);
      const r2 = remapVertex(tri.i2, vertexRemap, allPoints, chunkPoints);
      if (r0 == undefined || r1 == undefined || r2 == undefined) {
        continue;
      }
      chunkIndices.push(r0, r1, r2);
    }

    if (chunkIndices.length === 0) {
      continue;
    }

    // [ODR §11.8] Color by roadmark color from the OpenDRIVE file
    const markColorName = roadmarkColorMap.get(startIdx) ?? "standard";
    const color =
      ROAD_MARK_COLORS[markColorName] ?? ROAD_MARK_COLORS["standard"]!;
    // Stable entity ID using vertex start index (deterministic for same input)
    const entityId = `road.${roadId}.roadmark.${startIdx.toString()}`;

    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.triangles = [
      {
        pose: IDENTITY_POSE,
        points: chunkPoints,
        color,
        colors: [],
        indices: chunkIndices,
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "mark_type", value: markType },
    ];

    // Enrich with roadmark group metadata (weight, lane_change)
    const rmMeta = roadmarkMetadataMap?.get(startIdx);
    if (rmMeta) {
      const [, weight, laneChange, width] = rmMeta.split("\t");
      if (weight) {
        entity.metadata.push({ key: "weight", value: weight });
      }
      if (laneChange) {
        entity.metadata.push({ key: "lane_change", value: laneChange });
      }
      if (width) {
        entity.metadata.push({ key: "width", value: width });
      }
    }
    entities.push(entity);
  }

  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROAD OBJECTS → TriangleListPrimitive [FG-TRI]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build TriangleListPrimitive entities from road objects mesh.
 * One entity per road object (grouped by road_object_start_indices).
 *
 * [libODR] RoadObjectsMesh: extends RoadsMesh with per-object grouping.
 *   Objects include barriers, poles, buildings, vegetation etc. [ODR §13]
 *   Mesh is generated from object outlines [ODR §13.4] and repeats [ODR §13.5].
 *
 * [FG-TRI] Rendered as indexed triangles with uniform ROAD_OBJECT_COLOR.
 */
function buildRoadObjectEntities(
  objectsMesh: RoadObjectsMesh,
  objectMetadataMap: EmscriptenMap<number, string> | undefined,
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = objectsMesh.vertices;
  const indices = objectsMesh.indices;
  const numVerts = vertices.size();

  if (numVerts === 0 || indices.size() === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices);

  // Partition triangles by object chunk in O(N+M) time
  const objKeys = objectsMesh.road_object_start_indices.keys();
  const chunkStarts = extractChunkKeys(objKeys);
  objKeys.delete();
  const trianglesByChunk = partitionIndicesByChunk(
    indices,
    chunkStarts,
    numVerts,
  );
  const entities: PartialSceneEntity[] = [];

  for (const startIdx of chunkStarts) {
    const triangles = trianglesByChunk.get(startIdx);
    if (!triangles || triangles.length === 0) {
      continue;
    }

    const objectId = objectsMesh.road_object_start_indices.get(startIdx) ?? "";
    const roadId = objectsMesh.get_road_id(startIdx);

    const objPoints: Point3[] = [];
    const objIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const tri of triangles) {
      const r0 = remapVertex(tri.i0, vertexRemap, allPoints, objPoints);
      const r1 = remapVertex(tri.i1, vertexRemap, allPoints, objPoints);
      const r2 = remapVertex(tri.i2, vertexRemap, allPoints, objPoints);
      if (r0 == undefined || r1 == undefined || r2 == undefined) {
        continue;
      }
      objIndices.push(r0, r1, r2);
    }

    if (objIndices.length === 0) {
      continue;
    }

    const entityId = `road.${roadId}.object.${objectId}`;
    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.triangles = [
      {
        pose: IDENTITY_POSE,
        points: objPoints,
        color: ROAD_OBJECT_COLOR,
        colors: [],
        indices: objIndices,
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "object_id", value: objectId },
    ];

    // Enrich with object metadata from the parsed OpenDRIVE
    const objMeta = objectMetadataMap?.get(startIdx);
    if (objMeta) {
      const [
        type,
        name,
        subtype,
        orientation,
        isDynamic,
        width,
        height,
        length,
        s0,
        t0,
      ] = objMeta.split("\t");
      if (type) {
        entity.metadata.push({ key: "type", value: type });
      }
      if (name) {
        entity.metadata.push({ key: "name", value: name });
      }
      if (subtype) {
        entity.metadata.push({ key: "subtype", value: subtype });
      }
      if (orientation) {
        entity.metadata.push({ key: "orientation", value: orientation });
      }
      if (isDynamic === "true") {
        entity.metadata.push({ key: "dynamic", value: "true" });
      }
      if (width && width !== "0.000000") {
        entity.metadata.push({ key: "width", value: width });
      }
      if (height && height !== "0.000000") {
        entity.metadata.push({ key: "height", value: height });
      }
      if (length && length !== "0.000000") {
        entity.metadata.push({ key: "length", value: length });
      }
      if (s0) {
        entity.metadata.push({ key: "s", value: s0 });
      }
      if (t0) {
        entity.metadata.push({ key: "t", value: t0 });
      }
    }
    entities.push(entity);
  }

  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROAD SIGNALS → TriangleListPrimitive [FG-TRI]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build TriangleListPrimitive entities from road signals mesh.
 * One entity per road signal (grouped by road_signal_start_indices).
 *
 * [libODR] RoadSignalsMesh: extends RoadsMesh with per-signal grouping.
 *   Signals are rendered as oriented 3D boxes [ODR §14] placed at the
 *   signal position with correct heading/pitch/roll from the road geometry.
 *   See Road::get_road_signal_mesh() in Road.cpp.
 *
 * [FG-TRI] Rendered as indexed triangles with uniform ROAD_SIGNAL_COLOR.
 */
function buildRoadSignalEntities(
  signalsMesh: RoadSignalsMesh,
  signalMetadataMap: EmscriptenMap<number, string> | undefined,
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = signalsMesh.vertices;
  const indices = signalsMesh.indices;
  const numVerts = vertices.size();

  if (numVerts === 0 || indices.size() === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices);

  // Partition triangles by signal chunk in O(N+M) time
  const sigKeys = signalsMesh.road_signal_start_indices.keys();
  const chunkStarts = extractChunkKeys(sigKeys);
  sigKeys.delete();
  const trianglesByChunk = partitionIndicesByChunk(
    indices,
    chunkStarts,
    numVerts,
  );
  const entities: PartialSceneEntity[] = [];

  for (const startIdx of chunkStarts) {
    const triangles = trianglesByChunk.get(startIdx);
    if (!triangles || triangles.length === 0) {
      continue;
    }

    const signalId = signalsMesh.road_signal_start_indices.get(startIdx) ?? "";
    const roadId = signalsMesh.get_road_id(startIdx);

    const sigPoints: Point3[] = [];
    const sigIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const tri of triangles) {
      const r0 = remapVertex(tri.i0, vertexRemap, allPoints, sigPoints);
      const r1 = remapVertex(tri.i1, vertexRemap, allPoints, sigPoints);
      const r2 = remapVertex(tri.i2, vertexRemap, allPoints, sigPoints);
      if (r0 == undefined || r1 == undefined || r2 == undefined) {
        continue;
      }
      sigIndices.push(r0, r1, r2);
    }

    if (sigIndices.length === 0) {
      continue;
    }

    const entityId = `road.${roadId}.signal.${signalId}`;
    const entity = makeSceneEntity(entityId, GLOBAL_FRAME_ID, timestamp);
    entity.triangles = [
      {
        pose: IDENTITY_POSE,
        points: sigPoints,
        color: ROAD_SIGNAL_COLOR,
        colors: [],
        indices: sigIndices,
      },
    ];
    entity.metadata = [
      { key: "road_id", value: roadId },
      { key: "signal_id", value: signalId },
    ];

    // Enrich with signal metadata from the parsed OpenDRIVE
    const sigMeta = signalMetadataMap?.get(startIdx);
    if (sigMeta) {
      const [
        name,
        country,
        type,
        subtype,
        value,
        text,
        isDynamic,
        height,
        width,
        orientation,
      ] = sigMeta.split("\t");
      if (name) {
        entity.metadata.push({ key: "name", value: name });
      }
      if (country) {
        entity.metadata.push({ key: "country", value: country });
      }
      if (type) {
        entity.metadata.push({ key: "type", value: type });
      }
      if (subtype && subtype !== "-1" && subtype !== "none") {
        entity.metadata.push({ key: "subtype", value: subtype });
      }
      if (value && value !== "0.000000") {
        entity.metadata.push({ key: "value", value });
      }
      if (text) {
        entity.metadata.push({ key: "text", value: text });
      }
      if (isDynamic === "true") {
        entity.metadata.push({ key: "dynamic", value: "true" });
      }
      if (height && height !== "0.000000") {
        entity.metadata.push({ key: "height", value: height });
      }
      if (width && width !== "0.000000") {
        entity.metadata.push({ key: "width", value: width });
      }
      if (orientation) {
        entity.metadata.push({ key: "orientation", value: orientation });
      }
    }
    entities.push(entity);
  }

  return entities;
}
