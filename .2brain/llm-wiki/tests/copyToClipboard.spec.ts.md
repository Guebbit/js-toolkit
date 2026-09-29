---
source: tests/copyToClipboard.spec.ts
sha256: 661ba7c4b98234234ab9606b37f403c196329bf3131059374ae1d54b001febfe
generated_at: 2026-09-28T19:44:37.197464+00:00
model: ollama:qwen3.8:27b
---

# tests/copyToClipboard.spec.ts

## Purpose

Jest test suite for the `copyToClipboard` utility exported from `src/index.ts`. It verifies the function's dual strategy (modern Clipboard API with `execCommand` fallback), its error handling, and that it uses feature detection rather than a blanket try/catch around the API call.

## Key elements

- **`mockExecCommand(result)`** — Helper that replaces `document.execCommand` with a Jest mock. Accepts a boolean or a function (to simulate throwing). Returns the mock for later assertions.
- **`describe('copyToClipboard', …)`** — Six tests covering:
    - Clipboard API happy path (resolves `true`, calls `writeText`).
    - Clipboard API rejection + `execCommand` failure → resolves `false`, logs to `console.error`.
    - Clipboard API absent → falls back to `execCommand('copy')`.
    - `execCommand` throws → resolves `false`, logs to `console.error`.
    - Fallback creates exactly one `<textarea>`, sets `value`, `position: fixed`, `opacity: 0`.
    - When the Clipboard API is absent, `navigator.clipboard` is never accessed (no `TypeError` logged), confirming feature-detection over try/catch.
- **`afterEach` cleanup** — Uses `Reflect.deleteProperty` to remove the mocked `navigator.clipboard` and `document.execCommand`, then restores all Jest spies.

## Relationships

- **`src/index.ts`** — The sole import target; provides the `copyToClipboard` function under test. The tests exercise its public contract (return value, side effects on `navigator`/`document`, logging behavior) without importing any other internal modules.

## Notes

- The last test is deliberately structured as a **feature-detection guard check**: it asserts that no error is logged when the Clipboard API is missing, ensuring the implementation checks for API existence _before_ calling it rather than relying on a catch-all.
- `document.execCommand` is deprecated; the file carries `eslint-disable` comments for `@typescript-eslint/no-deprecated` wherever it is referenced.
- The textarea-inspection test wraps the real `document.createElement` to capture instances, so assertions read actual style properties rather than a full DOM mock.
