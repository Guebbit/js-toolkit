---
source: src/levenshteinDistance.ts
sha256: e4cb1f4cae78fd9667dc00c0c66e069850e36757a1720292a7f232d345625e72
generated_at: 2026-09-28T19:41:12.878893+00:00
model: ollama:qwen3.8:27b
---

# src/levenshteinDistance.ts

## Purpose

Implements the classic Wagner–Fischer dynamic-programming Levenshtein edit distance. It returns the minimum number of single-character insertions, deletions, or substitutions required to transform one string into another. Serves as the distance metric consumed by the fuzzy-matching logic in this project.

## Key elements

- **`export default (a?: string | null, b?: string | null): number`** — The sole export. Computes the edit distance between two strings. Accepts `null`/`undefined` on either side and collapses them to the empty string (so two nulls yield `0`). Returns an integer ≥ 0.

## Relationships

- **`src/index.ts`** — Re-exports the default function from this file as part of the package's public API surface.
- **`src/match.ts`** — Calls this function to obtain a numeric distance between a query and a candidate string, then compares it against a threshold to decide whether a fuzzy match succeeds.

## Notes

- Parameters are typed `string | null | undefined` and coerced with `??` rather than default parameters, because `null` (not just `undefined`) must also map to `''`. An explicit `eslint-disable` suppresses the `unicorn/prefer-default-parameters` rule here.
- The three early-return guards (equal strings, empty `first`, empty `second`) are pure shortcuts; the DP matrix would produce the same result without them. The in-file comment explicitly warns that mutation testing will show "surviving mutants" on these lines and that they should not be removed or refactored.
- The matrix is laid out as `matrix[row][col]` where rows correspond to `second` (b) and columns to `first` (a). The final answer is read from `matrix[second.length][first.length]`.
- Copyright header attributes the algorithm to Andrei Mackenzie (2011) under the MIT license.
