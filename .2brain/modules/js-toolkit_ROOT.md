---
tags:
  - 2brain
  - 2brain/module
  - project/js-toolkit
type: module
module: / (repository root)
files: 12
updated: 2026-09-28T20:00:08.563447+00:00
---

# / (repository root)

## Purpose

Root of **`@guebbit/js-toolkit`** (v2.3.0) — a zero-runtime-dependency, framework-free TypeScript utility library providing small, reusable helpers for array and object manipulation. The root directory holds all project-level configuration: the npm manifest, dual-build TypeScript configs, linting rules, and mutation-testing setup. There are no sub-modules; all source, build, and tooling concerns live here.

## Key parts

- **`package.json`** — Declares the public export surface, dual ESM/CommonJS build targets, publishing constraints, and every dev-tooling / CI script. This is the single source of truth for what the library exposes and how it is built.
- **TypeScript configs** (`tsconfig.json`, `tsconfig.build.cjs.json`, `tsconfig.build.esm.json`, `tsconfig.tests.json`, `tsconfig.types.json`, `tsconfig.eslint.json`) — A small family of extends-based configs that split concerns: base compiler options, CJS build, ESM build, test compilation, `.d.ts` generation, and the linting-specific config.
- **`eslint.config.mjs`** — Flat-config entry point wiring `typescript-eslint`, the Unicorn plugin, and JSDoc enforcement, with per-file overrides for tests, build scripts, and declaration files.
- **`stryker.config.json`** — Mutation-testing configuration (Stryker) for measuring the effectiveness of the test suite.
- **`README.md` / `CLAUDE.md`** — Human- and agent-facing overviews of the library's scope (array/object helpers) and usage.
- **`PLAN_FORMAT_CURRENCY.md`** — A decision record (D18, option A) documenting a chosen approach for currency formatting within the toolkit.

## How it connects

This module has **no internal sub-module dependencies**. It is a self-contained library: everything (source helpers, tests, build scripts, configuration) resides at this root level. Downstream consumers interact with it solely through the exports declared in `package.json`.

## Where to start

1. **`README.md`** — Two minutes of reading that tells you *what* the library does and *how* to import its helpers.
2. **`package.json`** (the `"exports"` and `"scripts"` fields) — Reveals the exact public API surface and the commands that drive build, test, lint, and publish, giving you a map of the whole project workflow.

## Connected modules
_(none)_

## Files
- `CLAUDE.md` — A published npm library (`@guebbit/js-toolkit`): framework-free TypeScript helpers (arrays,
- `PLAN_FORMAT_CURRENCY.md` — Decided 2026-09-28** (`boilerplate-node-backend/DECISIONS.md`, D18, option A): fix it once, here,
- `README.md` — Small, dependency-free TypeScript helpers for the things that keep coming up: array and object
- `eslint.config.mjs` — ESLint flat-config entry point for the project. It wires together TypeScript-aware linting (`typescript-eslint`), the Unicorn plugin, and JSDoc enforcement, and applies per-file overrides for tests, build scripts, and declaration files. Every other source file is validated against the rules defined here.
- `package.json` — npm package manifest for `@guebbit/js-toolkit` v2.3.0 — a zero-runtime-dependency TypeScript utility library. It declares the dual ESM/CommonJS build, the public export surface, publishing constraints, and the full dev-tooling + CI script surface for the project.
- `stryker.config.json`
- `tsconfig.build.cjs.json`
- `tsconfig.build.esm.json`
- `tsconfig.eslint.json`
- `tsconfig.json`
- `tsconfig.tests.json`
- `tsconfig.types.json`

---
[[js-toolkit_INDEX|← js-toolkit index]]
