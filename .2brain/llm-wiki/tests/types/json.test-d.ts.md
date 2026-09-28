---
source: tests/types/json.test-d.ts
sha256: 409bdccaf6dfb2ed39e17fe5357cb95ac5dfe8c90c71b26a0547d5a421fbab0e
generated_at: 2026-09-28T19:58:16.176678+00:00
model: ollama:qwen3.8:27b
---

# tests/types/json.test-d.ts

## Purpose

Type-level test (`.test-d.ts` convention) that asserts the public signatures of the JSON helpers exported from `src/index.ts`. It exists to lock in the contract that both `getJson` and `isJson` return concrete, checked types (`unknown`, a specific union) rather than `any`, and that `isJson`'s `false` sentinel is unambiguous. No runtime code executes.

## Key elements

- **`expectTypeOf(toolkit.getJson).toEqualTypeOf<(json?: string) => unknown>()`** — pins `getJson` to an optional-string parameter and an `unknown` return; also asserts it is not `any`.
- **`expectTypeOf(toolkit.isJson<number>).returns.toEqualTypeOf<Record<string, number> | number[] | false>()`** — pins `isJson`'s return to a three-member union (shallow object, array, or `false`), confirming the `false` sentinel does not collide with the JSON literal `"false"`.
- **`@ts-expect-error` on `toolkit.getJson(42)`** — verifies the parameter type rejects non-string input at compile time.

## Relationships

- **`src/index.ts`** — the sole import target (`../../src`). This file reads the exported types of `getJson` and `isJson` and asserts on them; changes to those signatures in `src/index.ts` will cause this test to fail at the type-check step.

## Notes

- The `@ts-expect-error` directive means the line *must* be a type error; if someone ever widens `getJson`'s parameter to accept `number`, the error goes away and the test breaks.
- The comment about `isJson('false')` documents a deliberate design choice: the `false` return sentinel was kept (rather than `boolean`) so it cannot be confused with the JSON literal string `"false"` parsed by the function.
- Because this is a `.test-d.ts` file, it is checked by the TypeScript compiler (or a tool like `tsd`) during type-checking, not executed as a runtime test.
