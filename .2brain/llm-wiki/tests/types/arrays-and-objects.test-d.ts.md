---
source: tests/types/arrays-and-objects.test-d.ts
sha256: 3492151b4e9c249b63c6d450100e1d4cfecb4565e51ae1eeea0d68350db27a2b
generated_at: 2026-09-28T19:57:14.503769+00:00
model: ollama:qwen3.8:27b
---

# tests/types/arrays-and-objects.test-d.ts

## Purpose

A type-level (compile-time) test that verifies the generic signatures of the array and object helper functions exported by the toolkit. It ensures element types are preserved through generic parameters rather than collapsing to `unknown[]`, and that overloaded and parameter-constrained call sites are correctly typed.

## Key elements

- **`expectTypeOf` assertions on `toolkit.*` exports** — Confirm each function is defined (`.not.toBeAny()`) and that its return type matches the documented signature (e.g. `arrayChunks<string>` → `string[][]`).
- **`arrayColumns` overload check** — A single column name yields `unknown[]`; an array of names yields `unknown[][]`. Without the overload both would collapse to `unknown[]`.
- **`canonicalize` signature pin** — Asserts the return type is `unknown` (not `any`), so callers must narrow before use.
- **`@ts-expect-error` lines** — Two intentional misuse cases (string passed as chunk size; missing `end` arg on `associativeSlice`) that must be rejected by the compiler.

## Relationships

- **`src/index.ts`** — The sole import target (`import * as toolkit from '../../src'`). Every assertion in this file validates a type signature declared there; the test file itself exports nothing.

## Notes

- The file is a *type* test (`.test-d.ts`), not a runtime test. It is checked at compile time and produces no executable code.
- `arrayColumns` always returns `unknown[]` / `unknown[][]` regardless of the input record's property types; the generic parameter of the record is not propagated. Callers who need a concrete element type must narrow or cast.
- The two `@ts-expect-error` comments document the *intended* parameter constraints (numeric chunk count, two required indices). Removing or altering the constraint in `src` will cause the compiler to flag the `@ts-expect-error` line as unused, which is itself the failure signal.
