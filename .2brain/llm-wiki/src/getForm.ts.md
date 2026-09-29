---
source: src/getForm.ts
sha256: 63471ef10595610027d928219146415870ab418b29846d6e7fd8d9d4d1087a18
generated_at: 2026-09-28T19:38:00.357285+00:00
model: ollama:qwen3.8:27b
---

# src/getForm.ts

## Purpose

Collects the current values of all named form fields within a given `<form>` element into a single `Record<string, unknown>` map keyed by each field's `name` attribute. It exists so callers can snapshot a form's state in one call without manually iterating fields or handling per-type value extraction.

## Key elements

- **Default export (anonymous function)** — Accepts a `form` (`HTMLElement | null`) and an optional CSS `selectors` string (defaults to `'input, textarea, select'`). Returns `{}` immediately if `form` is `null`; otherwise queries matching descendants, iterates them in **reverse** document order, and assigns each named element's value (via `getValue`) to `results[name]`. Elements without a `name` attribute are silently skipped.

## Relationships

- **`src/getValue.ts`** — Imported and called once per matched element to read that specific field's value. This is the only way individual input types (checkbox, select, textarea, etc.) are handled; `getForm` contains no type-specific logic.
- **`src/index.ts`** — The package entry point; expected to re-export this module so consumers can `import { getForm } from '…'` without reaching into `src/`.

## Notes

- Iteration runs **backwards** (`for (index = length; index--;)`). This is a deliberate choice: the last field in DOM order wins if two fields share the same `name`. Consumers should be aware that duplicate `name` values are not merged—last (in DOM) overwrites.
- The `selectors` parameter lets callers restrict which elements are picked up (e.g., only `input[type="checkbox"]`), but the function still relies on each element exposing a `name` attribute.
- Return type is `Record<string, unknown>`; callers must cast or narrow before using individual values.
