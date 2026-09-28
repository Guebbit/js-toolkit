---
source: tests/setCookie.spec.ts
sha256: 7770a3e4335697aadc2975968c0c9cf65a2f2faa8faaa4e1e40a99e3ccfa4531
generated_at: 2026-09-28T19:56:15.975423+00:00
model: ollama:qwen3.8:27b
---

# tests/setCookie.spec.ts

## Purpose

Jest test suite that verifies `setCookie` writes correct, URL-encoded cookie strings to `document.cookie`, including name/value encoding, default attributes, and optional flags (expiry, path, domain, secure, sameSite).

## Key elements

- **`describe('setCookie')`** — Basic integration tests: round-trips a value through `setCookie` → `getCookie`, confirms encoding of spaces/`&`, and asserts that passing `{ days, path, sameSite }` options does not throw.
- **`describe('setCookie attributes')`** — Low-level tests that inspect the raw string written to `document.cookie`. Before each test it replaces `document.cookie` with a custom property that captures the setter's argument into a `written` variable; after each test it restores the original property.
- **`afterEach(clearCookies)`** (first block only) — Clears all cookies between tests via the shared helper.
- **Expiry assertion** — Extracts the `; expires=` value with a regex and checks it is within 5 s of `now + 7 days`.

## Relationships

- **`src/index.ts`** — Source of the `setCookie` and `getCookie` functions under test.
- **`tests/_helpers/cookies.ts`** — Provides `clearCookies`, used as the `afterEach` hook in the first `describe` block to reset the cookie jar between tests.

## Notes

- **jsdom limitation:** jsdom's built-in cookie jar silently drops attributes (path, expires, domain, secure, samesite) on read. The second `describe` block works around this by overriding `document.cookie` with a `configurable` property whose setter records the full raw string.
- **No `clearCookies` in the second block:** Cleanup there is done by `delete document.cookie` in `afterEach`, not by the helper, because the helper operates on the real jsdom jar rather than the overridden property.
- **Encoding convention:** Tests assert `encodeURIComponent`-style output (`%20`, `%26`), not `+` for spaces or `&amp;`-style HTML encoding.
- **Default path:** When no `path` option is given, the written string includes `; path=/`. An explicit empty-string path omits the attribute entirely.
