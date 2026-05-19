/**
 * Tessellate lane surfaces into indexed triangle meshes for rendering.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [FG-SCENE]  Foxglove SceneUpdate / SceneEntity Schema
 *             TriangleListPrimitive expects flat point triples (0-1-2, 3-4-5, ...)
 * [ODR §11.6.1] Lane width — defines inner/outer boundary polylines
 *
 * DESIGN DECISION: Indexed → flattened pipeline
 * Tessellation produces an indexed strip mesh (shared vertices, Uint32 indices)
 * for memory efficiency during computation, then flattenTriangleMesh() expands
 * it to the non-indexed format required by [FG-SCENE] TriangleListPrimitive.
 * The vertex duplication overhead is ~2× for quad strips, which is acceptable
 * for the lane geometry sizes encountered in practice.
 * ============================================================================
 */

import type { TriangleMesh, Vec3 } from "../parser/types";

/**
 * Tessellate a lane strip defined by inner and outer boundary polylines.
 * Produces a triangle mesh suitable for foxglove.TriangleListPrimitive.
 *
 * The strip is divided into quads (one per pair of adjacent sample points),
 * each split into two triangles.
 *
 * @param inner Inner boundary polyline (closer to reference line)
 * @param outer Outer boundary polyline (farther from reference line)
 * @returns Indexed triangle mesh
 */
export function tessellateLaneStrip(
  inner: Vec3[],
  outer: Vec3[],
): TriangleMesh {
  const n = Math.min(inner.length, outer.length);
  if (n < 2) {
    return { vertices: new Float32Array(0), indices: new Uint32Array(0) };
  }

  // 2 vertices per sample point (inner + outer), 3 floats per vertex
  const vertices = new Float32Array(n * 2 * 3);
  // 2 triangles per quad, 3 indices per triangle, (n-1) quads
  const indices = new Uint32Array((n - 1) * 6);

  // Fill vertices: interleave inner[i], outer[i]
  for (let i = 0; i < n; i++) {
    const innerPt = inner[i]!;
    const outerPt = outer[i]!;

    const vi = i * 2;
    vertices[(vi + 0) * 3 + 0] = innerPt.x;
    vertices[(vi + 0) * 3 + 1] = innerPt.y;
    vertices[(vi + 0) * 3 + 2] = innerPt.z;

    vertices[(vi + 1) * 3 + 0] = outerPt.x;
    vertices[(vi + 1) * 3 + 1] = outerPt.y;
    vertices[(vi + 1) * 3 + 2] = outerPt.z;
  }

  // Fill indices: two triangles per quad
  for (let i = 0; i < n - 1; i++) {
    const bl = i * 2; // bottom-left (inner[i])
    const br = i * 2 + 1; // bottom-right (outer[i])
    const tl = (i + 1) * 2; // top-left (inner[i+1])
    const tr = (i + 1) * 2 + 1; // top-right (outer[i+1])

    const idx = i * 6;
    // Triangle 1: bl, br, tl
    indices[idx + 0] = bl;
    indices[idx + 1] = br;
    indices[idx + 2] = tl;
    // Triangle 2: br, tr, tl
    indices[idx + 3] = br;
    indices[idx + 4] = tr;
    indices[idx + 5] = tl;
  }

  return { vertices, indices };
}

/**
 * Convert an indexed triangle mesh to a flat position array for
 * foxglove.TriangleListPrimitive (which expects non-indexed flat triangles).
 *
 * @returns Float32Array of [x0,y0,z0, x1,y1,z1, x2,y2,z2, ...] for each triangle
 */
export function flattenTriangleMesh(mesh: TriangleMesh): Float32Array {
  const numTriangles = mesh.indices.length / 3;
  const result = new Float32Array(numTriangles * 9);

  for (let t = 0; t < numTriangles; t++) {
    for (let v = 0; v < 3; v++) {
      const idx = mesh.indices[t * 3 + v]!;
      result[t * 9 + v * 3 + 0] = mesh.vertices[idx * 3 + 0]!;
      result[t * 9 + v * 3 + 1] = mesh.vertices[idx * 3 + 1]!;
      result[t * 9 + v * 3 + 2] = mesh.vertices[idx * 3 + 2]!;
    }
  }

  return result;
}
