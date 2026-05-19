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
 *              https://github.com/pageldev/libOpenDRIVE
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

import type { OpenDriveConverterSettings } from "./context";
import { createOpenDriveConverterContext, DEFAULT_SETTINGS } from "./context";
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
  EmscriptenVector,
  LanesMesh,
  LibOpenDRIVEModule,
  OpenDriveMap,
  RoadmarksMesh,
  RoadNetworkMesh,
  RoadObjectsMesh,
  RoadSignalsMesh,
  Vec3D,
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
  event: { receiveTime: Time; topicConfig?: unknown },
) => {
  deletions: { timestamp: Time; type: SceneEntityDeletionType; id: string }[];
  entities: PartialSceneEntity[];
} {
  const ctx = createOpenDriveConverterContext();
  let wasmModule: LibOpenDRIVEModule | undefined;
  let wasmLoading = false;

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

    // Trigger async WASM load; return empty until module is ready
    if (!wasmModule) {
      if (!wasmLoading) {
        wasmLoading = true;
        void getLibOpenDRIVE()
          .then((mod) => {
            wasmModule = mod;
          })
          .catch((err: unknown) => {
            console.error("[OpenDRIVE Converter] WASM load failed:", err);
          })
          .finally(() => {
            wasmLoading = false;
          });
      }
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
      return { deletions, entities: [] };
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

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
          timestamp,
        ),
      );
    }

    if (config.showRoadObjects) {
      entities.push(
        ...buildRoadObjectEntities(mesh.road_objects_mesh, timestamp),
      );
    }

    if (config.showRoadSignals) {
      entities.push(
        ...buildRoadSignalEntities(mesh.road_signals_mesh, timestamp),
      );
    }

    laneTypeMap.delete();
    roadmarkColorMap.delete();
    mesh.delete();
    return entities;
  } finally {
    odrMap.delete();
  }
}

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
 * [FG-ENTITY] Entity ID format: "road.{roadId}.lanesection.{s0}.lane.{laneId}"
 *   Ensures stable upsert key per lane.
 */
