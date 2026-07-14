/**
 * ASAM OpenDRIVE Converter — Lichtblick Extension Entry Point
 *
 * Registers a message converter that transforms osi3.MapAsamOpenDrive messages
 * (from OMEGA PRIME MCAP recordings) into foxglove.SceneUpdate for 3D visualization.
 */

import type { ExtensionContext, PanelSettings } from "@lichtblick/suite";

import {
  generateOpenDrive3DPanelSettings,
  registerOpenDriveFrameTransformConverter,
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

  // [ODR §8.5] Publish global → proj_frame FrameTransforms (inverted <offset>),
  // placing "proj_frame" as a child of the root "global" frame — mirroring the
  // OSI converter's proj_frame_offset handling.
  extensionContext.registerMessageConverter<MapAsamOpenDrive>({
    fromSchemaName: "osi3.MapAsamOpenDrive",
    toSchemaName: "foxglove.FrameTransforms",
    converter: registerOpenDriveFrameTransformConverter(),
    supportsLatestPerRenderTick: true,
  });
}
