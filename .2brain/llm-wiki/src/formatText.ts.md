---
source: src/formatText.ts
sha256: 75e4c024d796692f4bca7439ceb4f055fbf1dfe34a695048b80054a75888fd61
generated_at: 2026-09-28T19:37:11.289077+00:00
model: ollama:qwen3.8:27b
---

# src/formatText.ts

## Purpose

Provides a single display guard: when a UI cell's string value is missing, null, or whitespace-only, it substitutes a visible placeholder glyph (default `'—'`) so the layout never shows a confusingly empty cell.

## Key elements

- **`default` export (arrow function)** — `(value?: string | null, empty = '—'): string`. Returns `value` unchanged if it is a non-empty string after trimming; otherwise returns the `empty` fallback. No class, no additional utilities.

## Relationships

- **`src/index.ts`** — Consumes this module. Because the file uses a bare `export default`, the index barrel most likely re-exports it (e.g. `export { default as formatText } from './formatText'`) so downstream callers import a named symbol.

## Notes

- Whitespace is explicitly treated as "empty": `'   '` is **not** a valid display value. Callers should not pre-trim the input expecting the original spacing to survive.
- The default glyph is an em-dash (`'—'`), not a hyphen or en-dash. Override via the second argument if the design system requires a different placeholder.
- The function is intentionally pure and synchronous; it performs no DOM access or i18n lookup. Localisation of the fallback is the caller's responsibility.
