/**
 * Parse an OpenDRIVE XML string into a typed OpenDriveMap data structure.
 */
import { XMLParser } from "fast-xml-parser";

import type {
  ElevationElement,
  GeometryElement,
  HeaderOffset,
  Junction,
  JunctionConnection,
  Lane,
  LaneLink,
  LaneSection,
  LaneType,
  LaneWidth,
  OpenDriveHeader,
  OpenDriveMap,
  Road,
  RoadLink,
  RoadLinkElement,
  RoadMark,
  RoadMarkType,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = Record<string, any>;

function ensureArray(val: unknown): Rec[] {
  if (val == null) {
    return [];
  }
  return (Array.isArray(val) ? val : [val]) as Rec[];
}

function num(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function str(val: unknown, fallback = ""): string {
  return val != null ? String(val) : fallback;
}

// ─── XML Parser Instance ─────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  isArray: (_name: string, _jpath: string) => false,
  textNodeName: "#text",
  processEntities: false,
});

// ─── Main Parse Function ─────────────────────────────────────────

export function parseOpenDriveXml(xmlContent: string): OpenDriveMap {
  const parsed = xmlParser.parse(xmlContent);
  const root = parsed.OpenDRIVE ?? parsed.openDRIVE;

  if (!root) {
    throw new Error("Invalid OpenDRIVE XML: missing root <OpenDRIVE> element");
  }

  return {
    header: parseHeader(root.header),
    roads: ensureArray(root.road).map(parseRoad),
    junctions: ensureArray(root.junction).map(parseJunction),
  };
}

// ─── Header ──────────────────────────────────────────────────────

function parseHeader(h: Record<string, unknown> | undefined): OpenDriveHeader {
  if (!h) {
    return {
      revMajor: 1,
      revMinor: 4,
      name: "",
      date: "",
      geoReference: "",
      offset: { x: 0, y: 0, z: 0, hdg: 0 },
    };
  }

  const hObj = h as Record<string, unknown>;
  const geoRef = hObj.geoReference;
  const geoRefStr =
    typeof geoRef === "object" && geoRef != null
      ? str((geoRef as Record<string, unknown>)["#text"])
      : str(geoRef);

  const offsetEl = hObj.offset as Record<string, unknown> | undefined;
  const offset: HeaderOffset = offsetEl
    ? {
        x: num(offsetEl["@_x"]),
        y: num(offsetEl["@_y"]),
        z: num(offsetEl["@_z"]),
        hdg: num(offsetEl["@_hdg"]),
      }
    : { x: 0, y: 0, z: 0, hdg: 0 };

  return {
    revMajor: num(hObj["@_revMajor"], 1),
    revMinor: num(hObj["@_revMinor"], 4),
    name: str(hObj["@_name"]),
    date: str(hObj["@_date"]),
    geoReference: geoRefStr,
    offset,
  };
}

// ─── Roads ───────────────────────────────────────────────────────

function parseRoad(r: Record<string, unknown>): Road {
  return {
    id: str(r["@_id"]),
    name: str(r["@_name"]),
    length: num(r["@_length"]),
    junction: str(r["@_junction"], "-1"),
    link: parseRoadLink(r.link as Record<string, unknown> | undefined),
    planView: parsePlanView(r.planView as Record<string, unknown> | undefined),
    elevationProfile: parseElevationProfile(
      r.elevationProfile as Record<string, unknown> | undefined,
    ),
    lanes: parseLanes(r.lanes as Record<string, unknown> | undefined),
  };
}

// ─── Road Links ──────────────────────────────────────────────────

function parseRoadLink(link: Record<string, unknown> | undefined): RoadLink {
  if (!link) {
    return {};
  }
  return {
    predecessor: parseRoadLinkElement(
      link.predecessor as Record<string, unknown> | undefined,
    ),
    successor: parseRoadLinkElement(
      link.successor as Record<string, unknown> | undefined,
    ),
  };
}

function parseRoadLinkElement(
  el: Record<string, unknown> | undefined,
): RoadLinkElement | undefined {
  if (!el) {
    return undefined;
  }
  return {
    elementId: str(el["@_elementId"]),
    elementType: str(el["@_elementType"], "road") as "road" | "junction",
    contactPoint: el["@_contactPoint"]
      ? (str(el["@_contactPoint"]) as "start" | "end")
      : undefined,
  };
}

// ─── PlanView (Geometry) ─────────────────────────────────────────

function parsePlanView(
  pv: Record<string, unknown> | undefined,
): GeometryElement[] {
  if (!pv) {
    return [];
  }
  return ensureArray(pv.geometry).map(parseGeometry);
}

