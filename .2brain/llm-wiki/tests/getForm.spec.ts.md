---
source: tests/getForm.spec.ts
sha256: b0ce0025896644f5d24840700985a55a338e0fce2ec2f6bac70af04a5b2148d5
generated_at: 2026-09-28T19:48:54.447779+00:00
model: ollama:qwen3.8:27b
---

# tests/getForm.spec.ts

## Purpose

Jest spec that verifies `getForm` correctly serialises every named form control (text inputs, selects, textareas, checkboxes, radios) into a `name → value` object, and handles edge cases (null form, unnamed fields, empty forms, custom selectors, duplicate names, unchecked checkboxes).

## Key elements

- **`markup`** (module-level constant) – a full HTML form string injected into `document.body` via `beforeEach`; exercises one of each control type.
- **`describe('(getForm) …')`** – the single suite. Contains seven `test` blocks:
  - *Input* – asserts the full expected object for the rich form.
  - *returns an empty object for a missing form* – `getForm(null)` → `{}`.
  - *skips fields without a name attribute* – unnamed inputs are omitted.
  - *returns an empty object for a form with no fields* – bare `<form>` → `{}`.
  - *honours a custom selector* – second argument narrows which controls are collected.
  - *keeps the first field in document order when two share a name* – pins the backward-walk behaviour.
  - *reports an unchecked checkbox as false* – unchecked checkbox yields `false`, not omission.

## Relationships

- **`src/index.ts`** – the sole import; provides the `getForm` function under test. The spec asserts on its return value but never mocks or patches it.

## Notes

- **Duplicate-name resolution is order-sensitive.** The implementation walks the field list in reverse, so the *first* field in document order wins. The dedicated test exists specifically to catch an accidental direction change.
- **`getForm` accepts `null`.** Callers typically pass a raw `querySelector` result without a null-check; the spec pins that this returns `{}` rather than throwing.
- **Inline ESLint suppressions** (`@typescript-eslint/naming-convention`, `unicorn/no-null`) appear throughout because the test object keys and the explicit `null` argument would otherwise violate lint rules. Don't remove them without adjusting the project's lint config.
