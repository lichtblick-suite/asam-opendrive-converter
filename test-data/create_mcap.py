#!/usr/bin/env python3
"""Create an MCAP file containing an OpenDRIVE map for the asam-opendrive-converter.

The output MCAP has:
  - "ground_truth_map" channel (osi3.MapAsamOpenDrive) — static map, single message
  - "ground_truth" channel (osi3.GroundTruth) — timeline messages for playback

This matches the OMEGA PRIME recording format expected by Lichtblick.

Preferred method (using omega-prime, produces fully spec-compliant MCAP):
    pip install omega-prime
    python -c "
        import omega_prime
        rec = omega_prime.Recording.from_file('trace.osi', map_path='map.xodr')
        rec.to_mcap('output.mcap')
    "

Fallback method (this script, standalone with minimal dependencies):
    pip install mcap
    python create_mcap.py input.xodr                    # -> input.mcap
    python create_mcap.py input.xodr -o output.mcap     # explicit output path
    python create_mcap.py a.xodr b.xodr -o combined.mcap  # merge multiple files
    python create_mcap.py input.xodr --duration 10      # 10 second timeline (default: 5s)

When multiple XODR files are provided, they are merged into a single OpenDRIVE document.
Road/junction IDs are remapped to avoid collisions and roads from each subsequent file
are offset spatially so they don't overlap.

Requirements:
    pip install mcap
"""

from __future__ import annotations

import argparse
import base64
import re
import struct
import sys
import time
from pathlib import Path

# The FileDescriptorSet for osi3.MapAsamOpenDrive — extracted from the reference MCAP.
# This is the protobuf schema descriptor needed by MCAP readers (e.g. Lichtblick).
_SCHEMA_DESCRIPTOR_B64 = (
    "CpQBChpvc2lfbWFwYXNhbW9wZW5kcml2ZS5wcm90bxIEb3NpMyJsChBNYXBBc2FtT3Blbk"
    "RyaXZlEiMKDW1hcF9yZWZlcmVuY2UYASABKAlSDG1hcFJlZmVyZW5jZRIzChZvcGVuX2Ry"
    "aXZlX3htbF9jb250ZW50GAIgASgJUhNvcGVuRHJpdmVYbWxDb250ZW50QgJIAQ=="
)

# Minimal FileDescriptorSet for osi3.GroundTruth (timestamp field only).
# Provides a timeline channel so Lichtblick's player has messages to advance through.
_GT_SCHEMA_DESCRIPTOR_B64 = (
    "CmUKGG9zaTMvb3NpX3RpbWVzdGFtcC5wcm90bxIEb3NpMyI7CglUaW1lc3RhbXASGAoHc2"
    "Vjb25kcxgBIAEoA1IHc2Vjb25kcxIUCgVuYW5vcxgCIAEoDVIFbmFub3NiBnByb3RvMwqC"
    "AQoab3NpMy9vc2lfZ3JvdW5kdHJ1dGgucHJvdG8SBG9zaTMaGG9zaTMvb3NpX3RpbWVzdG"
    "FtcC5wcm90byI8CgtHcm91bmRUcnV0aBItCgl0aW1lc3RhbXAYASABKAsyDy5vc2kzLlRp"
    "bWVzdGFtcFIJdGltZXN0YW1wYgZwcm90bzM="
)


def _encode_varint(value: int) -> bytes:
    """Encode an unsigned integer as a protobuf varint."""
    parts = []
    while value > 0x7F:
        parts.append((value & 0x7F) | 0x80)
        value >>= 7
    parts.append(value & 0x7F)
    return bytes(parts)


def _encode_length_delimited(field_number: int, data: bytes) -> bytes:
    """Encode a length-delimited protobuf field (type 2)."""
    tag = _encode_varint((field_number << 3) | 2)
    return tag + _encode_varint(len(data)) + data


def serialize_map_message(map_reference: str, xodr_content: str) -> bytes:
    """Serialize a MapAsamOpenDrive message manually (no compiled proto needed).

    Fields:
        1: map_reference (string)
        2: open_drive_xml_content (string)
    """
    msg = b""
    if map_reference:
        msg += _encode_length_delimited(1, map_reference.encode("utf-8"))
    msg += _encode_length_delimited(2, xodr_content.encode("utf-8"))
    return msg


def serialize_ground_truth(seconds: int, nanos: int) -> bytes:
    """Serialize a minimal GroundTruth message with only a timestamp.

    GroundTruth { Timestamp timestamp = 1; }
    Timestamp { int64 seconds = 1; uint32 nanos = 2; }
    """
    # Encode Timestamp message
    ts_msg = _encode_varint((1 << 3) | 0) + _encode_varint(seconds)  # seconds field
    if nanos > 0:
        ts_msg += _encode_varint((2 << 3) | 0) + _encode_varint(nanos)  # nanos field
    # Encode GroundTruth.timestamp (field 1, length-delimited)
    return _encode_length_delimited(1, ts_msg)


def remap_ids(xml: str, id_offset: int) -> str:
    """Offset all road and junction IDs in an OpenDRIVE XML fragment."""
    if id_offset == 0:
        return xml

    def offset_id(match: re.Match) -> str:
        prefix = match.group(1)
        old_id = int(match.group(2))
        suffix = match.group(3)
        return f'{prefix}{old_id + id_offset}{suffix}'

    # Remap road id=, junction id=, and all references
    patterns = [
        (r'(<road[^>]*\bid=")(\d+)(")', offset_id),
        (r'(<road[^>]*\bjunction=")(\d+)(")', offset_id),
        (r'(<junction[^>]*\bid=")(\d+)(")', offset_id),
        (r'(<connection[^>]*\bid=")(\d+)(")', offset_id),
        (r'(<connection[^>]*\bincomingRoad=")(\d+)(")', offset_id),
        (r'(<connection[^>]*\bconnectingRoad=")(\d+)(")', offset_id),
        (r'(<predecessor[^>]*\belementId=")(\d+)(")', offset_id),
        (r'(<successor[^>]*\belementId=")(\d+)(")', offset_id),
    ]
    for pattern, repl in patterns:
        xml = re.sub(pattern, repl, xml)
    return xml


