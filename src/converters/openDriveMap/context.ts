/**
 * Converter context: holds cached SceneUpdate for the static map.
 *
 * [OMEGA] The map is published once and never changes within a recording.
 * [FG-ENTITY] Entities with lifetime={0,0} persist until replaced — so we
 *   only need to generate them once per unique (map_reference, xml_hash, settings) tuple.
 */

import type { PartialSceneEntity } from "../../utils/scene";

export interface OpenDriveConverterSettings {
  showLaneSurfaces: boolean;
  showLaneBoundaries: boolean;
  showRoadMarkings: boolean;
  showRoadObjects: boolean;
  showRoadSignals: boolean;
  /** Chord error tolerance in meters [libODR eps parameter].
   *  Smaller = more vertices = higher fidelity. Default 0.1m. */
  stepSize: number;
}

export const DEFAULT_SETTINGS: OpenDriveConverterSettings = {
  showLaneSurfaces: true,
  showLaneBoundaries: true,
  showRoadMarkings: true,
  showRoadObjects: true,
  showRoadSignals: true,
  stepSize: 0.1,
};

/**
 * FNV-1a 32-bit hash for fast string fingerprinting.
 * Used to detect XML content changes without storing the full string.
 */
export function hashString(str: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return (hash >>> 0).toString(16);
}

export interface OpenDriveConverterContext {
  cachedEntities: PartialSceneEntity[] | undefined;
  previousMapReference: string | undefined;
  previousXmlHash: string | undefined;
  previousSettingsHash: string | undefined;
}

/** Create a fresh converter context with empty cache. */
export function createOpenDriveConverterContext(): OpenDriveConverterContext {
  return {
    cachedEntities: undefined,
    previousMapReference: undefined,
    previousXmlHash: undefined,
    previousSettingsHash: undefined,
  };
}
