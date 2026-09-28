---
source: src/getCookie.ts
sha256: 8bc3d948b7ec9b33a6604657dae94af9571d4f034f0948f844620167c47f5201
generated_at: 2026-09-28T19:37:20.917492+00:00
model: ollama:qwen3.8:27b
---

# src/getCookie.ts

## Purpose

Provides a small helper to read a single cookie's value by name from `document.cookie`, which has no built-in lookup-by-name API. It encapsulates the split → match → decode steps so callers get a clean `string | undefined` return instead of parsing the raw `"a=1; b=2"` string themselves.

## Key elements

- **default export `(name: string): string | undefined`** — Splits `document.cookie` on `'; '`, finds the entry whose key is `encodeURIComponent(name)`, and returns `decodeURIComponent` of the value portion. Returns `undefined` if no matching cookie is found.

## Relationships

- **`src/index.ts`** — Likely re-exports (or consumes) this helper as part of the package's public surface, making the cookie reader available to downstream consumers.

## Notes

- The cookie **name** must already be URI-encoded by the caller (the function applies `encodeURIComponent` when matching). Passing an unencoded name will not match a cookie that was set with an encoded name.
- The **value** is returned decoded (`decodeURIComponent` is applied), so callers receive the raw value, not its percent-encoded form.
- Uses `startsWith` + `indexOf('=')` rather than a regex; the `=` delimiter is assumed to be the first `=` in the matched row.
- No type imports or side effects — the file is fully self-contained and side-effect-free except for reading `document.cookie` at call time.
