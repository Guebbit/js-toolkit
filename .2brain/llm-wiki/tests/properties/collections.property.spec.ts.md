---
source: tests/properties/collections.property.spec.ts
sha256: a6dea6203acda1f8a0d368901a866fd467ac0e5fcda9dfa5ccd90e49c1e4959b
generated_at: 2026-09-28T19:54:24.335874+00:00
model: ollama:qwen3.8:27b
---

# tests/properties/collections.property.spec.ts

## Purpose

Property-based test suite (via `fast-check`) that verifies structural invariants and algebraic laws of the collection utility functions exposed by the package, rather than asserting behaviour on hand-picked examples. Each `describe` block pins down a small set of laws that must hold for _all_ inputs within a bounded domain.

## Key elements

- **`item` / `list`** — shared `fast-check` arbitraries: a `string | integer` leaf and an array of up to 30 such leaves. Reused across most test blocks.
- **`(arrayChunks) properties`** — asserts round-trip (`.flat()` reproduces input), immutability, empty-result for non-positive `n`, saturation of chunk count, max-min length ≤ 1, and no empty chunks.
- **`(arrayDepth) properties`** — asserts depth is 0 for non-arrays, wrapping adds exactly 1 (recursion law via `fc.letrec`), flat arrays are depth 1, and the result tracks the _deepest_ branch regardless of position.
- **`(associativeSlice) properties`** — asserts key-order preservation, output is a value-identical subset, full-span returns the original object, inverted/empty spans yield `{}`, result width ≤ span width, and input immutability.
- **`(arrayColumns) properties`** — asserts one result entry per haystack row, list-of-columns adds a nesting level, bare-column equals first slot of the same column as a list, and missing keys yield `undefined`.
- **`(canonicalize) properties`** — asserts key-order invariance (via local `shuffleKeys` helper that reverses insertion order), idempotency, value preservation, array-order preservation, and recursively sorted keys at every depth. Uses a dedicated `jsonValue` arbitrary restricted to JSON-representable types.

## Relationships

- **`src/index.ts`** — all five functions under test (`arrayChunks`, `arrayColumns`, `arrayDepth`, `associativeSlice`, `canonicalize`) are imported through the package barrel; this file exercises their public contract.
- **`src/arrayColumns.ts`** — defines `arrayColumns`; the `(arrayColumns) properties` block encodes its documented invariants (index alignment, nesting semantics, `undefined` for absent keys).
- **`src/arrayDepth.ts`** — defines `arrayDepth`; the `(arrayDepth) properties` block encodes its recursive definition as a law (`depth([v]) === depth(v) + 1`).
- **`src/canonicalize.ts`** — defines `canonicalize`; the `(canonicalize) properties` block encodes its normal-form contract (key-order independence, idempotency, data preservation).

## Notes

- Uses `fast-check` (`fc`) exclusively for property generation; no Jest `each`/table-style examples. Each `test` wraps a single `fc.assert(fc.property(…))`.
- The `jsonValue` arbitrary is deliberately limited to JSON-shaped values (string, int, boolean, null, array, object) because `canonicalize`'s contract is about JSON key stability; non-JSON types are out of scope by design.
- `fc.letrec` is used wherever the input must be recursively defined (`arrayDepth`, `canonicalize`) to avoid infinite generation; `{ depthSize: 'small' }` keeps trees shallow.
- `shuffleKeys` is a local helper (not exported) that reverses object key order at every nesting level to produce an order-perturbed copy for the canonicalize invariance test.
- `eslint-disable-next-line unicorn/no-null` comments suppress the linter rule for the intentional `fc.constant(null)` arbitraries.
