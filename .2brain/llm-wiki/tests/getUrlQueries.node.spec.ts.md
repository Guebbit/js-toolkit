---
source: tests/getUrlQueries.node.spec.ts
sha256: 86ec27915d6d86052440ebf859bf6b5292216e0d5164ec869215c5652c0420b8
generated_at: 2026-09-28T19:50:37.758319+00:00
model: ollama:qwen3.8:27b
---

# tests/getUrlQueries.node.spec.ts

## Purpose

Covers the `getUrlQueries` branch that executes when no `location` global exists (SSR, workers, plain Node). This case cannot be reached under jsdom because `location` is always present and non-configurable there, so this spec runs in a bare Node environment to exercise that guard and its fallback.

## Key elements

- **`@jest-environment` directive** — Pins the suite to Stryker's Node jest-env wrapper (not stock `node`) so that mutation-coverage data is reported back to Stryker; under a normal Jest run it behaves identically to `node`.
- **`describe('(getUrlQueries) outside a browser')`** — Contains two focused assertions:
  - Asserts `typeof location === 'undefined'` and that `getUrlQueries()` returns `{}`.
  - Asserts that an explicitly passed query string (`'?lorem=ipsum&dolor=sit'`) still parses to the expected object.

## Relationships

- **`src/index.ts`** — The sole import target. `getUrlQueries` is re-exported from the package entry point; this spec tests its non-browser behavior.

## Notes

- Do not remove or "simplify" the `@jest-environment` directive to plain `node`; Stryker will fail the mutation run with a missing-coverage error if the wrapper is absent.
- This file is intentionally tiny. Its only job is the one `location`-absence branch that the jsdom-based suite cannot trigger.
