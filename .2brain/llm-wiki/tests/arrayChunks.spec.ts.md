---
source: tests/arrayChunks.spec.ts
sha256: 21ec72cb4e6fec08f9fd31beb9f49b6f21f9da383171203921ff1fbcda9c73d3
generated_at: 2026-09-28T19:43:09.216644+00:00
model: ollama:qwen3.8:27b
---

# tests/arrayChunks.spec.ts

## Purpose

Jest test suite that verifies the `arrayChunks` utility correctly splits an array into N sub-arrays of as-equal length as possible. It exists to lock in the balancing behavior of `arrayChunks` against a fixed 9-element string array.

## Key elements

- **`describe('(arrayChunks) divide array in [num] numbers of sub-arrays, lengths differ as less as possible')`** – single test suite; the name documents the contract under test.
- **`input: string[]`** – shared fixture of 9 Latin-paragraph words used by every test case.
- **`test('2 balanced sub-arrays')`** – expects `[5, 4]` split.
- **`test('3 sub-arrays … perfect division and perfect balance')`** – expects three groups of exactly 3.
- **`test('4 balanced sub-arrays')`** – expects `[3, 2, 2, 2]` split.
- **`test('5 balanced sub-arrays')`** – expects `[2, 2, 2, 2, 1]` split.
- **`test('7 balanced sub-arrays')`** – expects `[2, 2, 1, 1, 1, 1, 1]` split.

## Relationships

- **`src/index.ts`** – the sole import source; `arrayChunks` is re-exported (or defined) there and is the function under test.

## Notes

- All tests use the **same 9-element input**; there is no coverage for empty arrays, `num = 1`, `num > length`, or non-string elements.
- Sub-array counts of 6, 8, and 9 are **not exercised**.
- The suite relies on `toEqual` (deep equality), so element order within each chunk is asserted, not just set membership.
- No mocking, setup/teardown, or async logic—pure synchronous value comparisons.
