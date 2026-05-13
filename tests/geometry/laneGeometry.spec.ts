/**
 * Tests for lane geometry computation.
 */

import { evaluateLaneWidth } from "../../src/geometry/laneGeometry";
import type { LaneWidth } from "../../src/parser/types";

describe("evaluateLaneWidth", () => {
  it("should return 0 for empty entries", () => {
    expect(evaluateLaneWidth([], 10)).toBe(0);
  });

  it("should evaluate constant width", () => {
    const entries: LaneWidth[] = [{ sOffset: 0, a: 3.5, b: 0, c: 0, d: 0 }];
    expect(evaluateLaneWidth(entries, 50)).toBeCloseTo(3.5, 6);
  });

  it("should evaluate linearly varying width", () => {
    const entries: LaneWidth[] = [{ sOffset: 0, a: 3.0, b: 0.01, c: 0, d: 0 }];
    expect(evaluateLaneWidth(entries, 100)).toBeCloseTo(4.0, 5);
  });

  it("should handle multiple width entries", () => {
    const entries: LaneWidth[] = [
      { sOffset: 0, a: 3.5, b: 0, c: 0, d: 0 },
      { sOffset: 50, a: 4.0, b: 0, c: 0, d: 0 },
    ];
    expect(evaluateLaneWidth(entries, 25)).toBeCloseTo(3.5, 6);
    expect(evaluateLaneWidth(entries, 75)).toBeCloseTo(4.0, 6);
  });
});
