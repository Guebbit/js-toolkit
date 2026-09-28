---
source: src/timeToSeconds.ts
sha256: 791e2a7c0f072e8ece49c5d800ac4455382f77ca6192d38c2b415c1a4f98027b
generated_at: 2026-09-28T19:42:29.944785+00:00
model: ollama:qwen3.8:27b
---

# src/timeToSeconds.ts

## Purpose

Converts a delimited time string (e.g. `"14:30:05:250"`) into a **milliseconds** number. Components are optional and read from the left, so shorter strings like `"14:30"` are valid. It exists as a small, dependency-free utility so callers don't repeat split/parse arithmetic.

## Key elements

- **Default export** – `(date?: string, delimiter?: string): number`
  - Splits `date` on `delimiter` (default `':'`), maps each part to an integer (`Number.parseInt`), and computes `(h × 3600 + m × 60 + s) × 1000 + ms`.
  - Destructures into exactly four slots (`hours`, `minutes`, `seconds`, `milliseconds`), each defaulting to `0` when absent.

## Relationships

- **`src/index.ts`** – Re-exports this module so it is available from the package entry point.

## Notes

- **Misleading filename.** Despite `timeToSeconds`, the return value is **milliseconds**, not seconds.
- **Blank vs. malformed input.** A component that is empty after trimming is treated as `0`. A component that is non-numeric text (e.g. `"abc"`) produces `NaN`, which then propagates to the result—intentionally, so typos don't silently become zero.
- **Max four components.** Splitting a string with five or more segments will ignore everything past `milliseconds` because the destructuring list has exactly four bindings.
- **`Number.parseInt`, not `Number`.** Leading/trailing digits are parsed, trailing non-digit characters are silently dropped (e.g. `"90x"` → `90`).
