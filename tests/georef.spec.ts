import {
  applyGeoOffset,
  applyGeoOffsetToPoints,
  areCrsEquivalent,
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

describe("applyGeoOffset", () => {
  it("should apply pure translation (hdg=0)", () => {
    const point = { x: 10, y: 20, z: 5 };
    const offset = { x: 100, y: 200, z: 10, hdg: 0 };
    const result = applyGeoOffset(point, offset);
    expect(result.x).toBeCloseTo(110);
    expect(result.y).toBeCloseTo(220);
    expect(result.z).toBeCloseTo(15);
  });

  it("should apply rotation + translation", () => {
    // 90° rotation: (1,0) → (0,1)
    const point = { x: 1, y: 0, z: 0 };
    const offset = { x: 100, y: 200, z: 0, hdg: Math.PI / 2 };
    const result = applyGeoOffset(point, offset);
    expect(result.x).toBeCloseTo(100); // cos(90°)*1 - sin(90°)*0 + 100 = 0 + 100
    expect(result.y).toBeCloseTo(201); // sin(90°)*1 + cos(90°)*0 + 200 = 1 + 200
    expect(result.z).toBeCloseTo(0);
  });

  it("should apply the ODR §8.5 formula correctly", () => {
    // xWorld = x*cos(hdg) - y*sin(hdg) + xOffset
    // yWorld = x*sin(hdg) + y*cos(hdg) + yOffset
    const point = { x: 3, y: 4, z: 1 };
    const hdg = Math.PI / 6; // 30°
    const offset = { x: 10, y: 20, z: 2, hdg };
    const result = applyGeoOffset(point, offset);
    const cos30 = Math.cos(hdg);
    const sin30 = Math.sin(hdg);
    expect(result.x).toBeCloseTo(3 * cos30 - 4 * sin30 + 10);
    expect(result.y).toBeCloseTo(3 * sin30 + 4 * cos30 + 20);
    expect(result.z).toBeCloseTo(3);
  });
});

describe("applyGeoOffsetToPoints", () => {
  it("should mutate points in place", () => {
    const points = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
    ];
    const offset = { x: 10, y: 20, z: 5, hdg: 0 };
    applyGeoOffsetToPoints(points, offset);
    expect(points[0]).toEqual({ x: 10, y: 20, z: 5 });
    expect(points[1]).toEqual({ x: 11, y: 21, z: 6 });
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
