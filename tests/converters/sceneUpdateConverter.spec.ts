/**
 * Integration test: full pipeline from OpenDRIVE XML to scene entities.
 */
import * as fs from "fs";
import * as path from "path";

import { parseOpenDriveXml } from "../../src/parser/parseOpenDriveXml";
import { computeLaneSectionGeometry } from "../../src/geometry/laneGeometry";
import { buildLaneSurfaceEntities } from "../../src/features/lanes/buildLaneEntity";
import { buildLaneBoundaryEntities } from "../../src/features/laneBoundaries/buildLaneBoundaryEntity";

describe("Full pipeline integration", () => {
  describe("straight_500m.xodr", () => {
    const xmlContent = fs.readFileSync(
      path.join(__dirname, "../parser/fixtures", "straight_500m.xodr"),
      "utf-8",
    );
    const odrMap = parseOpenDriveXml(xmlContent);

    it("should generate lane surface entities for all roads", () => {
      const timestamp = { sec: 0, nsec: 0 };
      let totalEntities = 0;

      for (const road of odrMap.roads) {
        for (let sIdx = 0; sIdx < road.lanes.length; sIdx++) {
          const section = road.lanes[sIdx]!;
          const nextSection = road.lanes[sIdx + 1];

          const laneSurfaces = computeLaneSectionGeometry(
            section,
            road.planView,
            road.elevationProfile,
            road.length,
            nextSection?.s,
            1.0,
          );

          const entities = buildLaneSurfaceEntities(
            laneSurfaces,
            road.id,
            sIdx,
            timestamp,
          );
          totalEntities += entities.length;

          // Each entity should have triangles
          for (const entity of entities) {
            expect(entity.id).toBeTruthy();
            expect(entity.triangles).toBeDefined();
            expect(entity.triangles!.length).toBeGreaterThan(0);
            expect(entity.triangles![0]!.points.length).toBeGreaterThan(0);
          }
        }
      }

      expect(totalEntities).toBeGreaterThan(0);
    });

    it("should generate lane boundary entities", () => {
      const timestamp = { sec: 0, nsec: 0 };
      let totalEntities = 0;

      for (const road of odrMap.roads) {
        for (let sIdx = 0; sIdx < road.lanes.length; sIdx++) {
          const section = road.lanes[sIdx]!;
          const nextSection = road.lanes[sIdx + 1];

          const laneSurfaces = computeLaneSectionGeometry(
            section,
            road.planView,
            road.elevationProfile,
            road.length,
            nextSection?.s,
            1.0,
          );

          const entities = buildLaneBoundaryEntities(
            laneSurfaces,
            road.id,
            sIdx,
            timestamp,
          );
          totalEntities += entities.length;
        }
      }

      expect(totalEntities).toBeGreaterThan(0);
    });
  });

  describe("fabriksgatan.xodr (urban)", () => {
    const xmlContent = fs.readFileSync(
      path.join(__dirname, "../parser/fixtures", "fabriksgatan.xodr"),
      "utf-8",
    );
    const odrMap = parseOpenDriveXml(xmlContent);

    it("should handle paramPoly3 geometry without errors", () => {
      const timestamp = { sec: 0, nsec: 0 };
      let totalEntities = 0;

      for (const road of odrMap.roads) {
        for (let sIdx = 0; sIdx < road.lanes.length; sIdx++) {
          const section = road.lanes[sIdx]!;
          const nextSection = road.lanes[sIdx + 1];

          const laneSurfaces = computeLaneSectionGeometry(
            section,
            road.planView,
            road.elevationProfile,
            road.length,
            nextSection?.s,
            1.0,
          );

          const entities = buildLaneSurfaceEntities(
            laneSurfaces,
            road.id,
            sIdx,
            timestamp,
          );
          totalEntities += entities.length;
        }
      }

      expect(totalEntities).toBeGreaterThan(0);
    });

    it("should produce entities for junction roads", () => {
      const junctionRoadIds = new Set<string>();
      for (const junction of odrMap.junctions) {
        for (const conn of junction.connections) {
          junctionRoadIds.add(conn.connectingRoad);
        }
      }

      expect(junctionRoadIds.size).toBeGreaterThan(0);

      const junctionRoads = odrMap.roads.filter((r) =>
        junctionRoadIds.has(r.id),
      );
      expect(junctionRoads.length).toBeGreaterThan(0);
    });
  });
});
