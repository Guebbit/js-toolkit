---
source: tests/extractErrorMessage.spec.ts
sha256: 76947f1da23371f06fee0d71007316a26bcf9c6924ed9aa52ebb2a3789141659
generated_at: 2026-09-28T19:45:53.992502+00:00
model: ollama:qwen3.8:27b
---

# tests/extractErrorMessage.spec.ts

## Purpose

Jest test suite for `extractErrorMessage`, a utility that pulls a human-readable message out of whatever shape a rejection happens to take (plain string, `Error`, normalised interceptor object, nested body, raw axios error). The suite exists to pin down the extraction and fallback contract so the function can be refactored with confidence.

## Key elements

- **`describe('(extractErrorMessage) …')`** — single top-level block; all cases live under it.
- **Happy-path tests** (individual `test` calls) — verify the function returns the correct string for: a bare string, an `Error`, a `{ status, message }` object, a nested `{ data: { message } }`, an axios-shaped `{ response: { data: { message } } }`, and the shallow-preference rule (top-level `message` wins over `data.message`).
- **`describe('nothing readable')` → `test.each(…)`** — parameterised table of 12 "no usable message" inputs (`undefined`, `null`, `''`, a number, `{}`, `new Error('')`, non-string message, empty/nested messages, `null` body/response variants). Each asserts the second-argument fallback is returned.
- **Final `test`** — confirms the function returns `''` when no fallback string is supplied and the value is `undefined`.

## Relationships

- **Imports `extractErrorMessage` from `../src`** (i.e. `src/index.ts`). This is the sole dependency; the file is a pure consumer of that export and re-exports nothing.

## Notes

- The function's inferred signature is `extractErrorMessage(value: unknown, fallback?: string): string`.
- Shallow-preference is an explicit, tested invariant: nesting can *add* a message but never *replace* one already present at a shallower level.
- Several `// eslint-disable-next-line` comments suppress `unicorn/no-null` and `unicorn/error-message` rules; these are intentional — the tests deliberately exercise `null` and empty-`Error`-message paths.
- The "nothing readable" table includes a non-string `message` value (`{ message: 42 }`), documenting that only string messages are considered valid.
