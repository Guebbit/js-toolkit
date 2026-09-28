---
source: src/downloadBlob.ts
sha256: 11631148390f75ea6011e957db25c8c7c81e700d02596d919fcf45d8eb79d07b
generated_at: 2026-09-28T18:22:05.998519+00:00
model: ollama:qwen3.8:27b
---

# src/downloadBlob.ts

## Purpose

Provides a client-side file-download utility. Because the browser exposes no direct "save this Blob" API, this module fakes a user-initiated download by programmatically clicking a detached `<a>` element whose `href` points to a temporary object URL.

## Key elements

- **`default(data, filename, type?)`** – Trigger a download. Accepts a `Blob` or any `BlobPart` (string, `ArrayBuffer`, etc.), a suggested filename, and an optional MIME type (defaults to `"text/plain"`). Wraps non-Blob input in a new `Blob`, creates an object URL, fires `anchor.click()` on a never-appended element, then immediately revokes the URL.

## Relationships

- **`src/index.ts`** – The package entry point. It imports this module (default export) to expose the download function as part of the public API.

## Notes

- The anchor element is intentionally **never** appended to the document; `.click()` works on a detached node for download purposes.
- `URL.revokeObjectURL` is called synchronously after `.click()`. The download request has already been dispatched by the time the call returns, so revocation does not cancel it—but the blob buffer is freed.
- The function is **synchronous** (returns `void`); there is no callback or promise for tracking completion.
- The `type` parameter only applies when `data` is _not_ already a `Blob`; passing a `Blob` with a different `type` argument is silently ignored.
