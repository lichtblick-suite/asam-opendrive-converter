/**
 * Scene entity helper utilities.
 */
import type { Time } from "@foxglove/schemas";

export interface PartialSceneEntity {
  id: string;
  timestamp: Time;
  frame_id: string;
  lifetime: Time;
  frame_locked: boolean;
  triangles?: TriangleListPrimitive[];
  lines?: LinePrimitive[];
  cubes?: CubePrimitive[];
  metadata?: KeyValuePair[];
}

export interface TriangleListPrimitive {
  pose: Pose;
  points: Point3[];
  color: Color;
  colors: Color[];
  indices: number[];
}

export interface LinePrimitive {
  type: number; // 0=LINE_STRIP, 1=LINE_LOOP, 2=LINE_LIST
  pose: Pose;
  thickness: number;
  scale_invariant: boolean;
  points: Point3[];
  color: Color;
  colors: Color[];
  indices: number[];
}

export interface CubePrimitive {
  pose: Pose;
  size: Point3;
  color: Color;
}

export interface Pose {
  position: Point3;
  orientation: Quaternion;
}

export interface Point3 {
  x: number;
  y: number;
  z: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export const IDENTITY_POSE: Pose = {
  position: { x: 0, y: 0, z: 0 },
  orientation: { x: 0, y: 0, z: 0, w: 1 },
};

export const ZERO_TIME: Time = { sec: 0, nsec: 0 };

export function makeSceneEntity(
  id: string,
  frameId: string,
  timestamp: Time,
): PartialSceneEntity {
  return {
    id,
    timestamp,
    frame_id: frameId,
    lifetime: ZERO_TIME,
    frame_locked: true,
  };
}
