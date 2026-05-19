/**
 * TypeScript type definitions for the libOpenDRIVE Emscripten WASM module.
 *
 * ============================================================================
 * REFERENCES
 * ============================================================================
 * [libODR]     libOpenDRIVE v0.6.0 — C++ source at submodule/libOpenDRIVE/
 * [EMB]        Emscripten Embind — JS binding layer for C++ classes
 * [ODR §8.2]   Inertial coordinate system — all Vec3D output is (x=East, y=North, z=Up)
 * [ODR §11.7]  Lane type — e_laneType enumeration values as strings
 * [ODR §11.8]  Road markings — e_roadMarkColor and e_roadMarkType as strings
 * [ODR §12]    Junctions — Road::junction field identifies junction membership
 *
 * MESH LAYOUT [libODR src/Road.cpp:310-345]:
 *   Vertices are in pairs per adaptively-sampled s-value:
 *     vertices[2i]   = outer border surface point
 *     vertices[2i+1] = inner border surface point
 *   Triangle indices form 2-triangle quads from consecutive vertex pairs.
 *   Winding: CCW for right lanes (id < 0), CW for left lanes (id > 0).
 *
 * OUTLINE INDICES [libODR src/RoadNetworkMesh.cpp:10-35]:
 *   get_lane_outline_indices() returns LINE_LIST pairs:
 *     - Even vertices (outer edge): 0→2, 2→4, ..., (n-4)→(n-2)
 *     - Odd vertices (inner edge): 1→3, 3→5, ..., (n-3)→(n-1)
 *     - Cross edges: start_idx→start_idx+1, end_idx-2→end_idx-1
 * ============================================================================
 */

export type Vec2D = [number, number];
export type Vec3D = [number, number, number];

/** Emscripten std::vector<T> binding [EMB register_vector] */
export interface EmscriptenVector<T> {
  size(): number;
  get(index: number): T;
  push_back(value: T): void;
  delete(): void;
}

/** Emscripten std::map<K, V> binding [EMB register_map] */
export interface EmscriptenMap<K, V> {
  size(): number;
  get(key: K): V | undefined;
  keys(): EmscriptenVector<K>;
  delete(): void;
}

/**
 * Mesh3D [libODR include/Mesh.h]
 * Base triangle mesh with indexed vertices in OpenDRIVE inertial frame [ODR §8.2].
 */
export interface Mesh3D {
  vertices: EmscriptenVector<Vec3D>;
  indices: EmscriptenVector<number>; // uint32_t triangle indices (groups of 3)
  normals: EmscriptenVector<Vec3D>;
  st_coordinates: EmscriptenVector<Vec2D>;
  get_obj(): string;
  delete(): void;
}

/**
 * RoadsMesh [libODR include/RoadNetworkMesh.h]
 * Extends Mesh3D with per-road vertex grouping.
 * road_start_indices maps vertex_start_idx → road_id [ODR Road::id]
 */
export interface RoadsMesh extends Mesh3D {
  road_start_indices: EmscriptenMap<number, string>;
  get_road_id(vert_idx: number): string;
  get_idx_interval_road(vert_idx: number): [number, number];
}

/**
 * LanesMesh [libODR include/RoadNetworkMesh.h]
 * Extends RoadsMesh with per-lane-section and per-lane vertex grouping.
 * - lanesec_start_indices: vertex_start_idx → LaneSection::s0 [ODR §11.3]
 * - lane_start_indices: vertex_start_idx → Lane::id [ODR §11.1]
 * - get_lane_outline_indices(): LINE_LIST index pairs for lane polygon edges
 */
export interface LanesMesh extends RoadsMesh {
  lanesec_start_indices: EmscriptenMap<number, number>;
  lane_start_indices: EmscriptenMap<number, number>;
  get_lanesec_s0(vert_idx: number): number;
  get_lane_id(vert_idx: number): number;
  get_idx_interval_lanesec(vert_idx: number): [number, number];
  get_idx_interval_lane(vert_idx: number): [number, number];
  get_lane_outline_indices(): EmscriptenVector<number>;
}

/**
 * RoadmarksMesh [libODR include/RoadNetworkMesh.h]
 * Extends LanesMesh with per-roadmark-type grouping.
 * - roadmark_type_start_indices: vertex_start_idx → RoadMark::type [ODR §11.8]
 * - get_roadmark_outline_indices(): LINE_LIST index pairs for roadmark edges
 */
export interface RoadmarksMesh extends LanesMesh {
  roadmark_type_start_indices: EmscriptenMap<number, string>;
  get_roadmark_type(vert_idx: number): string;
  get_idx_interval_roadmark(vert_idx: number): [number, number];
  get_roadmark_outline_indices(): EmscriptenVector<number>;
}

/**
 * RoadObjectsMesh [libODR include/RoadNetworkMesh.h]
 * Per-road-object vertex grouping [ODR §13].
 */
export interface RoadObjectsMesh extends RoadsMesh {
  road_object_start_indices: EmscriptenMap<number, string>;
  get_road_object_id(vert_idx: number): string;
  get_idx_interval_road_object(vert_idx: number): [number, number];
}

/**
 * RoadSignalsMesh [libODR include/RoadNetworkMesh.h]
 * Per-road-signal vertex grouping [ODR §14].
 */
