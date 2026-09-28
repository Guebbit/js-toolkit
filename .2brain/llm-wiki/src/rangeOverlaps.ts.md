---
source: src/rangeOverlaps.ts
sha256: 5d13f27e53d88ded9add9c662d6a139f74efd88239f9370ad380090007cb5296
generated_at: 2026-09-28T19:41:39.021069+00:00
model: ollama:qwen3.8:27b
---

# src/rangeOverlaps.ts

## Purpose

Provides a single utility that quantifies the overlap between two numeric intervals as a magnitude (number of units), returning `0` when the intervals do not intersect. Exists so callers can both test *whether* two ranges overlap and *how much* they overlap in one call.

## Key elements

- **`export default`** — `(firstStart, firstEnd, secondStart, secondEnd, sameUnitOverlap = false) => number`. Computes `min(firstEnd, secondEnd) − max(firstStart, secondStart)`, adds `1` when `sameUnitOverlap` is `true`, and clamps the result to `0` via `Math.max`.

## Relationships

- **`src/index.ts`** — Re-exports this module so consumers can import the overlap function from the package entry point rather than reaching into `src/` directly.

## Notes

- The `sameUnitOverlap` parameter controls an edge case: when one range's end equals the other's start (e.g. `[1, 3]` and `[3, 5]`), the default (`false`) treats that as **zero** overlap. Passing `true` makes it count as **1 unit**. The JSDoc explicitly calls out dates as a scenario where the boundary should *not* count — verify which convention your caller expects before changing the default.
- The function is symmetric: argument order for the two ranges does not matter.
