/**
 * Tests for the OpenDRIVE XML parser.
 */
import * as fs from "fs";
import * as path from "path";

import { parseOpenDriveXml } from "../../src/parser/parseOpenDriveXml";

describe("parseOpenDriveXml", () => {
  describe("straight_500m.xodr", () => {
    const xmlContent = fs.readFileSync(
      path.join(__dirname, "fixtures", "straight_500m.xodr"),
      "utf-8",
    );

    it("should parse without errors", () => {
      expect(() => parseOpenDriveXml(xmlContent)).not.toThrow();
    });

    it("should parse the header", () => {
      const map = parseOpenDriveXml(xmlContent);
      expect(map.header.revMajor).toBe(1);
      expect(map.header.revMinor).toBeGreaterThanOrEqual(4);
    });

    it("should parse roads", () => {
      const map = parseOpenDriveXml(xmlContent);
      expect(map.roads.length).toBeGreaterThan(0);
    });

    it("should parse road geometry", () => {
      const map = parseOpenDriveXml(xmlContent);
      const road = map.roads[0]!;
      expect(road.planView.length).toBeGreaterThan(0);
      // Straight road should have a line geometry
      const geom = road.planView[0]!;
      expect(geom.type).toBe("line");
      expect(geom.length).toBeGreaterThan(0);
    });

    it("should parse lane sections with lanes", () => {
      const map = parseOpenDriveXml(xmlContent);
      const road = map.roads[0]!;
      expect(road.lanes.length).toBeGreaterThan(0);

      const section = road.lanes[0]!;
      expect(section.lanes.length).toBeGreaterThan(0);

      // Should have driving lanes
      const drivingLanes = section.lanes.filter(
        (l) => l.type === "driving",
      );
      expect(drivingLanes.length).toBeGreaterThan(0);
    });

    it("should parse lane width polynomials", () => {
      const map = parseOpenDriveXml(xmlContent);
      const road = map.roads[0]!;
      const section = road.lanes[0]!;
      const drivingLane = section.lanes.find(
        (l) => l.type === "driving",
      );
      expect(drivingLane).toBeDefined();
      expect(drivingLane!.width.length).toBeGreaterThan(0);
      expect(drivingLane!.width[0]!.a).toBeGreaterThan(0);
    });
  });

  describe("fabriksgatan.xodr", () => {
    const xmlContent = fs.readFileSync(
      path.join(__dirname, "fixtures", "fabriksgatan.xodr"),
      "utf-8",
    );

    it("should parse without errors", () => {
      expect(() => parseOpenDriveXml(xmlContent)).not.toThrow();
    });

    it("should find multiple roads", () => {
      const map = parseOpenDriveXml(xmlContent);
      expect(map.roads.length).toBeGreaterThan(1);
    });

    it("should find junctions", () => {
      const map = parseOpenDriveXml(xmlContent);
      expect(map.junctions.length).toBeGreaterThan(0);
    });

    it("should parse junction connections", () => {
      const map = parseOpenDriveXml(xmlContent);
      const junction = map.junctions[0]!;
      expect(junction.connections.length).toBeGreaterThan(0);
      expect(junction.connections[0]!.incomingRoad).toBeTruthy();
      expect(junction.connections[0]!.connectingRoad).toBeTruthy();
    });

    it("should parse paramPoly3 geometry", () => {
      const map = parseOpenDriveXml(xmlContent);
      const paramPoly3Roads = map.roads.filter((r) =>
        r.planView.some((g) => g.type === "paramPoly3"),
      );
      expect(paramPoly3Roads.length).toBeGreaterThan(0);
    });

    it("should parse multiple lane types", () => {
      const map = parseOpenDriveXml(xmlContent);
      const allTypes = new Set<string>();
      for (const road of map.roads) {
        for (const section of road.lanes) {
          for (const lane of section.lanes) {
            allTypes.add(lane.type);
          }
        }
      }
      // Urban road should have at least driving and sidewalk or border
      expect(allTypes.size).toBeGreaterThan(1);
    });
  });

  describe("e6mini.xodr (georeference)", () => {
    const xmlContent = fs.readFileSync(
      path.join(__dirname, "fixtures", "e6mini.xodr"),
      "utf-8",
    );

    it("should parse without errors", () => {
      expect(() => parseOpenDriveXml(xmlContent)).not.toThrow();
    });

    it("should parse geo reference string", () => {
      const map = parseOpenDriveXml(xmlContent);
      expect(map.header.geoReference).toContain("proj");
    });
  });

  describe("error handling", () => {
    it("should throw on empty XML", () => {
      expect(() => parseOpenDriveXml("")).toThrow();
    });

    it("should throw on non-OpenDRIVE XML", () => {
      expect(() =>
        parseOpenDriveXml("<root><child/></root>"),
      ).toThrow("Invalid OpenDRIVE XML");
    });

    it("should handle minimal valid OpenDRIVE", () => {
      const minimal = `<?xml version="1.0"?>
        <OpenDRIVE>
          <header revMajor="1" revMinor="4" name="test"/>
        </OpenDRIVE>`;
      const map = parseOpenDriveXml(minimal);
      expect(map.roads).toEqual([]);
      expect(map.junctions).toEqual([]);
      expect(map.header.name).toBe("test");
    });
  });
});
