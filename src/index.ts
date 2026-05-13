/**
 * ASAM OpenDRIVE Converter — Lichtblick Extension Entry Point
 *
 * Registers a message converter that transforms osi3.MapAsamOpenDrive messages
 * (from OMEGA PRIME MCAP recordings) into foxglove.SceneUpdate for 3D visualization.
 */

import {
  registerOpenDriveMapConverter,
  generateOpenDrive3DPanelSettings,
} from "./converters";
import { ExtensionContext } from "@lichtblick/suite";

export function activate(extensionContext: ExtensionContext): void {
  const openDriveConverter = registerOpenDriveMapConverter();

  extensionContext.registerMessageConverter({
    fromSchemaName: "osi3.MapAsamOpenDrive",
    toSchemaName: "foxglove.SceneUpdate",
    converter: openDriveConverter,
    panelSettings: {
      "3D": generateOpenDrive3DPanelSettings(),
      Image: generateOpenDrive3DPanelSettings(),
    },
    supportsLatestPerRenderTick: true,
  });
}
