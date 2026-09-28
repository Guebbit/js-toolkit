---
source: tests/timeToSeconds.spec.ts
sha256: 4521018ccf6e252a96dabf3f79a6858934e309358a70a3432474368c9f987bb2
generated_at: 2026-09-28T19:56:41.150538+00:00
model: ollama:qwen3.8:27b
---

# tests/timeToSeconds.spec.ts

## Purpose

Test suite for the `timeToSeconds` utility, which parses a time-string in `HH:MM:SS:ms` format into a millisecond integer. It locks down the function's behavior across partial inputs, empty/blank components, custom delimiters, and malformed values.

## Key elements

- **`describe` block** — single suite titled `(timeToSeconds) Transform 'HH:MM:SS:ms' string in milliseconds integer`; contains all tests.
- **Tests cover**: full 4-component strings, progressive truncation (no ms, no seconds, hours only), empty/no-argument input (expects `0`, not `NaN`), blank components (treated as `0`), non-numeric present components (expects `NaN`), custom delimiter parameter, leading-zero handling (not octal), and extra components beyond the 4th slot (ignored).

## Relationships

- **`src/index.ts`** — sole import target; provides the `timeToSeconds` function under test. This spec is the only test file in the repo that exercises that export.

## Notes

- The no-argument / empty-string cases are intentionally pinned to `0` (not `NaN`) so that the value can be summed by callers without propagating `NaN`. This is a deliberate API contract, not a default.
- A present-but-non-numeric component (e.g. `'lorem:30'`) must yield `NaN`; blank components (`':30'`, `'14::20'`) must yield `0`. The distinction is the core edge-case contract.
- When the delimiter does not match (e.g. `'14:30'` with delimiter `'-'`), `parseInt` picks up only the leading number and the result is `50_400_000`. This is documented as intentional and "pinned because it looks like a bug at a glance and is not one."
- Leading zeros (`'08:09'`) are handled via `parseInt` (base-10), so they are not read as octal.
