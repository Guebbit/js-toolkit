---
source: src/match.ts
sha256: 32c3fe2035441d935d2478115ad14c80faf2f001254e68211e8928dd9b3005ff
generated_at: 2026-09-28T19:41:26.504569+00:00
model: ollama:qwen3.8:27b
---

# src/match.ts

## Purpose

Provides a single string-comparison function that supports five comparison modes (exact, contains, contained, either, fuzzy) with optional case-sensitivity and a configurable edit-distance threshold. It centralises the "do these two strings match?" logic so callers don't reimplement trimming, normalisation, or distance checks.

## Key elements

- **`TMatchMode`** (type) — Union of the five valid comparison modes: `'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'`.
- **`IMatchOptions`** (interface) — Optional configuration: `sensitive` (default `false`), `mode` (default `'contained'`), `maxDistance` (default `0`, used only by `fuzzy`).
- **default export** — `(check, against, options) => boolean`. Trims both inputs, lowercases unless `sensitive`, short-circuits on equality, then dispatches to the selected mode. `fuzzy` delegates the distance calculation to `levenshteinDistance`.

## Relationships

- **`src/levenshteinDistance.ts`** — Imported and called inside the `fuzzy` branch to compute edit distance between the two normalised strings.
- **`src/index.ts`** — Re-exports this module as part of the package's public API (indicated by the `@module` JSDoc tag).
- **`tests/types/strings.test-d.ts`** — Consumes the exported types (`TMatchMode`, `IMatchOptions`) in compile-time type assertions to ensure the public type surface is correct.

## Notes

- The default mode is `'contained'` (i.e. `check` is a substring of `against`), not `'contains'`. The parameter order `check` / `against` is intentional: for `contains` it reads "check contains against", for `contained` it reads "check is contained in against". Swapping the arguments flips the meaning of the one-way modes.
- The equality short-circuit means `fuzzy` with `maxDistance: 0` is equivalent to `exact`; it never actually calls `levenshteinDistance` when the strings are already equal.
- Both inputs default to `''`, so calling the function with zero arguments returns `true` (empty strings are equal after trimming).
