---
source: src/copyToClipboard.ts
sha256: 9bd95fb8166c33202fbc540dd2a67d743940abaeb4ba04b2fece7aa6d4a898b5
generated_at: 2026-09-28T18:21:28.922163+00:00
model: ollama:qwen3.8:27b
---

# src/copyToClipboard.ts

## Purpose

Provides a single utility that copies a string to the system clipboard, using the modern async Clipboard API when available and falling back to `document.execCommand('copy')` otherwise. It exists so callers can trigger a clipboard write without handling errors or worrying about browser compatibility — the function always resolves to a boolean.

## Key elements

- **Default export** — `async (text: string) => Promise<boolean>`. The sole (and only) export. Attempts `navigator.clipboard.writeText` first; on failure or absence of the Clipboard API, creates a temporary off-screen `<textarea>`, selects its contents, calls `document.execCommand('copy')`, removes the element, and returns the result. All errors are caught, logged via `console.error`, and converted to a `false` return.

## Relationships

- **src/index.ts** — Imports (and re-exports) this module as part of the package's public surface, making the copy function available to consumers of the top-level entry point.

## Notes

- The fallback `<textarea>` is intentionally kept in the document layout (`position: fixed; opacity: 0`) rather than hidden with `display: none`, because `execCommand('copy')` only operates on the current selection and a fully hidden element cannot be selected.
- `document.execCommand` is a deprecated Web API (hence the `@typescript-eslint/no-deprecated` suppression), retained solely as the fallback path for non-secure contexts or older browsers.
- The module is marked `@module` (side-effect-free) and has no named exports — only the default function.
- The function never throws; treat the resolved boolean as the sole success/failure signal.
