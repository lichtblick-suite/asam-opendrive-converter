/**
 * Mesh processing utilities for the OpenDRIVE converter.
 *
 * These functions convert Emscripten WASM mesh data into Foxglove-compatible
 * JavaScript arrays. Extracted for testability and reuse.
 */

import type { Point3 } from "../../utils/scene";
import type { EmscriptenVector, Vec3D } from "../../wasm/types";

/**
 * Extract all Vec3D vertices from an Emscripten vector into a JS Point3 array.
 * Applies an optional z-offset (for z-fighting prevention between coplanar layers).
 */
export function extractVertices(
  vertices: EmscriptenVector<Vec3D>,
  zOffset = 0,
): Point3[] {
  const count = vertices.size();
  const result: Point3[] = new Array<Point3>(count);
  for (let i = 0; i < count; i++) {
    const v = vertices.get(i);
    result[i] = { x: v[0], y: v[1], z: v[2] + zOffset };
  }
  return result;
}

/**
 * Remap a global vertex index to a local (per-entity) index.
 * If the vertex hasn't been seen before, adds it to localPoints and records the mapping.
 * Returns undefined if globalIdx is out of bounds (corrupt WASM data).
 */
export function remapVertex(
  globalIdx: number,
  remap: Map<number, number>,
  allPoints: Point3[],
  localPoints: Point3[],
): number | undefined {
  let localIdx = remap.get(globalIdx);
  if (localIdx == undefined) {
    const point = allPoints[globalIdx];
    if (point == undefined) {
      return undefined;
    }
    localIdx = localPoints.length;
    localPoints.push(point);
    remap.set(globalIdx, localIdx);
  }
  return localIdx;
}

/** Convert an Emscripten vector<string> to a JS Set<string> */
export function vectorToSet(vec: EmscriptenVector<string>): Set<string> {
  const set = new Set<string>();
  const n = vec.size();
  for (let i = 0; i < n; i++) {
    set.add(vec.get(i));
  }
  return set;
}

/**
 * A triangle defined by 3 global vertex indices.
 */
export interface Triangle {
  i0: number;
  i1: number;
  i2: number;
}

/**
 * Partition all triangle indices into per-chunk buckets in O(N) time.
 *
 * Given sorted chunk start indices (from Emscripten map keys) and a total vertex count,
 * assigns each triangle to the chunk that contains its first vertex (i0).
 * libOpenDRIVE guarantees that all 3 vertices of a triangle belong to the same chunk.
 *
 * @param indices - Emscripten vector of triangle indices (groups of 3)
 * @param chunkStarts - sorted array of chunk start vertex indices
 * @param totalVertices - total number of vertices (defines the end of the last chunk)
 * @returns Map from chunk start index to array of triangles belonging to that chunk
 */
export function partitionIndicesByChunk(
  indices: EmscriptenVector<number>,
  chunkStarts: number[],
  totalVertices: number,
): Map<number, Triangle[]> {
  const result = new Map<number, Triangle[]>();
  const numIndices = indices.size();

  if (chunkStarts.length === 0 || numIndices === 0) {
    return result;
  }

  // Pre-initialize empty arrays for each chunk
  for (const start of chunkStarts) {
    result.set(start, []);
  }

  // Build a lookup: for each vertex index, find its chunk using binary search
  for (let i = 0; i + 2 < numIndices; i += 3) {
    const i0 = indices.get(i);
    const i1 = indices.get(i + 1);
    const i2 = indices.get(i + 2);

    // Binary search: find the chunk index that contains i0
    const chunkIdx = findChunkIndex(i0, chunkStarts, totalVertices);
    if (chunkIdx < 0) {
      continue; // vertex out of range — skip corrupt triangle
    }

    // Verify all 3 vertices belong to the same chunk (fast bounds check)
    const chunkStart = chunkStarts[chunkIdx]!;
    const chunkEnd = chunkStarts[chunkIdx + 1] ?? totalVertices;
    if (
      i1 < chunkStart ||
      i1 >= chunkEnd ||
      i2 < chunkStart ||
      i2 >= chunkEnd
    ) {
      continue; // cross-chunk triangle — should not happen with libOpenDRIVE
    }

    result.get(chunkStart)!.push({ i0, i1, i2 });
  }

  return result;
}

/**
 * Binary search to find which chunk index a vertex belongs to.
 * Returns the chunk array index (not the start value), or -1 if out of bounds.
 */
function findChunkIndex(
  vertexIdx: number,
  chunkStarts: number[],
  totalVertices: number,
): number {
  if (vertexIdx < 0 || vertexIdx >= totalVertices) {
    return -1;
  }

  let lo = 0;
  let hi = chunkStarts.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const midStart = chunkStarts[mid]!;
    const nextStart = chunkStarts[mid + 1] ?? totalVertices;

    if (vertexIdx >= midStart && vertexIdx < nextStart) {
      return mid;
    } else if (vertexIdx < midStart) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return -1;
}

/**
 * Extract chunk start keys from an Emscripten keys vector into a sorted JS array.
 */
export function extractChunkKeys(keys: EmscriptenVector<number>): number[] {
  const count = keys.size();
  const result: number[] = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    result[i] = keys.get(i);
  }
  return result;
}
