---
source: src/formatCurrency.ts
sha256: 246d53d75970695138488b1e43a27c09c80227e9a9dd27482a7880df69b5db74
generated_at: 2026-09-28T18:23:06.739265+00:00
model: ollama:qwen3.8:27b
---

# src/formatCurrency.ts

## Purpose

Renders a numeric amount as a localized currency string via `Intl.NumberFormat` in currency style. It exists so callers get a single, safe formatting entry point that never throws on bad input (non-numeric values, malformed currency codes, unusable locales) and instead degrades gracefully to a plain decimal or a caller-supplied placeholder.

## Key elements

- **`IFormatCurrencyOptions`** (exported interface) — options bag: `currency` (ISO 4217, any case), `locale` (BCP 47 tag), `empty` (string for non-number values, default `'—'`), `format` (raw `Intl.NumberFormatOptions` override).
- **`default` export** (the formatting function) — accepts an optional `value` and an optional options object. Returns a display string. Only `@throws` when the caller passes an invalid `format` object (a programmatic bug, not a data issue).
- **`WELL_FORMED_CURRENCY`** (module-private regex) — `/^[A-Za-z]{3}$/`; mirrors the ECMA-402 `IsWellFormedCurrencyCode` check that `Intl.NumberFormat` enforces internally.
- **`NO_CURRENCY_FORMAT`** (module-private const) — `{ minimumFractionDigits: 2, maximumFractionDigits: 2 }`, the fallback when no well-formed currency is present.
- **`resolveLocale`** (imported from `./internal/resolveLocale.js`) — resolves a possibly-malformed locale tag to one `Intl` can use, or `undefined` for the runtime default.

## Relationships

- **`src/index.ts`** — the package entry point; re-exports this module's default function and the `IFormatCurrencyOptions` type so consumers can `import { … } from 'package-root'`.
- **`tests/types/numbers-and-ranges.test-d.ts`** — type-level test file that asserts the compile-time contracts of the default export (parameter types, return type, option shapes) without executing the function at runtime.

## Notes

- **Default currency is `'EUR'`.** A `TODO(next major)` comment marks this for removal — a missing `currency` currently silently becomes euros, which is considered a footgun.
- **Decimal behavior is currency-driven.** When no `format` override is given, the number of fraction digits is whatever `Intl.NumberFormat` decides for that currency (e.g. 0 for JPY, 2 for EUR, 3 for KWD). The `NO_CURRENCY_FORMAT` const hard-codes 2 for the no-currency fallback, matching what `Intl` itself returns for well-formed-but-unknown codes.
- **`format` is spread last** in the `Intl.NumberFormat` options object, so any key it contains (e.g. `minimumFractionDigits`, `currency`) overrides the `style: 'currency'` defaults set by the function.
- **`value` accepts `null` and `undefined`** in addition to `number`; the `typeof value !== 'number' || Number.isNaN(value)` guard covers all of them.
