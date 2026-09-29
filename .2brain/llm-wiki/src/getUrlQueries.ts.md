---
source: src/getUrlQueries.ts
sha256: fcb24783899799ee59c22d4b4b0886bee59f6c25891c5d5c5be855021f36d800
generated_at: 2026-09-28T19:39:13.492440+00:00
model: ollama:qwen3.8:27b
---

# src/getUrlQueries.ts

## Purpose

A single-function module that parses a URL query string into a plain `Record<string, string | string[]>`. It exists to provide a framework-agnostic, dependency-free way to read query parameters with multi-value support (repeated keys and separator-delimited values) without pulling in a router-specific utility.

## Key elements

- **Default export** — `parseQueryString(search?, arraySeparator?)`
    - `search` (`string | URLSearchParams`, optional): the query string to parse. Defaults to `location.search` in a browser; falls back to `''` in non-DOM environments (e.g. Node).
    - `arraySeparator` (`string | false`, default `','`): character that splits a single param value into an array. Pass `false` to disable splitting.
    - For each unique key (deduplicated via `Set`), collects all values with `URLSearchParams#getAll`, optionally splits each value on the separator, and returns a **single string** if exactly one value survives, otherwise a **string array**.

## Relationships

- **`src/index.ts`** — the package entry point; re-exports this function as the public API of the module.

## Notes

- `location` is referenced but guarded with `typeof location === 'undefined'` so the module is import-safe in Node/SSR contexts.
- Keys are deduplicated with `new Set(parameters.keys())` before `getAll` is called, so the loop body runs once per unique key even when the same key appears multiple times in the query string.
- The return type is intentionally heterogeneous (`string | string[]`); callers must check array-ness before treating a value as a list.
