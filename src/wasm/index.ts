/**
 * WASM module loader for libOpenDRIVE (cached singleton).
 * Called eagerly at converter registration (activate()) to avoid
 * races where the first map message arrives before WASM is ready.
 *
 * [libODR] The WASM binary (~400-500KB) contains the full libOpenDRIVE C++
 *   library compiled via Emscripten. It handles all OpenDRIVE geometry
 *   computation natively — no TypeScript geometry reimplementation needed.
 * [EMB] Module is ES module format (-sEXPORT_ES6=1 -sMODULARIZE=1)
 */

import type { LibOpenDRIVEModule, CreateLibOpenDRIVE } from "./types";

let modulePromise: Promise<LibOpenDRIVEModule> | undefined;

/**
 * Get the libOpenDRIVE WASM module instance (cached singleton).
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
