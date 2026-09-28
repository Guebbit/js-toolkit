---
source: tests/types/strings.test-d.ts
sha256: 6e02a4298db2634fcfce0522a19b15c61689ba7f4ecf7e72cd5b33a8fb84d6fc
generated_at: 2026-09-28T19:58:58.021362+00:00
model: ollama:qwen3.8:27b
---

# tests/types/strings.test-d.ts

## Purpose

Compile-time type assertion file (`.test-d.ts`) that pins down the public type signatures of the string-related exports (fuzzy matching, edit distance, UUID generation, and the two plain-text display formatters). It exists to make sure the API surface cannot silently drift — a signature change in `src` that breaks a consumer's expectations will fail type-checking before any runtime test runs.

## Key elements

- **`expectTypeOf(toolkit.levenshteinDistance)`** — asserts parameters are `[(string | null)?, (string | null)?]` and the return is not `any`.
- **`expectTypeOf(toolkit.match)`** — asserts parameters `[string?, string?, IMatchOptions?]` and return `boolean`.
- **`expectTypeOf(toolkit.getUuid)`** — asserts the signature is `() => string`.
- **`expectTypeOf(toolkit.formatFlag)`** — asserts the four-parameter signature with `boolean | null | undefined` value and both labels required.
- **`expectTypeOf(toolkit.formatText)`** — asserts the two-parameter signature `(value?: string | null, empty?: string) => string`.
- **`expectTypeOf<TMatchMode>()`** — asserts the closed union `'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'`.
- **`expectTypeOf<IMatchOptions>()`** — asserts the shape `{ sensitive?: boolean; mode?: TMatchMode; maxDistance?: number }`.
- **Three `@ts-expect-error` negative tests** — verify that an invalid `mode` literal, a missing `falseLabel`, and a numeric argument to `formatText` are all rejected at compile time.

## Relationships

- **`src/index.ts`** — the file imports `* as toolkit` from `../../src`; every assertion validates a member of that re-export barrel. If a string-related export is renamed or removed in the index, this file fails.
- **`src/match.ts`** — source of `match`, `IMatchOptions`, and `TMatchMode`; the type assertions here lock the contract that module must satisfy.

## Notes

- This is a **type-level** test: it produces no runtime artifact and is only evaluated during `tsc` / `vitest typecheck`. A passing green build here does not mean the implementations work correctly — only that their signatures are what consumers expect.
- The `@ts-expect-error` lines are **intentional compile errors**. If you "fix" the call to satisfy the compiler, you break the negative test; the line must remain a type error.
- `TMatchMode` is deliberately a **closed literal union**, not `string`. The comment in the file calls out that this is the point of replacing the old magic-number API.
- `formatFlag` keeps `null`/`undefined` distinct from `false` in its first parameter — the type assertion encodes that design decision so an accidental widening to `boolean` is caught immediately.
