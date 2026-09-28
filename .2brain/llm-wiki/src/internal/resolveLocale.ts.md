---
source: src/internal/resolveLocale.ts
sha256: 223ec37a33201906ac132a76e8ede20db6e6791777d951ab975bbfec75f4de46
generated_at: 2026-09-28T19:40:09.862687+00:00
model: ollama:qwen3.8:27b
---

# src/internal/resolveLocale.ts

## Purpose

Sanitises a user-supplied locale string before it reaches any `Intl` constructor. Malformed BCP 47 tags (e.g. `'en_US'`, `''`) cause `Intl` to throw a `RangeError`; this module maps those cases onto `undefined` so the runtime's default locale is used instead, while passing through well-formed tags and `undefined` unchanged.

## Key elements

- **default export `(locale?: string): string | undefined`** — Accepts an optional locale string. Calls `Intl.getCanonicalLocales(locale)` purely as a spec-compliant well-formedness probe. If it throws, returns `undefined`; otherwise returns the original `locale` (or `undefined` if none was given). No transformation of the tag is performed.

## Relationships

- **`src/formatCurrency.ts`** — Imports this module to resolve a locale before constructing `Intl.NumberFormat`, preventing a `RangeError` from a malformed caller-supplied tag.
- **`src/formatDateTime.ts`** — Same role: resolves the locale ahead of `Intl.DateTimeFormat` construction.

## Notes

- The check is intentionally minimal: it only validates well-formedness via `Intl.getCanonicalLocales` and does **not** canonicalise the tag (e.g. `'no-noy'` is passed through as-is). Downstream `Intl` constructors do their own canonicalisation.
- Because the export is `default`, consumers must import without a named binding: `import resolveLocale from './internal/resolveLocale'`.
- The catch block swallows *all* errors from `getCanonicalLocales`, not only `RangeError`. In practice the spec only defines that throw, so this is safe, but it means a future spec change that introduces a different error type would also be silently mapped to the runtime default.
