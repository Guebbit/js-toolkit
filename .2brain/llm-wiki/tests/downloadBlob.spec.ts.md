---
source: tests/downloadBlob.spec.ts
sha256: ac140c3301289493df39429c999eae0292dc2901b833d15f001589bc8661c171
generated_at: 2026-09-28T19:45:20.413613+00:00
model: ollama:qwen3.8:27b
---

# tests/downloadBlob.spec.ts

## Purpose

Jest test suite for the `downloadBlob` utility. Verifies three behaviors: non-Blob input is wrapped in a `Blob` with the correct MIME type and content size, an existing `Blob` is passed through by reference, and the download is triggered by setting `href`/`download` on an anchor and calling its `click` method.

## Key elements

- **`describe('downloadBlob')`** – top-level block containing all tests.
- **`beforeEach`** – stubs `URL.createObjectURL` (returns `'blob:mock-url'`), `URL.revokeObjectURL`, and spies on `HTMLAnchorElement.prototype.click`.
- **`afterEach`** – deletes the two `URL` properties via `Reflect.deleteProperty` and calls `jest.restoreAllMocks()`.
- **Test: "wraps non-Blob data and triggers a download"** – asserts a `Blob` is created with `text/plain` type, correct `size`, anchor is clicked once, and the object URL is revoked.
- **Test: "uses the given Blob as-is"** – asserts the exact `Blob` instance is forwarded to `createObjectURL` (identity check, not deep-equal).
- **Test: "sets href and filename on the created anchor"** – mocks `document.createElement` to capture the anchor and asserts `href` and `download` are set correctly; also verifies a caller-supplied MIME type (`text/csv`) is respected.

## Relationships

- **`src/index.ts`** – the only import source; provides the `downloadBlob` function under test. This file has no other imports or exports.

## Notes

- **jsdom limitation:** The content-integrity assertion uses `blob.size` (byte count) rather than `blob.text()` because jsdom's `Blob` implementation does not implement `text()`. A comment in the file explicitly warns that asserting only the MIME type would be insufficient to catch a wrapper that drops the data.
- **Cleanup style:** `afterEach` removes `URL.createObjectURL`/`revokeObjectURL` with `Reflect.deleteProperty` (not a simple re-assignment) to fully restore the original environment, then calls `jest.restoreAllMocks()` for the anchor `click` spy.
- The anchor-attribute test replaces the global `document.createElement` spy, so it does not rely on the `HTMLAnchorElement.prototype.click` spy set up in `beforeEach` (it spies on the instance instead).
