---
source: tests/arrayColumns.spec.ts
sha256: 7a8bf6e3d37cec02cbb067ec3d3970028d2db9379665e97a9bd1b8f425b0467f
generated_at: 2026-09-28T19:43:27.178739+00:00
model: ollama:qwen3.8:27b
---

# tests/arrayColumns.spec.ts

## Purpose

Test suite for the `arrayColumns` utility, verifying that it correctly extracts values from one or more named columns across an array of row objects. It also pins down edge-case behavior: non-array inputs, missing/null rows, empty column names, and prototype-property safety.

## Key elements

- **`input` fixture** – Array of three row objects (`id`, `param1`, `param2`, optional `param3`) shared by all tests.
- **Single-column (array form)** – `arrayColumns(input, ['param1'])` returns an array of single-element arrays.
- **Multi-column** – `arrayColumns(input, ['param1','param3'])` returns rows with `undefined` where a row lacks the requested key.
- **Single haystack / single column** – Passing one row object still yields the array-of-arrays shape.
- **Single-column (string form)** – `arrayColumns(input, 'param1')` returns a flat array of values (no wrapping).
- **Null/undefined row guard** – A `null` or `undefined` entry in the haystack produces `undefined` in the result rather than throwing.
- **Empty column name** – `arrayColumns([{ '': 'lorem' }], [''])` returns `[[undefined]]`; an empty string is not treated as "all columns."
- **Prototype-property guard** – Requesting `'toString'` on a plain object returns `[[undefined]]`, confirming an own-property check.

## Relationships

- **`src/index.ts`** – The spec imports `arrayColumns` from `'../src'`, which resolves to this barrel file; it is the re-export point that makes the function available here.
- **`src/arrayColumns.ts`** – The implementation under test. All assertions in this file validate its contract.

## Notes

- The function's public API is polymorphic: an **array** of column names produces an array-of-arrays result; a **single string** produces a flat array. Tests lock in both shapes.
- The `toString` test implicitly requires a `hasOwnProperty` (or equivalent) guard in the implementation—using a naive `row[col]` lookup would leak prototype methods.
- `null`/`undefined` rows are cast with `as unknown as Record<string, unknown>` and an eslint-disable for `unicorn/no-null`; this reflects that the type signature doesn't admit `null` but the runtime guard must still handle it.
