/**
 * Rendering constants: colors, sizes, default parameters.
 */

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

// Lane surface colors by type
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
  none: { r: 0.2, g: 0.2, b: 0.2, a: 0.3 },
};

export const DEFAULT_LANE_COLOR: RgbaColor = {
  r: 0.3,
  g: 0.3,
  b: 0.3,
  a: 0.7,
};

// Junction areas
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

// Road marking colors
export const ROAD_MARK_COLORS: Record<string, RgbaColor> = {
  standard: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
  white: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
  yellow: { r: 1.0, g: 0.85, b: 0.0, a: 1.0 },
  blue: { r: 0.0, g: 0.4, b: 1.0, a: 1.0 },
  green: { r: 0.0, g: 0.8, b: 0.2, a: 1.0 },
  red: { r: 1.0, g: 0.2, b: 0.2, a: 1.0 },
};

export const ROAD_MARK_WIDTH = 0.15;

// Tessellation resolution
export const DEFAULT_STEP_SIZE = 1.0; // meters between sample points

// Frame
export const GLOBAL_FRAME_ID = "global";

// Z-offset to prevent z-fighting between overlapping layers
export const LANE_Z_OFFSET = 0.0;
export const BOUNDARY_Z_OFFSET = 0.01;
export const MARKING_Z_OFFSET = 0.02;
