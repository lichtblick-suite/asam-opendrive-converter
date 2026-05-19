import { registerOpenDriveMapConverter } from "@converters/openDriveMap/sceneUpdateConverter";
import type { Time } from "@foxglove/schemas";
import type { MessageEvent } from "@lichtblick/suite";
import type { MapAsamOpenDrive } from "@utils/proto";

import { getLibOpenDRIVE } from "@/wasm";

// Mock the WASM module loader
jest.mock("@/wasm", () => ({
  getLibOpenDRIVE: jest.fn(),
}));

const mockedGetLibOpenDRIVE = getLibOpenDRIVE as jest.MockedFunction<
  typeof getLibOpenDRIVE
>;

function makeEvent(
  msg: MapAsamOpenDrive,
  topicConfig?: unknown,
): {
  msg: MapAsamOpenDrive;
  event: MessageEvent<MapAsamOpenDrive>;
} {
  const timestamp: Time = { sec: 100, nsec: 0 };
  return {
    msg,
    event: {
      topic: "/ground_truth_map",
      receiveTime: timestamp,
      message: msg,
      schemaName: "osi3.MapAsamOpenDrive",
      sizeInBytes: 100,
      topicConfig,
    },
  };
}

describe("registerOpenDriveMapConverter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a converter function", () => {
    const converter = registerOpenDriveMapConverter();
    expect(typeof converter).toBe("function");
  });

  it("returns empty entities when xml content is missing", () => {
    const converter = registerOpenDriveMapConverter();
    const { msg, event } = makeEvent({ map_reference: "test" });

    const result = converter(msg, event);
    expect(result.entities).toEqual([]);
    expect(result.deletions).toEqual([]);
  });

  it("returns empty entities while WASM module is loading", () => {
    // getLibOpenDRIVE returns a promise that never resolves during this test
    mockedGetLibOpenDRIVE.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      new Promise(() => {}),
    );

    const converter = registerOpenDriveMapConverter();
    const { msg, event } = makeEvent({
      map_reference: "test",
      open_drive_xml_content: "<OpenDRIVE/>",
    });

    const result = converter(msg, event);
    expect(result.entities).toEqual([]);
    expect(mockedGetLibOpenDRIVE).toHaveBeenCalledTimes(1);
  });

  it("does not call getLibOpenDRIVE multiple times while loading", () => {
    mockedGetLibOpenDRIVE.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      new Promise(() => {}),
    );

    const converter = registerOpenDriveMapConverter();
    const { msg, event } = makeEvent({
      map_reference: "test",
      open_drive_xml_content: "<OpenDRIVE/>",
    });

    converter(msg, event);
    converter(msg, event);
    converter(msg, event);

    // Should only trigger load once
    expect(mockedGetLibOpenDRIVE).toHaveBeenCalledTimes(1);
  });

  it("returns cached result on second call with same map_reference", async () => {
    // Create a mock WASM module that produces simple output
    const mockModule = createMockWasmModule();
    mockedGetLibOpenDRIVE.mockResolvedValue(mockModule);

    const converter = registerOpenDriveMapConverter();
    const { msg, event } = makeEvent({
      map_reference: "map_v1",
      open_drive_xml_content: "<OpenDRIVE><road/></OpenDRIVE>",
    });

    // First call triggers WASM load (returns empty)
    converter(msg, event);

    // Wait for the promise to resolve
    await Promise.resolve();
    await Promise.resolve();

    // Second call should use the loaded module and generate entities
    const result1 = converter(msg, event);
    // Third call should use cache
    const result2 = converter(msg, event);
    expect(result2.entities).toBe(result1.entities);
  });

  it("emits deletions when settings change", async () => {
    const mockModule = createMockWasmModule();
    mockedGetLibOpenDRIVE.mockResolvedValue(mockModule);

    const converter = registerOpenDriveMapConverter();
    const xml = "<OpenDRIVE><road/></OpenDRIVE>";

    // First call — load
    converter(
      ...(Object.values(
        makeEvent(
          { map_reference: "m", open_drive_xml_content: xml },
          {
            showLaneSurfaces: true,
            showLaneBoundaries: true,
            showRoadMarkings: true,
            showRoadObjects: true,
            showRoadSignals: true,
            stepSize: 0.1,
          },
        ),
      ) as [MapAsamOpenDrive, MessageEvent<MapAsamOpenDrive>]),
    );

    await Promise.resolve();
    await Promise.resolve();

    // Second call with original settings — generate
    converter(
      ...(Object.values(
        makeEvent(
          { map_reference: "m", open_drive_xml_content: xml },
          {
            showLaneSurfaces: true,
            showLaneBoundaries: true,
            showRoadMarkings: true,
            showRoadObjects: true,
            showRoadSignals: true,
            stepSize: 0.1,
          },
        ),
      ) as [MapAsamOpenDrive, MessageEvent<MapAsamOpenDrive>]),
    );

    // Third call with changed settings — should emit deletions
    const result = converter(
      ...(Object.values(
        makeEvent(
          { map_reference: "m", open_drive_xml_content: xml },
          {
            showLaneSurfaces: false,
            showLaneBoundaries: true,
            showRoadMarkings: true,
            showRoadObjects: true,
            showRoadSignals: true,
            stepSize: 0.1,
          },
        ),
      ) as [MapAsamOpenDrive, MessageEvent<MapAsamOpenDrive>]),
    );

    expect(result.deletions).toHaveLength(1);
    expect(result.deletions[0]!.type).toBe(1); // SceneEntityDeletionType.ALL = 1
  });
});

