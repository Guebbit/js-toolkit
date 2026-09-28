---
source: src/getMapDistance.ts
sha256: c9f430f32bb4f8f3e59c8c7e1eebcb5b22183d4503d6ab6c406985d1f8e970c8
generated_at: 2026-09-28T19:38:43.221900+00:00
model: ollama:qwen3.8:27b
---

# src/getMapDistance.ts

## Purpose

Computes the straight-line (Euclidean) distance between two points on a map. By delegating each axis to `getDelta`, it supports optional wrap-around (toroidal) distance when a map `size` is provided, then combines the two axis deltas with `Math.hypot`.

## Key elements

- **default export (anonymous function)** — Takes `Xa, Xb, Ya, Yb` (point A and B coordinates) and an optional `size` (default `0`, meaning unbounded). Returns a `number`: the combined distance.
- **`getDelta` call (×2)** — One per axis, passing the shared `size` so both axes receive identical wrap-around treatment.

## Relationships

- **`src/getDelta.ts`** — Imported as a module dependency. Provides the per-axis signed delta with optional modular wrap-around. This file calls it twice (X and Y) and feeds the results into `Math.hypot`.
- **`src/index.ts`** — Likely re-exports this function as part of the package's public API (standard barrel-file pattern).

## Notes

- `size = 0` disables wrapping; any positive value enables it on **both** axes simultaneously — there is no per-axis toggle.
- The distance is always non-negative and symmetric in A/B, since `Math.hypot` squares both arguments.
- The function is a thin composition; all non-trivial math (wrap-around logic) lives in `getDelta`.
