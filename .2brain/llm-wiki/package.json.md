---
source: package.json
sha256: c1a9b115248c53a559a91493c2e2cdaf3aec81c6a31759447138b2e47e94b332
generated_at: 2026-09-28T18:18:50.847041+00:00
model: ollama:qwen3.8:27b
---

# package.json

## Purpose

npm package manifest for `@guebbit/js-toolkit` v2.3.0 — a zero-runtime-dependency TypeScript utility library. It declares the dual ESM/CommonJS build, the public export surface, publishing constraints, and the full dev-tooling + CI script surface for the project.

## Key elements

- **`exports` map** — Defines the public API surface: root (`.`), subpath (`./*`) each resolved to `dist/esm/` or `dist/cjs/` with per-conditional `types`; `./internal/*` is explicitly set to `null` to block consumer imports; `./package.json` is exposed for tooling.
- **`type: "module"` / `sideEffects: false`** — Marks the package as ESM-by-default and signals to bundlers that every export is safe to tree-shake.
- **`main` / `module` / `types`** — Legacy top-level entry points (CJS, ESM, types) for older resolvers.
- **`engines.node: ">=20"`** — Minimum runtime requirement.
- **`files`** — Whitelist for npm publish: `dist/`, `README.md`, `LICENSE`, `CHANGELOG`.
- **`scripts`** — Full workflow: `build` (custom `scripts/build.mjs`), `test` (Jest), `test:types`, `test:package` (publint + attw + smoke + dtsGuard), `test:mutation` (Stryker), `lint`/`prettier`, `docs:*` (VitePress), `complete` / `complete:check` (full gate), `prepublishOnly` (clean-tree check + full gate), `publish:public`.
- **`devDependencies`** — All tooling: TypeScript 5.9, Jest 30 + ts-jest, ESLint 9 + plugins, Prettier, Stryker mutators, VitePress, husky, commitlint, publint, `@arethetypeswrong/cli`, `fast-check`, `expect-type`. **No `dependencies` or `peerDependencies`** — the library ships with zero runtime deps.
- **`license`** — AGPL-3.0.
- **`prepare`** — Installs husky git hooks on `npm install` (dev only).

## Relationships

No graph neighbors are registered for this file. It is the root manifest; all other project files (source, tests, scripts, docs) are consumed _through_ the tooling it declares.

## Notes

- **`./internal/*` is hard-blocked** via `"./internal/*": null` in `exports`. Any attempt to `import '@guebbit/js-toolkit/internal/foo'` will fail at resolution time — internal modules are not part of the public API.
- **`sideEffects: false`** is a contract to bundlers (Rollup, esbuild, webpack). If any module ever gains global side effects (e.g. polyfill registration), this flag must be removed or scoped.
- **Publishing is gated twice**: `prepublishOnly` runs `check:clean` (rejects dirty git tree) and then `complete:check` (lint + typecheck + build + all test suites + docs build). `publish:public` just adds `--access public` on top.
- **`type: "module"`** affects any `.js`/`.mjs` files shipped in `dist/`; the CJS build (`dist/cjs/`) relies on the `exports` map's `"require"` condition to be treated as CommonJS despite the top-level flag.
- **No `dependencies` key at all** — the library is intentionally dependency-free at runtime. All listed packages are dev-only and never ship to consumers.
