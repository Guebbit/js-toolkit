---
source: tests/associativeSlice.spec.ts
sha256: b651d13fe6b9530ab4963415d9832b53358e1ba5e354efb30969fbb8f7383ed4
generated_at: 2026-09-28T19:43:53.416042+00:00
model: ollama:qwen3.8:27b
---

# tests/associativeSlice.spec.ts

## Purpose

Jest test suite for the `associativeSlice` utility, which extracts a contiguous range of entries from a plain object by own-key index (analogous to `Array.prototype.slice` but over object keys). The suite locks down the function's slicing semantics, edge cases, reference behavior, and immutability contract.

## Key elements

- **`describe('(associativeSlice) …')`** — single top-level block; all tests share one fixture object with five keys (`lorem`, `adipiscing`, `dolor`, `elit`, `sit`).
- **Slicing-range tests** — cover normal range, start-at-zero, end-exclusive boundary, end-past-last, start-past-last, and empty/inverted span (all expected to return `{}`).
- **Negative-start test** — asserts a negative start index is clamped to `0` (does _not_ count back from the end like `Array.prototype.slice`).
- **Empty-input test** — `associativeSlice({}, 0, 5)` returns `{}`.
- **Reference-semantics test** — nested objects in the result are the _same_ reference as in the input (no deep clone).
- **Immutability test** — the input object is unchanged after a call.
- **Inherited-key test** — uses `Object.create` to confirm prototype-chain properties do not consume an index slot and are excluded from the result.

## Relationships

- **`src/index.ts`** — the sole import source. The test imports `associativeSlice` from `../src`, which resolves to this file. All assertions validate behavior defined there.

## Notes

- End index is **exclusive**; an off-by-one in the implementation silently shifts every caller's window.
- Negative `start` is treated as `0`, _not_ as "count back from the end." This diverges from `Array.prototype.slice` and is intentional per the test comment.
- Only **own** enumerable keys are indexed; inherited (prototype) keys are invisible to the slice.
- Values pass through **by reference** — callers may mutate the nested value and affect both the sliced result and the original object.
