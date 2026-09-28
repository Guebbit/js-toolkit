---
source: tests/getDelta.spec.ts
sha256: 25640e63334159f68f6eaff09d08d18d3f265e4be651120730fb4cf49bed1f32
generated_at: 2026-09-28T19:48:15.223420+00:00
model: ollama:qwen3.8:27b
---

# tests/getDelta.spec.ts

## Purpose

Jest test suite for `getDelta`, which computes the distance between two numbers in either linear space or a wrapping (circular) space of a given size. It locks down the function's contract: non-negative results, symmetry, correct handling of the wrap boundary, and degenerate inputs.

## Key elements

- **`import { getDelta } from '../src'`** — the single unit under test, pulled from the package's public entry point.
- **"linear space" describe block** — verifies `getDelta(a, b)` (size omitted or ≤ 0) returns `|a − b|`, is never negative, is 0 for identical inputs, and treats a negative `size` the same as no size.
- **"wrapping space" describe block** — verifies `getDelta(a, b, size)` with `size > 0` returns the shorter of the two arc paths around a circle, never exceeds `size / 2`, reduces gaps larger than `size` via modular arithmetic, and is symmetric in its two numeric arguments.

## Relationships

- **`src/index.ts`** — re-exports `getDelta`; this spec imports it through that barrel, so any change to the export name or the function's signature in `src/index.ts` (or the module it re-exports from) will break this file. The test comments also reference `getMapDistance` (which calls `Math.hypot` on delta results) as a downstream consumer, making the non-negativity guarantee a cross-module contract.

## Notes

- A negative or zero `size` is **not** an error; it silently falls back to linear (absolute-difference) behavior. Tests assert this explicitly so a refactor that throws on negative size will be caught.
- The non-negativity tests exist because `getMapDistance` squares deltas inside `Math.hypot`; a negative delta would not change the squared value but signals a logic error that the tests are designed to surface early.
- The diametrically-opposite test (`getDelta(0, 50, 100) === 50`) guards against a tie in `Math.min` producing inconsistent results depending on floating-point or branch order.
