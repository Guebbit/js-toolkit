---
source: src/getValue.ts
sha256: 514d61910299ba7d1b79855dcc99dcd773329b0a702e889c4614be6b363ae68c
generated_at: 2026-09-28T19:39:38.304136+00:00
model: ollama:qwen3.8:27b
---

# src/getValue.ts

## Purpose

A single-purpose utility that extracts a meaningful value from an HTML form element, handling the type-specific semantics (checkbox state, radio group selection, attribute access) so callers don't repeat branching logic.

## Key elements

- **Default export** `(element: HTMLElement | null, attribute?: string) → string | number | boolean | undefined`
  - `element` is `null` → returns `undefined`.
  - Non-empty `attribute` → returns `element.getAttribute(attribute) ?? undefined`.
  - `<input type="checkbox">` → returns `checked` (boolean).
  - `<input type="radio">` → walks `parentElement` siblings sharing the same `name`, returns the checked sibling's `.value`, or `undefined`.
  - Fallback → `(element as HTMLInputElement | HTMLSelectElement).value ?? element.textContent`.

## Relationships

- **src/getForm.ts** — consumes this function to read individual field values from a parsed form.
- **src/index.ts** — re-exports this as part of the package's public surface.

## Notes

- Radio-group lookup compares `radio.name` as a **property**, not by interpolating the name into a CSS selector. This is deliberate: a `name` containing quotes or brackets would produce a malformed selector and throw.
- Two mutation-testing notes are embedded in the source: the `if (!name) return` guard is documented as mutation-equivalent (a nameless radio matches nothing downstream anyway). Do not "simplify" it away.
- Return type is a four-way union (`string | number | boolean | undefined`); callers must handle all four, not assume a string.
