/**
 * Rendering constants: colors, sizes, default parameters.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [ODR §11.7]  Lane type — e_laneType values determine LANE_COLORS keys
 * [ODR §11.8]  Road markings — e_roadMarkColor determines ROAD_MARK_COLORS
 * [FG-SCENE]   Foxglove SceneUpdate — Color channels are float64 in [0, 1]
 * [ODR §8.2]   GLOBAL_FRAME_ID = "map_local" (fallback when no geoReference)
 * [ODR §12]    Junctions — JUNCTION_COLOR for connecting road surfaces
 *
 * COLOR VALUES: These are visualization choices, not standard-prescribed.
 * Lane colors are chosen for visual differentiation; road marking colors
 * approximate physical appearance per [ODR §11.8] e_roadMarkColor.
 *
 * ROAD_MARK_COLORS: Covers all e_roadMarkColor values from V1.8.1:
 * standard, white, yellow, blue, green, red, orange, violet, black.
 *
 * Z-OFFSETS: Prevent z-fighting between coplanar layers in 3D rendering.
 * These are rendering artifacts — per [ODR], surfaces/markings are coplanar.
 * ============================================================================
 */

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

// Lane surface colors by type [ODR §11.7 e_laneType]
export const LANE_COLORS: Record<string, RgbaColor> = {
  driving: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  stop: { r: 0.5, g: 0.2, b: 0.2, a: 0.85 },
  shoulder: { r: 0.45, g: 0.4, b: 0.3, a: 0.85 },
  biking: { r: 0.3, g: 0.55, b: 0.3, a: 0.85 },
  sidewalk: { r: 0.55, g: 0.55, b: 0.55, a: 0.85 },
  border: { r: 0.4, g: 0.4, b: 0.35, a: 0.6 },
  restricted: { r: 0.6, g: 0.3, b: 0.3, a: 0.85 },
  parking: { r: 0.3, g: 0.3, b: 0.55, a: 0.85 },
  median: { r: 0.3, g: 0.45, b: 0.3, a: 0.85 },
  curb: { r: 0.5, g: 0.5, b: 0.45, a: 0.85 },
  entry: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  exit: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  onRamp: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  offRamp: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  connectingRamp: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  walking: { r: 0.6, g: 0.55, b: 0.5, a: 0.85 },
  tram: { r: 0.4, g: 0.35, b: 0.5, a: 0.85 },
  rail: { r: 0.45, g: 0.4, b: 0.5, a: 0.85 },
  bus: { r: 0.3, g: 0.4, b: 0.55, a: 0.85 },
  taxi: { r: 0.5, g: 0.5, b: 0.3, a: 0.85 },
  hov: { r: 0.35, g: 0.45, b: 0.4, a: 0.85 },
  shared: { r: 0.4, g: 0.4, b: 0.45, a: 0.85 },
  slipLane: { r: 0.35, g: 0.35, b: 0.38, a: 0.85 },
  none: { r: 0.2, g: 0.2, b: 0.2, a: 0.3 },
};

export const DEFAULT_LANE_COLOR: RgbaColor = {
  r: 0.3,
  g: 0.3,
  b: 0.3,
  a: 0.7,
};

// Junction areas [ODR §12]
export const JUNCTION_COLOR: RgbaColor = {
  r: 0.35,
  g: 0.35,
  b: 0.4,
  a: 0.7,
};

// Lane boundary line colors
export const LANE_BOUNDARY_COLOR: RgbaColor = {
  r: 0.9,
  g: 0.9,
  b: 0.9,
  a: 0.9,
};

export const LANE_BOUNDARY_WIDTH = 0.08;

// Road marking colors [ODR §11.8 e_roadMarkColor]
export const ROAD_MARK_COLORS: Record<string, RgbaColor> = {
  standard: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
  white: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
  yellow: { r: 1.0, g: 0.85, b: 0.0, a: 1.0 },
  blue: { r: 0.0, g: 0.4, b: 1.0, a: 1.0 },
  green: { r: 0.0, g: 0.8, b: 0.2, a: 1.0 },
  red: { r: 1.0, g: 0.2, b: 0.2, a: 1.0 },
  orange: { r: 1.0, g: 0.55, b: 0.0, a: 1.0 },
  violet: { r: 0.6, g: 0.2, b: 0.8, a: 1.0 },
  black: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
};

export const ROAD_MARK_WIDTH = 0.15;

// Frame [ODR §8.2] — OpenDRIVE map-local inertial frame.
// Used ONLY as fallback when no <geoReference> is present. This frame is
// specific to the OpenDRIVE map and should NOT be confused with the OSI
// converter's "global" frame (which is the simulation inertial frame).
// When <geoReference> exists, "proj_frame" is used instead (see projFrame.ts).
export const GLOBAL_FRAME_ID = "map_local";

// Z-offsets to prevent z-fighting between overlapping layers
export const LANE_Z_OFFSET = 0.0;
export const BOUNDARY_Z_OFFSET = 0.01;
export const MARKING_Z_OFFSET = 0.02;
export const OBJECT_Z_OFFSET = 0.0; // objects/signals are 3D — no z-fighting

// Road object color [ODR §13] — neutral gray for infrastructure
export const ROAD_OBJECT_COLOR: RgbaColor = {
  r: 0.6,
  g: 0.55,
  b: 0.5,
  a: 0.9,
};

// Road signal color [ODR §14] — distinct yellow-green for visibility
export const ROAD_SIGNAL_COLOR: RgbaColor = {
  r: 0.8,
  g: 0.75,
  b: 0.2,
  a: 0.9,
};

// Default chord error tolerance [libODR eps parameter]
// Used in sceneUpdateConverter.ts as DEFAULT_EPS
