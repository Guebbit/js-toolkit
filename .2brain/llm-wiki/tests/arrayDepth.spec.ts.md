---
source: tests/arrayDepth.spec.ts
sha256: 9498452bbf055c8cb2f5e03266f821577ab3d909f3d19cd00c4b88a7a48fb665
generated_at: 2026-09-28T19:43:37.669339+00:00
model: ollama:qwen3.8:27b
---

# tests/arrayDepth.spec.ts

## Purpose

Jest test suite for the `arrayDepth` utility. Verifies that the function correctly returns the nesting depth of an array (0 for non-arrays, N for N levels of nesting), including an irregularly nested "complex" case.

## Key elements

- **`describe('(arrayDepth) Get depth of array')`** – single test group; imports `arrayDepth` from `'../src'` (the barrel at `src/index.ts`).
- **Tests (5 cases):**
  - Non-array string → expects `0`.
  - Single-element array → expects `1`.
  - Doubly nested array → expects `2`.
  - Triply nested array → expects `3`.
  - Irregularly nested array (mixed scalars and sub-arrays at multiple levels) → expects `4`.

## Relationships

- **`src/arrayDepth.ts`** – contains the implementation of `arrayDepth`; this spec is its sole test.
- **`src/index.ts`** – barrel/re-export module; the test imports `arrayDepth` through it (`import { arrayDepth } from '../src'`) rather than reaching into `src/arrayDepth.ts` directly.

## Notes

- The test imports from the package root (`'../src'`), not from the individual module. If `src/index.ts` changes its exports, this test breaks even if `arrayDepth` itself is untouched.
- The "complex" case uses a ragged array (`[1, 2, [3, 4, [5, 6], 7, [8, [9, 91]], 10], 11, 12]`) to confirm depth is measured by the *deepest* nesting path, not the average or first branch.
