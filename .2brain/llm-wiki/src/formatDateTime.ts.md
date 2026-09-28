---
source: src/formatDateTime.ts
sha256: 18bb46a8f848e0dc2b1a1e804757d36bfb20cbf6a0642b5950798b9b1466ae26
generated_at: 2026-09-28T18:23:26.967932+00:00
model: ollama:qwen3.8:27b
---

# src/formatDateTime.ts

## Purpose

Renders a date value into a locale-aware display string. Wraps `Intl.DateTimeFormat` (or `Date#toLocaleString` as a simpler fallback) behind a small API that guarantees no "Invalid Date" text ever reaches a user and that a bad locale silently degrades to the runtime default.

## Key elements

- **`IFormatDateTimeOptions`** – Options interface: `locale` (BCP 47 tag), `empty` (fallback text, defaults to `'—'`), `format` (passed directly to `Intl.DateTimeFormat`).
- **default export** – `(value, options) => string`. Accepts `string | number | Date | null | undefined`. Returns the formatted date, or the `empty` string when the value is missing or unparseable.
- **`resolveLocale`** (imported from `./internal/resolveLocale.js`) – Validates/resolves the caller-supplied locale before it reaches `Intl` or `toLocaleString`.

## Relationships

- **`src/index.ts`** – Re-exports this module's public API (the default function and `IFormatDateTimeOptions`) so consumers can import from the package root.
- **`tests/types/time.test-d.ts`** – Contains `expect-type` assertions that pin the public type signature of the default export and `IFormatDateTimeOptions`.

## Notes

- Two formatting code paths exist: with `format` options → `Intl.DateTimeFormat`; without → `Date#toLocaleString`. They are not interchangeable (e.g. `toLocaleString` ignores some `Intl.DateTimeFormatOptions` fields).
- The function intentionally **does not throw** for bad `value` or `locale`; it only throws `RangeError | TypeError` for an invalid `format` object, which is a programmer error.
- The default `empty` sentinel is an em dash (`'—'`), not a hyphen or empty string—relevant when matching rendered output in tests or UI snapshots.
