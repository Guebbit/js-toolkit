---
source: src/getExecTime.ts
sha256: 10a4aeaa6991d066b586cb1bedcfe8297bccb2ef701a7288018d16edc38d05c5
generated_at: 2026-09-28T19:37:47.018813+00:00
model: ollama:qwen3.8:27b
---

# src/getExecTime.ts

## Purpose

A tiny utility that measures the wall-clock execution time of any function (sync or async) using Node's monotonic nanosecond clock, returning the function's result together with the elapsed duration in milliseconds.

## Key elements

- **`default export`** — `<T>(function_: () => T | Promise<T>) => Promise<{ result: T, time: number }>`. Accepts a zero-argument callback, calls it inside `Promise.resolve` (so sync and async callers are treated identically), and resolves with the original return value plus `time` in ms.

## Relationships

- **`src/index.ts`** — Barrel/entry module that re-exports this function so consumers can import it from the package root.

## Notes

- `time` is always a `Promise`-resolved number; callers must `await` even when the timed function is synchronous.
- Timing uses `process.hrtime.bigint()` (monotonic), not `Date.now()`, so it is unaffected by system-clock adjustments.
- The generic `T` preserves the caller's return type through the wrapper without any explicit type assertion.
