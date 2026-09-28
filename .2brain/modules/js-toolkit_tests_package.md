---
tags:
  - 2brain
  - 2brain/module
  - project/js-toolkit
type: module
module: tests/package/
files: 3
updated: 2026-09-28T20:02:15.690722+00:00
---

# tests/package/

## Purpose

This module holds packaging-level integration tests that validate the **published** artifact (tarball, `dist/`, declaration files) rather than the source tree. It exists to catch regressions in `main`, `exports`, `files`, and the shipped `.d.ts` surface—issues the Jest + ts-jest unit suite cannot see because it resolves `../src` directly and never touches the build output.

## Key parts

- **`smoke.mjs`** – End-to-end packaging test: runs `npm pack`, installs the tarball into a throwaway directory, then exercises the package via both `require()` and `import()`, calls real functions, and asserts on the export surface, file set, and type declarations. This is the primary guard against shipping a broken package.
- **`dtsGuard.mjs`** – Standalone script that inspects the emitted `.d.ts` files in `dist/esm` and `dist/cjs` for three classes of silent consumer breakage: ESM/CJS declaration mismatch, `node:` builtin imports leaking into browser-facing types, and type references escaping the private `internal/` directory.
- **`attw.mjs`** – Additional packaging validation script (no documented description beyond its name, which suggests an "attw"-style compatibility or type-check pass over the built output).

## How it connects

This module has **no internal dependencies** in the project's dependency graph. It is a leaf: it consumes the built package (via `npm pack` and the resulting tarball) but is not imported by any other module. It runs after a build and stands alone, typically invoked from a CI step or a top-level `npm run` script.

## Where to start

1. **`smoke.mjs`** – Reading this first gives you the full picture of what a "correct" published package looks like from a consumer's perspective (install → import → call → verify).
2. **`dtsGuard.mjs`** – A shorter, self-contained script that makes concrete, checkable claims about declaration-file hygiene; useful for understanding the type-level guarantees the package promises.

## Connected modules
_(none)_

## Files
- `tests/package/attw.mjs`
- `tests/package/dtsGuard.mjs` — A standalone guard script that validates the published `.d.ts` declaration files in `dist/esm` and `dist/cjs` to catch three classes of silent consumer breakage: ESM/CJS declaration mismatch, `node:` builtin imports in browser-facing types, and type references that leak from the private `internal/` directory.
- `tests/package/smoke.mjs` — End-to-end packaging smoke test. It runs `npm pack`, installs the resulting tarball into a throwaway directory, then imports the package the two ways a real consumer would (`require()` and `import`), calls actual functions, and verifies the export surface, file set, and type declarations. It exists because the unit suite (Jest + ts-jest) resolves `../src` directly and never exercises `main`, `exports`, `files`, or `dist`, so packaging regressions would ship green.

---
[[js-toolkit_INDEX|← js-toolkit index]]