function parseGeometry(g: Record<string, unknown>): GeometryElement {
  const base: GeometryElement = {
    s: num(g["@_s"]),
    x: num(g["@_x"]),
    y: num(g["@_y"]),
    hdg: num(g["@_hdg"]),
    length: num(g["@_length"]),
    type: "line",
  };

  if (g.line != null) {
    base.type = "line";
  } else if (g.arc != null) {
    base.type = "arc";
    const arc = g.arc as Record<string, unknown>;
    base.curvature = num(arc["@_curvature"]);
  } else if (g.spiral != null) {
    base.type = "spiral";
    const spiral = g.spiral as Record<string, unknown>;
    base.curvStart = num(spiral["@_curvStart"]);
    base.curvEnd = num(spiral["@_curvEnd"]);
  } else if (g.poly3 != null) {
    base.type = "poly3";
    const poly = g.poly3 as Record<string, unknown>;
    base.a = num(poly["@_a"]);
    base.b = num(poly["@_b"]);
    base.c = num(poly["@_c"]);
    base.d = num(poly["@_d"]);
  } else if (g.paramPoly3 != null) {
    base.type = "paramPoly3";
    const pp = g.paramPoly3 as Record<string, unknown>;
    base.aU = num(pp["@_aU"]);
    base.bU = num(pp["@_bU"]);
    base.cU = num(pp["@_cU"]);
    base.dU = num(pp["@_dU"]);
    base.aV = num(pp["@_aV"]);
    base.bV = num(pp["@_bV"]);
    base.cV = num(pp["@_cV"]);
    base.dV = num(pp["@_dV"]);
    base.pRange = str(pp["@_pRange"], "arcLength") as
      | "arcLength"
      | "normalized";
  }

  return base;
}

// ─── Elevation Profile ───────────────────────────────────────────

function parseElevationProfile(
  ep: Record<string, unknown> | undefined,
): ElevationElement[] {
  if (!ep) {
    return [];
  }
  return ensureArray(ep.elevation).map((e: Rec) => ({
    s: num(e["@_s"]),
    a: num(e["@_a"]),
    b: num(e["@_b"]),
    c: num(e["@_c"]),
    d: num(e["@_d"]),
  }));
}

// ─── Lanes ───────────────────────────────────────────────────────

function parseLanes(
  lanesEl: Record<string, unknown> | undefined,
): LaneSection[] {
  if (!lanesEl) {
    return [];
  }
  return ensureArray(lanesEl.laneSection).map(parseLaneSection);
}

function parseLaneSection(ls: Record<string, unknown>): LaneSection {
  const lanes: Lane[] = [];

  // Parse left, center, and right lane groups
  const left = ls.left as Record<string, unknown> | undefined;
  const center = ls.center as Record<string, unknown> | undefined;
  const right = ls.right as Record<string, unknown> | undefined;

  if (left) {
    ensureArray(left.lane).forEach((l) => lanes.push(parseLane(l)));
  }
  if (center) {
    ensureArray(center.lane).forEach((l) => lanes.push(parseLane(l)));
  }
  if (right) {
    ensureArray(right.lane).forEach((l) => lanes.push(parseLane(l)));
  }

  return {
    s: num(ls["@_s"]),
    lanes,
  };
}

function parseLane(l: Rec): Lane {
  return {
    id: num(l["@_id"]),
    type: str(l["@_type"], "driving") as LaneType,
    level: l["@_level"] === true || l["@_level"] === "true",
    width: ensureArray(l.width).map(parseLaneWidth),
    roadMark: ensureArray(l.roadMark).map(parseRoadMark),
    link: parseLaneLink(l.link as Record<string, unknown> | undefined),
  };
}

function parseLaneWidth(w: Rec): LaneWidth {
  return {
    sOffset: num(w["@_sOffset"]),
    a: num(w["@_a"]),
    b: num(w["@_b"]),
    c: num(w["@_c"]),
    d: num(w["@_d"]),
  };
}

function parseRoadMark(rm: Rec): RoadMark {
  return {
    sOffset: num(rm["@_sOffset"]),
    type: str(rm["@_type"], "none") as RoadMarkType,
    weight: str(rm["@_weight"], "standard") as "standard" | "bold",
    color: str(rm["@_color"], "standard") as RoadMark["color"],
    width: num(rm["@_width"], 0.12),
    laneChange: str(rm["@_laneChange"], "none") as RoadMark["laneChange"],
  };
}

function parseLaneLink(
  link: Record<string, unknown> | undefined,
): LaneLink {
  if (!link) {
    return {};
  }
  const pred = link.predecessor as Record<string, unknown> | undefined;
  const succ = link.successor as Record<string, unknown> | undefined;
  return {
    predecessor: pred ? num(pred["@_id"]) : undefined,
    successor: succ ? num(succ["@_id"]) : undefined,
  };
}

// ─── Junctions ───────────────────────────────────────────────────

function parseJunction(j: Record<string, unknown>): Junction {
  return {
    id: str(j["@_id"]),
    name: str(j["@_name"]),
    connections: ensureArray(j.connection).map(parseJunctionConnection),
  };
}

function parseJunctionConnection(c: Rec): JunctionConnection {
  return {
    id: str(c["@_id"]),
    incomingRoad: str(c["@_incomingRoad"]),
    connectingRoad: str(c["@_connectingRoad"]),
    contactPoint: str(c["@_contactPoint"], "start") as "start" | "end",
    laneLinks: ensureArray(c.laneLink).map((ll: Rec) => ({
      from: num(ll["@_from"]),
      to: num(ll["@_to"]),
    })),
  };
}
