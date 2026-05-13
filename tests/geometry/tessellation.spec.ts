/**
 * Tests for triangle mesh tessellation.
 */

import {
  tessellateLaneStrip,
  flattenTriangleMesh,
} from "../../src/geometry/tessellation";
import type { Vec3 } from "../../src/parser/types";

describe("tessellateLaneStrip", () => {
  it("should return empty mesh for insufficient points", () => {
    const inner: Vec3[] = [{ x: 0, y: 0, z: 0 }];
    const outer: Vec3[] = [{ x: 0, y: 1, z: 0 }];
    const mesh = tessellateLaneStrip(inner, outer);
    expect(mesh.vertices.length).toBe(0);
    expect(mesh.indices.length).toBe(0);
  });

  it("should create 2 triangles for a single quad", () => {
    const inner: Vec3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
    ];
    const outer: Vec3[] = [
      { x: 0, y: 3.5, z: 0 },
      { x: 10, y: 3.5, z: 0 },
    ];
    const mesh = tessellateLaneStrip(inner, outer);
    expect(mesh.vertices.length).toBe(4 * 3); // 4 vertices × 3 floats
    expect(mesh.indices.length).toBe(6); // 2 triangles × 3 indices
  });

  it("should create correct number of triangles for N points", () => {
    const n = 10;
    const inner: Vec3[] = [];
    const outer: Vec3[] = [];
    for (let i = 0; i < n; i++) {
      inner.push({ x: i, y: 0, z: 0 });
      outer.push({ x: i, y: 3.5, z: 0 });
    }
    const mesh = tessellateLaneStrip(inner, outer);
    // (n-1) quads × 2 triangles × 3 indices
    expect(mesh.indices.length).toBe((n - 1) * 6);
    // n × 2 vertices × 3 floats
    expect(mesh.vertices.length).toBe(n * 2 * 3);
  });
});

describe("flattenTriangleMesh", () => {
  it("should flatten indexed triangles to flat position array", () => {
    const inner: Vec3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
    ];
    const outer: Vec3[] = [
      { x: 0, y: 3.5, z: 0 },
      { x: 10, y: 3.5, z: 0 },
    ];
    const mesh = tessellateLaneStrip(inner, outer);
    const flat = flattenTriangleMesh(mesh);
    // 2 triangles × 3 vertices × 3 floats = 18
    expect(flat.length).toBe(18);
  });
});
