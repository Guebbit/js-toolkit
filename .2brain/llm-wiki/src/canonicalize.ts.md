---
source: src/canonicalize.ts
sha256: de112edffdfaabdedd61472a0dfa507b5f8aec730c1769dc9e5af91607e58597
generated_at: 2026-09-28T18:21:02.105687+00:00
model: ollama:qwen3.8:27b
---

# src/canonicalize.ts

## Purpose

Canonicalizes an arbitrary value into a deterministic shape so that `JSON.stringify` of the result is a stable cache key, independent of property insertion order. It exists to give the rest of the codebase a single, correct way to normalize filter/config objects before hashing or caching, avoiding the common pitfall of sorting only top-level keys.

## Key elements

- **`canonicalize(value, throwOnCircular?)`** (default export) — Recursively walks a value and returns a canonical copy. Object keys are sorted alphabetically; arrays keep their order; `Date` instances become ISO-8601 strings; `undefined` properties are dropped. Circular references default to the literal string `'[Circular]'`; setting `throwOnCircular` to `true` makes them throw a `TypeError` instead.
- **Internal `walk(node)`** — The recursive worker. Uses a `WeakSet` (`seen`) that tracks only the _current root-to-node path_ (added on descent, removed on ascent), so a shared-but-acyclic reference ("diamond") is not falsely flagged as a cycle.

## Relationships

- **`src/index.ts`** — Re-exports or consumes `canonicalize` as part of the package's public/internal API.
- **`tests/canonicalize.spec.ts`** — Unit tests covering key ordering, nested objects, arrays, dates, `undefined` filtering, and circular-reference handling (both default and `throwOnCircular` modes).
- **`tests/properties/collections.property.spec.ts`** — Property-based tests that exercise `canonicalize` as a building block inside collection/filter operations, verifying stability invariants (e.g., key invariance under permutation).

## Notes

- The `seen` set is path-scoped, not visit-scoped. A diamond-shaped object graph (same object reachable via two different parents) is **not** treated as a cycle and will appear in full at both sites. Only true back-edges trigger the circular branch.
- Arrays are intentionally **not** key-sorted; order is semantically meaningful (e.g., sort priority in a filter chain).
- `undefined` values are silently dropped, not serialized as `null`. This means `{ a: undefined }` and `{}` produce the same key.
- The function is pure with respect to its input (it never mutates the original), but it does allocate new objects/arrays on every call.
- No module-level state or side effects; safe to call concurrently.
