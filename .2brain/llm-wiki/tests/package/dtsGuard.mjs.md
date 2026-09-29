---
source: tests/package/dtsGuard.mjs
sha256: f838aa072a0e778f5886a9cba14979a2c7d39ae337685dbc05f805a2acded3c2
generated_at: 2026-09-28T19:53:26.135647+00:00
model: ollama:qwen3.8:27b
---

# tests/package/dtsGuard.mjs

## Purpose

A standalone guard script that validates the published `.d.ts` declaration files in `dist/esm` and `dist/cjs` to catch three classes of silent consumer breakage: ESM/CJS declaration mismatch, `node:` builtin imports in browser-facing types, and type references that leak from the private `internal/` directory.

## Key elements

- **`dtsFiles(buildDirectory)`** — recursively lists all `.d.ts` files under a build directory, returning sorted relative paths.
- **`NODE_IMPORT_ALLOWED`** — a `Set` naming the sole file (`deleteFile.d.ts`) permitted to import a `node:` builtin.
- **`NODE_IMPORT` / `INTERNAL_IMPORT`** — regexes that detect `node:`-prefixed imports and relative imports into `internal/`, respectively (both handle `from` and `import()` forms).
- **Main body** — collects both declaration trees, diffs them, scans every file against the two regexes, accumulates failures, and either prints a summary and exits `0` or prints each failure and exits `1`.

## Relationships

No dependency-graph neighbors. This file is a self-contained CLI entry point (shebang + top-level `await`) that is invoked directly rather than imported.

## Notes

- Resolves the package root by going two directories up from the script's own location (`tests/package/` → repo root), so it must be run from its expected place in the tree.
- The `internal/` prohibition is a project convention documented in `CLAUDE.md` under "Function design": a public helper may _call_ internal code, but its declaration must not _reference_ it, because `internal/` is outside the `exports` map and consumers cannot import or name those types.
- `NODE_IMPORT_ALLOWED` is keyed by **basename** only; if a file is renamed or moved, the guard will flag it.
- The script assumes both `dist/esm` and `dist/cjs` already exist; it will throw on a missing directory rather than reporting a friendly failure.
