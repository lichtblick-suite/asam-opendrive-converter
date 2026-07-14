import {
  areCrsEquivalent,
  buildProjFrameTransform,
  parseGeoReference,
} from "../src/utils/georef";

describe("parseGeoReference", () => {
  it("should extract geoReference PROJ string", () => {
    const xml = `<?xml version="1.0"?>
      <OpenDRIVE>
        <header>
          <geoReference><![CDATA[+proj=tmerc +lat_0=50.97 +lon_0=6.85 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs]]></geoReference>
        </header>
      </OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.projString).toBe(
      "+proj=tmerc +lat_0=50.97 +lon_0=6.85 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
    );
    expect(result.offset).toBeUndefined();
  });

  it("should extract geoReference without CDATA", () => {
    const xml = `<OpenDRIVE><header><geoReference>EPSG:32632</geoReference></header></OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.projString).toBe("EPSG:32632");
  });

  it("should extract offset element", () => {
    const xml = `<?xml version="1.0"?>
      <OpenDRIVE>
        <header>
          <geoReference><![CDATA[+proj=utm +zone=32]]></geoReference>
          <offset x="349210.32" y="5648717.38" z="0.0" hdg="1.5708"/>
        </header>
      </OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.projString).toBe("+proj=utm +zone=32");
    expect(result.offset).toEqual({
      x: 349210.32,
      y: 5648717.38,
      z: 0.0,
      hdg: 1.5708,
    });
  });

  it("should handle self-closing offset tag", () => {
    const xml = `<OpenDRIVE><header><offset x="100" y="200" z="5" hdg="0.1"/></header></OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.offset).toEqual({ x: 100, y: 200, z: 5, hdg: 0.1 });
  });

  it("should return undefined for missing elements", () => {
    const xml = `<OpenDRIVE><header revMajor="1" revMinor="4"></header></OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.projString).toBeUndefined();
    expect(result.offset).toBeUndefined();
  });

  it("should handle offset with default z and hdg", () => {
    const xml = `<OpenDRIVE><header><offset x="100" y="200"/></header></OpenDRIVE>`;
    const result = parseGeoReference(xml);
    expect(result.offset).toEqual({ x: 100, y: 200, z: 0, hdg: 0 });
  });
});

describe("buildProjFrameTransform", () => {
  const timestamp = { sec: 0, nsec: 0 };

  it("places proj_frame as a child of the global root frame", () => {
    const transform = buildProjFrameTransform(
      { x: 349210.32, y: 5648717.38, z: 0, hdg: 0 },
      timestamp,
    );
    expect(transform.parent_frame_id).toBe("global");
    expect(transform.child_frame_id).toBe("proj_frame");
  });

  it("inverts a pure-translation offset (hdg=0)", () => {
    const transform = buildProjFrameTransform(
      { x: 1000, y: 2000, z: 50, hdg: 0 },
      timestamp,
    );
    // With hdg=0 the inversion is simple negation
    expect(transform.translation).toEqual({ x: -1000, y: -2000, z: -50 });
    // Identity rotation
    expect(transform.rotation).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  });

  it("inverts offset with heading (matches OSI inverted-offset math)", () => {
    const hdg = 0.029;
    const tx = 349210.32;
    const ty = 5648717.38;
    const transform = buildProjFrameTransform(
      { x: tx, y: ty, z: 0, hdg },
      timestamp,
    );

    const cosH = Math.cos(hdg);
    const sinH = Math.sin(hdg);
    // t_inv = -R(-hdg) * offset
    expect(transform.translation.x).toBeCloseTo(-(tx * cosH + ty * sinH), 2);
    expect(transform.translation.y).toBeCloseTo(tx * sinH - ty * cosH, 2);
    expect(transform.translation.z).toBeCloseTo(0, 6);

    // Inverse rotation quaternion about z by -hdg
    expect(transform.rotation.z).toBeCloseTo(Math.sin(-hdg / 2), 6);
    expect(transform.rotation.w).toBeCloseTo(Math.cos(-hdg / 2), 6);
  });

  it("resolves a proj_frame point back to global coordinates", () => {
    // A map vertex at world/CRS coordinates world = R(hdg)*odr + offset
    // must resolve to its original odr coordinates in the global frame.
    const hdg = Math.PI / 6;
    const offset = { x: 10, y: 20, z: 2, hdg };
    const odr = { x: 3, y: 4, z: 1 };
    const cosH = Math.cos(hdg);
    const sinH = Math.sin(hdg);
    const world = {
      x: odr.x * cosH - odr.y * sinH + offset.x,
      y: odr.x * sinH + odr.y * cosH + offset.y,
      z: odr.z + offset.z,
    };

    const transform = buildProjFrameTransform(offset, timestamp);
    // Apply transform: p_global = R(-hdg) * world + translation
    const rx = cosH * world.x + sinH * world.y;
    const ry = -sinH * world.x + cosH * world.y;
    const pGlobal = {
      x: rx + transform.translation.x,
      y: ry + transform.translation.y,
      z: world.z + transform.translation.z,
    };
    expect(pGlobal.x).toBeCloseTo(odr.x, 6);
    expect(pGlobal.y).toBeCloseTo(odr.y, 6);
    expect(pGlobal.z).toBeCloseTo(odr.z, 6);
  });
});

describe("areCrsEquivalent", () => {
  it("should return true for identical strings", () => {
    expect(areCrsEquivalent("+proj=utm +zone=32", "+proj=utm +zone=32")).toBe(
      true,
    );
  });

  it("should return false for undefined inputs", () => {
    expect(areCrsEquivalent(undefined, "+proj=utm +zone=32")).toBe(false);
    expect(areCrsEquivalent("+proj=utm +zone=32", undefined)).toBe(false);
  });

  it("should handle whitespace differences", () => {
    expect(areCrsEquivalent(" +proj=utm +zone=32 ", "+proj=utm +zone=32")).toBe(
      true,
    );
  });
});
