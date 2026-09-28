---
source: tests/properties/roundtrip.property.spec.ts
sha256: 3734ec038038f2b8e7465abc27c46ab4c1e0a8aa175c10b821df0fa0051741a5
generated_at: 2026-09-28T19:55:04.042601+00:00
model: ollama:qwen3.8:27b
---

# tests/properties/roundtrip.property.spec.ts

## Purpose

Property-based test suite (via `fast-check`) that verifies round-trip and algebraic invariants of the utility functions exported by `src/index.ts`. It exists to pin down the *contract* of serialization/deserialization pairs so that refactors cannot silently break symmetry without tripping a property.

## Key elements

- **`queryValue` / `queryKey`** – Reusable arbiters for URL query tests. `queryValue` generates non-empty strings that exclude the default array separator (`,`); `queryKey` generates identifier-shaped keys.
- **`(setUrlQueries → getUrlQueries) round trip`** – Suite covering: plain-value round-trip, multi-value array round-trip, single-item-array demotion to scalar, custom-separator round-trip, number/boolean coercion to string, empty-value dropping (`''`, `null`, `undefined`, `[]`), empty-value key removal from an existing query, and serialize→parse→serialize idempotency.
- **`(secondsToTime → timeToSeconds) round trip`** – Suite covering: sub-day ms→HH:MM:SS:ms→ms round-trip, component-range bounds, `*Only` total variants, and full depleting-component reconstruction up to ~128 days.
- **`(timeToSeconds) properties`** – Monotonicity per component, zero-default for omitted components, custom-delimiter support.
- **`(getJson / isJson) properties`** – Round-trip of `JSON.stringify`→`getJson`, non-throwing guarantee on arbitrary strings, and `isJson` returning the parsed object for valid object payloads.
- **`(toFormData) properties`** – Flat-key preservation, no spurious keys, nested-path bracket-chain naming at arbitrary depth, and `Blob` values being appended whole rather than recursed into.

## Relationships

- **`src/index.ts`** – Source of every function under test (`getJson`, `getUrlQueries`, `isJson`, `secondsToTime`, `setUrlQueries`, `timeToSeconds`, `toFormData`). This spec is the behavioural contract for that module's public API.
- **`src/toFormData.ts`** – Implementation behind the `toFormData` import (re-exported through `src/index.ts`). The `toFormData` properties block exercises its flat-key, nested-path, and Blob-handling logic.

## Notes

- Single-item arrays are **intentionally asymmetric**: `{ key: [v] }` serialises to a scalar and deserialises back as a scalar, not an array. A test explicitly pins this to prevent a future "fix" that always returns arrays.
- `secondsToTime` round-trip is bounded to < 86 400 000 ms (one day) because the `HH:MM:SS:ms` string format has no slot for days-and-above; the depleting-components test uses a much larger range to cover that path.
- The `jsonValue` arbiter uses `fc.letrec` to build recursive JSON structures (nested objects/arrays up to depth 4).
- `toFormData` nested-path test builds the expected key as `a[b][c]` (bracket notation) and asserts exactly one key is produced, guarding against the historical bug where only the leaf name was passed down.