/** Creates a minimal mock WASM module that produces empty but valid meshes */
function createMockWasmModule() {
  const emptyVec = {
    size: () => 0,
    get: () => undefined as never,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    push_back: () => {},
    delete: jest.fn(),
  };

  const emptyMap = {
    size: () => 0,
    get: () => undefined,
    keys: () => ({ ...emptyVec, size: () => 0 }),
    delete: jest.fn(),
  };

  const lanesMesh = {
    vertices: emptyVec,
    indices: emptyVec,
    normals: emptyVec,
    st_coordinates: emptyVec,
    get_obj: () => "",
    delete: jest.fn(),
    road_start_indices: emptyMap,
    get_road_id: () => "1",
    get_idx_interval_road: () => [0, 0] as [number, number],
    lanesec_start_indices: emptyMap,
    lane_start_indices: emptyMap,
    get_lanesec_s0: () => 0,
    get_lane_id: () => -1,
    get_idx_interval_lanesec: () => [0, 0] as [number, number],
    get_idx_interval_lane: () => [0, 0] as [number, number],
    get_lane_outline_indices: () => emptyVec,
  };

  const roadmarksMesh = {
    ...lanesMesh,
    roadmark_type_start_indices: emptyMap,
    get_roadmark_type: () => "solid",
    get_idx_interval_roadmark: () => [0, 0] as [number, number],
    get_roadmark_outline_indices: () => emptyVec,
  };

  const objectsMesh = {
    ...lanesMesh,
    road_object_start_indices: emptyMap,
    get_road_object_id: () => "obj1",
    get_idx_interval_road_object: () => [0, 0] as [number, number],
  };

  const signalsMesh = {
    ...lanesMesh,
    road_signal_start_indices: emptyMap,
    get_road_signal_id: () => "sig1",
    get_idx_interval_signal: () => [0, 0] as [number, number],
  };

  const mesh = {
    lanes_mesh: lanesMesh,
    roadmarks_mesh: roadmarksMesh,
    road_objects_mesh: objectsMesh,
    road_signals_mesh: signalsMesh,
    get_mesh: () => lanesMesh,
    delete: jest.fn(),
  };

  const odrMap = {
    proj4: "",
    x_offs: 0,
    y_offs: 0,
    xodr_file: "/tmp/test.xodr",
    get_road_network_mesh: () => mesh,
    delete: jest.fn(),
  };

  return {
    OpenDriveMap: jest.fn(() => odrMap),
    createFromXml: jest.fn(() => odrMap),
    getLaneTypeMap: jest.fn(() => emptyMap),
    getJunctionRoadIds: jest.fn(() => emptyVec),
    getRoadmarkColorMap: jest.fn(() => emptyMap),
    getRoadObjectMetadataMap: jest.fn(() => emptyMap),
    getRoadSignalMetadataMap: jest.fn(() => emptyMap),
    getRoadmarkMetadataMap: jest.fn(() => emptyMap),
    getRoadMetadataMap: jest.fn(() => emptyMap),
    getRoadLinkageMap: jest.fn(() => emptyMap),
    getLaneLinkageMap: jest.fn(() => emptyMap),
  };
}
