/**
 * Converter context: holds cached SceneUpdate for the static map.
 *
 * [OMEGA] The map is published once and never changes within a recording.
 * [FG-ENTITY] Entities with lifetime={0,0} persist until replaced — so we
 *   only need to generate them once per unique (map_reference, settings) pair.
 */

import type { PartialSceneEntity } from "../../utils/scene";

export interface OpenDriveConverterSettings {
  showLaneSurfaces: boolean;
  showLaneBoundaries: boolean;
  showRoadMarkings: boolean;
  /** Chord error tolerance in meters [libODR eps parameter].
   *  Smaller = more vertices = higher fidelity. Default 0.1m. */
  stepSize: number;
}

export const DEFAULT_SETTINGS: OpenDriveConverterSettings = {
  showLaneSurfaces: true,
  showLaneBoundaries: true,
  showRoadMarkings: true,
  stepSize: 0.1,
};

export interface OpenDriveConverterContext {
  cachedEntities: PartialSceneEntity[] | undefined;
  previousMapReference: string | undefined;
  previousSettingsHash: string | undefined;
}

export function createOpenDriveConverterContext(): OpenDriveConverterContext {
  return {
    cachedEntities: undefined,
    previousMapReference: undefined,
    previousSettingsHash: undefined,
  };
}
