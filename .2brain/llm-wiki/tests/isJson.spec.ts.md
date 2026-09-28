---
source: tests/isJson.spec.ts
sha256: fc9ef682d269c13be3e9df67da99a159c92c10dd02657f624de37b6f6c08e05f
generated_at: 2026-09-28T19:52:26.815304+00:00
model: ollama:qwen3.8:27b
---

# tests/isJson.spec.ts

## Purpose

Jest test suite for the `isJson` utility, which parses a JSON string and returns the resulting structure (object or array) on success, or `false` on failure. The suite pins down the function's contract, including edge cases and the deliberate exclusion of bare JSON scalar values.

## Key elements

- **`describe('(isJson) …')`** — single top-level block importing `isJson` from `../src` and containing all test cases:
  - *Empty / populated arrays and objects* — verifies parsing and that the return value is the parsed structure (not a boolean).
  - *Malformed JSON* — confirms `false` is returned for syntactically invalid input (single quotes, missing value, plain text).
  - *Rejection of non-structure values* — `'5'`, `'"lorem"'`, `'true'`, `'false'`, `'null'` all return `false`, because the function is defined as checking for a *structure* and because `false` is the failure sentinel.
  - *No console output* — spies on `console.error` to assert the library stays silent on invalid input.
  - *Nested structures* — `{"a":{"b":[1,2]}}` parses to the full nested object.

## Relationships

- **`src/index.ts`** — the sole import target; provides the `isJson` function under test. No other modules are involved.

## Notes

- The return type is intentionally `T | false` (not `T | null` or a dedicated error type). This means a valid JSON input of `false` is ambiguous with the failure signal, which is why the function rejects all bare scalar values rather than only structures.
- Tests use `toBe(false)` for failure cases (identity check) and `toStrictEqual` / `toEqual` for success cases (deep structural equality).
- The no-console test wraps the spy in `try/finally` with `mockRestore` to avoid leaking the mock into subsequent tests.
