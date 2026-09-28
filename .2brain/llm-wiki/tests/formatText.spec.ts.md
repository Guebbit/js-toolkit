---
source: tests/formatText.spec.ts
sha256: 6d9091a8a82ad437688d0920a55c1a5382fb1c4378cd63d420951544758d0c6c
generated_at: 2026-09-28T19:47:47.297369+00:00
model: ollama:qwen3.8:27b
---

# tests/formatText.spec.ts

## Purpose

Unit tests for the `formatText` utility. Verifies that the function returns its input when meaningful content is present, and substitutes a fallback glyph (default `—`) when the value is empty, nullish, or whitespace-only—preventing blank cells from being mistaken for layout bugs.

## Key elements

- **`describe('(formatText) …')`** — top-level suite grouping all tests for the single `formatText` function.
- **`test('returns the text when there is some')`** — asserts pass-through of a plain non-empty string.
- **`test('preserves surrounding whitespace of a non-empty value')`** — confirms leading/trailing spaces are *not* trimmed from a valid value.
- **`test.each([...])('falls back for %s')`** — table-driven test covering five "empty" cases: `undefined`, `null`, `''`, whitespace-only (`'   '`), and a lone tab (`'\t'`). Each must produce the default fallback `'—'`.
- **`test('accepts a custom fallback')`** — verifies the optional second argument overrides the default glyph.

## Relationships

- **`src/index.ts`** — the sole import source; `formatText` is exported from this barrel module. All assertions in this file validate behavior defined there.

## Notes

- The `null` case carries an explicit `// eslint-disable-next-line unicorn/no-null` comment because the test *intentionally* exercises `null` handling despite the lint rule banning it.
- The fallback glyph is the em-dash character `—` (U+2014), not a hyphen.
- Whitespace-only strings are treated as "empty" (fall back), but whitespace *surrounding* non-empty content is preserved—these are distinct rules.
