---
source: src/getIndex.ts
sha256: 1308ac7289a90f519e9bf939e5c2456f92f2558435cf25824a40bb6c1f93c43a
generated_at: 2026-09-28T19:38:24.425425+00:00
model: ollama:qwen3.8:27b
---

# src/getIndex.ts

## Purpose
Provides a single utility that returns a DOM element's zero-based position among its parent's children (or `-1` when the element is null or detached). It exists as a lightweight, framework-free stand-in for jQuery's `.index()` so the codebase can query sibling position without a library dependency.

## Key elements
- **default export** — `(element: HTMLElement | null) => number`
  - Returns `-1` if `element` is `null` or `element.parentElement` is `null`.
  - Otherwise spreads `parent.children` into an array and calls `Array.prototype.indexOf(element)` to produce the index.

## Relationships
- **src/index.ts** — Re-exports (or otherwise consumes) the default export from this module as part of the package's public API surface.

## Notes
- The function spreads `parent.children` (`HTMLCollection`) into a plain array before calling `.indexOf`, because `HTMLCollection` lacks that method.
- Exposed via a **default** export, not a named one; importers must use `import getIndex from '…'` (or `import default from '…'` when pulled through `index.ts`).
