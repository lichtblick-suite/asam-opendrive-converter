/**
 * TypeScript type definitions for the libOpenDRIVE Emscripten WASM module.
 * Generated from: submodule/libOpenDRIVE/src/Embind.cpp (v0.6.0 API)
 */

export type Vec2D = [number, number];
export type Vec3D = [number, number, number];

export interface EmscriptenVector<T> {
  size(): number;
  get(index: number): T;
  push_back(value: T): void;
  delete(): void;
}

export interface EmscriptenMap<K, V> {
  size(): number;
  get(key: K): V | undefined;
  keys(): EmscriptenVector<K>;
  delete(): void;
}

export interface Mesh3D {
  vertices: EmscriptenVector<Vec3D>;
  indices: EmscriptenVector<number>;
  normals: EmscriptenVector<Vec3D>;
  st_coordinates: EmscriptenVector<Vec2D>;
  get_obj(): string;
  delete(): void;
}

export interface RoadsMesh extends Mesh3D {
  road_start_indices: EmscriptenMap<number, string>;
  get_road_id(vert_idx: number): string;
  get_idx_interval_road(vert_idx: number): [number, number];
}

export interface LanesMesh extends RoadsMesh {
  lanesec_start_indices: EmscriptenMap<number, number>;
  lane_start_indices: EmscriptenMap<number, number>;
  get_lanesec_s0(vert_idx: number): number;
  get_lane_id(vert_idx: number): number;
  get_idx_interval_lanesec(vert_idx: number): [number, number];
  get_idx_interval_lane(vert_idx: number): [number, number];
  get_lane_outline_indices(): EmscriptenVector<number>;
}

export interface RoadmarksMesh extends LanesMesh {
  roadmark_type_start_indices: EmscriptenMap<number, string>;
  get_roadmark_type(vert_idx: number): string;
  get_idx_interval_roadmark(vert_idx: number): [number, number];
  get_roadmark_outline_indices(): EmscriptenVector<number>;
}

export interface RoadObjectsMesh extends RoadsMesh {
  road_object_start_indices: EmscriptenMap<number, string>;
  get_road_object_id(vert_idx: number): string;
  get_idx_interval_road_object(vert_idx: number): [number, number];
}

export interface RoadSignalsMesh extends RoadsMesh {
  road_signal_start_indices: EmscriptenMap<number, string>;
  get_road_signal_id(vert_idx: number): string;
  get_idx_interval_signal(vert_idx: number): [number, number];
}

export interface RoadNetworkMesh {
  lanes_mesh: LanesMesh;
  roadmarks_mesh: RoadmarksMesh;
  road_objects_mesh: RoadObjectsMesh;
  road_signals_mesh: RoadSignalsMesh;
  get_mesh(): Mesh3D;
  delete(): void;
}

export interface OpenDriveMap {
  readonly proj4: string;
  readonly x_offs: number;
  readonly y_offs: number;
  readonly xodr_file: string;
  get_road_network_mesh(eps: number): RoadNetworkMesh;
  delete(): void;
}

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

  /** Create an OpenDriveMap from an XML string (writes to virtual FS internally) */
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
}

/**
 * Factory function exported by the Emscripten module.
 * Loads and instantiates the WASM binary.
 */
export type CreateLibOpenDRIVE = () => Promise<LibOpenDRIVEModule>;
