---
source: tests/getSiblings.spec.ts
sha256: 3910267f36f89bc20e95bee4745f9e7a8876a7c265434ea737a19e518255ba25
generated_at: 2026-09-28T19:50:25.692507+00:00
model: ollama:qwen3.8:27b
---

# tests/getSiblings.spec.ts

## Purpose

Jest test suite for the `getSiblings` DOM utility. It verifies the function returns an element's siblings in document order as a plain array, excluding the element itself, and handles edge cases (only child, null, detached node) without throwing.

## Key elements

- **`describe('(getSiblings) get siblings of element', …)`** — single suite; the `beforeEach` injects a fixed DOM tree (a `#wrapper` div with four spans: `#first`, `#testSpan`, `#third`, `#fourth`) via `document.body.innerHTML`.
- **"returns every sibling, in document order, excluding the element itself"** — asserts the returned id list is `['first', 'third', 'fourth']`.
- **"never includes the element itself"** — explicitly checks `not.toContain(element)`.
- **"returns an empty array for an only child"** — rewrites `document.body.innerHTML` to a single span and expects `[]`.
- **"returns an empty array for a missing element"** — passes `null` (with an inline `eslint-disable` for `unicorn/no-null`) and expects `[]`.
- **"returns an empty array for a detached element"** — passes a freshly created `<span>` with no `parentNode` and expects `[]`.
- **"returns a real array, not a live HTMLCollection"** — asserts `Array.isArray` and that mutating the DOM afterwards does not change the already-returned list.

## Relationships

- **Imports `getSiblings` from `../src`** (i.e. `src/index.ts`) — this file is the sole consumer in the test graph; all assertions target the behavior of that one exported function.

## Notes

- The "real array" test is a contract guard: `getSiblings` must return a static `Array`, not a live `HTMLCollection`. Removing a node from the DOM after the call must not shrink the result.
- The `null` test deliberately uses `null` (not `undefined`) to pin the accepted "missing element" shape; the inline lint suppression is required because the project's `unicorn/no-null` rule would otherwise flag it.
- The detached-element test exercises the branch where `element.parentNode` is `undefined`; the function must short-circuit to `[]` rather than dereference `children`.
