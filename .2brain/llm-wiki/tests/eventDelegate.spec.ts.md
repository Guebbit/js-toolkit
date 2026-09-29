---
source: tests/eventDelegate.spec.ts
sha256: 642f500fbe7b9c10d40e242aa397f84a97d750bf43c2da8630ceb0646349021f
generated_at: 2026-09-28T19:45:38.829219+00:00
model: ollama:qwen3.8:27b
---

# tests/eventDelegate.spec.ts

## Purpose

Jest test suite for the `eventDelegate` utility. It verifies that event delegation correctly forwards bubbled events from a matched child to a callback, that non-matching targets are ignored, that the Node-selector form performs a containment check (not mere equality), and that the returned unsubscribe function reliably detaches the listener without affecting sibling delegates.

## Key elements

- **`describe('eventDelegate')` block** — sets up a minimal DOM (`#parent > #child`) and a `jest.fn()` callback in `beforeEach`; every test dispatches a bubbling `MouseEvent('click')`.
- **String-selector tests** — confirm the listener is attached to `parent` (or `window` when `parent` is omitted), the callback fires only when the event origin matches the CSS selector, and `this` inside the callback is the matched element (`callback.mock.instances[0]`).
- **Node-selector tests** — cover three containment cases: child inside the Node → fires; sibling outside → does not fire; the Node itself clicked → fires (self-containment).
- **`describe('the returned unsubscribe')`** — verifies that calling the returned `off()` stops further callbacks, is idempotent (safe to call twice), and removes only its own listener so a second delegate on the same parent/event remains active.

## Relationships

- **`src/index.ts`** — the sole import target. This spec imports `eventDelegate` from `../src` and exercises its public contract (signature, `this` binding, optional `parent` parameter, Node-vs-string selector handling, and the unsubscribe return value). No other modules are touched.

## Notes

- **Optional `parent` parameter.** When omitted, `eventDelegate` attaches its listener to `window`. The test "should add event listener to window…" covers this default path.
- **`this` binding via `mock.instances`.** The spec asserts `callback.mock.instances[0] === child`, which means `eventDelegate` calls the callback with the matched element as `this` (not as an argument).
- **Node selector is a containment check, not an equality check.** A sibling element that is _not_ inside the Node must not trigger the callback. Conversely, the Node _does_ contain itself, so clicking the Node directly counts.
- **Unsubscribe is the only cleanup path.** The internal listener is never exposed; the returned function is the sole mechanism to remove it. Leaking occurs if the caller discards the return value.
- **DOM setup uses `innerHTML` assignment** rather than `appendChild`, so elements created in one test are fully replaced in the next.
