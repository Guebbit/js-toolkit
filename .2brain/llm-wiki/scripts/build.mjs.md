---
source: scripts/build.mjs
sha256: 8ec1273fd3a5a9a29dcee22eb622a77ef6dcbe04b98ff88155cb394d9986d5de
generated_at: 2026-09-28T18:19:05.549671+00:00
model: ollama:qwen3.8:27b
---

# scripts/build.mjs

## Purpose

Builds dual ESM and CommonJS outputs (plus type declarations) from a single TypeScript source tree by invoking `tsc` twice with separate tsconfig files, then writes marker `package.json` files so Node resolves each output directory with the correct module system.

## Key elements

- **`root`** — Resolves the project root directory (one level up from this script) using `fileURLToPath(import.meta.url)`.
- **`run(args)`** — Shorthand wrapper around `execFileSync('npx', args, …)` that executes with the project root as cwd and inherited stdio.
- **`fs.rmSync(…dist, { recursive: true, force: true })`** — Clears any previous `dist/` output before building.
- **`run(['tsc', '-p', 'tsconfig.build.esm.json'])`** — Emits ESM + declarations into `dist/esm`.
- **`run(['tsc', '-p', 'tsconfig.build.cjs.json'])`** — Emits CJS + declarations into `dist/cjs`.
- **Marker `package.json` writes** — Writes `{"type":"commonjs"}` into `dist/cjs/` and `{"type":"module"}` into `dist/esm/` so Node's nearest-`package.json` lookup picks the right parser.

## Notes

- The root `package.json` declares `"type": "module"`, which means Node would parse _everything_ under the tree as ESM by default. Without the explicit `dist/cjs/package.json` marker, `require()` calls against the CJS output would fail at runtime. The ESM marker is written for symmetry/explicitness.
- The script is plain top-level code (no exported function); it is expected to be invoked directly via `node scripts/build.mjs` (or an equivalent npm script), not imported.
- `execFileSync` is used (synchronous, blocking) rather than `exec`/`execFile` with callbacks, so the two `tsc` runs are strictly sequential.
