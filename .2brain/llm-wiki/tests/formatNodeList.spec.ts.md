---
source: tests/formatNodeList.spec.ts
sha256: cfaad01acd3541f933d91c924334cc1da8aed0c28ea9a97e6d90c9e3f7af0d45
generated_at: 2026-09-28T19:47:36.505576+00:00
model: ollama:qwen3.8:27b
---

# tests/formatNodeList.spec.ts

## Purpose

Unit tests for the `formatNodeList` utility, verifying that it normalises any DOM element collection (NodeList, HTMLCollection, single Element, array, or nothing) into a plain, static JavaScript array.

## Key elements

- **`describe('(formatNodeList) …')`** — single suite containing eight test cases.
- **Test: "returns an empty array when given nothing"** — covers `undefined` and `null` inputs.
- **Test: "wraps a single element in an array"** — a bare `Element` becomes `[element]`.
- **Test: "converts a NodeList to an array"** — `querySelectorAll` result → array.
- **Test: "converts an HTMLCollection to an array"** — uses `getElementsByTagName` (not `querySelectorAll`) to exercise the HTMLCollection path.
- **Test: "keeps the items of an array that is already an array"** — array in, same items out.
- **Test: "returns a new array rather than the one passed in"** — asserts `output !== input` and that mutating the result does not affect the caller's array.
- **Test: "returns a static array, not a live view"** — detaching a DOM node after the call does not shrink the returned array.
- **Test: "returns an empty array for an empty collection"** — zero-length collection → `[]`.

## Relationships

- **`src/index.ts`** — the sole import target; provides the `formatNodeList` function under test.

## Notes

- All assertions use `toStrictEqual`, not `toEqual`, specifically because Jest's `toEqual` treats `[undefined]` as equal to `[]`. This is called out in an inline comment.
- The HTMLCollection test intentionally uses `getElementsByTagName` and carries an `eslint-disable` for `unicorn/prefer-query-selector`, because `querySelectorAll` returns a NodeList and would not exercise that code path.
- Tests mutate `document.body.innerHTML` and rely on a DOM environment (jsdom or similar); they do not clean up between cases.
