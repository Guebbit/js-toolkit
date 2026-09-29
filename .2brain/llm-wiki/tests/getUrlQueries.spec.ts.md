---
source: tests/getUrlQueries.spec.ts
sha256: c81044ca83f1f1445fb85c3aad3552933174297e57bea5c0737b10c1a4589744
generated_at: 2026-09-28T19:50:47.767835+00:00
model: ollama:qwen3.8:27b
---

# tests/getUrlQueries.spec.ts

## Purpose

Test suite for the `getUrlQueries` utility, verifying that it correctly parses query strings into plain objects with array-splitting, repeated-key merging, and flexible input types.

## Key elements

- **`describe('getUrlQueries')`** — single test block containing nine assertions covering the function's documented behaviors:
    - Basic `?key=value&key2=value2` parsing (with and without leading `?`).
    - Comma-separated values expanded into arrays (default separator `,`).
    - Repeated keys (e.g. `?a=1&a=2`) merged into an array.
    - `arraySeparator` parameter: `false` disables splitting; a string (e.g. `'|'`) sets a custom delimiter.
    - Accepts a `URLSearchParams` instance in place of a string.
    - Empty string returns `{}`.
    - Omitting the argument falls back to `location.search` (tested via `history.pushState`).

## Relationships

- **src/index.ts** — the sole import source; exports the `getUrlQueries` function under test. The test file has no other dependencies.

## Notes

- The "defaults to current location search" test mutates global history state and restores it in a `finally` block. It depends on a browser-like environment (Jest + jsdom or equivalent); running this in a bare Node environment would fail.
- The `arraySeparator` parameter is a second positional argument to `getUrlQueries`, not an options object.
