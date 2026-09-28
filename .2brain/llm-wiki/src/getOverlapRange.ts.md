---
source: src/getOverlapRange.ts
sha256: 667ad83fbcf70aab315b8a76dc5fbe42111e3ab1243d5fd9c943d1f2a69c87d3
generated_at: 2026-09-28T19:38:52.275221+00:00
model: ollama:qwen3.8:27b
---

# src/getOverlapRange.ts

## Purpose

Computes the intersection (overlap) of two numeric ranges and returns the resulting `[start, end]` tuple. It exists to provide a single, reusable primitive for determining the shared interval between any two ranges (e.g., time periods), with a well-defined sentinel for the "no overlap" case.

## Key elements

- **`export default (firstStart, firstEnd, secondStart, secondEnd): [number, number]`** — Computes overlap as `max(starts)` / `min(ends)`. Returns `[start, end]` when the width is strictly positive; otherwise returns `[0, 0]`.

## Relationships

- **`src/index.ts`** — Imports and re-exports this function as part of the public API surface of the package.

## Notes

- `[0, 0]` is the universal "no overlap" sentinel. A real intersection always has strictly positive width (`end > start`), so `[0, 0]` can never be a legitimate result.
- Ranges that merely touch (one's end equals the other's start) are **not** considered overlapping and will return `[0, 0]`.
- The function is symmetric: argument order of the two ranges does not affect the result.
- No input validation is performed (e.g., `start > end` in a range is not caught here); callers are responsible for passing well-formed ranges.
