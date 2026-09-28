---
source: src/getDelta.ts
sha256: 0f9b1a5f3dd76307c8a39ebf467b3e38b11819c29dfa8c2535d9267a6a04dfa9
generated_at: 2026-09-28T19:37:31.254667+00:00
model: ollama:qwen3.8:27b
---

# src/getDelta.ts

## Purpose

Computes the distance between two numbers, either linearly or as the shorter arc on a wrapping circle of a given circumference. It exists as a low-level primitive that higher-level distance functions (e.g. map distance) rely on to handle both open and periodic axes uniformly.

## Key elements

- **`export default (a, b, size = 0) => number`** — The sole export. Returns `|a − b|` when `size ≤ 0`; otherwise reduces `|a − b|` modulo `size` and returns `min(wrapped, size − wrapped)`, guaranteeing a non-negative result ≤ `size / 2`.

## Relationships

- **`src/getMapDistance.ts`** — Direct consumer. Calls this function per-axis and feeds the result into `Math.hypot` to build a multi-axis distance.
- **`src/index.ts`** — Re-exports this module so external consumers can import `getDelta` from the package entry point.

## Notes

- `size` defaults to `0`, so the two-argument form is a plain absolute difference — no wrapping occurs unless a positive circumference is passed explicitly.
- The modulo step (`delta % size`) handles cases where `|a − b|` exceeds `size` (i.e. the gap wraps more than once) before selecting the shorter arc.
- The return value is always ≥ 0; no sign information is preserved.
