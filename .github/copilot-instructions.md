# Copilot Instructions for ASAM OpenDRIVE Converter

## Project Context

This is a **Lichtblick extension** that converts `osi3.MapAsamOpenDrive` protobuf messages
from OMEGA PRIME MCAP recordings into `foxglove.SceneUpdate` 3D scene entities.

All geometry computation is handled by **libOpenDRIVE** (C++ compiled to WebAssembly).
TypeScript is a thin adapter that extracts XML, passes it to WASM, and maps the returned
meshes to Foxglove SceneUpdate format.

## Architecture

```
MCAP → proto.ts → sceneUpdateConverter.ts → libOpenDRIVE WASM → SceneEntity[] → 3D Panel
```

Key files:
- `src/index.ts` — Extension entry point (registers converter)
- `src/converters/openDriveMap/sceneUpdateConverter.ts` — Main conversion pipeline
- `src/converters/openDriveMap/meshUtils.ts` — Mesh partitioning utilities
- `src/converters/openDriveMap/panelSettings.ts` — Panel settings UI
- `src/converters/openDriveMap/context.ts` — Cache context
- `src/wasm/` — WASM module loader and type definitions
- `src/config/constants.ts` — Lane colors, road mark colors, dimensions

## Standards

- Code comments use `[ODR §X.Y]` notation referencing ASAM OpenDRIVE V1.8.1 sections
- The geometry engine (libOpenDRIVE) targets OpenDRIVE **1.4**
- Coordinate frame follows ASAM OSI / ISO 8855 conventions

## Conventions

- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Path aliases**: `@converters/`, `@config/`, `@utils/`, `@/` (mapped in tsconfig + jest)
- **Testing**: Jest with ts-jest, test files in `tests/*.spec.ts`
- **Linting**: ESLint with `@lichtblick/eslint-plugin` + prettier integration
- **WASM build**: `npm run build:wasm` (requires Emscripten SDK)

## Important Rules

- Never call `.delete()` twice on Emscripten WASM objects (crashes runtime)
- `tryCall()` in sceneUpdateConverter.ts must remain catch-all (WASM throws RuntimeError, not TypeError)
- WASM is loaded eagerly at registration time, not lazily on first message
- SceneEntityDeletion.ALL must be emitted on settings changes for immediate visual feedback
