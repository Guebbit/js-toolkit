---
source: tests/formatDuration.spec.ts
sha256: 0578e4c0b71dd66a80239db264d8d38d570aeee905acedeea0c3279c478fb4be
generated_at: 2026-09-28T19:46:52.973230+00:00
model: ollama:qwen3.8:27b
---

# tests/formatDuration.spec.ts

## Purpose
Jest test suite for the `formatDuration` utility (imported from `../src`). It pins the compact rendering contract—how a duration in seconds is decomposed into a human-readable string like `"2h 5m"`—including edge cases around unit selection, ordering, overflow, and invalid inputs.

## Key elements
- **`describe('(formatDuration) Render a duration compactly')`** — single describe block containing all tests.
- **Basic rendering tests** (`test.each`) — verify `0s → "0m"`, `300s → "5m"`, `3600s → "1h 0m"`, `7500s → "2h 5m"`.
- **Leading-zero / smallest-unit tests** — confirms zero values still show the smallest requested unit (`"0m"`).
- **Overflow-absorption test** — without a larger unit requested, hours absorb days (`72h 5m` for 3 days).
- **Custom `units` array tests** — exercises selective unit lists, single-unit lists (`["minutes"]`, `["seconds"]`), and the full ladder (years, months, weeks, days, hours, minutes, seconds).
- **Invalid-input tests** (`test.each`) — negative, `NaN`, `±Infinity` all render as `"0m"`.
- **Ordering / dedup tests** — units are always rendered largest-first regardless of caller order; repeated unit names are counted once.
- **Empty-list test** — `{ units: [] }` produces `""`.
- **Skipped-unit folding test** — when an intermediate unit is omitted (e.g. `["days","minutes"]`), its value folds into the next smaller unit (`"3d 60m"`), not silently dropped.

## Relationships
- **`src/index.ts`** — the sole import target. The test pulls `formatDuration` from the package's public entry point, so this file exercises the exported surface rather than an internal module directly.

## Notes
- The import is `from '../src'`, not a relative path to a specific source file; it resolves through `src/index.ts`. Changes to the re-export in `src/index.ts` will break this test.
- The function's unit ladder (from the tests) is, largest to smallest: `years → months → weeks → days → hours → minutes → seconds`. The default (no `units` option) appears to be `["hours", "minutes"]`.
- Skipped units fold *downward* (hours into minutes), not upward.
- The test suite is self-contained: no setup/teardown files, no mocking, no environment dependencies beyond Jest globals.
