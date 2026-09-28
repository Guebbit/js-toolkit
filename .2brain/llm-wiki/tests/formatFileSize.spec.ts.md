---
source: tests/formatFileSize.spec.ts
sha256: 6c32b9d1c36ae6c9a4ef8aaff63a1ffc4f4402c7ed9d1489071917996db434d2
generated_at: 2026-09-28T19:47:08.453815+00:00
model: ollama:qwen3.8:27b
---

# tests/formatFileSize.spec.ts

## Purpose

Jest test suite for the `formatFileSize` utility. Verifies that a raw byte count is rendered into a human-readable string (e.g. `1.5 KB`, `5 MB`) across binary/decimal units, decimal precision, forced-unit mode, and boundary/edge-case inputs.

## Key elements

- **`describe('(formatFileSize) …')`** – single top-level suite; every test targets the one imported function.
- **Table-driven unit tests (`test.each`)** – cover 0 B through 3 GB, plus negative, `NaN`, and `Infinity` inputs (all expected to render `0 B`).
- **Trailing-zero stripping** – asserts `5 MB`, not `5.0 MB`.
- **`decimals` option** – `{ decimals: 3 }` → `1.526 MB`; `{ decimals: 0 }` → `2 MB` (rounding up).
- **`binary: false` (decimal units)** – 1000 and 1024 both render as `1 kB`.
- **Clamping at the largest unit** – `1024 ** 6` must contain `TB` rather than `undefined`.
- **Forced `unit` option** – `{ unit: 'MB' }` keeps a column comparable (512 KB → `0.5 MB`); `{ unit: 'B' }` pins to bytes.
- **Unrecognised unit fallback** – casting `'PB'` as a valid unit still yields a sensible `1 KB` instead of `NaN undefined`.

## Relationships

- **`src/index.ts`** – sole import source; the test file calls the `formatFileSize` re-exported from this module. No other modules are touched.

## Notes

- The function's options object exposes at least three keys: `decimals` (number), `binary` (boolean, default `true`), and `unit` (string, e.g. `'B'`, `'MB'`). The tests do not assert on the shape of a default options object.
- The unrecognised-unit test deliberately passes an invalid unit via a type assertion (`'PB' as 'MB'`) to exercise the runtime fallback; it is not a TypeScript compile error in practice.
- Negative, `NaN`, and `Infinity` inputs are all treated identically to `0`; there is no negative-size or error path.
