---
source: src/extractErrorMessage.ts
sha256: 9f5e396a19006ee66621f8491d157ec718c1667119330077ff322dce8890455f
generated_at: 2026-09-28T18:22:37.913649+00:00
model: ollama:qwen3.8:27b
---

# src/extractErrorMessage.ts

## Purpose

Extracts a human-readable message from whatever a `catch` block or promise rejection hands you, regardless of shape. It exists because HTTP clients (axios, interceptors, normalisers) frequently reject with plain object literals rather than `Error` instances, causing naive `instanceof Error` checks to miss the server's message entirely.

## Key elements

- **`isRecord`** (private) — Type guard: `!!value && typeof value === 'object'`. The truthiness check excludes `null`, which `typeof` would otherwise let through.
- **`ownMessage`** (private) — Pulls a non-empty `message` string off a record; returns `undefined` for non-records or empty/absent messages.
- **default export** — The main function `(error: unknown, fallback?: string): string`. Tries, in order: bare string → `Error.message` → own `.message` → `.data.message` → `.response.data.message`. Returns the first non-empty string found, or `fallback` (default `''`).

## Relationships

- **`src/index.ts`** — Imports (and likely re-exports) the default function, making it available to the rest of the codebase under the package's public API.

## Notes

- An empty-string `message` is deliberately treated as _absent_, not as a valid message, to avoid rendering a blank alert that looks like a broken UI.
- The nested lookups (`.data`, `.response.data`) only execute when every higher-priority source came up empty, so they can only _add_ a message, never override one.
- The function never throws and never invents wording; the `fallback` parameter leaves tone/language decisions to the caller.
- `instanceof Error` is checked before the generic record path, so a standard `Error` with a non-empty message short-circuits before the `.data` / `.response.data` scans.
