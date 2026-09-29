---
source: tests/getJson.spec.ts
sha256: 5ee0d07a062c38647d3050dd64ed3387787b0e2dfe54f2d988052f7128e69f2f
generated_at: 2026-09-28T19:49:36.649959+00:00
model: ollama:qwen3.8:27b
---

# tests/getJson.spec.ts

## Purpose

Jest test suite for the `getJson` utility, verifying that it safely parses JSON strings by returning the parsed value on success and `undefined` on failure (no exceptions, no console output). It exists to lock down the "safe parse" contract so callers can distinguish valid from invalid JSON purely via the return value.

## Key elements

- **`getJson`** (imported from `../src`) — the function under test; accepts `string | undefined`, returns the parsed JSON value or `undefined`.
- **`describe('(getJson) Safe conversion of JSON', …)`** — top-level suite containing all cases.
- **Bare-value tests** — confirm that numbers, quoted strings, booleans, and `null` are parsed to their native JS types (not wrapped in objects).
- **Empty container tests** — `{}` and `[]` parse to an empty object / empty array respectively.
- **Invalid-JSON tests** — single-quoted object/array strings (not valid JSON) must yield `undefined`.
- **Silent-failure test** — spies on `console.error` and asserts it is _never_ called for malformed input, then restores the spy in a `finally` block.

## Relationships

- **`src/index.ts`** — sole dependency. `getJson` is imported from this module (`import { getJson } from '../src'`). This test file is the consumer-side contract for that export.

## Notes

- The tests treat _single-quoted_ key/value strings as the "invalid JSON" cases; double-quoted strings are the valid ones. Don't assume single-quoted input is a supported format.
- The design intent is explicitly documented in comments: `getJson` is a **general parse** (unlike a hypothetical `isJson`), so bare scalars are legitimate inputs, and a malformed string is _expected_ input rather than an error event — hence no logging.
- The `console.error` spy is restored in `finally` to avoid leaking the mock into subsequent tests.
