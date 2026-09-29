---
source: tests/deleteCookie.spec.ts
sha256: 902a081729bb4d2cc031520603fa402fee3373abde7f82aefd4d99b16aa91ff9
generated_at: 2026-09-28T19:44:50.682662+00:00
model: ollama:qwen3.8:27b
---

# tests/deleteCookie.spec.ts

## Purpose

Unit tests for the `deleteCookie` utility, verifying both its basic removal behavior and the exact cookie attribute string it writes to `document.cookie` (path, domain, name encoding, expiration).

## Key elements

- **`describe('deleteCookie')`** — end-to-end round-trip test: sets a cookie via `setCookie`, confirms it with `getCookie`, then asserts it is `undefined` after `deleteCookie`.
- **`describe('deleteCookie attributes')`** — intercepts writes to `document.cookie` by redefining the property on `document` so the raw string is captured in a local `written` variable. Individual tests assert:
    - Name is URI-encoded (`the%20me`).
    - Expiration is the epoch (`Thu, 01 Jan 1970 00:00:00 GMT`).
    - Default path is `/`; an explicit path is used when provided; path is omitted when empty string is passed.
    - Domain appears only when explicitly supplied.

## Relationships

- **`src/index.ts`** — source of the three functions under test: `deleteCookie`, `getCookie`, `setCookie`.
- **`tests/_helpers/cookies.ts`** — provides `clearCookies`, called in `afterEach` of the first describe block to reset jsdom's cookie jar between tests.

## Notes

- The second describe block exists because **jsdom's built-in cookie jar silently drops attributes on read**, making normal `getCookie` assertions insufficient for verifying path/domain/encoding. The workaround redefines `document.cookie` as a plain getter/setter pair to capture the raw write string.
- The `afterEach` in that block uses `delete (document as unknown as { cookie?: string }).cookie` to restore jsdom's original property; forgetting this would leak the mock into subsequent tests.
- Only the first describe block depends on the `clearCookies` helper; the second block relies solely on the property redefinition.
