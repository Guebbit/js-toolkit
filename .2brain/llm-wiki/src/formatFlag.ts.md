---
source: src/formatFlag.ts
sha256: 7d7c02067d292d2b923203fc8eb87e7bf85351fbacd2267b6a107c535645b1ac
generated_at: 2026-09-28T18:24:28.622282+00:00
model: ollama:qwen3.8:27b
---

# src/formatFlag.ts

## Purpose

Provides a single formatting utility that renders a tri-state flag (`true`, `false`, or nullish) as a human-readable label. It exists to keep "unset" visually distinct from "false," since coercing a nullish value to `false` would assert a state the data does not actually hold.

## Key elements

- **Default export (anonymous function)** — Takes a `boolean | null | undefined` value plus two already-translated label strings and an optional `empty` string (default `'—'`). Returns `empty` for `null`/`undefined`, `trueLabel` for `true`, `falseLabel` for `false`.

## Relationships

- **src/index.ts** — Consumes or re-exports this function as part of the module's public API.

## Notes

- Labels (`trueLabel`, `falseLabel`, `empty`) are expected to be pre-translated by the caller; this function performs no i18n lookup.
- The `empty` parameter defaults to an em dash (`'—'`), not a space or empty string, so unset flags remain visible in rendered output.
- The check uses `===` against both `null` and `undefined` separately (no `==` coercion), making the tri-state boundary explicit.
