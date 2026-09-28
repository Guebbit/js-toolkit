---
source: src/getElementCenter.ts
sha256: a2688f9a6ea4f3495aeba35c0126f43e9c82b38c4e0c264b18e405498e4a4ffb
generated_at: 2026-09-28T19:37:39.039519+00:00
model: ollama:qwen3.8:27b
---

# src/getElementCenter.ts

## Purpose

Provides a single utility to compute the geometric centre of a DOM element as a pair of viewport-relative coordinates, derived from its bounding rect.

## Key elements

- **Default export** — `(element: Element): [number, number]`. Calls `element.getBoundingClientRect()` and returns `[left + width/2, top + height/2]`. No other exports exist.

## Relationships

- **src/index.ts** — re-exports this module as part of the package's public API surface.

## Notes

- The return type is the tuple `[number, number]`, not `number[]`, so callers can destructure with the guarantee of exactly two values.
- Coordinates are **viewport-relative** (not document-relative); they shift with scroll. Callers that need stable document coordinates must offset by `scrollX`/`scrollY` themselves.
- The function is pure with respect to its input (no mutations, no side effects beyond reading layout), so it is safe to call repeatedly.