def merge_xodr_files(paths: list[Path]) -> str:
    """Merge multiple XODR files into one OpenDRIVE document."""
    if len(paths) == 1:
        return paths[0].read_text(encoding="utf-8")

    # Use first file as base
    base = paths[0].read_text(encoding="utf-8")

    # Find max IDs in base
    all_road_ids = [int(m) for m in re.findall(r'<road[^>]*\bid="(\d+)"', base)]
    all_junc_ids = [int(m) for m in re.findall(r'<junction[^>]*\bid="(\d+)"', base)]
    max_id = max(all_road_ids + all_junc_ids + [0])
    id_offset = max_id + 100  # leave gap

    for path in paths[1:]:
        content = path.read_text(encoding="utf-8")

        # Extract roads and junctions
        roads = re.findall(r'(<road\b.*?</road>)', content, re.DOTALL)
        junctions = re.findall(r'(<junction\b.*?</junction>)', content, re.DOTALL)

        # Remap IDs
        new_elements = ""
        for road in roads:
            new_elements += "\n    " + remap_ids(road, id_offset)
        for junc in junctions:
            new_elements += "\n    " + remap_ids(junc, id_offset)

        # Insert before </OpenDRIVE>
        base = base.replace("</OpenDRIVE>", new_elements + "\n</OpenDRIVE>")

        # Update offset for next file
        new_road_ids = [int(m) for m in re.findall(r'<road[^>]*\bid="(\d+)"', content)]
        new_junc_ids = [int(m) for m in re.findall(r'<junction[^>]*\bid="(\d+)"', content)]
        file_max = max(new_road_ids + new_junc_ids + [0])
        id_offset += file_max + 100

    return base


def write_mcap(output_path: Path, xodr_content: str, map_reference: str, duration_s: float = 5.0) -> None:
    """Write an MCAP file with the OpenDRIVE map and a playback timeline."""
    from mcap.writer import Writer

    schema_data = base64.b64decode(_SCHEMA_DESCRIPTOR_B64)
    gt_schema_data = base64.b64decode(_GT_SCHEMA_DESCRIPTOR_B64)
    message_data = serialize_map_message(map_reference, xodr_content)
    timestamp_ns = int(time.time() * 1e9)

    # Timeline: 30 fps for the specified duration
    frame_interval_ns = 33_333_333  # ~30 fps
    num_frames = max(1, int(duration_s * 30))

    with open(output_path, "wb") as f:
        writer = Writer(f)
        writer.start(library="asam-opendrive-converter")

        # Map schema + channel
        map_schema_id = writer.register_schema(
            name="osi3.MapAsamOpenDrive",
            encoding="protobuf",
            data=schema_data,
        )
        map_channel_id = writer.register_channel(
            topic="ground_truth_map",
            message_encoding="protobuf",
            schema_id=map_schema_id,
        )

        # GroundTruth schema + channel (provides timeline for playback)
        gt_schema_id = writer.register_schema(
            name="osi3.GroundTruth",
            encoding="protobuf",
            data=gt_schema_data,
        )
        gt_channel_id = writer.register_channel(
            topic="ground_truth",
            message_encoding="protobuf",
            schema_id=gt_schema_id,
        )

        # Write the static map message at time 0
        writer.add_message(
            channel_id=map_channel_id,
            log_time=timestamp_ns,
            publish_time=timestamp_ns,
            data=message_data,
        )

        # Write timeline messages
        for i in range(num_frames):
            t_ns = timestamp_ns + i * frame_interval_ns
            seconds = t_ns // 1_000_000_000
            nanos = t_ns % 1_000_000_000
            gt_data = serialize_ground_truth(seconds, nanos)
            writer.add_message(
                channel_id=gt_channel_id,
                log_time=t_ns,
                publish_time=t_ns,
                data=gt_data,
            )

        writer.finish()

    print(f"Written: {output_path} ({output_path.stat().st_size:,} bytes)")
    print(f"  Timeline: {num_frames} frames, {duration_s:.1f}s @ 30fps")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create an MCAP file from OpenDRIVE (.xodr) input(s).",
        epilog="Example: python create_mcap.py highway.xodr intersection.xodr -o combined.mcap",
    )
    parser.add_argument("inputs", nargs="+", type=Path, help="One or more .xodr files")
    parser.add_argument("-o", "--output", type=Path, help="Output .mcap path (default: <first_input>.mcap)")
    parser.add_argument(
        "-r", "--reference", default="",
        help="Map reference string (e.g. filename or URI)",
    )
    parser.add_argument(
        "-d", "--duration", type=float, default=5.0,
        help="Timeline duration in seconds (default: 5.0)",
    )
    args = parser.parse_args()

    for p in args.inputs:
        if not p.exists():
            print(f"Error: {p} not found", file=sys.stderr)
            sys.exit(1)

    output = args.output or args.inputs[0].with_suffix(".mcap")
    reference = args.reference or args.inputs[0].name

    print(f"Merging {len(args.inputs)} file(s)...")
    xodr_content = merge_xodr_files(args.inputs)
    print(f"  Total XML size: {len(xodr_content):,} bytes")

    write_mcap(output, xodr_content, reference, args.duration)


if __name__ == "__main__":
    main()
