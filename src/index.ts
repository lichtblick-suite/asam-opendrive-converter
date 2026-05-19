/**
 * ASAM OpenDRIVE Converter — Lichtblick Extension Entry Point
 *
 * Registers a message converter that transforms osi3.MapAsamOpenDrive messages
 * (from OMEGA PRIME MCAP recordings) into foxglove.SceneUpdate for 3D visualization.
 */

import type { ExtensionContext, PanelSettings } from "@lichtblick/suite";

import {
  generateOpenDrive3DPanelSettings,
  registerOpenDriveMapConverter,
} from "./converters";
import type { MapAsamOpenDrive } from "./utils/proto";

export function activate(extensionContext: ExtensionContext): void {
  const openDriveConverter = registerOpenDriveMapConverter();
  const settings = generateOpenDrive3DPanelSettings() as PanelSettings<unknown>;

  extensionContext.registerMessageConverter<MapAsamOpenDrive>({
    fromSchemaName: "osi3.MapAsamOpenDrive",
    toSchemaName: "foxglove.SceneUpdate",
    converter: openDriveConverter,
    panelSettings: {
      "3D": settings,
      Image: settings,
    },
    supportsLatestPerRenderTick: true,
  });
}
