---
source: eslint.config.mjs
sha256: 0d9da4117913d640774a4ffaf9973e144f100b7c88d0699e32f18d9d21497b3f
generated_at: 2026-09-28T18:18:18.066510+00:00
model: ollama:qwen3.8:27b
---

# eslint.config.mjs

## Purpose

ESLint flat-config entry point for the project. It wires together TypeScript-aware linting (`typescript-eslint`), the Unicorn plugin, and JSDoc enforcement, and applies per-file overrides for tests, build scripts, and declaration files. Every other source file is validated against the rules defined here.

## Key elements

- **`tseslint.config(...)`** — Top-level export; assembles all config blocks into a single flat-config array.
- **Ignores block** — Excludes `dist`, `node_modules`, `docs`, `.stryker-tmp`, `reports`, and this file itself from linting.
- **Base + TS presets** — `eslint.configs.recommended` plus the four `tseslint.configs` variants (recommended, recommendedTypeChecked, strictTypeChecked, stylisticTypeChecked).
- **`tsconfig.eslint.json`** — Dedicated tsconfig referenced via `project` in `parserOptions`; used instead of `projectService` to avoid issues with test files. `extraFileExtensions: ['.vue']` is registered.
- **Naming-convention block** — Enforces `I[A-Z]` prefix for interfaces, `E[A-Z]` for enums, `camelCase`/`UPPER_CASE` for variables/functions, `PascalCase` for classes/types.
- **Unicorn rules** — `better-regex`, `consistent-destructuring`, `filename-case` (camelCase), `catch-error-name` (`error`), `prevent-abbreviations` (with custom exemptions). `number-literal-case` is explicitly off to avoid Prettier conflicts.
- **JSDoc block** (`src/**/*.ts` only) — Requires JSDoc on public functions/classes/interfaces/type aliases/enums; checks param names, tag names, param/returns descriptions, and `@throws`. Runs in `typescript` mode so types are not duplicated in `@param`/`@returns`.
- **Test overrides** (`tests/**`, `**/*.spec.ts`) — Adds `globals.jest`, merges `tsconfig.tests.json` into the program, relaxes `restrict-template-expressions` (allows bare numbers), and relaxes `filename-case` / `prevent-abbreviations`.
- **Script overrides** (`scripts/**/*.mjs`) — Disables all type-checked rules (`tseslint.configs.disableTypeChecked`), adds `globals.node`, and turns off `no-console`, `unicorn/no-process-exit`, `unicorn/no-null`, `unicorn/filename-case`, `unicorn/prevent-abbreviations`, `@typescript-eslint/no-dynamic-delete`.
- **`.d.ts` override** — Disables `naming-convention` and filename rules for ambient declarations.

## Relationships

No graph neighbors are recorded for this file. It is a leaf configuration consumed by the ESLint CLI (via the `eslint` package) at runtime; no other project source file imports it.

## Notes

- **Prettier ownership:** Formatting-related rules that overlap with Prettier (e.g. `unicorn/number-literal-case`) are explicitly turned off. If you add a new Unicorn stylistic rule, verify it does not conflict with the project's `.prettierrc`.
- **Dedicated tsconfig:** Type-aware rules rely on `tsconfig.eslint.json`, not the main `tsconfig.json`. Adding a file to lint scope may require adding it to that tsconfig.
- **Stryker sandbox:** `.stryker-tmp` is in the ignore list because Stryker copies the source tree there; a stale copy after an interrupted mutation run would otherwise produce duplicate findings.
- **JSDoc scope:** The `require-jsdoc` rule is scoped to `src/**/*.ts` only. Test and script files are exempt by omission.
- **Interface/enum prefixes:** The `I`- and `E`-prefix requirements are enforced via the `custom.regex` entries in `naming-convention`. Renaming an existing interface without the prefix will break lint.
- **`unicorn/string-content`** is present but fully commented out — do not re-enable without removing the emoji patterns.