function buildLaneSurfaceEntities(
  lanesMesh: LanesMesh,
  laneTypeMap: EmscriptenMap<number, string>,
  junctionRoadIds: Set<string>,
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

  // Iterate per-lane chunks using lane_start_indices
  const laneKeys = lanesMesh.lane_start_indices.keys();
  const numLanes = laneKeys.size();

  for (let li = 0; li < numLanes; li++) {
    const startIdx = laneKeys.get(li);
    const endIdx = li + 1 < numLanes ? laneKeys.get(li + 1) : numVerts;

    // Get lane metadata
    const roadId = lanesMesh.get_road_id(startIdx);
    const laneId = lanesMesh.get_lane_id(startIdx);
    const s0 = lanesMesh.get_lanesec_s0(startIdx);
    const laneType = laneTypeMap.get(startIdx) ?? "driving";

    // Collect triangle indices for this lane's vertex range
    const lanePoints: Point3[] = [];
    const laneIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (let i = 0; i < numIndices; i += 3) {
      const i0 = indices.get(i);
      const i1 = indices.get(i + 1);
      const i2 = indices.get(i + 2);

      if (
        i0 >= startIdx &&
        i0 < endIdx &&
        i1 >= startIdx &&
        i1 < endIdx &&
        i2 >= startIdx &&
        i2 < endIdx
      ) {
        laneIndices.push(
          remapVertex(i0, vertexRemap, allPoints, lanePoints),
          remapVertex(i1, vertexRemap, allPoints, lanePoints),
          remapVertex(i2, vertexRemap, allPoints, lanePoints),
        );
      }
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
    entities.push(entity);
  }

  laneKeys.delete();
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

  // Split outline pairs per lane chunk, same as buildLaneSurfaceEntities
  const laneKeys = lanesMesh.lane_start_indices.keys();
  const numLanes = laneKeys.size();
  const entities: PartialSceneEntity[] = [];

  for (let li = 0; li < numLanes; li++) {
    const startIdx = laneKeys.get(li);
    const endIdx = li + 1 < numLanes ? laneKeys.get(li + 1) : numVerts;

    const lanePoints: Point3[] = [];
    const lineIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (const [a, b] of outlinePairs) {
      if (a >= startIdx && a < endIdx && b >= startIdx && b < endIdx) {
        lineIndices.push(
          remapVertex(a, vertexRemap, allPoints, lanePoints),
          remapVertex(b, vertexRemap, allPoints, lanePoints),
        );
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

  laneKeys.delete();
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
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = roadmarksMesh.vertices;
  const indices = roadmarksMesh.indices;
  const numVerts = vertices.size();
  const numIndices = indices.size();

  if (numVerts === 0 || numIndices === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices, MARKING_Z_OFFSET);

  // Iterate per-roadmark chunks
  const typeKeys = roadmarksMesh.roadmark_type_start_indices.keys();
  const numChunks = typeKeys.size();
  const entities: PartialSceneEntity[] = [];

  for (let ci = 0; ci < numChunks; ci++) {
    const startIdx = typeKeys.get(ci);
    const endIdx = ci + 1 < numChunks ? typeKeys.get(ci + 1) : numVerts;
    const markType =
      roadmarksMesh.roadmark_type_start_indices.get(startIdx) ?? "solid";
    const roadId = roadmarksMesh.get_road_id(startIdx);

    const chunkPoints: Point3[] = [];
    const chunkIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (let i = 0; i < numIndices; i += 3) {
      const i0 = indices.get(i);
      const i1 = indices.get(i + 1);
      const i2 = indices.get(i + 2);

      if (
        i0 >= startIdx &&
        i0 < endIdx &&
        i1 >= startIdx &&
        i1 < endIdx &&
        i2 >= startIdx &&
        i2 < endIdx
      ) {
        chunkIndices.push(
          remapVertex(i0, vertexRemap, allPoints, chunkPoints),
          remapVertex(i1, vertexRemap, allPoints, chunkPoints),
          remapVertex(i2, vertexRemap, allPoints, chunkPoints),
        );
      }
    }

    if (chunkIndices.length === 0) {
      continue;
    }

    // [ODR §11.8] Color by roadmark color from the OpenDRIVE file
    const markColorName = roadmarkColorMap.get(startIdx) ?? "standard";
    const color =
      ROAD_MARK_COLORS[markColorName] ?? ROAD_MARK_COLORS["standard"]!;
    const entityId = `road.${roadId}.roadmark.${ci.toString()}`;

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
    entities.push(entity);
  }

  typeKeys.delete();
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
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = objectsMesh.vertices;
  const indices = objectsMesh.indices;
  const numVerts = vertices.size();
  const numIndices = indices.size();

  if (numVerts === 0 || numIndices === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices);

  const objKeys = objectsMesh.road_object_start_indices.keys();
  const numObjects = objKeys.size();
  const entities: PartialSceneEntity[] = [];

  for (let oi = 0; oi < numObjects; oi++) {
    const startIdx = objKeys.get(oi);
    const endIdx = oi + 1 < numObjects ? objKeys.get(oi + 1) : numVerts;
    const objectId = objectsMesh.road_object_start_indices.get(startIdx) ?? "";
    const roadId = objectsMesh.get_road_id(startIdx);

    const objPoints: Point3[] = [];
    const objIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (let i = 0; i < numIndices; i += 3) {
      const i0 = indices.get(i);
      const i1 = indices.get(i + 1);
      const i2 = indices.get(i + 2);

      if (
        i0 >= startIdx &&
        i0 < endIdx &&
        i1 >= startIdx &&
        i1 < endIdx &&
        i2 >= startIdx &&
        i2 < endIdx
      ) {
        objIndices.push(
          remapVertex(i0, vertexRemap, allPoints, objPoints),
          remapVertex(i1, vertexRemap, allPoints, objPoints),
          remapVertex(i2, vertexRemap, allPoints, objPoints),
        );
      }
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
    entities.push(entity);
  }

  objKeys.delete();
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
  timestamp: Time,
): PartialSceneEntity[] {
  const vertices = signalsMesh.vertices;
  const indices = signalsMesh.indices;
  const numVerts = vertices.size();
  const numIndices = indices.size();

  if (numVerts === 0 || numIndices === 0) {
    return [];
  }

  const allPoints = extractVertices(vertices);

  const sigKeys = signalsMesh.road_signal_start_indices.keys();
  const numSignals = sigKeys.size();
  const entities: PartialSceneEntity[] = [];

  for (let si = 0; si < numSignals; si++) {
    const startIdx = sigKeys.get(si);
    const endIdx = si + 1 < numSignals ? sigKeys.get(si + 1) : numVerts;
    const signalId = signalsMesh.road_signal_start_indices.get(startIdx) ?? "";
    const roadId = signalsMesh.get_road_id(startIdx);

    const sigPoints: Point3[] = [];
    const sigIndices: number[] = [];
    const vertexRemap = new Map<number, number>();

    for (let i = 0; i < numIndices; i += 3) {
      const i0 = indices.get(i);
      const i1 = indices.get(i + 1);
      const i2 = indices.get(i + 2);

      if (
        i0 >= startIdx &&
        i0 < endIdx &&
        i1 >= startIdx &&
        i1 < endIdx &&
        i2 >= startIdx &&
        i2 < endIdx
      ) {
        sigIndices.push(
          remapVertex(i0, vertexRemap, allPoints, sigPoints),
          remapVertex(i1, vertexRemap, allPoints, sigPoints),
          remapVertex(i2, vertexRemap, allPoints, sigPoints),
        );
      }
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
    entities.push(entity);
  }

  sigKeys.delete();
  return entities;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Extract all Vec3D vertices from an Emscripten vector into a JS Point3 array */
function extractVertices(
  vertices: EmscriptenVector<Vec3D>,
  zOffset = 0,
): Point3[] {
  const count = vertices.size();
  const result: Point3[] = new Array<Point3>(count);
  for (let i = 0; i < count; i++) {
    const v = vertices.get(i);
    result[i] = { x: v[0], y: v[1], z: v[2] + zOffset };
  }
  return result;
}

/** Remap a global vertex index to a local index, adding to localPoints if new */
function remapVertex(
  globalIdx: number,
  remap: Map<number, number>,
  allPoints: Point3[],
  localPoints: Point3[],
): number {
  let localIdx = remap.get(globalIdx);
  if (localIdx == undefined) {
    localIdx = localPoints.length;
    localPoints.push(allPoints[globalIdx]!);
    remap.set(globalIdx, localIdx);
  }
  return localIdx;
}

/** Convert an Emscripten vector<string> to a JS Set<string> */
function vectorToSet(vec: EmscriptenVector<string>): Set<string> {
  const set = new Set<string>();
  const n = vec.size();
  for (let i = 0; i < n; i++) {
    set.add(vec.get(i));
  }
  return set;
}
