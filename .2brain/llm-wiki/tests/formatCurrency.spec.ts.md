---
source: tests/formatCurrency.spec.ts
sha256: d1dea3d8d6e6d2c8c77f4e3d2c6fa228a5f171804046b3e6f7eca42469fda12a
generated_at: 2026-09-28T19:46:13.582022+00:00
model: ollama:qwen3.8:27b
---

# tests/formatCurrency.spec.ts

## Purpose

Test suite for the `formatCurrency` function. It pins the function's formatting behavior (symbols, decimals, separators), its fallback strategy for invalid or missing inputs, and the boundary between graceful degradation (bad data) and hard errors (bad code-level config).

## Key elements

- **`describe('(formatCurrency) Render an amount as money')`** — single top-level block containing all cases.
- **Basic & locale cases** — verifies symbol insertion, default-to-EUR, per-currency decimals (USD/JPY/KWD), rounding to minor unit, and locale-specific separators (`en-US` vs `de-DE`).
- **`test.each` – currency decimals** — parameterized over USD, JPY, KWD to assert the currency's own decimal count is used.
- **`test.each` – fallback values** (`undefined`, `null`, `NaN`) — asserts the em-dash `'—'` fallback.
- **`test.each` – malformed currency codes** — asserts graceful degradation to a plain localized number (no symbol, no crash).
- **`test.each` – unusable locales** (`en_US`, `''`, `zz`) — asserts fallback to the runtime default locale on both the currency and plain-number paths.
- **Format-object tests** — verifies `format` is applied as-is (replace, not merge), accepts `Intl` overrides (`maximumFractionDigits`), and still throws `RangeError` for out-of-range values even when the locale is also invalid.
- **Edge-case tests** — zero is a valid amount; `XYZ` (well-formed, unknown) stays in currency style; currency code is case-insensitive; custom `empty` fallback string.

## Relationships

- **`src/index.ts`** — the sole import target; exports `formatCurrency`, which is the unit under test.

## Notes

- **Replace-not-merge contract:** the `format` object is used verbatim, not deep-merged with a default. A test explicitly pins this; changing to merge behavior will break it.
- **Graceful vs. hard failure split:** malformed _data_ (locale, currency code, amount) degrades silently; malformed _code config_ (`format.maximumFractionDigits > 100`) must throw `RangeError`. The locale fallback must not swallow that throw.
- **Currency-code validation** is "exactly 3 ASCII letters, case-insensitive." Anything else (digits, non-ASCII, wrong length, empty) triggers the plain-number path.
- **Zero is not falsy-here:** `0` is formatted normally; the fallback path is only for `undefined`/`null`/`NaN`.
- An intentional `// eslint-disable-next-line unicorn/no-null` guards the `null` test case.