export interface RoadSignalsMesh extends RoadsMesh {
  road_signal_start_indices: EmscriptenMap<number, string>;
  get_road_signal_id(vert_idx: number): string;
  get_idx_interval_signal(vert_idx: number): [number, number];
}

/**
 * RoadNetworkMesh [libODR include/RoadNetworkMesh.h]
 * Complete road network mesh with separate sub-meshes for lanes,
 * roadmarks, road objects, and road signals.
 */
export interface RoadNetworkMesh {
  lanes_mesh: LanesMesh;
  roadmarks_mesh: RoadmarksMesh;
  road_objects_mesh: RoadObjectsMesh;
  road_signals_mesh: RoadSignalsMesh;
  get_mesh(): Mesh3D;
  delete(): void;
}

/**
 * OpenDriveMap [libODR include/OpenDriveMap.h]
 * Parsed OpenDRIVE map with geometry computation.
 * - proj4: CRS projection string from <geoReference> [ODR §8.5]
 * - x_offs/y_offs: coordinate centering offsets (non-zero when center_map=true)
 */
export interface OpenDriveMap {
  readonly proj4: string;
  readonly x_offs: number;
  readonly y_offs: number;
  readonly xodr_file: string;
  /** Generate road network mesh with adaptive tessellation [libODR]
   *  @param eps - chord error linearization tolerance in meters */
  get_road_network_mesh(eps: number): RoadNetworkMesh;
  delete(): void;
}

/**
 * Main WASM module interface.
 * Exposes the libOpenDRIVE C++ API via Emscripten Embind.
 */
export interface LibOpenDRIVEModule {
  OpenDriveMap: new (
    xodrFile: string,
    centerMap?: boolean,
    withRoadObjects?: boolean,
    withLateralProfile?: boolean,
    withLaneHeight?: boolean,
    absZForLocalRoadObjOutline?: boolean,
    fixSpiralEdgeCases?: boolean,
    withRoadSignals?: boolean,
  ) => OpenDriveMap;

  /** Create OpenDriveMap from XML string [Embind.cpp createFromXml] */
  createFromXml(
    xmlContent: string,
    centerMap?: boolean,
    withRoadObjects?: boolean,
    withLateralProfile?: boolean,
    withLaneHeight?: boolean,
    absZForLocalRoadObjOutline?: boolean,
    fixSpiralEdgeCases?: boolean,
    withRoadSignals?: boolean,
  ): OpenDriveMap;

  /** Get lane type [ODR §11.7] per lane chunk: vertex_start_idx → type string */
  getLaneTypeMap(
    odrMap: OpenDriveMap,
    lanesMesh: LanesMesh,
  ): EmscriptenMap<number, string>;

  /** Get road IDs that are junction connecting roads [ODR §12] */
  getJunctionRoadIds(odrMap: OpenDriveMap): EmscriptenVector<string>;

  /** Get roadmark color [ODR §11.8] per chunk: vertex_start_idx → color string */
  getRoadmarkColorMap(
    odrMap: OpenDriveMap,
    roadmarksMesh: RoadmarksMesh,
  ): EmscriptenMap<number, string>;

  /** Get road metadata per road chunk: vertex_start_idx → "name\tlength\tjunction\tspeed_max\tspeed_unit\ttype" */
  getRoadMetadataMap(
    odrMap: OpenDriveMap,
    lanesMesh: LanesMesh,
  ): EmscriptenMap<number, string>;

  /** Get road object metadata per chunk: vertex_start_idx → "type\tname\tsubtype\torientation\tis_dynamic\twidth\theight\tlength\ts0\tt0" */
  getRoadObjectMetadataMap(
    odrMap: OpenDriveMap,
    objectsMesh: RoadObjectsMesh,
  ): EmscriptenMap<number, string>;

  /** Get road signal metadata per chunk: vertex_start_idx → "name\tcountry\ttype\tsubtype\tvalue\ttext\tis_dynamic\theight\twidth\torientation" */
  getRoadSignalMetadataMap(
    odrMap: OpenDriveMap,
    signalsMesh: RoadSignalsMesh,
  ): EmscriptenMap<number, string>;

  /** Get roadmark group metadata per chunk: vertex_start_idx → "type\tweight\tlane_change\twidth" */
  getRoadmarkMetadataMap(
    odrMap: OpenDriveMap,
    roadmarksMesh: RoadmarksMesh,
  ): EmscriptenMap<number, string>;

  /** Get road predecessor/successor linkage per road chunk: vertex_start_idx → "pred_id\tpred_type\tpred_contact\tsucc_id\tsucc_type\tsucc_contact" */
  getRoadLinkageMap(
    odrMap: OpenDriveMap,
    lanesMesh: LanesMesh,
  ): EmscriptenMap<number, string>;

  /** Get lane predecessor/successor IDs per lane chunk: vertex_start_idx → "pred_lane_id\tsucc_lane_id" */
  getLaneLinkageMap(
    odrMap: OpenDriveMap,
    lanesMesh: LanesMesh,
  ): EmscriptenMap<number, string>;
}

/** Emscripten module factory function */
export type CreateLibOpenDRIVE = () => Promise<LibOpenDRIVEModule>;
