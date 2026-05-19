/**
 * Lazy-loading wrapper for the libOpenDRIVE WASM module.
 * Loads the module on first use and caches the instance.
 */

import type { LibOpenDRIVEModule, CreateLibOpenDRIVE } from "./types";

let modulePromise: Promise<LibOpenDRIVEModule> | undefined;

/**
 * Get the libOpenDRIVE WASM module instance (lazy-loaded, cached).
 * The WASM binary (~300-500KB) is loaded on first call only.
 */
export async function getLibOpenDRIVE(): Promise<LibOpenDRIVEModule> {
  modulePromise ??= loadModule();
  return await modulePromise;
}

async function loadModule(): Promise<LibOpenDRIVEModule> {
  // Dynamic import of the Emscripten-generated JS loader

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
} from "./types";
