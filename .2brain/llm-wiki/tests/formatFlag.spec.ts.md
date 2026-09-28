---
source: tests/formatFlag.spec.ts
sha256: 7cff9c3e01ea3394c40ae4bc903a7b1460749df92fa1b23b93b69383f65335f2
generated_at: 2026-09-28T19:47:23.572993+00:00
model: ollama:qwen3.8:27b
---

# tests/formatFlag.spec.ts

## Purpose

Unit test suite for the `formatFlag` utility (exported from `src/index.ts`), verifying that a boolean value is rendered as one of two caller-supplied labels and that absent values (`null`/`undefined`) are kept semantically distinct from `false`.

## Key elements

- **`describe('(formatFlag) …')`** — single top-level suite; no helpers or setup/teardown.
- **`test('picks the true label')`** — asserts `formatFlag(true, 'Active', 'Inactive')` → `'Active'`.
- **`test('picks the false label')`** — asserts `formatFlag(false, 'Active', 'Inactive')` → `'Inactive'`.
- **`test.each([…])` (null / undefined)** — parametrized case confirming both `null` and `undefined` return the default em-dash `'—'`, not the false label. Carries an `eslint-disable` for `unicorn/no-null` to silence the linter on the intentional `null` literal.
- **`test('accepts a custom fallback')`** — verifies the optional 4th argument overrides the `'—'` default.

## Relationships

- **`src/index.ts`** — sole dependency; the suite imports `formatFlag` via `import { formatFlag } from '../src'`. No other modules are touched.

## Notes

- The default fallback for non-boolean input is the Unicode em dash `'—'` (U+2014), not a space or empty string. Tests must match it exactly.
- The 4th parameter (custom fallback) is optional; omitting it yields `'—'`.
- The suite intentionally treats `null`/`undefined` as a third state ("no answer") rather than coalescing them to `false`. Any change to that contract in `src` will break both parametrized cases.
- No async tests, mocks, or file-system access — safe to run in isolation.
