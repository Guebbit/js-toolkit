---
source: tests/formatDateTime.spec.ts
sha256: 36497129c59c037e71039e497d0ac5f69b364160454c667adc903395ea76db36
generated_at: 2026-09-28T19:46:31.108806+00:00
model: ollama:qwen3.8:27b
---

# tests/formatDateTime.spec.ts

## Purpose

Jest test suite for the `formatDateTime` utility (imported from `src/index.ts`). It verifies correct date rendering across locales, input types, and `Intl.DateTimeFormat` options, and locks down the fallback/error behaviour the function must exhibit when given unusable values or locales.

## Key elements

- **`describe('(formatDateTime) …')`** — single suite containing all tests; no helper functions are defined locally.
- **ISO-string / locale tests** — assert the output contains the expected year and that different BCP-47 tags (`en-US`, `de-DE`) produce different strings.
- **Date & timestamp inputs** — confirm `Date` objects, epoch milliseconds, and ISO strings are all accepted and produce identical output for the same instant.
- **`Intl` options pass-through** — verifies a `format` key (e.g. `{ year: 'numeric', timeZone: 'UTC' }`) is forwarded to `Intl.DateTimeFormat`.
- **Fallback for invalid input** (`test.each`: `undefined`, `null`, `''`, `'not a date'`) — all return the default em-dash `'—'`.
- **Bad-locale tolerance** (`test.each`: `en_US`, `''`, `'zz'`) — the function silently falls back to the runtime's default locale; asserted both with and without a `format` option.
- **Malformed `format` still throws** — a bad `timeZone` in the `format` object raises `RangeError` even when the locale is also invalid; the locale fallback must not swallow this error.
- **NaN / invalid `Date` guard** (`test.each`) — `new Date(NaN)` and raw `NaN` are caught by a dedicated NaN check (distinct from the empty-value guard) and return the custom `empty` fallback.
- **Custom fallback** — `{ empty: 'N/A' }` overrides the default `'—'`.

## Relationships

- **`src/index.ts`** — the module under test. The file imports the single named export `formatDateTime` and exercises every public behaviour of that function. No other module is imported.

## Notes

- The default empty/invalid fallback is the em-dash character `'—'`, not a hyphen or the string `"Invalid Date"`. Tests explicitly document that `"Invalid Date"` must never reach the user.
- The NaN path and the empty-value path are tested separately; the comments make clear they are triggered by different guards inside the implementation.
- `null` is included in the empty-value table with an `eslint-disable-next-line unicorn/no-null` comment — the rule is intentionally suppressed because testing `null` handling is the point of that row.
- The malformed-format test asserts `RangeError` (not `TypeError` or generic `Error`), so the implementation is expected to let `Intl.DateTimeFormat` surface its own exception rather than wrapping it.
