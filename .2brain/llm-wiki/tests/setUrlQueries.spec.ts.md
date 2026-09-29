---
source: tests/setUrlQueries.spec.ts
sha256: a66775880ce1e82ff2bd4d51013a76b3d8ef3579b60649a478ea5a5fe6ae4496
generated_at: 2026-09-28T19:56:28.936629+00:00
model: ollama:qwen3.8:27b
---

# tests/setUrlQueries.spec.ts

## Purpose

Unit-test suite for the `setUrlQueries` utility (imported from `src/index.ts`). It verifies that the function correctly serializes a plain object into a query string, handles non-string values, filters out "empty" values, joins arrays, and merges/overrides keys within an existing query string or `URLSearchParams` instance.

## Key elements

- **`describe('setUrlQueries', …)`** — single block containing eight tests covering:
    - Basic `{ key: value }` → `"key=value"` serialization.
    - Coercion of numbers/booleans to their string representations.
    - Omission of `undefined`, `null`, `''`, and `[]` values from the output.
    - Array joining with the default comma separator.
    - Array joining with a caller-supplied separator (3rd argument).
    - Merging new keys into / overriding existing keys in a pre-existing query string.
    - Removing a key from the merged result when its value is `undefined`.
    - Accepting a `URLSearchParams` instance as the merge target instead of a raw string.

## Relationships

- **`src/index.ts`** — The sole import. The test calls `setUrlQueries` directly from this module; no other local dependencies exist.

## Notes

- The second parameter of `setUrlQueries` is optional; passing `false` (as in the custom-separator test) signals "no existing query to merge into."
- A `// eslint-disable-next-line unicorn/no-null` comment suppresses the `unicorn/no-null` rule for the intentional `null` test value.
- Array values are joined into a single query parameter (e.g. `groups=a,b,c`), not repeated keys (`groups=a&groups=b`).
