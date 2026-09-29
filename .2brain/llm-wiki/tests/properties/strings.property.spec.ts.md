---
source: tests/properties/strings.property.spec.ts
sha256: c2e2a76d11b40ddb7bbbe1ccef92eb9e7c6704413b229cdeaf89096ae3974bef
generated_at: 2026-09-28T19:55:23.053769+00:00
model: ollama:qwen3.8:27b
---

# tests/properties/strings.property.spec.ts

## Purpose

Property-based tests (via `fast-check`) for the three string utilities exported from `src/index.ts`: `levenshteinDistance`, `match`, and `coerceStringArray`. The tests encode the mathematical invariants (metric axioms, mode-lattice relationships, normalisation rules) that must hold for _all_ inputs, not just hand-picked examples, and are sized to run fast enough inside a pre-commit hook.

## Key elements

- **`shortString` / `nonEmpty` / `anyString`** – `fast-check` arbiters for strings capped at 12 characters; `nonEmpty` additionally requires `minLength: 1`. The cap keeps the O(a·b) Levenshtein computation cheap in CI.
- **`describe('(levenshteinDistance) properties')`** – Verifies metric axioms (zero-iff-equal, symmetry, non-negativity, triangle inequality), bounds (≤ max length, ≥ |length difference|), empty-string edge cases, `null` as absent-string, and suffix-invariance.
- **`describe('(match) properties')`** – Verifies reflexivity across all five modes (`exact`, `contains`, `contained`, `either`, `fuzzy`), case-folding default, `either` ≡ `contains ∨ contained`, mirror symmetry of one-way modes, monotonicity of `maxDistance`, exact-implying-all, and whitespace-trim invariance.
- **`describe('(coerceStringArray) properties')`** – Verifies the function always returns `string[]`, filters empty/whitespace items, is idempotent on its own output, and correctly splits comma-joined strings.
- **`modes` constant** – The tuple `['exact','contains','contained','either','fuzzy']` used to parametrize `match` tests.

## Relationships

- **Imports from `src/index.ts`** – The sole dependency. It pulls in `coerceStringArray`, `levenshteinDistance`, and `match`. No other project modules are referenced.

## Notes

- All string arbiters are capped at `maxLength: 12` explicitly to keep the file runnable in a pre-commit hook; raising the cap will slow the Levenshtein and fuzzy-match tests quadratically.
- The `levenshteinDistance(a)` single-arg call and `levenshteinDistance(a, null)` are tested as equivalent to passing `''`; the `eslint-disable` comments suppress `unicorn/no-null` and `unicorn/no-useless-undefined` for those intentional cases.
- The idempotence test for `coerceStringArray` filters generated strings to exclude commas (`s.includes(',')`), because a comma in the _output_ would be re-split on a second pass—this is a known design boundary, not a bug.
- The comment "The old sentinel returned 999 here" documents a prior implementation where the empty string was a special case; the current code no longer treats it specially, and the tests assert that.
