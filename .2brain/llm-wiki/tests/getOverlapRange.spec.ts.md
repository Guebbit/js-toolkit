---
source: tests/getOverlapRange.spec.ts
sha256: ee80f161d1af72bbf6da37cae8cfaa30dd413d57030d3bdc0a6c4a4c2070381e
generated_at: 2026-09-28T19:50:11.658734+00:00
model: ollama:qwen3.8:27b
---

# tests/getOverlapRange.spec.ts

## Purpose

Jest test suite for `getOverlapRange`, which computes the intersection of two numeric ranges. It codifies the expected overlap semantics (shared endpoints count as overlap, zero-width ranges never overlap, result is symmetric) and guards against regressions discovered via property-based testing (fast-check).

## Key elements

- **`getOverlapRange(startA, endA, startB, endB)`** — imported from `../src`; returns `[overlapStart, overlapEnd]` or `[0, 0]` when no overlap exists.
- **Test cases** cover: identical ranges, disjoint ranges (including touching endpoints), partial containment in both directions, and shared-start / shared-end edge cases.
- **Symmetry tests** — assert that swapping the two range arguments yields the same result for shared-start and shared-end pairs.
- **Zero-width regression test** — confirms a degenerate range (`start === end`) reports no overlap even when it "touches" another range.

## Relationships

- **`src/index.ts`** — the module under test. `getOverlapRange` is re-exported from `src/index.ts`; this spec imports it via the relative path `../src` and asserts its return values directly.

## Notes

- `[0, 0]` is the sentinel for "no overlap." A caller must treat a legitimate overlap of `[0, 0]` as impossible (zero-width is explicitly rejected), so the sentinel is unambiguous.
- The shared-endpoint tests (e.g. `[50,100]` vs `[100,200]`) confirm that touching endpoints are **not** considered overlap.
- The shared-start/shared-end tests (e.g. `[0,2]` vs `[0,1]`) confirm that sharing a boundary point **is** overlap. The distinction: one endpoint touching is non-overlap; one range starting where the other also starts (with different ends) is overlap.
- A comment notes the shared-start/end case originates from a fast-check counterexample, suggesting the original implementation had an off-by-one at that boundary.
