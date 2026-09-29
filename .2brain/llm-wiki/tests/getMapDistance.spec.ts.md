---
source: tests/getMapDistance.spec.ts
sha256: 47c46af83303fcaa21c79712703b36f381261836ba3d151c25cc6e52fddc3b51
generated_at: 2026-09-28T19:49:57.399650+00:00
model: ollama:qwen3.8:27b
---

# tests/getMapDistance.spec.ts

## Purpose

Unit tests for the `getMapDistance` function, verifying both plain (unbounded) Euclidean distance and the optional wrapping-around-map-edges behavior. The test suite is written to catch specific regressions: swapped axis arguments, leaking map size into a coordinate, and non-symmetric results.

## Key elements

- **`describe('(getMapDistance) …')`** — top-level suite; no setup/teardown hooks.
- **Zero-distance test** — same point returns `0`.
- **3-4-5 triangle test** — pins the exact Pythagorean result so a swapped-arg bug shows as a wrong number, not just a reordered one.
- **Single-axis test** — `getMapDistance(10,25,5,5)` → 15 and the reversed call, confirming axis independence.
- **Axis-pairing test** — calls with a 5th argument (map size = 400) and without, asserting both yield ≈ 22.36. The comment flags the specific failure mode: feeding `(size, Xa, Xb)` into `getDelta` produces 417.73 instead of 22.36.
- **Non-negative test** — guarantees the result is `>= 0` regardless of argument order.
- **Wrap-around test** — on a 100-unit map, `getMapDistance(5,95,0,0,100)` → 10 (short path across the edge), and a diagonal wrap gives `Math.hypot(10,10)`.
- **Symmetry test** — swapping both points produces the identical distance.

## Relationships

- **`src/index.ts`** — the sole import target; provides the `getMapDistance` function under test. No other modules are touched.

## Notes

- The function signature is positional: `(x1, y1, x2, y2, size?)`. The 5th argument (`size`) is optional and enables edge-wrapping; omitting it yields plain Euclidean distance.
- Test comments are written to explain _which_ regression each case guards against (swapped args, size-as-coordinate confusion). Keep them when editing so the intent stays visible.
- The suite uses `toBe` for exact integer results and `toBeCloseTo` for floating-point results; match that convention when adding cases.
