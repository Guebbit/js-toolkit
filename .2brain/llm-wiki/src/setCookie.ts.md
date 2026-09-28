---
source: src/setCookie.ts
sha256: 89daf009959be4ef1de22dd13c6e708bc5ba07a755eb5b9631fd0b3943233ee5
generated_at: 2026-09-28T19:42:05.485010+00:00
model: ollama:qwen3.8:27b
---

# src/setCookie.ts

## Purpose

A single-purpose module that assembles a `document.cookie` attribute string from a name, value, and an optional set of cookie attributes, then performs one `document.cookie` assignment to add or update that cookie without affecting others.

## Key elements

- **`ISetCookieOptions`** (exported interface) — Optional cookie attributes: `days` (expiry in days; omit for session cookie), `path` (defaults to `'/'`), `domain`, `secure` (boolean), `sameSite` (`'Strict' | 'Lax' | 'None'`).
- **default export** (function) — Accepts `name: string`, `value: string`, and an optional `ISetCookieOptions`. URL-encodes name and value via `encodeURIComponent`, conditionally appends each provided attribute, and writes the result to `document.cookie` in a single assignment.

## Relationships

- **`src/index.ts`** — Re-exports this module's default function and/or `ISetCookieOptions` as part of the package's public API surface.
- **`tests/types/browser-platform.test-d.ts`** — Type-level test that exercises `ISetCookieOptions` (and the function signature) under the `browser` platform type definition, ensuring the types are correct in a DOM context.

## Notes

- `path` defaults to `'/'` inside the destructuring, so omitting it still emits `; path=/`. All other attributes are appended only when truthy/defined.
- `days` is converted to an `expires` date by adding `days * 86_400_000` ms to `Date.now()` and formatting with `Date#toUTCString()`.
- The write goes through a bare `document.cookie = …` assignment (suppressed via an `eslint-disable` for `unicorn/no-document-cookie`); the cookie spec guarantees this adds/updates only the named cookie.
- There is no `max-age` alternative — expiry is always expressed as `expires` with a UTC date string.
