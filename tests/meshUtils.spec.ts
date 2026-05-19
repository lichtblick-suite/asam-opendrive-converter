import {
  extractChunkKeys,
  extractVertices,
  partitionIndicesByChunk,
  remapVertex,
  vectorToSet,
} from "@converters/openDriveMap/meshUtils";
import type { Point3 } from "@utils/scene";

import type { EmscriptenVector, Vec3D } from "@/wasm/types";

/** Helper: create a mock EmscriptenVector from an array */
function mockVector<T>(items: T[]): EmscriptenVector<T> {
  return {
    size: () => items.length,
    get: (i: number) => items[i]!,
    push_back: (v: T) => {
      items.push(v);
    },
    delete: jest.fn(),
  };
}

describe("extractVertices", () => {
  it("converts Vec3D array to Point3 array", () => {
    const verts: Vec3D[] = [
      [1.0, 2.0, 3.0],
      [4.0, 5.0, 6.0],
    ];
    const result = extractVertices(mockVector(verts));
    expect(result).toEqual([
      { x: 1.0, y: 2.0, z: 3.0 },
      { x: 4.0, y: 5.0, z: 6.0 },
    ]);
  });

  it("applies z-offset", () => {
    const verts: Vec3D[] = [[0, 0, 1.0]];
    const result = extractVertices(mockVector(verts), 0.5);
    expect(result[0]).toEqual({ x: 0, y: 0, z: 1.5 });
  });

  it("returns empty array for empty input", () => {
    const result = extractVertices(mockVector([]));
    expect(result).toEqual([]);
  });
});

describe("remapVertex", () => {
  it("adds new vertex and returns local index 0 for first vertex", () => {
    const allPoints: Point3[] = [
      { x: 1, y: 2, z: 3 },
      { x: 4, y: 5, z: 6 },
    ];
    const localPoints: Point3[] = [];
    const remap = new Map<number, number>();

    const idx = remapVertex(0, remap, allPoints, localPoints);
    expect(idx).toBe(0);
    expect(localPoints).toHaveLength(1);
    expect(localPoints[0]).toEqual({ x: 1, y: 2, z: 3 });
  });

  it("returns same local index for already-remapped vertex", () => {
    const allPoints: Point3[] = [{ x: 1, y: 2, z: 3 }];
    const localPoints: Point3[] = [];
    const remap = new Map<number, number>();

    const idx1 = remapVertex(0, remap, allPoints, localPoints);
    const idx2 = remapVertex(0, remap, allPoints, localPoints);
    expect(idx1).toBe(0);
    expect(idx2).toBe(0);
    expect(localPoints).toHaveLength(1);
  });

  it("returns undefined for out-of-bounds index", () => {
    const allPoints: Point3[] = [{ x: 1, y: 2, z: 3 }];
    const localPoints: Point3[] = [];
    const remap = new Map<number, number>();

    const idx = remapVertex(99, remap, allPoints, localPoints);
    expect(idx).toBeUndefined();
    expect(localPoints).toHaveLength(0);
  });

  it("assigns incrementing local indices", () => {
    const allPoints: Point3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      { x: 2, y: 2, z: 2 },
    ];
    const localPoints: Point3[] = [];
    const remap = new Map<number, number>();

    expect(remapVertex(2, remap, allPoints, localPoints)).toBe(0);
    expect(remapVertex(0, remap, allPoints, localPoints)).toBe(1);
    expect(remapVertex(1, remap, allPoints, localPoints)).toBe(2);
    expect(localPoints).toHaveLength(3);
  });
});

describe("vectorToSet", () => {
  it("converts string vector to Set", () => {
    const vec = mockVector(["a", "b", "c"]);
    const result = vectorToSet(vec);
    expect(result).toEqual(new Set(["a", "b", "c"]));
  });

  it("handles duplicates", () => {
    const vec = mockVector(["a", "a", "b"]);
    const result = vectorToSet(vec);
    expect(result.size).toBe(2);
  });

  it("returns empty set for empty vector", () => {
    const vec = mockVector<string>([]);
    const result = vectorToSet(vec);
    expect(result.size).toBe(0);
  });
});

describe("extractChunkKeys", () => {
  it("converts number vector to sorted array", () => {
    const keys = mockVector([0, 10, 20, 30]);
    const result = extractChunkKeys(keys);
    expect(result).toEqual([0, 10, 20, 30]);
  });

  it("returns empty array for empty input", () => {
    const keys = mockVector<number>([]);
    const result = extractChunkKeys(keys);
    expect(result).toEqual([]);
  });
});

describe("partitionIndicesByChunk", () => {
  it("partitions triangles into correct chunks", () => {
    // 2 chunks: [0..5] and [6..11] (total 12 vertices)
    // Triangle (0,1,2) → chunk 0
    // Triangle (6,7,8) → chunk 6
    // Triangle (3,4,5) → chunk 0
    const indices = mockVector([0, 1, 2, 6, 7, 8, 3, 4, 5]);
    const chunkStarts = [0, 6];
    const totalVertices = 12;

    const result = partitionIndicesByChunk(indices, chunkStarts, totalVertices);

    expect(result.get(0)).toEqual([
      { i0: 0, i1: 1, i2: 2 },
      { i0: 3, i1: 4, i2: 5 },
    ]);
    expect(result.get(6)).toEqual([{ i0: 6, i1: 7, i2: 8 }]);
  });

  it("handles single chunk", () => {
    const indices = mockVector([0, 1, 2, 1, 2, 3]);
    const chunkStarts = [0];
    const totalVertices = 4;

    const result = partitionIndicesByChunk(indices, chunkStarts, totalVertices);
    expect(result.get(0)).toHaveLength(2);
  });

  it("returns empty map for empty indices", () => {
    const indices = mockVector<number>([]);
    const result = partitionIndicesByChunk(indices, [0, 10], 20);
    expect(result.size).toBe(0);
  });

  it("returns empty map for empty chunk starts", () => {
    const indices = mockVector([0, 1, 2]);
    const result = partitionIndicesByChunk(indices, [], 10);
    expect(result.size).toBe(0);
  });

  it("skips out-of-bounds triangles", () => {
    const indices = mockVector([0, 1, 2, 99, 100, 101]);
    const chunkStarts = [0];
    const totalVertices = 10;

    const result = partitionIndicesByChunk(indices, chunkStarts, totalVertices);
    expect(result.get(0)).toHaveLength(1);
  });

  it("skips cross-chunk triangles", () => {
    // Triangle with vertices spanning two chunks: i0=4 in chunk[0..5], i1=6 in chunk[6..11]
    const indices = mockVector([4, 6, 7]);
    const chunkStarts = [0, 6];
    const totalVertices = 12;

    const result = partitionIndicesByChunk(indices, chunkStarts, totalVertices);
    expect(result.get(0)).toHaveLength(0);
    expect(result.get(6)).toHaveLength(0);
  });

  it("handles many chunks with binary search correctly", () => {
    // 5 chunks of size 4: [0..3], [4..7], [8..11], [12..15], [16..19]
    const chunkStarts = [0, 4, 8, 12, 16];
    const totalVertices = 20;
    // One triangle in last chunk
    const indices = mockVector([16, 17, 18]);

    const result = partitionIndicesByChunk(indices, chunkStarts, totalVertices);
    expect(result.get(16)).toEqual([{ i0: 16, i1: 17, i2: 18 }]);
    expect(result.get(0)).toHaveLength(0);
    expect(result.get(4)).toHaveLength(0);
    expect(result.get(8)).toHaveLength(0);
    expect(result.get(12)).toHaveLength(0);
  });
});
