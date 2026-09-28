---
source: src/secondsToTime.ts
sha256: a535816e63f06c22336b3da4179a8ec7caf258fa7f309f2e91fa23061c22bbd4
generated_at: 2026-09-28T19:41:52.772682+00:00
model: ollama:qwen3.8:27b
---

# src/secondsToTime.ts

## Purpose

Converts a duration in milliseconds into a flat object containing both remainder-style breakdowns (years, months, weeks, …) and single-unit totals (`yearsOnly`, `monthsOnly`, …) using repeated integer division. It exists so callers can pick whichever representation they need without re-deriving the math.

## Key elements

- **`ISecondsToTimeMap`** (exported interface) — 16 numeric fields: 8 remainder units (largest-to-smallest) and 8 corresponding `…Only` fields (whole duration expressed in that single unit).
- **`factors`** (module-private const) — Maps each unit name to its millisecond equivalent. Used as the loop's iteration source.
- **default export** — `(time?: number) => ISecondsToTimeMap`. Defaults to `0`. Iterates `factors` largest→smallest; for each unit computes `…Only` from the *original* `time` and the remainder from the running `remaining` accumulator.

## Relationships

- **`src/index.ts`** — Re-exports this module so consumers can import from the package root rather than reaching into `src/`.
- **`tests/types/time.test-d.ts`** — Type-level tests that assert the shape and field types of `ISecondsToTimeMap` and the default export's signature.

## Notes

- "Month" is fixed at 30 days and "year" at 365 days. There is no calendar anchoring; use a date library when real month lengths matter.
- Every field on `ISecondsToTimeMap` is required (no `?`), so callers never need a non-null assertion to read a unit.
- The `…Only` values use `Math.floor(time / factor)` on the *original* input, not on the remainder. They represent "how many of this unit fit in the whole duration," not "what's left after peeling off larger units."
- `millisecondsOnly` always equals the input (factor is 1).
