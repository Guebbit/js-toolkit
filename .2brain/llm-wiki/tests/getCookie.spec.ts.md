---
source: tests/getCookie.spec.ts
sha256: 2b91c129330f3d9aeb4b6795f468ced80e493a30d856c88e5defde43270e0a0d
generated_at: 2026-09-28T19:48:00.160896+00:00
model: ollama:qwen3.8:27b
---

# tests/getCookie.spec.ts

## Purpose

Unit-test suite for the `getCookie` helper exported by the library. It verifies cookie reading, value decoding, missing-cookie handling, and name-boundary correctness against a real `document.cookie` in the test environment.

## Key elements

- **`setRawCookie(cookie: string)`** – Local helper that writes a raw string directly to `document.cookie` (bypasses any library setter). Used to seed state before each assertion.
- **`describe('getCookie')`** – Top-level test block containing four cases:
  - *reads an existing cookie* – basic happy-path read.
  - *decodes the value* – confirms the returned value is `decodeURIComponent`-ed (e.g. `a b&c`).
  - *returns undefined for a missing cookie* – absent name yields `undefined`, not `""` or a throw.
  - *does not match a cookie whose name is only a prefix* – guards against naive `startsWith` matching (`themeExtra` ≠ `theme`).
- **`afterEach(clearCookies)`** – Resets `document.cookie` between tests so cases are independent.

## Relationships

- **`src/index.ts`** – Source of the `getCookie` function under test; this spec is its sole dedicated unit-test file.
- **`tests/_helpers/cookies.ts`** – Provides `clearCookies`, the cleanup utility called in `afterEach` to wipe any cookies set during a test.

## Notes

- The `eslint-disable-next-line unicorn/no-document-cookie` comment is intentional: the test must write raw cookie strings to exercise decoding and boundary logic that the library's own setter would mask.
- Tests rely on the browser test environment (e.g. Jest with jsdom or Vitest) providing a functional `document.cookie`; they will not run in a pure Node environment.
- No mocking is used—`getCookie` is tested against the real `document.cookie` API, so assertions reflect actual browser cookie semantics.
