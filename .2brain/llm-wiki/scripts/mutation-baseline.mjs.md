---
source: scripts/mutation-baseline.mjs
sha256: 18d0c823924bb58cede8f270d5a6ce207021be540b9a56b7c15a76818953db6d
generated_at: 2026-09-28T18:19:35.689116+00:00
model: ollama:qwen3.8:27b
---

# scripts/mutation-baseline.mjs

## Purpose

Per-file mutation-testing gate. Reads a Stryker JSON report, compares each file's kill score against a committed `mutation-baseline.json`, fails the run on any regression, and ratchets baselines upward only when the entire run is regression-free. Replaces a single global percentage that can hide a weak file behind a strong one.

## Key elements

- **`scoreFile(mutants)`** — Computes two per-file percentages from a mutant array: `covered` (killed / (killed + survived)) and `total` (killed / (killed + survived + noCov)). `Timeout` is treated as killed; `Ignored` and `CompileError` are excluded from both denominators.
- **`asBaseline(entry, previous)`** — Shapes a baseline record (rounded to 2 dp) and carries over a hand-written `note` from the previous entry so it survives rewrites.
- **`--init` mode** — Writes a fresh `mutation-baseline.json` from the current report (preserving existing `note` fields) and exits.
- **Default (check) mode** — Compares measured scores to the baseline, collects regressions and improvements, prunes deleted files, and writes the updated baseline only if zero regressions were found.
- **`inCI` flag** — When `process.env.CI` is set, a file missing from the baseline is a hard failure rather than an auto-recorded new entry.
- **`EPSILON` (0.01)** — Slack for floating-point comparison so a stable re-run cannot fail on rounding alone.

## Relationships

No graph neighbors are recorded for this file. It reads `reports/mutation/mutation.json` (produced by the test runner) and writes `mutation-baseline.json` at the repo root; it is invoked as a standalone script via `node` or an npm alias.

## Notes

- **Two metrics, two diagnoses.** `total` far below `covered` means untested code; both low and close means tested-but-unasserted code. The script prints a tailored hint for each case on regression.
- **One-way ratchet, all-or-nothing write.** Baselines are only written back when the entire run has zero regressions. If any file regresses, the baseline file is left untouched and the process exits 1.
- **New-file gap is a failure in CI.** Outside CI a missing baseline entry is recorded at the current score (so a contributor can commit it deliberately); in CI the same situation exits 1, preventing a new source file from riding in ungated.
- **`note` field.** A human-authored string on a baseline entry explaining why a file intentionally sits below 100 % (e.g., equivalent mutants). It is preserved across `--init` and normal rewrites.
- **Timeout = killed.** Mutants with status `Timeout` are counted as detected, matching Stryker's own scoring convention.
- **Removed files are pruned.** A baseline entry whose source file no longer appears in the report is deleted on the next successful write.
