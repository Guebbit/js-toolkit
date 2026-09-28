---
source: tests/types/numbers-and-ranges.test-d.ts
sha256: de2c7a0e213cd63003e2e3708c06dad189168da33114e6666ad37d41da1cee7d
generated_at: 2026-09-28T19:58:40.401423+00:00
model: ollama:qwen3.8:27b
---

# tests/types/numbers-and-ranges.test-d.ts

## Purpose

Compile-time type assertions (via `expect-type`) that lock down the exact public signatures of the toolkit's numeric and range helpers — `getDelta`, `getMapDistance`, `rangeOverlaps`, `getOverlapRange`, and `formatCurrency` — plus the `IFormatCurrencyOptions` interface. The file exists so that any unintended signature change (parameter reordering, widened return types, added optionality) fails the type-check before it ships.

## Key elements

- **Positive type assertions** (`expectTypeOf(...).toEqualTypeOf<…>()`): pin the exact parameter types, optional parameters, and return types of each function, and the exact shape of `IFormatCurrencyOptions`.
- **Tuple return check for `getOverlapRange`**: asserts the return is `[number, number]` (a fixed-length tuple), not `number[]`, and verifies destructuring yields `number` for both slots.
- **Negative tests** (`@ts-expect-error`): confirm that passing `true` where `size?: number` is expected in `getDelta`, and `978` where `currency?: string` is expected in `formatCurrency`, are rejected by the compiler.

## Relationships

- **`src/index.ts`** — the sole import source (`import * as toolkit from '../../src'` and `import type { IFormatCurrencyOptions }`). Every assertion in this file validates a symbol re-exported from that barrel.
- **`src/formatCurrency.ts`** — the implementation behind `toolkit.formatCurrency` and the `IFormatCurrencyOptions` type; this test file is the only consumer that pins their public contract at the type level.

## Notes

- This is a **type-only** test (`.test-d.ts`); it is evaluated by the TypeScript compiler, never executed at runtime. It will not appear in Jest/Vitest runtime output.
- `formatCurrency` is deliberately tested *here* rather than in a string-formatter type test: the file header notes it renders a number for display and thus groups with the other numeric helpers.
- The `getOverlapRange` tuple assertion is intentional — widening to `number[]` would silently drop the two-element length guarantee that callers rely on for destructuring.
