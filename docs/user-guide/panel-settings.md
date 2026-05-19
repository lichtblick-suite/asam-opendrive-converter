---
sidebar_position: 2
---

# Panel Settings

The OpenDRIVE converter currently operates with sensible defaults. Future versions will expose panel settings for customization.

## Current Defaults

| Setting | Value | Description |
|---------|-------|-------------|
| Step size | 1.0 m | Distance between sample points along reference line |
| Boundary line width | 0.1 m | Width of lane boundary lines |
| Marking line width | 0.15 m | Width of road marking lines |
| Boundary z-offset | +0.01 m | Slight elevation to prevent z-fighting with lane surface |
| Marking z-offset | +0.02 m | Above boundary lines |

## Lane Color Mapping

Lane surfaces are colored by their OpenDRIVE `e_laneType`:

| Lane Type | Color | Hex |
|-----------|-------|-----|
| `driving` | Gray | `#808080` |
| `sidewalk` | Light Blue | `#ADD8E6` |
| `shoulder` | Green | `#90EE90` |
| `border` | Dark Gray | `#505050` |
| `parking` | Light Yellow | `#FFFACD` |
| `biking` | Dark Green | `#228B22` |
| `median` | Sandy Brown | `#F4A460` |
| `curb` | Dim Gray | `#696969` |
| Other | Medium Gray | `#A0A0A0` |

## Road Marking Colors

| Mark Color | Rendered As |
|------------|-------------|
| `white` | White |
| `yellow` | Yellow |
| `blue` | Blue |
| `green` | Green |
| `red` | Red |
| `orange` | Orange |

## Caching

The converter caches `SceneUpdate` results keyed by:
- `map_reference` string (identifies which map file)
- Rendering settings hash

If the same map appears in multiple messages, it is only computed once.
