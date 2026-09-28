---
source: tests/types/time.test-d.ts
sha256: 076d34c6787a24302affc6850a8d8b0721884cb39b11741570d218ab895cf370
generated_at: 2026-09-28T19:59:34.063882+00:00
model: ollama:qwen3.8:27b
---

# tests/types/time.test-d.ts

## Purpose

Type-level test file that asserts the public TypeScript signatures of the toolkit's time-related utilities (unit conversion, execution timing, and date/duration formatting). It exists to catch accidental signature changes in the type system before they reach consumers, without any runtime execution.

## Key elements

- **`expectTypeOf` assertions on exported functions** — Verifies that `secondsToTime`, `timeToSeconds`, `getExecTime`, `formatDuration`, and `formatDateTime` are exported with concrete (non-`any`) types.
- **`ISecondsToTimeMap` field checks** — Confirms every field (`hours`, `millisecondsOnly`, etc.) is a required `number`, so callers never need a non-null assertion.
- **`timeToSeconds` parameter shape** — Locks the signature to `[string?, string?]`.
- **`getExecTime` generic return** — Asserts the resolved value preserves the timed callback's return type (`{ result: T; time: number }`) rather than collapsing to `unknown`, tested with both sync (`() => 'lorem'`) and async (`() => Promise.resolve(1)`) examples.
- **`formatDuration` / `TDurationUnit`** — Pins the `(seconds: number, options?) => string` signature and the exact 7-member union type for duration units.
- **`formatDateTime` / `IFormatDateTimeOptions`** — Pins the `(value?, options?) => string` signature and the `{ locale?, empty?, format? }` options shape.
- **Negative tests (`@ts-expect-error`)** — Three cases that must fail: calling `formatDuration()` with no arguments, passing a bare string to `units`, and passing a plain object to `formatDateTime`.

## Relationships

- **`src/index.ts`** — The sole import source; all functions and types under test are reached through `import * as toolkit from '../../src'` and the named type imports from the same barrel.
- **`src/secondsToTime.ts`** — Source of `secondsToTime`, `timeToSeconds`, and `ISecondsToTimeMap`; their signatures are the primary assertion targets in the upper half of the file.
- **`src/formatDuration.ts`** — Source of `formatDuration`, `IFormatDurationOptions`, and `TDurationUnit`; asserted in the lower half, including the negative `units` test.
- **`src/formatDateTime.ts`** — Source of `formatDateTime` and `IFormatDateTimeOptions`; asserted with the full option-shape check and the negative `Date|string|number` test.

## Notes

- This is a **type-level** test (`.test-d.ts` convention). It is type-checked by `tsc` / `tsd` and never executed at runtime, so no test-runner assertions (`expect`, `assert`) are used.
- The `expect-type` library provides the `expectTypeOf` API; it is a dev-only dependency that compiles to nothing at runtime.
- The `@ts-expect-error` lines double as "negative type tests": if the corresponding call ever becomes valid, the compiler will flag the directive as unused, failing the type-check.
- All time-related exports are verified through the barrel (`../../src`) rather than direct module paths, mirroring how consumers actually import them.
