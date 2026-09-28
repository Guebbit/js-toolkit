---
source: tests/toFormData.spec.ts
sha256: 6c2a951f6a9781afdbe1ad515fbebe38562c1408cfead8b9d727ace7da875c1d
generated_at: 2026-09-28T19:56:59.608930+00:00
model: ollama:qwen3.8:27b
---

# tests/toFormData.spec.ts

## Purpose

Unit tests for the `toFormData` utility. Verifies that plain JavaScript objects (including nested structures, arrays, File/Blob values, nulls, and prototype-inherited properties) are correctly serialized into a `FormData` instance, and that the function respects a caller-supplied `FormData` for appending.

## Key elements

- **Single `describe` block** — `(toFormData) transform object in FormData` — containing 11 `test` cases; no helper functions or fixtures.
- **Flat / nested / deep object tests** — Assert bracket-notation keys (`dolor[sit]`, `lorem[ipsum][dolor]`) and that sibling branches with identical inner shapes remain distinguishable.
- **Array flattening test** — Confirms indexed bracket keys (`adipiscing[0]`, `adipiscing[1]`).
- **File & Blob tests** — Verify `File` instances are appended by reference; plain `Blob` instances survive as `Blob` (not silently dropped); a `Blob` nested inside an object lands under its bracket key.
- **Null-drop test** — Ensures `null` values are skipped rather than stringified.
- **Inherited-property test** — Uses `Object.create` to confirm `for...in` (or equivalent iteration) excludes prototype properties.
- **FormData-reuse test** — Passes an existing `FormData` as the second argument and asserts both reference identity and that pre-existing entries are preserved.

## Relationships

- **`src/index.ts`** — The import target (`import { toFormData } from '../src'`). Acts as the public barrel re-exporting `toFormData` from the module.
- **`src/toFormData.ts`** — The implementation under test. This spec is its sole test file; every assertion here exercises behavior defined there.

## Notes

- **Depth disambiguation threshold:** The comment in the three-level test explains that at two levels the accumulated namespace and the bare property name are indistinguishable, so the first level at which the full bracket chain is required is three. The sibling-branch test pins that both branches must carry the full chain to avoid key collisions.
- **Blob identity caveat:** `FormData.append` normalises a non-`File` Blob into a `File` named `"blob"` per spec, so tests assert `instanceof Blob`, size, and type rather than reference equality.
- **Null on the recursive path:** `null` is `typeof 'object'`, so it enters the recursive branch; `for...in` over `null` iterates nothing, yielding a silent drop. The test is intentionally pinned to guard that branch.
- **Inherited-property guard:** The test relies on `for...in`-style enumeration (which includes inherited keys) being filtered, or on the implementation using `Object.keys`/`for...of Object.entries`. The `Object.create` setup makes the distinction explicit.
