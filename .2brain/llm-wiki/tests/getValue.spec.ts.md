---
source: tests/getValue.spec.ts
sha256: a2eabc05be31f23a0f30550070a42e1f57761146d0c2423ce945129bea6328e1
generated_at: 2026-09-28T19:51:22.549601+00:00
model: ollama:qwen3.8:27b
---

# tests/getValue.spec.ts

## Purpose

Unit-test suite for the `getValue` function, verifying it returns the correct value across a range of form elements (input, select, textarea, checkbox, radio, generic elements) and handles edge cases like radio-group isolation and CSS-hostile names.

## Key elements

- **`describe('(getValue) get value of various elements', …)`** — single top-level suite containing all tests.
- **Initial DOM setup** (top of file) — injects a `<form>` into `document.body` with one of each supported element type, used by the first seven tests.
- **`test('Checkbox', …)`** — asserts `getValue` returns a truthy value (not a specific string) for a checked checkbox.
- **`test('Radio reads its own group, not a neighbouring one', …)`** — overwrites `document.body.innerHTML` with two radio groups sharing a parent form; asserts each unselected radio resolves to its *own* group's checked value.
- **`test('Radio handles a name containing CSS syntax', …)`** — overwrites `document.body.innerHTML` again with a radio group whose `name` contains `]`, `[`, and `"`; asserts lookup still works, confirming the name is compared as a property rather than interpolated into a selector.

## Relationships

- **`src/index.ts`** — sole import target; provides the `getValue` function under test. No other modules are referenced.

## Notes

- Tests that need a different DOM (the two radio edge-case tests) call `document.body.innerHTML = …` directly, destroying the initial fixture. Any test added after them must bring its own DOM or the initial setup is already gone.
- The checkbox assertion uses `toBeTruthy()` rather than a concrete value, so the exact return type for checked checkboxes (e.g. `"true"` vs `true`) is not pinned down.
- All DOM manipulation is raw `innerHTML` assignment; there is no cleanup/teardown between tests, so ordering matters.
