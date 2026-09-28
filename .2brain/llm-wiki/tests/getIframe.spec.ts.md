---
source: tests/getIframe.spec.ts
sha256: 3ec32ba7a6563effcb9330df877471214822ba7d659bec9252d16c353f4dc343
generated_at: 2026-09-28T19:49:08.592001+00:00
model: ollama:qwen3.8:27b
---

# tests/getIframe.spec.ts

## Purpose

Test suite for the `getIframe` utility (exported from `src/index.ts`). Verifies that the function returns the `<body>` element of an attached iframe's document and gracefully returns `undefined` for all invalid inputs (non-iframe elements, null, and detached iframes) without throwing.

## Key elements

- **`describe('(getIframe) Get Iframe content')`** — top-level test group.
- **`beforeEach`** — injects a known `<iframe id="iframe-test">` and a `<div id="not-an-iframe">` into `document.body` so every test starts from the same DOM state.
- **Test: "returns the body of the iframe document"** — asserts `getIframe(iframeEl)?.tagName === 'BODY'`, confirming the happy path returns the iframe's content `<body>`.
- **Test: "returns undefined for an element that is not an iframe"** — passes a `<div>`; expects `undefined` (the tagName guard short-circuits before any property access).
- **Test: "returns undefined for a missing element"** — passes `null` and omits the argument entirely; expects `undefined`.
- **Test: "returns undefined for an iframe that is not attached to the document"** — creates a detached `<iframe>` via `createElement`; expects `undefined` (no `contentWindow`, so the second guard prevents a throw on `.document`).

## Relationships

- **`src/index.ts`** — the sole import target. `getIframe` is re-exported from this file and is the unit under test here. No other imports exist in this spec.

## Notes

- The function is expected to guard in two stages: (1) check `tagName` so non-iframe elements return `undefined` immediately, and (2) check for a valid `contentWindow` so detached iframes don't cause a `TypeError` when `.document` is read.
- The `null` case triggers an inline `eslint-disable-next-line unicorn/no-null` comment — the linter forbids `null` literals, but the test intentionally exercises it.
- The first assertion uses optional chaining (`?.tagName`), implying the function's return type is nullable even on the success path.
