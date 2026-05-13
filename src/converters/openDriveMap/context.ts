/**
 * Converter context: holds cached SceneUpdate for the static map.
 */

import type { PartialSceneEntity } from "@utils/scene";

export interface OpenDriveConverterSettings {
  showLaneSurfaces: boolean;
  showLaneBoundaries: boolean;
  showRoadMarkings: boolean;
  stepSize: number;
}

export const DEFAULT_SETTINGS: OpenDriveConverterSettings = {
  showLaneSurfaces: true,
  showLaneBoundaries: true,
  showRoadMarkings: true,
  stepSize: 1.0,
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
