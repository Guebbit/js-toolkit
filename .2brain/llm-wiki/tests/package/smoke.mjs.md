---
source: tests/package/smoke.mjs
sha256: a1ad70ef2623854f797505773acfdc59eb38768dff3fb1e7b73039a9ff258c52
generated_at: 2026-09-28T19:53:56.169981+00:00
model: ollama:qwen3.8:27b
---

# tests/package/smoke.mjs

## Purpose

End-to-end packaging smoke test. It runs `npm pack`, installs the resulting tarball into a throwaway directory, then imports the package the two ways a real consumer would (`require()` and `import`), calls actual functions, and verifies the export surface, file set, and type declarations. It exists because the unit suite (Jest + ts-jest) resolves `../src` directly and never exercises `main`, `exports`, `files`, or `dist`, so packaging regressions would ship green.

## Key elements

- **`check(label, fn)`** — test harness; runs `fn()`, prints `ok`/`FAIL` with the child process's stdout/stderr on failure. Increments a `failures` counter.
- **`run(command, args, cwd)`** — thin wrapper around `execFileSync` (no shell, piped output).
- **`frozenExports`** — loaded from `tests/package/exports.json`; a deliberately frozen list of public module names that only changes via a conscious edit.
- **`sourceExports`** — derived at runtime by reading `src/*.ts` (excluding `index`), so the expected export list tracks the source tree without a hardcoded count.
- **Export-list cross-check** — asserts `frozenExports` and `sourceExports` agree in both directions (catches both "added to src but not frozen" and "frozen entry whose source was deleted").
- **Published file-set check** — verifies `dist/esm/index.js`, `dist/esm/index.d.ts`, `dist/cjs/index.js`, `dist/cjs/index.d.ts`, and `pkg.types` all exist in the installed tarball.
- **CJS marker check** — asserts `dist/cjs/package.json` exists and declares `"type": "commonjs"`; without it, Node treats the CJS output as ESM (root is `"type": "module"`) and `require()` fails.
- **Orphan-module check** — walks `dist/esm/*.js` in the tarball and flags any file with no matching `src/` file (catches stale output from `tsc`'s no-clean behavior).
- **CommonJS consumption test** — writes a `.cjs` script that `require()`s the barrel, calls `getDelta`, validates the full named-export set, and resolves a subpath (`pkg.name + '/getDelta'`).
- **ESM consumption test** — writes an `.mjs` script that uses named imports, the namespace import, asserts no `default` export exists, calls `getMapDistance`, and resolves the subpath via `await import`.
- **Internal-module refusal test** — for each file in `src/internal/`, asserts that both `require.resolve` and dynamic `import` throw `ERR_PACKAGE_PATH_NOT_EXPORTED` (verifies the `./internal/*: null` entry in the exports map).
- **Type-check (CJS and ESM)** — writes a `consume.ts` that imports named types (`ISetCookieOptions`), a value, and a subpath default; typechecks it under both `"type": "module"` and `"type": "commonjs"` consumer packages.

## Relationships

No graph neighbors. The script is self-contained: it shells out to `npm` and `node` and reads the repository's `src/`, `package.json`, and `tests/package/exports.json` at runtime. It is invoked by `npm run test:package`, which the build pipeline (`complete:check`, CI) schedules *after* the `build` step.

## Notes

- **Does not build `dist`.** It assumes `dist/` already exists. Running it in isolation without a prior build will produce misleading failures.
- **`exports.json` is a contract file.** Deleting an entry from it is treated as a semver-major, CHANGELOG-worthy act. The test enforces both directions (src → frozen and frozen → src) to prevent silent shrinkage or zombie entries.
- **The dual-format marker is critical.** The root `package.json` declares `"type": "module"`, so `dist/cjs/*.js` only parses as CommonJS because of a `dist/cjs/package.json` with `"type": "commonjs"`. Losing that file breaks `require()` at consumer runtime while every unit test stays green — this is the exact scenario this file catches.
- **`tsc` never cleans its `outDir`.** A deleted source file leaves its old `.js` behind, and `files: ["dist"]` ships it. The orphan check is the only guard against that.
- **The subpath export test** (`pkg.name + '/getDelta'`) exercises the `exports` map's subpath entries, which a wildcard mismatch or missing mapping would silently break for consumers.
- **No `default` export is expected.** The barrel exports named symbols only; a `default` would be a CommonJS-interop artifact and is explicitly asserted absent in the ESM consumer.
