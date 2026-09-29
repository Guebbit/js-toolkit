---
source: src/getIframe.ts
sha256: 74360864f12c79d081788c564d325ee843475f91190f5007ef5184d09e29796e
generated_at: 2026-09-28T19:38:13.399761+00:00
model: ollama:qwen3.8:27b
---

# src/getIframe.ts

## Purpose

Safely retrieves the `<body>` element from an iframe's _own_ document (i.e. `contentWindow.document.body`), guarding against the element not actually being an iframe, the iframe being detached, or the window not yet being available. It exists so callers can access cross-document DOM without risking a `TypeError` on a null `contentWindow`.

## Key elements

- **default export (function)** — `getIframeBody(iframe?)`. Accepts a loosely typed `HTMLElement | HTMLIFrameElement | Element | null` and returns `HTMLElement | HTMLBodyElement | undefined`. Performs three checks in sequence:
    1. `tagName === 'IFRAME'` — rejects any non-iframe element.
    2. `contentWindow` is truthy — rejects detached/unloaded iframes.
    3. Returns `contentWindow?.document.body`.

## Relationships

- **`src/index.ts`** — imports this module as its public surface (the file is the sole/default export consumed by the package entry point).

## Notes

- The `contentWindow` null-check is technically redundant with the optional-chained `contentWindow?.document.body` that follows it (a `null` window would short-circuit the `?.`). It is kept intentionally to make the "must be attached" precondition explicit. A mutation-testing comment in the source warns against removing it as a "cleanup."
- The parameter type is deliberately wide (`Element | null`) so callers can pass values straight from `querySelector`-style APIs without a separate cast; the `tagName` check narrows at runtime.
- The return type is `HTMLElement | HTMLBodyElement | undefined`, not just `HTMLBodyElement`, because `document.body` is typed `HTMLBodyElement` in the DOM lib but the union reflects the module's documented contract.
