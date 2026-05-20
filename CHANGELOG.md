# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-05-19

### Added
- OpenDRIVE map visualization from OMEGA PRIME MCAP recordings
- libOpenDRIVE C++ compiled to WebAssembly (SINGLE_FILE mode) for geometry computation
- Lane surfaces as color-coded triangle meshes (24 lane types)
- Lane boundaries as line primitives
- Road markings as filled triangle meshes with natural dash/gap patterns
- Road objects [ODR §13] as triangle meshes
- Road signals [ODR §14] as triangle meshes
- Panel settings: toggle surfaces, boundaries, markings, objects, signals
- Configurable tessellation tolerance (eps parameter)
- Static map caching (parse once per unique map + settings combination)
- SceneEntityDeletion.ALL on settings change for immediate visual feedback
- Two-phase CI: WASM build (cached) → TypeScript lint/test/build
- Emscripten WASM build system with SINGLE_FILE embedding
