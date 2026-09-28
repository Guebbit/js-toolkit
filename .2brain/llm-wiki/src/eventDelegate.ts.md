---
source: src/eventDelegate.ts
sha256: 74219a8d8ec82f1e3f151cd5bdb772a923d7c925d580ed35eb2adbcf67f71ca1
generated_at: 2026-09-28T18:22:22.802486+00:00
model: ollama:qwen3.8:27b
---

# src/eventDelegate.ts

## Purpose

Implements event delegation: a single listener on a stable ancestor handles events for many current **and future** children. Instead of attaching one listener per child, every event is matched against a selector inside the one registered listener.

## Key elements

- **Default export** — `(eventName, childSelector, callback, parent) → cleanup`. Registers a single `addEventListener` on `parent` and returns a closure that removes it.
    - `eventName: string` — e.g. `"click"`, `"pointerdown"`.
    - `childSelector: string | Node` — if a string, resolved via `target.closest()`; if a Node, resolved via `childSelector.contains(target)`.
    - `callback` — invoked with `this` bound to the matched child element (not the parent).
    - `parent: Node | Window | typeof globalThis` — defaults to `globalThis`.
- **Internal `listener` closure** — casts `event.target` to `Element | null`, finds the matching child, and calls `callback.call(matchingChild, event)`. If no child matches, the event is silently ignored.

## Relationships

- **src/index.ts** — sole graph neighbor; this module is exposed through the package entry point.

## Notes

- The registered listener is **not** returned or stored elsewhere — the cleanup function it returns is the only way to remove it.
- When `childSelector` is a Node, `contains(target)` is used (a Node contains itself), so clicking the selector element itself counts as a match.
- `this` inside `callback` is the **matched child**, not the parent, which can trip up unbound arrow-function callbacks.
