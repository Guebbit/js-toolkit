---
source: src/appendChildren.ts
sha256: 1afddf9f74a071cf3d40a589b55ab5cb7de57e2b2b0cab4ec4bb5b9ca29c69cf
generated_at: 2026-09-28T18:19:45.859972+00:00
model: ollama:qwen3.8:27b
---

# src/appendChildren.ts

## Purpose

Provides a single helper that appends one or more child nodes (or nested arrays of nodes) to a parent element using a `DocumentFragment`, ensuring the live DOM is mutated exactly once regardless of how many children are passed.

## Key elements

- **`default` export (function)** — `appendChildren(element, ...children)`
    - Accepts an `HTMLElement | Element` and a rest list of children, where each child may be a node or an array of nodes.
    - Flattens all children into a `DocumentFragment`, then calls `element.append(fragment)` a single time.
    - Returns the same `element` to support method-chaining.

## Relationships

- **`src/index.ts`** — Barrel file; re-exports this module so consumers can import `appendChildren` from the package root.

## Notes

- Children are appended in the order given; arrays are flattened in place (depth-1 only).
- The function mutates the live DOM (nodes are removed from their previous parents by `DocumentFragment.append`), so passing a node already in the tree will detach it first.
- No type guards or error handling — invalid arguments (e.g. `null`, strings) will throw at runtime.
