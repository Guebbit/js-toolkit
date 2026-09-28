---
source: src/coerceStringArray.ts
sha256: 17a6e7090b116ef305bf16f2774eeaf65e2d2175295ace63b138bf95fd127554
generated_at: 2026-09-28T18:21:13.640477+00:00
model: ollama:qwen3.8:27b
---

# src/coerceStringArray.ts

## Purpose

Normalizes an arbitrary value into a flat array of trimmed, non-empty strings so callers never need to branch on "single string" vs. "comma-separated string" vs. "already an array" vs. "nullish" input shapes.

## Key elements

- **Default export** — `(value?: unknown): string[]`. Accepts any value and returns a normalized `string[]`:
    - Arrays → each element stringified, trimmed, empties dropped.
    - Strings → split on commas, each piece trimmed, empties dropped.
    - `null` / `undefined` → `[]`.
    - Everything else → `String(value).trim()` wrapped in a single-element array (or `[]` if the result is empty).

## Relationships

- **`src/index.ts`** — imports this module's default export, making `coerceStringArray` part of the package's public surface.

## Notes

- A _single_ string with no commas is **not** split; only comma-delimited strings produce multi-item results. This is the key behavioral distinction from a naive `.split('')`.
- The generic fallback path carries an intentional `eslint-disable` for `@typescript-eslint/no-base-to-string`, signaling that `String(value)` on objects/numbers/etc. is a deliberate catch-all, not an oversight.
- The function is pure and has no side effects; safe to call repeatedly.
