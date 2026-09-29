---
source: tests/canonicalize.spec.ts
sha256: fc1db79514d0883dd17bfaa98221eb4343399c3a3678b00be71b156d70254416
generated_at: 2026-09-28T19:44:08.331894+00:00
model: ollama:qwen3.8:27b
---

# tests/canonicalize.spec.ts

## Purpose

Jest test suite that verifies `canonicalize` produces a stable, insertion-order-independent canonical form of a JavaScript value. It exists to pin down the serialization contract (key ordering, type coercion, undefined handling, circular-reference policy) so downstream consumers can rely on `JSON.stringify(canonicalize(x))` being deterministic.

## Key elements

- **`describe('(canonicalize) …')`** — single top-level suite covering 11 focused `test` blocks.
- **Key-sorting tests** — asserts top-level and nested object keys are sorted alphabetically while array element order is preserved.
- **`undefined`-dropping test** — uses `toStrictEqual` (not `toEqual`) and checks `Object.keys` to guarantee the key is absent, not merely `undefined`.
- **Date → ISO string test** — confirms `Date` instances are converted at any nesting depth.
- **Primitive passthrough test** — numbers, strings, booleans, `null`, and `undefined` are returned unchanged.
- **Circular-reference tests** — default behavior replaces cycles with the string `"[Circular]"`; a `throwOnCircular` flag (second arg) makes it throw instead; a diamond (shared but acyclic) reference is _not_ treated as circular.

## Relationships

- **`src/canonicalize.ts`** — the implementation under test; `canonicalize` is the sole function exercised here.
- **`src/index.ts`** — barrel module; the test imports `canonicalize` via `import { canonicalize } from '../src'` rather than reaching into `src/canonicalize.ts` directly, so the public re-export surface is implicitly validated.

## Notes

- The `throwOnCircular` option is passed as a positional second argument (`canonicalize(node, true)`); there is no options-object API exercised in these tests.
- Circular-reference detection is cycle-based, not identity-based: the same object appearing in two sibling slots (diamond) passes without being flagged, even with `throwOnCircular` enabled.
- The `undefined` test deliberately uses `toStrictEqual` — switching to `toEqual` would silently pass if the key were present with an `undefined` value.
