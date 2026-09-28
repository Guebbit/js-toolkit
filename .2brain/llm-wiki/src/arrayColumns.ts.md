---
source: src/arrayColumns.ts
sha256: e038b3c0e5055664b16c004689a5ad3febd13a27f730781d59585f448d214843
generated_at: 2026-09-28T18:20:16.802680+00:00
model: ollama:qwen3.8:27b
---

# src/arrayColumns.ts

## Purpose

A single-function module that mirrors PHP's `array_column`: it extracts one or more named properties from each record in an array of objects. It always preserves a 1-to-1 slot count with the input so the result can be zipped back by index.

## Key elements

- **`arrayColumns`** (default export) — The sole function. Two call signatures:
    - `arrayColumns(haystack, column: string)` → `unknown[]` — one flat value per record.
    - `arrayColumns(haystack, columns: string[])` → `unknown[][]` — one inner array (same order as `columns`) per record.
- Missing records (`null`/`undefined` in the haystack) or missing keys yield `undefined` in the corresponding slot; no exception is thrown.
- Property access uses `Object.hasOwn`, so inherited properties are **not** returned.

## Relationships

- **`src/index.ts`** — Re-exports `arrayColumns` as part of the public package surface.
- **`tests/arrayColumns.spec.ts`** — Unit tests covering single-column, multi-column, missing-key, and non-object-record cases.
- **`tests/properties/collections.property.spec.ts`** — Property-based (hypothesis-style) tests that treat `arrayColumns` as one of the collection primitives, verifying invariants like length preservation and round-trip zippability.

## Notes

- The return type is a union (`unknown[] | unknown[][]`) determined at runtime by `Array.isArray(columns)`. Callers relying on the single-column overload get a flat array; the multi-column overload gets nested arrays. There is no shared base type — downstream code must narrow by the overload it called.
- A `// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition` guard sits before the `record && column &&` check. The type system says both are always truthy, but partially-loaded or corrupted haystacks break that assumption at runtime; the guard is intentional, not a lint workaround.
- The function is **pure** and **synchronous** — no side effects, no async, no allocation beyond the two mapped arrays.
