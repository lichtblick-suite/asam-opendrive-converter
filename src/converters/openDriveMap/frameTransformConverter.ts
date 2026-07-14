/**
 * ASAM OpenDRIVE → foxglove.FrameTransform converter.
 *
 * Publishes a FrameTransform(parent="global", child="proj_frame") derived from
 * the OpenDRIVE <offset> element [ODR §8.5], placing "proj_frame" as a child of
 * the root "global" frame.
 *
 * This mirrors the OSI converter, which emits the same transform from the
 * inverted GroundTruth.proj_frame_offset. Keeping "global" as the tree root lets
 * Lichtblick resolve OpenDRIVE map geometry (published un-baked in "proj_frame"
 * by sceneUpdateConverter.ts) alongside OSI objects (in "global").
 *
 * The transform is emitted only when BOTH <geoReference> and <offset> are
 * present — that is exactly when the map geometry is published in "proj_frame"
 * and an offset relative to "global" is known.
 */

import type { FrameTransform } from "@foxglove/schemas";
import type {
  Immutable,
  MessageConverterContext,
  MessageEvent,
  VariableValue,
} from "@lichtblick/suite";

import { buildProjFrameTransform, parseGeoReference } from "../../utils/georef";
import type { MapAsamOpenDrive } from "../../utils/proto";

export function registerOpenDriveFrameTransformConverter(): (
  msg: MapAsamOpenDrive,
  event: Immutable<MessageEvent<MapAsamOpenDrive>>,
  globalVariables?: Readonly<Record<string, VariableValue>>,
  context?: MessageConverterContext,
) => FrameTransform | undefined {
  return (msg, event) => {
    const xmlContent = msg.open_drive_xml_content;
    if (!xmlContent) {
      return undefined;
    }

    const geoRef = parseGeoReference(xmlContent);

    // Only publish the proj_frame link when geometry lives in "proj_frame"
    // (<geoReference> present) and an <offset> relative to "global" is known.
    if (!geoRef.projString || !geoRef.offset) {
      return undefined;
    }

    return buildProjFrameTransform(geoRef.offset, event.receiveTime);
  };
}
