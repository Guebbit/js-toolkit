---
source: tests/types/node.test-d.ts
sha256: 396a0ff090b4ef59d4698154bf6eb678d4df3af159462c4004ba08f0ca9a4ed5
generated_at: 2026-09-28T19:58:25.739187+00:00
model: ollama:qwen3.8:27b
---

# tests/types/node.test-d.ts

## Purpose

Compile-time type-test for the `deleteFile` helper exported by the toolkit. It asserts the exact function signature and confirms that the required `filePath` argument is enforced, ensuring no accidental type regressions (e.g., widening to `any` or making the argument optional).

## Key elements

- **`expectTypeOf(toolkit.deleteFile).not.toBeAny()`** — Guards against the export silently becoming `any`.
- **`expectTypeOf(toolkit.deleteFile).toEqualTypeOf<…>()`** — Pins the full signature: `(filePath: string, onError?: (error: Error) => void) => Promise<boolean>`.
- **`@ts-expect-error` on `toolkit.deleteFile()`** — Verifies that omitting the required `filePath` argument is a compile-time error.

## Relationships

- **`src/index.ts`** — The single import source. This file exercises the `deleteFile` export that `src/index.ts` re-exports. Changes to that export's type will surface here as a compile failure.

## Notes

- The file is a *type-only* test (`.test-d.ts`); it produces no runtime code and is not executed by a test runner. It is checked by `tsc` / `tsd`-style tooling.
- The header comment references `tests/getUrlQueries.node.spec.ts` as the runtime counterpart, but the file actually tests `deleteFile`, not `getUrlQueries`. Treat the comment as a copy-paste artifact.
