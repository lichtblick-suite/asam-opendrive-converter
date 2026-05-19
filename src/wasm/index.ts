/**
 * Lazy-loading wrapper for the libOpenDRIVE WASM module.
 * Loads the module on first use and caches the instance.
 *
 * [libODR] The WASM binary (~400-500KB) contains the full libOpenDRIVE C++
 *   library compiled via Emscripten. It handles all OpenDRIVE geometry
 *   computation natively — no TypeScript geometry reimplementation needed.
 * [EMB] Module is ES module format (-sEXPORT_ES6=1 -sMODULARIZE=1)
 */

import type { LibOpenDRIVEModule, CreateLibOpenDRIVE } from "./types";

let modulePromise: Promise<LibOpenDRIVEModule> | undefined;

/**
 * Get the libOpenDRIVE WASM module instance (lazy-loaded, cached singleton).
 * If loading fails, the next call will retry.
 */
export async function getLibOpenDRIVE(): Promise<LibOpenDRIVEModule> {
  modulePromise ??= loadModule().catch((err: unknown) => {
    modulePromise = undefined;
    throw err;
  });
  return await modulePromise;
}

async function loadModule(): Promise<LibOpenDRIVEModule> {
  const createModule = (await import(
    /* webpackChunkName: "libOpenDRIVE" */
    "./libOpenDRIVE.js"
  )) as { default: CreateLibOpenDRIVE };

  const module = await createModule.default();
  return module;
}

export {
  type LibOpenDRIVEModule,
  type OpenDriveMap,
  type RoadNetworkMesh,
  type LanesMesh,
  type RoadmarksMesh,
} from "./types";
