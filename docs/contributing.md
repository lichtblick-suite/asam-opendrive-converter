---
sidebar_position: 99
---

# Contributing

## Development Setup

```bash
git clone https://github.com/lichtblick-suite/asam-opendrive-converter.git
cd asam-opendrive-converter
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (Jest) |
| `npm run build` | Build the extension |
| `npm run lint` | Lint with auto-fix |
| `npm run lint:ci` | Lint without auto-fix (CI mode) |
| `npm run package` | Create `.foxe` package |
| `npm run local-install` | Install to local Lichtblick |

## Testing

```bash
npm test                    # Run all 42 tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage report
```

Tests cover:
- XML parsing (multiple OpenDRIVE fixture files)
- Geometry evaluation (all 5 types + elevation)
- Lane geometry (width accumulation, boundary computation)
- Tessellation (triangle mesh generation)
- Full converter pipeline (end-to-end)

## Code Style

- TypeScript strict mode
- ESLint for linting
- All implementations must reference the relevant ASAM OpenDRIVE V1.8.1 section
- Use `[ODR §X.Y]` bracket notation for standard references in comments

## Commit Conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- All commits must be GPG-signed (`-S`) and signed-off (`-s`)
- No AI co-authorship attribution

## Architecture

See the [Architecture Overview](/architecture/overview) for the full module structure and design principles.

## Standards References

All reference documentation is in `docs/references/`:
- `ASAM_OpenDRIVE_Standard.md` — V1.8.1 technical reference
- `INTERFACE_MAPPING.md` — Deep mapping analysis
- `FEATURE_MAPPING_TABLE.md` — Complete feature gap analysis
- `opendrive/` — Full spec chapters as markdown
