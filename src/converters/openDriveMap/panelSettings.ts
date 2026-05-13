/**
 * Panel settings for the OpenDRIVE map converter.
 */

import type { OpenDriveConverterSettings } from "./context";
import { DEFAULT_SETTINGS } from "./context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateOpenDrive3DPanelSettings(): any {
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
        stepSize: {
          label: "Tessellation Step Size (m)",
          input: "number" as const,
          value: config?.stepSize ?? DEFAULT_SETTINGS.stepSize,
          min: 0.1,
          max: 10,
          step: 0.1,
        },
      },
    }),
    handler: (
      action: { action: string; payload: { path: string[]; value: unknown } },
      config: OpenDriveConverterSettings,
    ) => {
      if (action.action !== "update") {
        return;
      }
      const field = action.payload.path[2];
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
        case "stepSize":
          config.stepSize = action.payload.value as number;
          break;
      }
    },
    defaultConfig: DEFAULT_SETTINGS,
  };
}
