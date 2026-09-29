---
source: src/isJson.ts
sha256: 434baa65bb9c92b4fd9febba0d043638a0e4ffa67089dca3c42757d41dc32bba
generated_at: 2026-09-28T19:40:47.937855+00:00
model: ollama:qwen3.8:27b
---

# src/isJson.ts

## Purpose

Provides a single, throw-safe helper for parsing a string into a JSON _structure_ (object or array). It exists so callers can distinguish "this is a walkable JSON structure" from every other case (parse failure, primitive value, `null`) with one boolean-like check, without wrapping `JSON.parse` in their own `try`/`catch`.

## Key elements

- **default export** — `<T>(test: string): Record<string, T> | T[] | false`
    - Attempts `JSON.parse(test)` inside a `try`/`catch`.
    - Returns `false` if parsing throws, the result is `null`, or the result is a primitive (number, string, boolean).
    - Returns the parsed value (cast to `Record<string, T> | T[]`) when it is an object or array.
    - Generic parameter `T` shapes the expected value type of the resulting object properties or array elements.

## Relationships

- **`src/index.ts`** — Re-exports this module's default function as part of the package's public API, making it available to consumers of the library.

## Notes

- The doc comment references a `getJson` function for cases where _any_ valid JSON value (including primitives and `null`) is acceptable; that function is not defined in this file and is not visible in the graph neighbors.
- Invalid input is signalled purely via the `false` return; the function never throws and never writes to `console`.
- Because `false` is both the "not a structure" sentinel and the return type, callers must check with `=== false` rather than truthiness if they ever expect to distinguish a parsed `false` literal (which this function will never return, but the type makes it look possible).
