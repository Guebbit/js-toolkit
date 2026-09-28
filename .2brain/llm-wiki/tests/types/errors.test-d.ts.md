---
source: tests/types/errors.test-d.ts
sha256: 33567ea4f94af9cfe9cf6fd0c3de5004a0567c3c6390395a19fbcc8bd0a3cad9
generated_at: 2026-09-28T19:58:03.578935+00:00
model: ollama:qwen3.8:27b
---

# tests/types/errors.test-d.ts

## Purpose

Compile-time type test that locks down the public signature of `extractErrorMessage` from the toolkit. It exists to guarantee that the function accepts `unknown` (matching what a `catch` block yields), returns `string`, and restricts its optional fallback to `string`—all without executing any runtime code.

## Key elements

- **Signature assertion** — `expectTypeOf(toolkit.extractErrorMessage).toEqualTypeOf<(error: unknown, fallback?: string) => string>()` pins the exact parameter and return types.
- **Return-type checks** — Verifies the call returns `string` regardless of the input value passed (`Error`, `string`, plain object).
- **Input-flexibility checks** — Confirms that *any* value type-checks as the first argument, documenting the deliberate choice of `unknown` over a narrower type.
- **`@ts-expect-error` guard** — Asserts that passing a non-`string` (e.g. `0`) as `fallback` is a compile error; the line fails the type-check if the fallback parameter is ever widened.

## Relationships

- **`src/index.ts`** — The sole import target (`import * as toolkit from '../../src'`). This test file consumes the `extractErrorMessage` export and asserts its type contract. No other exports from `src/index.ts` are referenced here.

## Notes

- This file is a **type-only** test (`.test-d.ts`); it produces no runtime assertions and is typically run through `tsd` or `tsc --noEmit` rather than a JS test runner.
- The `@ts-expect-error` comment is a *negative* assertion: if a future change accidentally widens `fallback` to accept numbers, the type-check will report an "unused `@ts-expect-error`" and fail the build.
- The file intentionally imports the whole namespace (`* as toolkit`) rather than a named import, so adding/removing exports in `src/index.ts` won't break this test's import resolution.
