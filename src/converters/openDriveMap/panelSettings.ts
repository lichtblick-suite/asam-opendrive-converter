/**
 * Panel settings for the OpenDRIVE map converter.
 *
 * [FG-SCENE] Panel settings allow user control over rendering parameters
 * without requiring re-parse of the map data.
 */

import type { PanelSettings, SettingsTreeAction } from "@lichtblick/suite";

import type { OpenDriveConverterSettings } from "./context";
import { DEFAULT_SETTINGS } from "./context";

/** Generate panel settings for the 3D and Image panels (toggle layers, tessellation). */
export function generateOpenDrive3DPanelSettings(): PanelSettings<OpenDriveConverterSettings> {
  return {
    settings: (config: OpenDriveConverterSettings | undefined) => ({
      fields: {
        showLaneSurfaces: {
          label: "Show Lane Surfaces",
          input: "boolean" as const,
          value: config?.showLaneSurfaces ?? DEFAULT_SETTINGS.showLaneSurfaces,
        },
        showLaneBoundaries: {
          label: "Show Lane Boundaries",
          input: "boolean" as const,
          value:
            config?.showLaneBoundaries ?? DEFAULT_SETTINGS.showLaneBoundaries,
        },
        showRoadMarkings: {
          label: "Show Road Markings",
          input: "boolean" as const,
          value: config?.showRoadMarkings ?? DEFAULT_SETTINGS.showRoadMarkings,
        },
        showRoadObjects: {
          label: "Show Road Objects",
          input: "boolean" as const,
          value: config?.showRoadObjects ?? DEFAULT_SETTINGS.showRoadObjects,
        },
        showRoadSignals: {
          label: "Show Road Signals",
          input: "boolean" as const,
          value: config?.showRoadSignals ?? DEFAULT_SETTINGS.showRoadSignals,
        },
        stepSize: {
          label: "Tessellation Tolerance (m)",
          input: "number" as const,
          value: config?.stepSize ?? DEFAULT_SETTINGS.stepSize,
          min: 0.01,
          max: 5.0,
          step: 0.01,
        },
      },
    }),
    handler: (
      action: SettingsTreeAction,
      config?: OpenDriveConverterSettings,
    ) => {
      if (action.action !== "update" || !config) {
        return;
      }
      const field = action.payload.path[2];
      if (field == undefined) {
        return;
      }
      switch (field) {
        case "showLaneSurfaces":
          config.showLaneSurfaces = action.payload.value as boolean;
          break;
        case "showLaneBoundaries":
          config.showLaneBoundaries = action.payload.value as boolean;
          break;
        case "showRoadMarkings":
          config.showRoadMarkings = action.payload.value as boolean;
          break;
        case "showRoadObjects":
          config.showRoadObjects = action.payload.value as boolean;
          break;
        case "showRoadSignals":
          config.showRoadSignals = action.payload.value as boolean;
          break;
        case "stepSize":
          config.stepSize = action.payload.value as number;
          break;
        default:
          break;
      }
    },
    defaultConfig: DEFAULT_SETTINGS,
  };
}
