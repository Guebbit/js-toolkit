---
source: tests/rangeOverlaps.spec.ts
sha256: 039d79d55a9e375cda5c077bd4cf325d47f120f4e121a91dc03bed646488c168
generated_at: 2026-09-28T19:55:38.879962+00:00
model: ollama:qwen3.8:27b
---

# tests/rangeOverlaps.spec.ts

## Purpose

Jest test suite for the `rangeOverlaps` utility function. It verifies that the function correctly computes the number of overlapping units between two numeric ranges and handles the inclusive/exclusive boundary semantics correctly.

## Key elements

- **`describe('(rangeOverlaps) …')`** — top-level suite containing all assertions.
- **`rangeOverlaps(aStart, aEnd, bStart, bEnd, inclusive?)`** (imported, not defined here) — the unit under test. Returns the count of overlapping units (a number). The optional 5th argument toggles whether a shared boundary point counts as overlap.
- **Test cases** (8 total):
  - *Same time* — identical ranges return the full length.
  - *No intersection* — disjoint ranges return 0.
  - *Boundary touch, default* — `rangeOverlaps(50,100, 100,200)` → 0 (shared endpoint does **not** overlap).
  - *Boundary touch, inclusive* — `rangeOverlaps(50,100, 100,200, true)` → 1 (shared endpoint **does** overlap).
  - *A starts in B / B ends in A* — partial overlap from the left.
  - *A ends in B / B starts in A* — partial overlap from the right.
  - *A in B* — first range fully contained in the second.
  - *B in A* — second range fully contained in the first.

## Relationships

- **`src/index.ts`** — sole import source (`import { rangeOverlaps } from '../src'`). This file is the only consumer of that export in the test tree shown.

## Notes

- The 5th parameter (positional boolean, not destructured) is the only way to opt into inclusive-boundary behavior; omitting it means touching endpoints are **not** counted as overlap.
- The function returns a **number** (unit count), not a boolean. The inclusive-boundary case returns `1`, not `true`.
- Test names for the two boundary-touch cases use "No intersection" in both, which can be misleading — they actually exercise the *inclusive* edge case.
