---
source: tests/isWithinFileSize.spec.ts
sha256: d69ae32d2968b63fac6c501806c2961e8298b5bc8e628f3ca3bda5308041f391
generated_at: 2026-09-28T19:52:39.358900+00:00
model: ollama:qwen3.8:27b
---

# tests/isWithinFileSize.spec.ts

## Purpose

Unit tests for the `isWithinFileSize` utility, verifying that it correctly accepts files at or below a byte limit, rejects files above it, and degrades gracefully when given a degenerate maximum (zero, negative, NaN).

## Key elements

- **`FIVE_MB`** — local constant (`5 * 1024 * 1024`) used as the reference limit throughout the suite.
- **`describe('(isWithinFileSize) …')`** — single top-level block containing:
    - Accepts a file **under** the limit.
    - Accepts a file **exactly at** the limit (inclusive boundary).
    - Rejects a file **over** the limit by one byte.
    - `test.each` over degenerate maxima (`0`, `-1`, `NaN`): all must behave as "no limit" and return `true`.

## Relationships

- **`src/index.ts`** — the module under test. This file imports `isWithinFileSize` from it (via `../src`) and exercises every documented behavior path of that function.

## Notes

- The function signature takes a **file-like object** (`{ size: number }`) rather than a raw byte count; tests always pass an object with a `size` property.
- The degenerate-max cases (zero, negative, NaN) are an **intentional design decision**: a misconfigured maximum must accept everything rather than reject everything. This is not a bug — it is the specified contract.
- The boundary test confirms the comparison is **inclusive** (`<=`), not strict (`<`).
