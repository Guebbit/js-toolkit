---
source: src/formatDuration.ts
sha256: 0441db6740ae25750b6d5f417fb86a5a12773d64c2e2fd62ed0ab543a7d2b9bc
generated_at: 2026-09-28T18:23:49.312351+00:00
model: ollama:qwen3.8:27b
---

# src/formatDuration.ts

## Purpose

Converts a duration in seconds into a compact, human-readable string (e.g. `2h 15m`) by cascading through a fixed list of units largest-first. Exists to give the rest of the codebase a single, dependency-free way to render durations for status lines and metrics panels.

## Key elements

- **`UNITS`** (internal const) – Maps each unit name (`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`) to its seconds-per-unit value and a one- or two-character ASCII suffix.
- **`TDurationUnit`** (exported type) – `keyof typeof UNITS`; the set of valid unit names.
- **`IFormatDurationOptions`** (exported interface) – Optional `{ units?: readonly TDurationUnit[] }` controlling which units participate in the render.
- **Default export** – `(seconds: number, options?: IFormatDurationOptions) => string`. Sorts the caller's unit list largest-first, iteratively floors each unit's quotient, drops leading zero units, and joins the result with single spaces.

## Relationships

- **`src/index.ts`** – Re-exports this module (barrel entry point), making the default function and the two type exports available to consumers of the package root.
- **`tests/types/time.test-d.ts`** – Compile-time type tests (`expectType`-style assertions) that pin the shape of `TDurationUnit` and `IFormatDurationOptions` so breaking renames surface as type errors.

## Notes

- "Month" = 30 days, "year" = 365 days. This is a _duration_ formatter, not a calendar-aware one; use `Intl.RelativeTimeFormat` or a date library when real month lengths matter.
- The `units` option is order-agnostic: the function re-sorts it internally. Duplicates are collapsed via `Set`.
- The **smallest requested unit is always rendered**, even if its value is 0 — a zero duration produces e.g. `0m`, never an empty string (unless `units` is an empty array).
- Negative or non-finite `seconds` are silently clamped to 0.
- Suffixes are intentionally ASCII and unlocalised; this is not a user-facing prose formatter.
- When a unit is omitted from `units`, its seconds fold into the next-smaller requested unit (e.g. `['days','minutes']` folds hours into minutes rather than discarding them).
