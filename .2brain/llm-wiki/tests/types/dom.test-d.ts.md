---
source: tests/types/dom.test-d.ts
sha256: 6e08e7d4be88c45ab681d6643b7278841adfd3a33b51f4f27f6d9555527903eb
generated_at: 2026-09-28T19:57:49.164532+00:00
model: ollama:qwen3.8:27b
---

# tests/types/dom.test-d.ts

## Purpose
Compile-time type-assertion suite for the DOM helper functions exported by the toolkit. It verifies that element-returning helpers preserve concrete element types (rather than widening to `any` or a bare object), so downstream callers can chain DOM operations without casting.

## Key elements
- **`expectTypeOf(...).not.toBeAny()` block** — asserts each listed export (`appendChildren`, `eventDelegate`, `formatNodeList`, `getElementCenter`, `getForm`, `getIframe`, `getIndex`, `getSiblings`, `getValue`, `isInViewport`) is not `any`.
- **Return-type assertions** — pins the exact return type of each helper (e.g. `formatNodeList → HTMLElement[]`, `eventDelegate → () => void`, `getElementCenter → [number, number]`, `getIframe → HTMLElement | HTMLBodyElement | undefined`, `getValue → string | number | boolean | undefined`).
- **Signature assertions** — locks the full function type for `getIndex`, `isInViewport`, `appendChildren` (variadic element/array children), and `getForm`.
- **Negative tests (`@ts-expect-error`)** — confirms two rejections: passing a bare string to `appendChildren` and omitting the required `form` argument to `getForm`.

## Relationships
- **`src/index.ts`** — the sole import target (aliased as `toolkit`). Every assertion in this file references a member of that module's public API. This file has no runtime effect; it is evaluated only by the TypeScript compiler during `tsc --noEmit` / `vitest --typecheck`.

## Notes
- `eventDelegate` returns `() => void` (an unsubscribe function), **not** `void`. The comment in the file explicitly calls this out.
- `appendChildren` is variadic and accepts nested arrays of elements; the type test exists specifically to prevent the parameter list from widening to `any[]`.
- `getForm` accepts an optional `selectors` string parameter, but the `form` argument itself is required (enforced by the `@ts-expect-error` negative test).
- The file is a `.test-d.ts` file, meaning it runs under a type-checking runner (e.g. `vitest --typecheck`), not a runtime test runner.
