---
source: tests/deleteFile.spec.ts
sha256: cc95998dae0e7ef86054cd3ff078d3efc036608e961fb24227eb31d37e5a075b
generated_at: 2026-09-28T19:45:05.087488+00:00
model: ollama:qwen3.8:27b
---

# tests/deleteFile.spec.ts

## Purpose

Jest test suite that verifies the `deleteFile` utility (imported from `../src`) correctly deletes a file, handles missing files, and surfaces unexpected deletion errors through an optional `onError` callback—without throwing.

## Key elements

- **`describe('(deleteFile) delete target file in the filesystem')`** – Top-level suite. Creates a unique temp directory (`os.tmpdir()/js-toolkit-…`) in `beforeEach` and removes it in `afterEach` so each test runs in isolation.
- **`test('deletes an existing file and resolves true')`** – Writes a real file, asserts `deleteFile` resolves `true`, then confirms the file is gone (`ENOENT` on `stat`).
- **`test('resolves false when the file does not exist…')`** – Passes a `jest.fn` as `onError`; asserts resolution value is `false` and `onError` is _never_ called (ENOENT is the "expected" missing-file path).
- **`test('resolves false and forwards the error…')`** – Targets an existing _directory_ so `unlink` fails with a non-ENOENT error. Asserts `onError` is called exactly once and inspects the error via `typeof … .message === 'string'` (see Notes).
- **`test('does not throw when no onError callback is provided…')`** – Same directory target, but omits `onError`; asserts `deleteFile` still resolves `false` rather than rejecting.

## Relationships

- **`src/index.ts`** – The sole unit under test. This spec imports `deleteFile` from `../src` and exercises its happy path, its "file absent" contract, and its error-forwarding behavior. No other module is imported by the test.

## Notes

- The non-ENOENT error case is simulated by pointing `deleteFile` at a _directory_; `unlink` on a directory fails on all major platforms, giving a reliable non-ENOENT error without needing platform-specific fixtures.
- Error assertions deliberately avoid `instanceof Error` because the error originates in Node's `fs` realm while tests run under jsdom (Jest's default environment); checking `typeof .message === 'string'` sidesteps cross-realm identity checks.
- `onError` is typed as `(error: Error) => void` but the test treats it as fire-and-forget—`deleteFile` never re-throws; it always resolves `false` on failure.
