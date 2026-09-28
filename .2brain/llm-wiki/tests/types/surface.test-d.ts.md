---
source: tests/types/surface.test-d.ts
sha256: c9f6da33e8279f2b4c69670a873fbc076af665f2e82662f1f9ac6b6a38d9b5fc
generated_at: 2026-09-28T19:59:13.658883+00:00
model: ollama:qwen3.8:27b
---

# tests/types/surface.test-d.ts

## Purpose

Compile-time guard that asserts every public export from the toolkit's entry point retains a concrete type rather than silently widening to `any`. Because `any` satisfies every downstream type assertion, a regression to `any` would leave the unit suite green while erasing type-safety for all consumers. This file makes that regression a hard type-error at check time.

## Key elements

- **`expectTypeOf(...).not.toBeAny()` assertions** (~50 lines) — one per exported function (`appendChildren`, `arrayChunks`, `formatCurrency`, `levenshteinDistance`, `setCookie`, etc.). Each line fails compilation if the corresponding export's inferred type is `any`.
- **`import * as toolkit from '../../src'`** — namespace import of the full public API surface. The file does not import individual functions; it references them through the namespace, so it tracks whatever `src/index.ts` re-exports.
- **`expectTypeOf` from `expect-type`** — type-level assertion utility; no runtime code is produced.

## Relationships

- **`src/index.ts`** — the sole subject under test. Every symbol re-exported by that file is expected to appear as a `.not.toBeAny()` line here. Adding a new export to `src/index.ts` without a matching assertion defeats the file's purpose (the comment makes this an explicit convention).

## Notes

- This is a **type-level** test (`.test-d.ts` suffix). It is validated by the TypeScript compiler / `tsc --noEmit` (or an equivalent type-check step), **not** by a runtime test runner like Vitest or Jest.
- The file contains no runtime logic; it produces no executable output.
- The assertion list is the **source of truth for the public API surface**. If a function is removed or renamed in `src/index.ts`, the corresponding line here must be updated or the type-check will error on the missing member.
