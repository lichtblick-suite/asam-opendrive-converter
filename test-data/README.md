# Test Data

## Files

| File | Description |
|------|-------------|
| `fabriksgatan.xodr` | OpenDRIVE map of Fabriksgatan (Gothenburg) |
| `pedestrian_fabriksgatan.mcap` | MCAP with pedestrian OSI trace + map |
| `combined_example.mcap` | Feature-rich combined map (highway + intersection + signals) |

## Creating Your Own MCAP

Use `create_mcap.py` to wrap any OpenDRIVE file into an MCAP that this extension can load:

```bash
pip install mcap protobuf

# Single file
python test-data/create_mcap.py my_map.xodr

# Multiple files merged into one
python test-data/create_mcap.py highway.xodr intersection.xodr -o combined.mcap

# With explicit map reference
python test-data/create_mcap.py my_map.xodr -r "My Custom Map" -o output.mcap
```

The output MCAP contains a single `ground_truth_map` channel with schema `osi3.MapAsamOpenDrive`.

## Combined Example Features

The `combined_example.mcap` covers these OpenDRIVE features:

- **28 roads**, 2 junctions
- **Geometry types**: line, arc, spiral, paramPoly3
- **Lane types**: driving, shoulder, stop, border, median, sidewalk, none
- **14 objects** (barriers, delineators)
- **3 signals** (traffic lights)
- **Elevation profiles**

Sources:
- [german_highway_short.xodr](https://github.com/Persival-GmbH/asam-openx-assets) (highway with spirals, objects, elevation)
- [X-Intersection_NCAP.xodr](https://github.com/vectorgrp/OSC-NCAP-scenarios) (junction with arcs)
- [fabriksgatan_traffic_lights.xodr](https://github.com/esmini/esmini) (signals, paramPoly3)
