---
source: src/formatNodeList.ts
sha256: 2924a5376f4306f3790933cf807a4c254820afdf91ffc2469f48a7667aa5d9e3
generated_at: 2026-09-28T18:24:46.419754+00:00
model: ollama:qwen3.8:27b
---

# src/formatNodeList.ts

## Purpose

Normalises the various shapes a DOM query can return (single element, plain array, live `NodeList`, or `HTMLCollection`) into a single plain `HTMLElement[]`, so downstream code never needs to branch on input type.

## Key elements

- **`default export` (function)** — Accepts `HTMLElement | HTMLElement[] | NodeList | HTMLCollection | null | undefined` and always returns `HTMLElement[]`.
    - `null` / `undefined` → `[]`
    - Plain array → shallow copy via spread
    - `NodeList` / `HTMLCollection` → iterated via spread, cast to `HTMLElement[]`
    - Single `HTMLElement` → wrapped in a one-element array

## Relationships

- **`src/index.ts`** — Re-exports (or imports) this utility as part of the public module surface, making it available to consumers of the package without a deep import path.

## Notes

- The `NodeList` / `HTMLCollection` branch uses an `instanceof` check followed by a spread-then-cast (`as HTMLElement[]`). This assumes the collection only contains `HTMLElement`s; if it ever contains non-element `Node`s (e.g. text nodes from `querySelectorAll`), the cast is unsafe.
- Arrays are copied (not aliased), so mutating the returned array won't affect the caller's original array. Live DOM collections, however, are snapshot at call time — subsequent DOM mutations are not reflected.
- The function is a pure default export (no named export), so importers use `import formatNodeList from '…/formatNodeList'` or pick it up via the `index.ts` barrel.
