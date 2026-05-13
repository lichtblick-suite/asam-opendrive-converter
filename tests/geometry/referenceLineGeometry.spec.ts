/**
 * Tests for reference line geometry evaluation.
 */

import {
  evaluateReferenceLineAtS,
  evaluateElevation,
  offsetPoint,
} from "../../src/geometry/referenceLineGeometry";
import type { GeometryElement, ElevationElement } from "../../src/parser/types";

describe("evaluateReferenceLineAtS", () => {
  describe("line geometry", () => {
    const planView: GeometryElement[] = [
      { s: 0, x: 0, y: 0, hdg: 0, length: 100, type: "line" },
    ];

    it("should evaluate at s=0", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 0);
      expect(pose.x).toBeCloseTo(0, 6);
      expect(pose.y).toBeCloseTo(0, 6);
      expect(pose.hdg).toBeCloseTo(0, 6);
    });

    it("should evaluate at s=50 (midpoint)", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 50);
      expect(pose.x).toBeCloseTo(50, 5);
      expect(pose.y).toBeCloseTo(0, 5);
    });

    it("should evaluate at s=100 (end)", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 100);
      expect(pose.x).toBeCloseTo(100, 5);
      expect(pose.y).toBeCloseTo(0, 5);
    });
  });

  describe("line geometry with heading", () => {
    const planView: GeometryElement[] = [
      {
        s: 0,
        x: 10,
        y: 20,
        hdg: Math.PI / 4,
        length: 100,
        type: "line",
      },
    ];

    it("should follow heading direction", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 50);
      const expected_x = 10 + 50 * Math.cos(Math.PI / 4);
      const expected_y = 20 + 50 * Math.sin(Math.PI / 4);
      expect(pose.x).toBeCloseTo(expected_x, 4);
      expect(pose.y).toBeCloseTo(expected_y, 4);
    });
  });

  describe("arc geometry", () => {
    const radius = 100;
    const curvature = 1 / radius;
    const planView: GeometryElement[] = [
      {
        s: 0,
        x: 0,
        y: 0,
        hdg: 0,
        length: Math.PI * radius / 2, // quarter circle
        type: "arc",
        curvature,
      },
    ];

    it("should produce correct endpoint for quarter circle", () => {
      const s = Math.PI * radius / 2;
      const pose = evaluateReferenceLineAtS(planView, [], s);
      // Quarter circle: end at (R, R) for left turn
      expect(pose.x).toBeCloseTo(radius, 1);
      expect(pose.y).toBeCloseTo(radius, 1);
      expect(pose.hdg).toBeCloseTo(Math.PI / 2, 2);
    });

    it("should be at origin at s=0", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 0);
      expect(pose.x).toBeCloseTo(0, 6);
      expect(pose.y).toBeCloseTo(0, 6);
    });
  });

  describe("multi-segment road", () => {
    const planView: GeometryElement[] = [
      { s: 0, x: 0, y: 0, hdg: 0, length: 50, type: "line" },
      { s: 50, x: 50, y: 0, hdg: 0, length: 50, type: "line" },
    ];

    it("should evaluate in first segment", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 25);
      expect(pose.x).toBeCloseTo(25, 5);
    });

    it("should evaluate in second segment", () => {
      const pose = evaluateReferenceLineAtS(planView, [], 75);
      expect(pose.x).toBeCloseTo(75, 5);
    });
  });
});

describe("evaluateElevation", () => {
  it("should return 0 for empty profile", () => {
    expect(evaluateElevation([], 50)).toBe(0);
  });

  it("should evaluate constant elevation", () => {
    const profile: ElevationElement[] = [
      { s: 0, a: 5, b: 0, c: 0, d: 0 },
    ];
    expect(evaluateElevation(profile, 50)).toBeCloseTo(5, 6);
  });

  it("should evaluate linear elevation", () => {
    const profile: ElevationElement[] = [
      { s: 0, a: 0, b: 0.1, c: 0, d: 0 }, // 10% grade
    ];
    expect(evaluateElevation(profile, 100)).toBeCloseTo(10, 5);
  });
});

describe("offsetPoint", () => {
  it("should offset left from eastward heading", () => {
    const pose = { x: 10, y: 20, z: 0, hdg: 0 };
    const point = offsetPoint(pose, 3.5);
    expect(point.x).toBeCloseTo(10, 5);
    expect(point.y).toBeCloseTo(23.5, 5);
  });

  it("should offset right from eastward heading", () => {
    const pose = { x: 10, y: 20, z: 0, hdg: 0 };
    const point = offsetPoint(pose, -3.5);
    expect(point.x).toBeCloseTo(10, 5);
    expect(point.y).toBeCloseTo(16.5, 5);
  });
});
