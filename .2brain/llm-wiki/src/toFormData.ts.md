---
source: src/toFormData.ts
sha256: f02a3a939e30949c066ecd65d85f661d2c0eab89c16b4c0f52133bcb4da77e0c
generated_at: 2026-09-28T19:42:47.343167+00:00
model: ollama:qwen3.8:27b
---

# src/toFormData.ts

## Purpose

Converts a plain JavaScript object into a `FormData` instance suitable for multipart/form-data uploads. Because `FormData` is inherently flat (strings and blobs only), this module encodes object nesting via PHP-style bracket keys (`user[tags][0]`), giving the server a parseable path back into the original structure.

## Key elements

- **`toFormData`** (default export) — Recursively walks `object` depth-first and appends each leaf value to a `FormData`. Parameters:
  - `object: Record<string, unknown>` — the object to serialize.
  - `form?: FormData` — an existing `FormData` to append to; a new one is created if omitted.
  - `namespace?: string` — accumulated bracket prefix set by the recursive caller (not meant for direct use by callers).
- **Leaf detection** — A value is appended as-is unless it is a plain object *and* not an instance of `Blob`. This means `File`, `Blob`, arrays-of-Blobs, and all primitives are terminal; only plain objects (and arrays of objects) recurse.

## Relationships

- **`src/index.ts`** — Re-exports `toFormData` as part of the package's public API.
- **`tests/toFormData.spec.ts`** — Unit tests exercising key generation, nesting depth, Blob/File pass-through, and the optional `form` parameter.
- **`tests/properties/roundtrip.property.spec.ts`** — Property-based tests that serialize → parse (bracket notation) → compare against the original object to verify structural fidelity.

## Notes

- **Blob vs. File check is deliberate.** The guard is `instanceof Blob`, *not* `instanceof File`. `File extends Blob`, so this covers both. Checking only `File` would route plain `Blob` instances (from `canvas.toBlob()`, `fetch().blob()`, image croppers) down the recursive branch; they have no enumerable own properties, so nothing is appended and the upload silently goes out empty.
- **Namespace accumulates the full ancestor path.** Each recursion level passes `namespace + '[' + property + ']'`, not just `property`. Omitting ancestors would collapse siblings that share the same nested shape (e.g., `{a:{b:1}, c:{b:1}}` both posting as `b`) and make the server unable to disambiguate.
- **`hasOwnProperty` guard.** The loop uses `Object.prototype.hasOwnProperty.call` to skip inherited properties; the object is not expected to be frozen or to use `Symbol` keys.
- **No `FormData` nesting.** If the target server does not understand bracket notation, the documented workaround is to `JSON.stringify` the object into a single field instead.
