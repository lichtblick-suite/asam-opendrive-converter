/**
 * TypeScript type definitions for the OpenDRIVE data model.
 * Covers the subset of OpenDRIVE 1.4+ needed for road network visualization.
 */

// ─── Top-Level Map ───────────────────────────────────────────────

export interface OpenDriveMap {
  header: OpenDriveHeader;
  roads: Road[];
  junctions: Junction[];
}

// ─── Header ──────────────────────────────────────────────────────

export interface OpenDriveHeader {
  revMajor: number;
  revMinor: number;
  name: string;
  date: string;
  geoReference: string;
  offset: HeaderOffset;
}

export interface HeaderOffset {
  x: number;
  y: number;
  z: number;
  hdg: number;
}

// ─── Road ────────────────────────────────────────────────────────

export interface Road {
  id: string;
  name: string;
  length: number;
  junction: string; // "-1" if not part of a junction
  link: RoadLink;
  planView: GeometryElement[];
  elevationProfile: ElevationElement[];
  lanes: LaneSection[];
}

export interface RoadLink {
  predecessor?: RoadLinkElement;
  successor?: RoadLinkElement;
}

export interface RoadLinkElement {
  elementId: string;
  elementType: "road" | "junction";
  contactPoint?: "start" | "end";
}

// ─── Geometry (planView) ─────────────────────────────────────────

export type GeometryType = "line" | "arc" | "spiral" | "poly3" | "paramPoly3";

export interface GeometryElement {
  s: number;
  x: number;
  y: number;
  hdg: number;
  length: number;
  type: GeometryType;
  // Arc
  curvature?: number;
  // Spiral
  curvStart?: number;
  curvEnd?: number;
  // Poly3
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  // ParamPoly3
  aU?: number;
  bU?: number;
  cU?: number;
  dU?: number;
  aV?: number;
  bV?: number;
  cV?: number;
  dV?: number;
  pRange?: "arcLength" | "normalized";
}

// ─── Elevation ───────────────────────────────────────────────────

export interface ElevationElement {
  s: number;
  a: number;
  b: number;
  c: number;
  d: number;
}

// ─── Lanes ───────────────────────────────────────────────────────

export interface LaneSection {
  s: number;
  lanes: Lane[];
}

export interface Lane {
  id: number;
  type: LaneType;
  level: boolean;
  width: LaneWidth[];
  roadMark: RoadMark[];
  link: LaneLink;
}

export type LaneType =
  | "driving"
  | "stop"
  | "shoulder"
  | "biking"
  | "sidewalk"
  | "border"
  | "restricted"
  | "parking"
  | "median"
  | "curb"
  | "none"
  | "entry"
  | "exit"
  | "onRamp"
  | "offRamp"
  | "connectingRamp";

export interface LaneWidth {
  sOffset: number;
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface LaneLink {
  predecessor?: number;
  successor?: number;
}

// ─── Road Marks ──────────────────────────────────────────────────

export interface RoadMark {
  sOffset: number;
  type: RoadMarkType;
  weight: "standard" | "bold";
  color: "standard" | "white" | "yellow" | "blue" | "green" | "red";
  width: number;
  laneChange: "increase" | "decrease" | "both" | "none";
}

export type RoadMarkType =
  | "none"
  | "solid"
  | "broken"
  | "solid solid"
  | "solid broken"
  | "broken solid"
  | "broken broken"
  | "botts dots"
  | "grass"
  | "curb";

// ─── Junctions ───────────────────────────────────────────────────

export interface Junction {
  id: string;
  name: string;
  connections: JunctionConnection[];
}

export interface JunctionConnection {
  id: string;
  incomingRoad: string;
  connectingRoad: string;
  contactPoint: "start" | "end";
  laneLinks: JunctionLaneLink[];
}

export interface JunctionLaneLink {
  from: number;
  to: number;
}

// ─── Geometry output ─────────────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Polyline3D {
  points: Vec3[];
}

export interface TriangleMesh {
  vertices: Float32Array;
  indices: Uint32Array;
}
