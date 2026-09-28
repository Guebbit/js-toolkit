---
source: src/getUuid.ts
sha256: 8a66aa6dafa3e2f2c210ae511a230e7bd7cd714124cf32014d55d8ed4cbb81a4
generated_at: 2026-09-28T19:39:23.621164+00:00
model: ollama:qwen3.8:27b
---

# src/getUuid.ts

## Purpose

Provides a single utility for generating random RFC 4122 version-4 UUIDs. It exists to give callers one import that works across secure and non-secure browser origins without pulling in a dependency.

## Key elements

- **`getUuid(): string`** (default export) — Returns a random v4 UUID string. Prefers `crypto.randomUUID`; if absent, builds the same 128-bit payload from `crypto.getRandomValues`, then stamps the version (nibble 4 in byte 6) and variant (`10xx` in byte 8) bits before formatting the standard `8-4-4-4-12` hex layout.

## Relationships

- **`src/index.ts`** — Re-exports `getUuid` as part of the package's public API surface.
- **`tests/getUuid.spec.ts`** — Unit-tests the function, including the fallback path (e.g., by stubbing out `crypto.randomUUID`).

## Notes

- The `crypto as Partial<Crypto>` cast is intentional: TypeScript's lib.dom types declare `randomUUID` as always present, but browsers omit it on non-secure origins (e.g. `http://localhost` without HSTS). The runtime `typeof` check is the real guard.
- Neither code path ever touches `Math.random`; both draw from the platform CSPRNG.
- The fallback allocates exactly 16 random bytes (the UUID payload before bit-stamping), so no extra entropy is wasted.
