---
source: tests/match.spec.ts
sha256: 7d9f56f0d119c5bf816517db6032ee98f1efc59154b4411023e71ad8020182df
generated_at: 2026-09-28T19:53:10.651290+00:00
model: ollama:qwen3.8:27b
---

# tests/match.spec.ts

## Purpose

Test suite for the `match` function, verifying that two-string comparison behaves correctly across all five modes (`exact`, `contains`, `contained`, `either`, `fuzzy`) and that the default/sensitivity/trimming invariants hold.

## Key elements

- **`match` (imported from `../src`)** — the single function under test; accepts `(a, b?, options?)` and returns `boolean`.
- **`describe('(match) …')`** — top-level block; the first test asserts that identical strings always match regardless of mode (equality short-circuit).
- **`describe('case sensitivity')`** — confirms the default is case-insensitive and `sensitive: true` disables folding.
- **`describe("mode 'exact'")`** — verifies strict equality after trim/case-fold; substrings are rejected in both directions.
- **`describe("mode 'contained'")`** — documents that this is the *default* mode (no `mode` key needed) and that it asks "is `a` inside `b`?".
- **`describe("mode 'contains'")`** — the mirror: "does `a` hold `b`?".
- **`describe("mode 'either'")`** — containment in either direction; still rejects unrelated strings.
- **`describe("mode 'fuzzy'")`** — Levenshtein-style distance gated by `maxDistance`; confirms that a case-only difference counts as an edit only under `sensitive: true`; confirms substring logic does not leak into fuzzy mode.
- **Empty-string defaults test** — `match()` (no args) returns `true`; a single arg against `''` returns `false`.

## Relationships

- **`src/index.ts`** — sole dependency; exports the `match` function that every assertion in this file exercises. No other modules are imported.

## Notes

- The default mode is **`contained`**, not `exact` or `fuzzy`. A caller omitting `options` entirely gets `contained` semantics.
- `maxDistance` defaults to **0**, so `{ mode: 'fuzzy' }` without `maxDistance` is equivalent to `exact` after case-fold/trim.
- Both operands are trimmed of leading/trailing whitespace before any comparison logic runs.
- Equality of the two (trimmed, case-folded) strings short-circuits to `true` before any mode-specific branching, meaning `fuzzy` with `maxDistance: 0` and `exact` produce the same result on identical inputs.
