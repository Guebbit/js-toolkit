---
generated_at: 2026-09-28T19:59:52.761233+00:00
model: ollama:qwen3.8:27b
---

# Repository Overview

A TypeScript library of small, composable utility functions. Each `src/*.ts` module exports one focused helper (array manipulation, formatting, DOM/browser actions, file handling, time calculations, etc.). `src/index.ts` is a barrel file that re-exports all ~108 utilities under a single entry point.

## Main Areas

| Area                             | Contents                                                                                   | Notes                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Utilities (`src/`)**           | ~108 single-purpose modules (e.g. `arrayChunks`, `formatCurrency`, `getCookie`, `getJson`) | Grouped thematically by domain: arrays & objects, strings, numbers & ranges, time, JSON, errors, browser/DOM, Node/file, etc. |
| **Internal (`src/internal/`)**   | `resolveLocale.ts`                                                                         | Shared helper not meant for public re-export.                                                                                 |
| **Tests (`tests/`)**             | Property-based specs and `*.test-d.ts` type tests                                          | Verify runtime invariants and exported types.                                                                                 |
| **Docs (`docs/`)**               | VitePress site: per-domain API pages + guides (getting started, testing)                   | Mirrors the `src/` groupings.                                                                                                 |
| **Tooling (`scripts/`, config)** | Build script, mutation baseline, ESLint config, `package.json`                             | Standard build/lint/mutation-test pipeline.                                                                                   |

## How the Pieces Relate

```
src/index.ts  ──re-exports──▶  src/*.ts  (one utility per file)
                                  │
        tests/  ──imports──▶     │     ──▶  src/internal/ (shared helpers)
        docs/   ──documents──▶   │
```

Each utility module is self-contained; cross-module dependencies are limited (most connect to only 1–3 files).

## Where to Start

1. **`README.md`** – project purpose, install, and quick examples.
2. **`src/index.ts`** – the full public API surface in one file.
3. **`docs/guide/getting-started.md`** – usage patterns and conventions.
4. **`docs/api/<domain>.md`** – detailed API reference for a specific area (e.g. `arrays-and-objects`, `browser-platform`, `time`).
5. **`tests/`** – property-based and type tests that illustrate intended behavior and edge cases.
