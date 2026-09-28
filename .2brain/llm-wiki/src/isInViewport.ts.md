---
source: src/isInViewport.ts
sha256: f7fba3b3b59aa7135ff9082451dd81eada89a0535bcf203368d8bf767f076637
generated_at: 2026-09-28T19:40:34.750353+00:00
model: ollama:qwen3.8:27b
---

# src/isInViewport.ts

## Purpose

Provides a single-purpose utility that tests whether a DOM element is visible within the browser viewport, supporting both "fully contained" and "any overlap" semantics. It exists so callers can gate scroll-triggered behavior (lazy loading, animations, intersection checks) without re-implementing the rect/viewport comparison.

## Key elements

- **default export** `(element: Element, fully = false): boolean` — Reads the element's `getBoundingClientRect()`, compares it to the viewport dimensions, and returns `true` if:
  - `fully` is `true`: all four edges fall inside the viewport (`top ≥ 0`, `left ≥ 0`, `bottom ≤ height`, `right ≤ width`).
  - `fully` is `false` (default): any overlap exists (`top < height && bottom > 0 && left < width && right > 0`).
- **Viewport size fallback** — Uses `window.innerHeight / innerWidth` with a fallback to `document.documentElement.clientHeight / clientWidth` when the window values are `0` (notable in certain sandboxed iframes outside a full browsing context).

## Relationships

- **`src/index.ts`** — Re-exports this module (likely as a named export), making it part of the package's public API surface.

## Notes

- The function is synchronous and does not use `IntersectionObserver`; for high-frequency or large-DOM scenarios an observer-based approach may be more performant.
- `getBoundingClientRect()` returns values relative to the viewport (including scroll offset), so the comparison against `innerHeight/innerWidth` is correct without additional scroll adjustments.
- In non-browsing contexts (e.g., some SSR or iframe environments) `window.innerHeight` can be `0`; the fallback to `documentElement` sizes handles that case, but both could still be `0`, yielding a `false` result for any positive coordinates.
