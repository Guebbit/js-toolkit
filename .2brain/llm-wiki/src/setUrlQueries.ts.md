---
source: src/setUrlQueries.ts
sha256: 44db94d98b70f23a97f783d677c55e904f2cc6cd674e41864a17ea9c8f8eac06
generated_at: 2026-09-28T19:42:16.291084+00:00
model: ollama:qwen3.8:27b
---

# src/setUrlQueries.ts

## Purpose

Serializes a plain key/value object into a URL query string using `URLSearchParams`, with optional merging into an existing query string. It exists as a framework-agnostic utility so callers can build query strings for any router or apply them via `history.pushState`/`replaceState` without pulling in a specific framework.

## Key elements

- **`QueryValue`** (type) — Union of `string | number | boolean | null | undefined` and arrays of those scalars. Defines what a query value may be.
- **default export** (function) — Takes three arguments:
    - `query: Record<string, QueryValue>` — key/value pairs to serialize.
    - `merge: string | URLSearchParams | false` (default `false`) — an existing query string or `URLSearchParams` to start from; its keys are preserved unless overwritten by `query`.
    - `arraySeparator: string` (default `','`) — separator used when joining array values.

    Behavior:
    - Drops (deletes) any key whose value is `undefined`, `null`, `''`, or an empty array.
    - Joins array values with `arraySeparator`.
    - Returns a plain query string (no leading `?`).

## Relationships

- **`src/index.ts`** — The project entry point; re-exports this module so consumers can import the serializer from the package root.

## Notes

- The default export is a **function**, not a named export — import with a default import (`import setUrlQueries from …`).
- The returned string does **not** include a leading `?`. Callers must prepend it when constructing a full URL.
- When `merge` is provided, keys present in `merge` but _absent_ from `query` survive; keys present in both are overwritten by `query`.
- `parameters.delete(key)` is called for empty values even if the key isn't in the merged set — this is a no-op in that case but ensures correctness when it is.
