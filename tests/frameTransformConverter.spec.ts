import { registerOpenDriveFrameTransformConverter } from "@converters/openDriveMap/frameTransformConverter";
import type { Time } from "@foxglove/schemas";
import type { MessageEvent } from "@lichtblick/suite";
import type { MapAsamOpenDrive } from "@utils/proto";

function makeEvent(msg: MapAsamOpenDrive): MessageEvent<MapAsamOpenDrive> {
  const timestamp: Time = { sec: 100, nsec: 0 };
  return {
    topic: "/ground_truth_map",
    receiveTime: timestamp,
    message: msg,
    schemaName: "osi3.MapAsamOpenDrive",
    sizeInBytes: 100,
  };
}

const XML_WITH_OFFSET = `<?xml version="1.0"?>
  <OpenDRIVE>
    <header>
      <geoReference><![CDATA[+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs]]></geoReference>
      <offset x="349210.32" y="5648717.38" z="0.0" hdg="0.0"/>
    </header>
  </OpenDRIVE>`;

describe("registerOpenDriveFrameTransformConverter", () => {
  it("returns a converter function", () => {
    expect(typeof registerOpenDriveFrameTransformConverter()).toBe("function");
  });

  it("emits a global → proj_frame transform when geoReference and offset are present", () => {
    const converter = registerOpenDriveFrameTransformConverter();
    const msg = { open_drive_xml_content: XML_WITH_OFFSET } as MapAsamOpenDrive;

    const transform = converter(msg, makeEvent(msg));

    expect(transform).toBeDefined();
    expect(transform!.parent_frame_id).toBe("global");
    expect(transform!.child_frame_id).toBe("proj_frame");
    // hdg=0 → simple negation
    expect(transform!.translation.x).toBeCloseTo(-349210.32, 2);
    expect(transform!.translation.y).toBeCloseTo(-5648717.38, 2);
    expect(transform!.rotation).toEqual({ x: 0, y: 0, z: 0, w: 1 });
    expect(transform!.timestamp).toEqual({ sec: 100, nsec: 0 });
  });

  it("returns undefined when the XML content is missing", () => {
    const converter = registerOpenDriveFrameTransformConverter();
    const msg = {} as MapAsamOpenDrive;
    expect(converter(msg, makeEvent(msg))).toBeUndefined();
  });

  it("returns undefined when geoReference is absent", () => {
    const converter = registerOpenDriveFrameTransformConverter();
    const xml = `<OpenDRIVE><header><offset x="100" y="200" z="0" hdg="0"/></header></OpenDRIVE>`;
    const msg = { open_drive_xml_content: xml } as MapAsamOpenDrive;
    expect(converter(msg, makeEvent(msg))).toBeUndefined();
  });

  it("returns undefined when offset is absent", () => {
    const converter = registerOpenDriveFrameTransformConverter();
    const xml = `<OpenDRIVE><header><geoReference>EPSG:32632</geoReference></header></OpenDRIVE>`;
    const msg = { open_drive_xml_content: xml } as MapAsamOpenDrive;
    expect(converter(msg, makeEvent(msg))).toBeUndefined();
  });
});
