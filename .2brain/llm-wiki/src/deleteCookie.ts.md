---
source: src/deleteCookie.ts
sha256: e5d401ee87891e9c5c8edd80e4f9ca8b87dce458bd4355fb9869ccc6384d5a1c
generated_at: 2026-09-28T18:21:42.742757+00:00
model: ollama:qwen3.8:27b
---

# src/deleteCookie.ts

## Purpose

Provides the single supported mechanism for removing a browser cookie: rewriting it with the same `name`/`path`/`domain` but a long-past expiry date, causing the browser to discard it. Exists because the DOM exposes no true "delete cookie" API.

## Key elements

- **`export default (name, path = '/', domain?) : void`** — The sole export. Builds a `document.cookie` assignment string with `expires=Thu, 01 Jan 1970 00:00:00 GMT`. `path` defaults to `'/'` but is appended only when truthy; `domain` is appended only when provided.

## Relationships

- **`src/index.ts`** — Imports this module (dependency-graph neighbor). This file is a leaf utility with no other imports of its own.

## Notes

- `path` and `domain` **must** match the values used when the cookie was originally set, or the browser will treat the rewrite as a different cookie and the original will persist.
- `name` is passed through `encodeURIComponent`; the `path` and `domain` values are inserted verbatim (no encoding).
- An `eslint-disable-next-line unicorn/no-document-cookie` comment suppresses the linter rule, since direct `document.cookie` assignment is unavoidable here.
- Passing `path` as an empty string (`''`) is falsy, so the `path` attribute will be omitted from the cookie string—useful if the original cookie was set without an explicit path.
