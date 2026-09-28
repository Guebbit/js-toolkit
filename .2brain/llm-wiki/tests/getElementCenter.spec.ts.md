---
source: tests/getElementCenter.spec.ts
sha256: fb86f634cd6fb2135870024abc262c80f6edfad4492ae1b5630f357e5f8cc524
generated_at: 2026-09-28T19:48:27.573750+00:00
model: ollama:qwen3.8:27b
---

# tests/getElementCenter.spec.ts

## Purpose

Unit tests for the `getElementCenter` function, verifying that it correctly computes the `[x, y]` center coordinates from a DOM rect's `left`, `top`, `width`, and `height` properties. Tests cover standard, zero-sized, and offset elements.

## Key elements

- **`describe('getElementCenter')`** — Test suite containing three cases:
  - *"calculates the center of a given element"* — 100×200 rect at origin expects `[50, 100]`.
  - *"handles element with zero width and height"* — Degenerate 0×0 rect expects `[0, 0]`.
  - *"calculates the center of a positioned element"* — 200×300 rect at (100, 150) expects `[200, 300]`.
- **`stubRect(...)`** (imported) — Builds a minimal object with `left`, `top`, `width`, `height` to stand in for a real DOM element's bounding rect, avoiding any real DOM dependency.

## Relationships

- **`src/index.ts`** — Source of the `getElementCenter` function under test. The spec imports it via `../src`.
- **`tests/_helpers/dom.ts`** — Provides `stubRect`, the test double that mimics the subset of a DOM node/rect interface that `getElementCenter` reads.

## Notes

- The expected return type is a two-element numeric tuple `[x, y]`, not an object. Tests assert with `toEqual` on arrays.
- The implied formula is `x = left + width / 2`, `y = top + height / 2`.
- No real DOM or `getBoundingClientRect` call is made; `stubRect` replaces the entire element, so the function under test must accept a plain object with those four numeric properties (structural typing).
