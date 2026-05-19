import {
  GLOBAL_FRAME_ID,
  LANE_COLORS,
  ROAD_MARK_COLORS,
} from "@config/constants";
import { DEFAULT_SETTINGS } from "@converters/openDriveMap/context";

describe("constants", () => {
  it("defines colors for all standard lane types", () => {
    const requiredTypes = [
      "driving",
      "stop",
      "shoulder",
      "biking",
      "sidewalk",
      "border",
      "parking",
      "median",
      "none",
    ];
    for (const type of requiredTypes) {
      expect(LANE_COLORS[type]).toBeDefined();
      expect(LANE_COLORS[type]!.a).toBeGreaterThan(0);
    }
  });

  it("defines colors for all ODR §11.8 road mark colors", () => {
    const requiredColors = [
      "standard",
      "white",
      "yellow",
      "blue",
      "green",
      "red",
      "orange",
      "violet",
      "black",
    ];
    for (const color of requiredColors) {
      expect(ROAD_MARK_COLORS[color]).toBeDefined();
    }
  });

  it("uses 'global' as the frame ID per ODR §8.2", () => {
    expect(GLOBAL_FRAME_ID).toBe("global");
  });
});

describe("default settings", () => {
  it("enables all rendering layers by default", () => {
    expect(DEFAULT_SETTINGS.showLaneSurfaces).toBe(true);
    expect(DEFAULT_SETTINGS.showLaneBoundaries).toBe(true);
    expect(DEFAULT_SETTINGS.showRoadMarkings).toBe(true);
    expect(DEFAULT_SETTINGS.showRoadObjects).toBe(true);
    expect(DEFAULT_SETTINGS.showRoadSignals).toBe(true);
  });

  it("uses 0.1m default tessellation tolerance", () => {
    expect(DEFAULT_SETTINGS.stepSize).toBe(0.1);
  });
});
