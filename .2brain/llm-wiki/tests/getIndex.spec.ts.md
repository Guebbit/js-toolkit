---
source: tests/getIndex.spec.ts
sha256: b61f43a72b3b11de852911ed41c288b52a6fb15f2226dec6c2024b5b841a0ccb
generated_at: 2026-09-28T19:49:19.786535+00:00
model: ollama:qwen3.8:27b
---

# tests/getIndex.spec.ts

## Purpose

Unit test suite for the `getIndex` utility, verifying that it returns the 0-based position of an element among its siblings and handles edge cases (null input, detached elements).

## Key elements

- **DOM fixture (module-level)** — Populates `document.body` with a single outer `<div>` containing four child `<div>`s; the third child carries `id="testContent"`. Set up once before any test runs.
- **`describe('(getIndex) …')` block** — Groups three `test` cases:
    - _Element only_ — asserts `getIndex` returns `2` for the `#testContent` element.
    - _null element_ — asserts `getIndex(null)` returns `-1` (with an `eslint-disable` for `unicorn/no-null`).
    - _orphan element_ — creates a detached `<div>` via `createElement` and asserts `getIndex` returns `-1`.

## Relationships

- **Imports `getIndex` from `src/index.ts`** — the sole subject under test; no other modules are touched.

## Notes

- The DOM fixture is set at module scope (outside any `beforeEach`), so it persists across all three tests in this file and is not torn down between them.
- The null-test line carries an inline `eslint-disable-next-line unicorn/no-null` comment, indicating the project enforces the `unicorn/no-null` rule but permits `null` here for an explicit edge-case assertion.
