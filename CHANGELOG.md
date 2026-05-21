# Changelog

All notable changes to this project will be documented in this file.
## [0.1.1](https://github.com/lichtblick-suite/asam-opendrive-converter/tree/v0.1.1) — 2026-05-21

### 🏗️ Build

- Bump @lichtblick/suite from 1.25.0 to 1.25.1 (#24)

### 🐛 Bug Fixes

- Invalidate map cache when XML content changes (#25)
- Use gh release create with changelog body instead of third-party action

### 📚 Documentation

- Update CHANGELOG for v0.1.0 [skip ci]
## [0.1.0](https://github.com/lichtblick-suite/asam-opendrive-converter/tree/v0.1.0) — 2026-05-20

### ♻️ Refactoring

- Load WASM eagerly at registration time
- Extract meshUtils, improve performance, add tests, update docs
- Use dot notation for SceneEntity IDs mirroring XODR hierarchy
- Replace TypeScript geometry engine with WASM-based converter

### ⚙️ CI/CD

- Make npm audit step fail CI on vulnerabilities
- Add GitHub Actions workflows and Docusaurus documentation site

### 🏗️ Build

- Bump typescript from 5.8.3 to 5.9.3 in /website
- Bump eslint-config-prettier from 9.1.0 to 9.1.2
- Bump react from 18.2.0 to 18.3.1
- Bump esbuild from 0.25.12 to 0.28.0
- Pin libOpenDRIVE submodule to fork development branch

### 🐛 Bug Fixes

- Switch to git-cliff for conventional commit changelog generation
- Add WASM build step and submodule checkout to release workflow
- Use RELEASE_PAT to bypass branch protection in release workflow
- Enforce LF line endings via .gitattributes
- Restore original combined_example map with timeline channel
- Regenerate combined_example.mcap with ground_truth timeline
- Revert tryCall to catch-all for graceful degradation
- Remove double-delete on laneKeys causing WASM crash
- Update libOpenDRIVE submodule with Embind fixes
- Add error reporting and graceful WASM degradation
- Split lane boundaries into per-lane entities
- Fix broken Mermaid diagram in architecture overview
- Resolve audit findings for v0.1.0 release
- Send SceneEntityDeletion.ALL on settings change
- Resolve CI failures and lint errors
- Embed WASM binary in JS via SINGLE_FILE for extension sandbox
- Use Ninja generator for WASM build, update .gitignore
- Auto-detect emsdk and limit parallelism in WASM build
- Update isArray callback signature for fast-xml-parser v5
- Regenerate website lockfile, add docs build to pre-commit
- Add pre-commit hooks, clean lockfile from artifactory URLs
- Use npm install and npx for CI commands
- Spiral step count now based on geometry length, not query point ds

### 📚 Documentation

- Update CHANGELOG for v0.1.0 [skip ci]
- Fix test-data README attribution, licenses, and README quick start
- Reference ASAM QC Framework Rule UID Schema for entity ID convention
- Update all documentation to reflect WASM integration and 2-phase build
- Rewrite architecture with Mermaid diagrams explaining WASM strategy
- Add comprehensive feature mapping table (ODR→libOpenDRIVE→TS→Foxglove)
- Add standards reference docs and scholarly source annotations

### 📦 Dependencies

- Bump react-dom, @types/react, and CI actions
- Bump actions/checkout from 4 to 6 and actions/setup-node from 4 to 6
- Bump actions/upload-artifact from 4 to 7
- Bump actions/upload-pages-artifact from 4 to 5
- Bump actions/setup-python from 5 to 6

### 🔧 Miscellaneous

- Update libOpenDRIVE submodule pin
- Add dependabot ignore rules for framework-aligned deps
- Update libOpenDRIVE submodule pin
- Release-readiness audit fixes
- Upgrade jest to v30, remove unused jest-environment-jsdom
- Keep only pedestrian scenario as test fixture
- Check in test data fixtures for CI
- Prepare for v0.1.0 release
- Pin submodule to commit with Embind.cpp bindings

### 🚀 Features

- Add Windows support and fix release workflow
- Add tunnels and multi_intersections test maps from esmini
- Add MCAP creation script and feature-rich example
- Add road and lane linkage metadata (predecessor/successor)
- Expose map-level projection metadata (proj4, coordinate offsets)
- Enrich entity metadata with road, object, and signal attributes
- Add road objects, signals, and improved road markings
- Add libOpenDRIVE WASM integration with 2-phase cached build
- ASAM OpenDRIVE Converter Lichtblick extension

