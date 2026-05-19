---
sidebar_position: 2
---

# Panel Settings

The OpenDRIVE converter exposes panel settings in Lichtblick for feature-layer toggles and libOpenDRIVE tessellation control.

## Available Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Show Lane Surfaces | `true` | Render lane meshes as `TriangleListPrimitive` entities |
| Show Lane Boundaries | `true` | Render lane outlines as a `LinePrimitive` overlay |
| Show Road Markings | `true` | Render road marks as filled triangle meshes |
| Show Road Objects | `true` | Render OpenDRIVE road objects |
| Show Road Signals | `true` | Render OpenDRIVE road signals |
| Tessellation Tolerance (m) | `0.1` | libOpenDRIVE `eps` value; smaller values create denser meshes |

When any setting changes, the converter emits `SceneEntityDeletion.ALL` before publishing the updated entities so hidden layers disappear immediately.

## Lane Color Mapping

Lane surfaces are colored by OpenDRIVE lane type. The current palette includes:

| Lane Type | Color |
|-----------|-------|
| `driving`, `entry`, `exit`, `onRamp`, `offRamp`, `connectingRamp`, `slipLane` | dark asphalt gray |
| `stop`, `restricted` | muted red |
| `shoulder` | brown |
| `biking` | green |
| `sidewalk` | light gray |
| `walking` | warm beige |
| `border` | gray-brown |
| `parking` | blue-gray |
| `median` | olive green |
| `curb` | stone gray |
| `tram`, `rail` | purple-gray |
| `bus` | slate blue |
| `taxi` | olive |
| `hov` | teal-gray |
| `shared` | neutral gray |
| `none` | transparent dark gray |

## Road Marking Colors

The road-mark color map includes:

- `standard`
- `white`
- `yellow`
- `blue`
- `green`
- `red`
- `orange`
- `violet`
- `black`

## Caching Behavior

Rendered output is cached by:

- `map_reference`
- panel settings hash

Changing the map or any setting creates a new cache entry; repeated messages with the same combination reuse the cached scene.
