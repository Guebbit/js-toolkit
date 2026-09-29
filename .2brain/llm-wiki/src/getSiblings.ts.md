---
source: src/getSiblings.ts
sha256: e09b2fc6363d7c9494bda3281831f435f25a2ac7dab66342223499f1cd5a777c
generated_at: 2026-09-28T19:39:02.132195+00:00
model: ollama:qwen3.8:27b
---

# src/getSiblings.ts

## Purpose

Provides a small utility that returns the sibling elements of a given DOM node (excluding the node itself). It exists as a dependency-free replacement for jQuery's `.siblings()` so the rest of the codebase can collect adjacent elements without pulling in a framework.

## Key elements

- **`default` export (anonymous function)** — Accepts an `HTMLElement | Element | null`. Returns an `Element[]` of the element's siblings, or an empty array if the argument is null/undefined, has no `parentNode`, or the parent has no `children`. Internally:
    1. Guards against a falsy element.
    2. Casts `element.parentNode` to `HTMLElement | null` (because the DOM type is `Node`, which lacks `children`).
    3. Converts the `children` `HTMLCollection` to an array via `Array.prototype.slice.call`.
    4. Filters out the original element.

## Relationships

- **`src/index.ts`** — Likely re-exports or composes this utility as part of the package's public API. This module has no other imports; it is a leaf dependency.

## Notes

- The `parentNode` cast is necessary because TypeScript types `parentNode` as `Node`, which does not expose `children`. The `?? {}` fallback keeps the destructuring safe when the parent is absent.
- The function is **not** curried and takes no options; it always returns a plain `Element[]`.
- It filters by reference identity (`child !== element`), so duplicate elements (e.g. in a Shadow DOM tree) are handled correctly.
