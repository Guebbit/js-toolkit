---
source: tests/isInViewport.spec.ts
sha256: a59dd7525b38124b342f69e14925d80775863d0af4e2c5411554a8c16f4be82f
generated_at: 2026-09-28T19:52:12.079363+00:00
model: ollama:qwen3.8:27b
---

# tests/isInViewport.spec.ts

## Purpose

Unit tests for the `isInViewport` utility, verifying both its default "any pixel visible" mode and its `fully` mode where the element must be entirely within the viewport. Includes explicit boundary tests that isolate each comparison in the viewport-intersection logic to guarantee full branch coverage.

## Key elements

- **`beforeAll`** – Patches `globalThis.innerWidth` / `innerHeight` to fixed values (1024 × 768) for a deterministic viewport.
- **`describe('isInViewport')`** – Top-level suite covering:
  - Basic visibility: fully inside → `true`, partially inside → `true`, entirely outside → `false`.
  - `fully` parameter: partial visibility with `fully: true` → `false`; full visibility with `fully: true` → `true`.
- **`describe('partial branch boundaries')`** – Four tests, each causing exactly one of the four strict-inequality checks (`top < h`, `bottom > 0`, `left < w`, `right > 0`) to fail, confirming the element is reported as *not* in the viewport.
- **`describe('fully branch boundaries')`** – Eight tests (each boundary at the exact edge and one pixel past) confirming the inclusive logic (`>= 0`, `<= width/height`): touching the edge → `true`, one pixel beyond → `false`.

## Relationships

- **`src/index.ts`** – Provides the `isInViewport` function under test (imported directly).
- **`tests/_helpers/dom.ts`** – Provides `stubRect`, a helper that fabricates a `DOMRect`-shaped object without requiring a real DOM element.

## Notes

- The two modes use *different* comparison operators: the partial branch uses **strict** inequalities (element touching an edge is **not** considered in-viewport), while the fully branch uses **inclusive** comparisons (touching an edge **is** considered fully in-viewport). The boundary tests exist specifically to pin this asymmetry.
- Viewport dimensions are set via `Object.defineProperty` on `globalThis` rather than a framework mock, so any test running in the same worker inherits these values unless it redefines them.
- `stubRect` returns a plain object with `{top, left, bottom, right}`; the code under test must read only those four properties.
