---
source: src/arrayChunks.ts
sha256: 7269ffa7d16eb4365561fa991b7ec906baea0f3534c0d1c6621c6e386dd9ab65
generated_at: 2026-09-28T18:20:00.987468+00:00
model: ollama:qwen3.8:27b
---

# src/arrayChunks.ts

## Purpose

Provides a single utility function that splits an array into `n` sub-arrays whose lengths differ by at most one element. It exists so callers get a balanced chunking without duplicating the distribution logic (e.g. spreading the remainder across the first chunks rather than dumping it into the last).

## Key elements

- **default export** `<T>(array: T[], n: number): T[][]` — the sole public API.
    - Returns `[]` when `n < 1`, `[items]` when `n < 2`.
    - Copies the input via `Object.assign([], array)` so the caller's array is never mutated.
    - **Fast path** (`length % n === 0`): repeatedly `splice`s a fixed-size chunk off the copy.
    - **General path**: a `while` loop that advances `index` by `Math.ceil((remaining) / n)` and decrements `n` each iteration, distributing the leftover elements across the leading chunks.

## Relationships

- **src/index.ts** — Re-exports this module so downstream consumers can import `arrayChunks` from the package root without reaching into `src/`.

## Notes

- The fast-path branch (`length_ % n === 0`) has a surviving mutation-test mutant. A comment in the source explicitly states this is intentional: the general loop produces identical output for evenly divisible inputs, so the branch is purely a performance shortcut. Do not "fix" or remove the branch to satisfy mutation coverage.
- The function is a `@module` with only a default export; there are no named exports to import.
- `n` is decremented in-place inside the general loop's condition (`n--`); the parameter is not preserved after the call returns, but the local copy (`n`) is the only one used, so this is safe.
