---
source: src/arrayDepth.ts
sha256: 6092477fead1b3af40bc159c928a7c14e9fd92a925276e8e8e76cdcb668953f8
generated_at: 2026-09-28T18:20:31.726625+00:00
model: ollama:qwen3.8:27b
---

# src/arrayDepth.ts

## Purpose

Provides a single utility function that computes the nesting depth of a (possibly nested) array by recursive inspection: a non-array value has depth 0, and an array has depth 1 + the maximum depth of its elements.

## Key elements

- **`arrayDepth<T>(check: T | T[]): number`** (default export) — Recursively measures nesting depth. Returns `0` for any non-array value; for an array, returns `1 + Math.max(0, …elementDepths)`. The `Math.max(0, …)` guard ensures an **empty array** yields depth `1` (not `NaN`).

## Relationships

- **`src/index.ts`** — Re-exports `arrayDepth` as part of the package's public API surface.
- **`tests/arrayDepth.spec.ts`** — Unit tests exercising the depth calculation across various nesting levels and the empty-array edge case.
- **`tests/properties/collections.property.spec.ts`** — Property-based tests (e.g. fast-check) that generate random nested structures and assert depth invariants against this function.

## Notes

- The generic parameter `T` is unconstrained, so the function accepts any value type, not just arrays.
- An empty array is depth **1** (it is itself an array with no deeper elements), not 0. Callers relying on `0` to mean "flat/non-array" will see `1` for `[]`.
- Only a **default** export is provided; consumers must import with a default syntax (`import arrayDepth from …`).
