---
source: tests/index.spec.ts
sha256: 6ae027f9a44b0d49be14628353c7dd03f11f733ff66094b16868d306ab3640f4
generated_at: 2026-09-28T19:51:35.068803+00:00
model: ollama:qwen3.8:27b
---

# tests/index.spec.ts

## Purpose

Runtime smoke test for the barrel module (`src/index.ts`). It verifies that every re-export actually resolves to a defined, callable function at runtime — catching a class of breakage (e.g. a re-export that type-checks but resolves to `undefined`) that type-level tests cannot see.

## Key elements

- **`describe('barrel')`** — the single test suite in the file.
- **`test('every export is a callable function')`** — asserts two things:
    - `Object.values(toolkit)` has exactly **46** entries (the expected export count).
    - Every value satisfies `typeof value === 'function'`.

## Relationships

- **`src/index.ts`** — imported as `* as toolkit`. This spec is the only consumer that checks the barrel's _runtime_ shape; it does not exercise individual exports' behavior, only that they exist and are callable.

## Notes

- The export count (`46`) is **hardcoded**. Adding or removing a re-export in `src/index.ts` requires updating this literal, otherwise the test fails.
- The file deliberately complements `tests/types/surface.test-d.ts`: the type test validates the _static_ surface, while this spec guards the _runtime_ surface.
- The test does **not** call the exported functions; it only checks `typeof`. Actual behavior coverage lives elsewhere.
