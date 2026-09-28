---
source: tests/levenshteinDistance.spec.ts
sha256: f236408ac927c028e757628a43cf37794ec951ade535572e23245f985a214ee7
generated_at: 2026-09-28T19:52:53.693923+00:00
model: ollama:qwen3.8:27b
---

# tests/levenshteinDistance.spec.ts

## Purpose

Test suite for the `levenshteinDistance` function, covering correctness across identical inputs, case differences, minor and major edits, empty strings, missing arguments, and `null` values. It exists to pin down the distance semantics (case-sensitive edit count, `null`/absent treated as `''`, and the `d(x, x) === 0` invariant) so regressions are caught immediately.

## Key elements

- **`describe('(levenshteinDistance) Levenshtein Distance from 2 strings (0)')`** — single test group containing all cases.
- **Identical / similar / very different string pairs** — asserts specific edit distances (0, 2, 4, 11) for `'lorem ipsum'` vs. various targets.
- **Empty / missing / `null` argument tests** — verifies that a missing or `null` argument is normalized to an empty string, and that two such values yield distance 0.
- **`// eslint-disable-next-line unicorn/no-null`** — two inline disables because the tests intentionally pass `null` to exercise the coercion path.

## Relationships

- **`src/index.ts`** — the sole import target (`from '../src'`). This file is the only consumer in the test suite for the `levenshteinDistance` export; no other test file in the graph imports from it.

## Notes

- The function is **case-sensitive**: `'lorem ipsum'` vs. `'Lorem Ipsum'` yields 2, not 0.
- Absent (undefined) and `null` are both coerced to `''` before distance computation; the comment in the source explicitly warns that violating `d(x, x) === 0` would mislead callers filtering on `distance <= threshold`.
- The `describe` title includes `(0)` — a convention indicating the expected distance for the canonical "same string" case in this group; the test name in parentheses mirrors the expected return value.
