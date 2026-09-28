---
source: tests/coerceStringArray.spec.ts
sha256: 1ecadbedb50ce83be97732bd62c69bc3a6e8f8a6dfcac722ae2e4f14167bde63
generated_at: 2026-09-28T19:44:22.015218+00:00
model: ollama:qwen3.8:27b
---

# tests/coerceStringArray.spec.ts

## Purpose

Unit test suite for the `coerceStringArray` utility. Verifies that the function normalises any input (arrays, comma-separated strings, scalars, objects with custom `toString`) into a flat array of trimmed, non-empty strings, and returns `[]` for nullish or blank inputs.

## Key elements

- **`describe('(coerceStringArray) …')`** — single describe block containing 9 test cases that collectively pin down the coercion contract.
- **Array input tests** — confirms items are mapped through `String()`, trimmed, and empty strings are dropped.
- **Comma-string test** — confirms a plain string is split on commas before trimming.
- **Nullish tests** — `null` and `undefined` (omitted arg) both yield `[]`.
- **Scalar-wrap tests** — numbers and booleans are stringified into a one-element array.
- **Blank-input tests** — whitespace-only strings, empty arrays, and objects whose `toString()` returns whitespace all yield `[]` (not `['']`).
- **Custom `toString` tests** — objects with padded or blank `toString` output are trimmed or discarded respectively.

## Relationships

- **`src/index.ts`** — the sole import target; provides the `coerceStringArray` function under test. No other modules are referenced.

## Notes

- The null test carries an `eslint-disable-next-line unicorn/no-null` comment because the lint rule forbids `null` literals; the disable is scoped to that single line.
- The contract explicitly distinguishes "value stringifies to `''`" (→ `[]`) from "value stringifies to something" (→ `['…']`). Any change to `coerceStringArray` that introduces a `['']` result will break two dedicated tests.
- The function is exercised through its public API only (imported from the package root); no internal helpers or module internals are tested here.
