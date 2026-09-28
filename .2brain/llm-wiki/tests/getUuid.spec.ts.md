---
source: tests/getUuid.spec.ts
sha256: 33055c84f0ffe45d1046f6af55ed548624545d7d433ecb1ebd1a4669e0d103d4
generated_at: 2026-09-28T19:51:07.266871+00:00
model: ollama:qwen3.8:27b
---

# tests/getUuid.spec.ts

## Purpose

Jest test suite for the `getUuid` function. Validates that it returns well-formed UUID v4 strings, produces unique values, delegates to `crypto.randomUUID` when present, and correctly falls back to a `crypto.getRandomValues`–based implementation (with proper hex padding, version/variant bit stamping, and CSPRNG usage) when `randomUUID` is unavailable.

## Key elements

- **`V4`** — regex constant matching a valid UUID v4 string (version nibble `4`, variant `[89ab]`).
- **`describe('(getUuid) random unique id')`** — top-level suite covering the happy path and the `crypto.randomUUID` fast path.
- **`describe('when crypto.randomUUID is unavailable')`** — nested suite that swaps `globalThis.crypto` (via `Object.defineProperty`) to expose only `getRandomValues`, then exercises the manual fallback: hex padding, bit stamping, buffer size (16 bytes), and uniqueness.
- **`beforeEach` / `afterEach` hooks** — save and restore the original `crypto` property descriptor so the mock is fully torn down.

## Relationships

- **`src/getUuid.ts`** — the module under test; provides the `getUuid` implementation.
- **`src/index.ts`** — barrel/entry file; the test imports via `import { getUuid } from '../src'`, exercising the public export surface rather than the internal module directly.

## Notes

- The `getRandomValues` mock in the fallback suite is a **pass-through** to the real implementation (it calls `real.getRandomValues`), so randomness is genuinely random unless a specific test overrides it with `mockImplementation`.
- Two edge-case tests pin the fallback to **deterministic** byte fills (`0xff` to verify bit stamping, `0x00` to verify zero-padding). Without these, random bytes would mask a missing `toString(16).padStart(2, '0')`.
- `crypto` is restored via the saved `PropertyDescriptor`, not simply deleted—important in environments where `crypto` is non-configurable by default and the property descriptor must round-trip exactly.
