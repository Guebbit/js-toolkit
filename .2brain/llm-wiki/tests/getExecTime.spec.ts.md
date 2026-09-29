---
source: tests/getExecTime.spec.ts
sha256: fdacb375cea7787e92f9e4d1f3d58faa9ffdda44305f7eb0843d4d71a363a40e
generated_at: 2026-09-28T19:48:40.024561+00:00
model: ollama:qwen3.8:27b
---

# tests/getExecTime.spec.ts

## Purpose

Test suite for the `getExecTime` utility, verifying that it correctly wraps a (sync or async) function, returns its result alongside a non-negative elapsed-time measurement in milliseconds, and propagates errors with the same semantics as the wrapped function.

## Key elements

- **`(getExecTime) measure execution time of a function`** — the single `describe` block; all five `test` cases live inside it.
- **Sync result test** — confirms `result` is the return value of a plain synchronous function.
- **Async result test** — confirms `result` is the resolved value when the wrapped function returns a Promise.
- **Elapsed-time test** — asserts `time` is a number ≥ 0 _and_ < 60 000 ms (the upper bound guards against a unit-conversion or sign-inversion bug that a `≥ 0` check alone would miss).
- **Sync-throw test** — uses `expect(() => …).toThrow` (synchronous assertion) to confirm a thrown error in the timed function surfaces immediately, not as a rejection.
- **Async-reject test** — uses `expect(…).rejects.toThrow` to confirm a rejected Promise from the timed function surfaces as a rejection of `getExecTime`'s own Promise.

## Relationships

- **`src/index.ts`** — the sole import target; re-exports (or defines) the `getExecTime` function that this suite exercises. No other module is touched.

## Notes

- The sync-throw test deliberately uses `expect(() => getExecTime(…)).toThrow` rather than `rejects`, pinning down that `getExecTime` does **not** wrap synchronous throws in a Promise — the error escapes the call synchronously. If the implementation ever changes to always return a Promise, this test will fail and signal the API change.
- The 60 000 ms upper bound is intentionally generous (the loop is ~10⁵ additions) so the assertion cannot flake under CI load while still catching an ms↠s or sign bug.
- The file imports from the package root (`../src`) rather than a deep path, mirroring how a consumer would import it.
