---
source: src/associativeSlice.ts
sha256: 19752ba1cb0f1cc563d89779a69109bb1693572186970724d0e619df597a52a5
generated_at: 2026-09-28T18:20:43.459992+00:00
model: ollama:qwen3.8:27b
---

# src/associativeSlice.ts

## Purpose

Provides an object-slice utility that selects own enumerable properties by enumeration index, giving objects the same `[start, end)` range semantics that `Array.prototype.slice` gives to arrays. It exists so callers can grab a positional window of an object's keys without manual key-listing.

## Key elements

- **`export default`** — A single arrow function `(object, start, end) → Record<string, unknown>`. Iterates the object's keys in enumeration order, counting only own properties (`hasOwnProperty` guard), and copies those whose index falls in `[start, end)` into a fresh object. Inherited keys are invisible to the index counter and never appear in the result.

## Relationships

- **`src/index.ts`** — Re-exports this module's default export as part of the package's public API surface.

## Notes

- Indexing follows _enumeration order_ (insertion order for string keys in modern engines), not key name or alphabetical order. Adding/removing keys elsewhere in the object shifts which properties land in a given slice.
- The function is pure: it never mutates the input object and always returns a new object.
- Because it uses `for…in` + `hasOwnProperty`, symbol-keyed properties and non-enumerable own properties are skipped entirely (they don't increment the index).
- Negative `start`/`end` values are **not** normalized the way `Array.prototype.slice` handles them; they simply act as literal boundaries.
