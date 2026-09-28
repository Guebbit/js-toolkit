---
source: src/getJson.ts
sha256: 4ae2537f847a560c052c3a88b07407355c89b50759285aa5c9e7f8f37cd98d50
generated_at: 2026-09-28T19:38:33.186941+00:00
model: ollama:qwen3.8:27b
---

# src/getJson.ts

## Purpose

A thin wrapper around `JSON.parse` that converts the thrown `SyntaxError` into an `undefined` return value, allowing callers to treat "not valid JSON" as a normal value rather than handling a control-flow exception.

## Key elements

- **`default` export** — `(json?: string) => unknown`. Accepts an optional string; returns the parsed value, or `undefined` if the input is empty, falsy, or not valid JSON. No side effects (no logging).

## Relationships

- **`src/index.ts`** — re-exports this module's default function as part of the package's public API surface.

## Notes

- The explicit `return undefined` in the `catch` block is intentional documentation of the contract, not a functional requirement. A mutation-testing note in the source confirms that deleting it produces equivalent behavior (falling off the end of the function also yields `undefined`). Do not remove it.
- The function deliberately does **not** write to the console on parse failure; a malformed string is an expected input, not an error condition to report to the host.
- Returns type is `unknown`, not `any` — callers must narrow the result after the `undefined` check.
