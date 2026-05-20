# Test Data

## Files

| File | Description | Source |
|------|-------------|--------|
| `fabriksgatan.xodr` | OpenDRIVE map of Fabriksgatan, Gothenburg — urban intersection with paramPoly3 geometry | [esmini](https://github.com/esmini/esmini) |
| `pedestrian.osi` | OSI GroundTruth trace with pedestrian scenario on Fabriksgatan | [esmini](https://github.com/esmini/esmini) |
| `pedestrian_fabriksgatan.mcap` | MCAP combining `pedestrian.osi` + `fabriksgatan.xodr` — full playback scenario | Generated with [omega-prime](https://github.com/ika-rwth-aachen/omega-prime) |
| `combined_example.mcap` | Feature-rich merged map (highway + intersection + signals) with playback timeline | Generated with `create_mcap.py` |
| `tunnels.xodr` | Two roads with 4 tunnels, barriers with repeat, lane emergence, elevation | [esmini](https://github.com/esmini/esmini) |
| `tunnels.mcap` | MCAP wrapping `tunnels.xodr` with playback timeline | Generated with `create_mcap.py` |
| `multi_intersections.xodr` | 30+ roads, multiple junctions, dynamic traffic lights, pedestrian signals | [esmini](https://github.com/esmini/esmini) |
| `multi_intersections.mcap` | MCAP wrapping `multi_intersections.xodr` with playback timeline | Generated with `create_mcap.py` |
| `osi_centerline_example.mcap` | OSI GroundTruth trace with centerline data (no OpenDRIVE map — not usable by this converter; included for reference) | [omega-prime](https://github.com/ika-rwth-aachen/omega-prime) |

## Licenses

All third-party test data files are licensed under the **Mozilla Public License 2.0 (MPL-2.0)**.

| Source | License | Link |
|--------|---------|------|
| [esmini/esmini](https://github.com/esmini/esmini) | MPL-2.0 | [LICENSE](https://github.com/esmini/esmini/blob/master/LICENSE) |
| [ika-rwth-aachen/omega-prime](https://github.com/ika-rwth-aachen/omega-prime) | MPL-2.0 | [LICENSE](https://github.com/ika-rwth-aachen/omega-prime/blob/main/LICENSE) |
| [Persival-GmbH/asam-openx-assets](https://github.com/Persival-GmbH/asam-openx-assets) | MPL-2.0 | [LICENSE](https://github.com/Persival-GmbH/asam-openx-assets/blob/main/LICENSE) |
| [vectorgrp/OSC-NCAP-scenarios](https://github.com/vectorgrp/OSC-NCAP-scenarios) | MPL-2.0 | [LICENSE](https://github.com/vectorgrp/OSC-NCAP-scenarios/blob/main/LICENSE) |

MPL-2.0 is a file-level copyleft license: the original files remain under MPL-2.0
while the rest of this repository is licensed under Apache-2.0.

## Feature Coverage

### `combined_example.mcap`

- **28 roads**, 2 junctions
- **Geometry types**: line, arc, spiral, paramPoly3
- **Lane types**: driving, shoulder, stop, border, median, sidewalk, none
- **14 objects** (barriers, delineators)
- **3 signals** (traffic lights)
- **Elevation profiles** (cubic polynomials)

Sources:
- [german_highway_short.xodr](https://github.com/Persival-GmbH/asam-openx-assets) — highway with spirals, objects, elevation
- [X-Intersection_NCAP.xodr](https://github.com/vectorgrp/OSC-NCAP-scenarios) — junction with arcs
- [fabriksgatan_traffic_lights.xodr](https://github.com/esmini/esmini) — signals, paramPoly3

### `tunnels.mcap`

- **2 roads**, line + spiral + arc geometry
- **4 tunnel objects** (flexible, short, manual tunnel types)
- **3 barrier objects** with `<repeat>` patterns
- **Lane emergence** (width 0 → 3.5 m via polynomial)
- **Mid-road roadmark changes** (solid → broken → solid)
- **Elevation profiles** (hills up to 20 m)
- OpenDRIVE schema 1.6

### `multi_intersections.mcap`

- **30+ roads**, multiple junctions with complex topology
- **Dynamic traffic lights** (`type=1000001`, 3-phase), pedestrian lights (`type=1000002`)
- **Crosswalk road marks**, yield/stop signs, directional arrows
- **Signal `<validity>`** scoping to specific lane ranges
- **Lane widening** (merge lane tapering to zero)
- **Sidewalk curb heights** via `<height>` elements

## Creating Your Own MCAP

### Preferred: Using omega-prime (spec-compliant MCAP)

```bash
pip install omega-prime

python -c "
import omega_prime
rec = omega_prime.Recording.from_file('trace.osi', map_path='map.xodr')
rec.to_mcap('output.mcap')
"
```

### Fallback: Using create_mcap.py (standalone)

```bash
pip install mcap

# Single file
python test-data/create_mcap.py my_map.xodr

# Multiple files merged into one
python test-data/create_mcap.py highway.xodr intersection.xodr -o combined.mcap

# With explicit map reference and custom timeline duration
python test-data/create_mcap.py my_map.xodr -r "My Custom Map" -d 10 -o output.mcap
```

The output MCAP contains a `ground_truth_map` channel (static map) and a `ground_truth`
channel (timeline for playback).
