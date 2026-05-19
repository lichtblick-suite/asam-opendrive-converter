---
sidebar_position: 99
---

# Contributing

## Development Setup

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter
npm install

# Build WASM module (requires emsdk — one-time unless libOpenDRIVE changes)
npm run build:wasm
```

## Commands

All build commands are centralized in `package.json` — CI and developers use the same scripts:

| Command | Description |
|---------|-------------|
| `npm run build:wasm` | Compile libOpenDRIVE C++ → WASM via Emscripten |
| `npm run build:wasm:check` | Verify WASM artifacts exist (fails fast if missing) |
| `npm run build` | Full build: check WASM + bundle TypeScript extension |
| `npm test` | Run all tests (Jest) |
| `npm run lint` | Lint with auto-fix |
| `npm run lint:ci` | Lint without auto-fix (CI mode) |
| `npm run package` | Create `.foxe` package |
| `npm run local-install` | Install to local Lichtblick |

## Two-Phase Build

The project uses a **two-phase build**:

1. **Phase 1: C++ → WASM** (`npm run build:wasm`) — Compiles `submodule/libOpenDRIVE` with Emscripten. Cached locally in `src/wasm/` and in CI by submodule commit hash. Only rebuilds when the C++ source or Embind bindings change.

2. **Phase 2: TypeScript → Extension** (`npm run build`) — Bundles TypeScript + WASM artifacts into the Lichtblick extension.

## Testing

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage report
```

Test files go in `tests/**/*.spec.ts`. The test infrastructure uses Jest + ts-jest + jsdom with path alias support matching `tsconfig.json`.

## Code Style

- TypeScript strict mode
- ESLint with `@lichtblick/eslint-plugin` (flat config in `eslint.config.mjs`)
- All implementations must reference the relevant ASAM OpenDRIVE V1.8.1 section
- Use `[ODR §X.Y]` bracket notation for standard references in comments

## Commit Conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Pre-commit hooks enforce: tests, lint-staged, npm audit, build, docs build
- Commit messages are validated by the `commit-msg` hook

## Architecture

See the [Architecture Overview](/architecture/overview) for the full module structure, WASM integration design, and Mermaid diagrams.

## Standards References

All reference documentation is in `docs/references/`:
- `ASAM_OpenDRIVE_Standard.md` — V1.8.1 technical reference
- `ASAM_OSI_Coordinate_System.md` — OSI coordinate system & proto definitions
- `Foxglove_SceneUpdate_Schema.md` — Foxglove visualization schema reference
- `FEATURE_MAPPING_TABLE.md` — Complete feature mapping: Standard → libOpenDRIVE → TS → Foxglove
- `opendrive/` — Full spec chapters as markdown
