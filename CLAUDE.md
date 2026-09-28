## What this repo is

A published npm library (`@guebbit/js-toolkit`): framework-free TypeScript helpers (arrays,
strings, numbers, time, formatting, DOM, browser platform), shipped as a dual ESM/CommonJS build.
Every export of `src/index.ts` is public API that other apps depend on (`@guebbit/vue-toolkit`
among them), and so is every `src/*.ts` file, reachable on its own through the `./*` subpath
export.

- Semver applies. A breaking change only ships in a major version, and every breaking change is
  listed in `CHANGELOG` under that version, marked **BREAKING**, with its migration.
- Every user-visible change (added, changed, removed, fixed) gets a `CHANGELOG` line.
- Every public export has a section in `docs/`, on a page listed in the vitepress sidebar
  (`docs/.vitepress/config.mts`). Its parameters, return value and defaults match the source.
- Quality gate: `npm run complete:check` passes.

## TypeScript

- MUST NOT use `any` — use `unknown` plus type narrowing. No exceptions: the source has none today.

## Function design

- MUST apply SOLID principles.
- MUST keep functions focused — one responsibility each.
- MUST keep nesting ≤ 3 levels; extract a helper for anything deeper.
- MUST prefer pure functions and shared abstractions over duplicated inline logic.
- One public helper per file: `src/<name>.ts` default-exports it, and `src/index.ts` re-exports it
  under that same name. The file name _is_ the public name.
- Internal machinery stays internal: anything shared between helpers but not meant for apps lives
  under `src/internal/`. It is never re-exported by `src/index.ts`, and the `./*` subpath export
  must not reach it.

## Scope

- MUST NOT keep backward-compatibility shims (old option names, deprecated aliases, dual paths)
  unless the user explicitly asks for it. Replace, don't shim — the major version and the
  `CHANGELOG` migration note are how consumers move over.
- MUST NOT leave deprecated code in place — no `@deprecated` tag kept "for later." When a change
  supersedes something, remove it in the same change.

## Async and error handling

- **Prefer promise chaining** (`.then`/`.catch`/`.finally`) when there are only 1–2 awaits.
- Use `async`/`await` only when several sequential awaits make chaining unreadable.
- **Avoid `try`/`catch`** unless genuinely necessary — synchronous throws, or multi-step
  transactions with partial rollback.
- MUST handle errors explicitly — no swallowed promises. A helper that must not throw (a
  formatter in a render path, a clipboard write) returns its failure as a value (a fallback
  string, `false`), and its JSDoc says so.
- A render-path formatter never throws on **data**: any input that can change while the app runs
  (the value, a currency code, a locale). It may throw on a malformed **options object**
  (`format`): that is written in code, so it fails on every call and a test catches it. See
  `docs/guide/getting-started.md`, "What the formatters throw".

## Comments

- Exported functions, interfaces, types and enums: JSDoc REQUIRED — `jsdoc/require-jsdoc`. An
  interface states its purpose and what each field means; a function adds `@param`/`@returns`/
  `@throws` **as needed**. "As needed" is yours to judge, but a tag you do write is checked:
  `jsdoc/check-param-names` refuses a name that is not in the signature, `check-tag-names` refuses
  a tag that is not a tag, and the `*-description` rules refuse an empty one.
- Every `.ts` file **under `src/`**: a JSDoc `@module` header at the top explaining the **logic or
  pattern** the file follows — what it is and how it works, not what it is for in an app. Keep it
  short: a few lines, enough to orient someone opening the file cold. If it grows into prose, it
  belongs in `docs/`. One `@module` header per file, always.

    `tests/**` is outside the rule, and `eslint.config.mjs` scopes `jsdoc/*` to `src/**` to match.
    Specs are free to open with a file-level docblock describing what they pin down.

- Non-trivial internal helpers: a concise inline or JSDoc explanation.
- Comments MUST be brief theory-level notes on what the code does and its role — ADHD friendly,
  not line-by-line narration.
- Docs describing flow, architecture or process MUST include Mermaid diagrams
  (`vitepress-plugin-mermaid` renders ` ```mermaid ` fences).
- Never narrate history — no "this used to...", "previously...", "was renamed from...", "new in
  3.0". A comment describes the code as it is now; git log and `CHANGELOG` are where the past
  lives. Likewise no process notes ("verified", "reproduced against the installed package") — state
  the fact the code relies on, not how it was found.
- Never link to a `.md` file outside `docs/*` — a root-level plan, audit, or report doc is
  ephemeral and is not published; only `docs/` is a stable target for a comment to point at.

Comments are **not** a replacement for the documentation. They are code-centric: they explain the
code in front of you, and give a quick overview of what the docs already say in full. The
reasoning, the alternatives and the diagrams live in `docs/` — a comment points at that, it does
not reproduce it.

## Code layout

Orderly, scannable files. Two rules, always:

- **Every top-level declaration gets JSDoc.** Top-level means the outermost body of the file —
  and also the outermost body of whatever construct owns most of the file (the exported helper, a
  factory). Constants, types, helpers, exported and internal alike: each one carries its own JSDoc
  block.
- **One blank line between them.** Every top-level declaration is separated from its neighbours by
  a single empty line — Prettier's formatting has no way to preserve more than one, so this is the
  enforced ceiling, not just the floor — so the JSDoc block visually belongs to the thing below it.
  Inside a declaration, blank lines are fine as needed.

```ts
/**
 * Seconds in one of each unit.
 */
const UNIT_SECONDS = { days: 86_400, hours: 3600, minutes: 60 }

/**
 * Whole units in a number of seconds, remainder discarded.
 *
 * @returns `0` for a negative input, never a negative count
 */
const wholeUnits = (seconds: number, unit: keyof typeof UNIT_SECONDS): number =>
    Math.max(0, Math.floor(seconds / UNIT_SECONDS[unit]))
```

## Commenting external calls

Calls into an external dependency are the code we forget fastest — the parameters are someone
else's vocabulary, not ours. This library has no runtime dependencies, so here that means the
platform: `Intl`, the DOM, `navigator.clipboard`, `document.cookie`, `node:fs`.

- Any class instantiation or method call from an external API with **non-obvious parameters** MUST
  be annotated: either a brief comment above the call, or a JSDoc block documenting each unclear
  parameter.
- Annotate the parameters that are not immediately clear — magic numbers, bare booleans, option
  objects, positional arguments whose meaning comes only from the platform's docs. Skip the
  self-evident ones.
- Prefer more comments over fewer. When in doubt, write it.

All of it ADHD friendly: short lines, one idea per line, plain language, the "why" before the
"how". No paragraphs, no restating the code.

```ts
// DOM: there is no delete API — a cookie is removed by rewriting it already expired.
document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
```

## Tests

- Jest + ts-jest, specs under `tests/`: one `<name>.spec.ts` per public export, importing through
  the barrel (`from '../src'`) so the barrel is exercised too. Property specs live in
  `tests/properties/`, type-level tests in `tests/types/` (checked by `tsc`, not Jest), built-package
  checks in `tests/package/`. Shared fakes live in `tests/_helpers/` — reuse them instead of
  re-stubbing `getBoundingClientRect` or re-clearing cookies in each spec.
- Every spec tears down what it builds (DOM nodes, cookies, spies, fake timers) in `afterEach`,
  never inline after the assertions — a failing `expect` would skip it. Nothing leaks into the next
  test.
- A bug fix comes with a regression test that fails without the fix. A confirmed bug not fixed yet
  gets an `it.failing` test with a `Known bug:` comment naming the cause; the change that fixes it
  flips it back to `it`.
- Jest runs in jsdom. jsdom has the DOM's shape, not its behaviour: no layout
  (`getBoundingClientRect` is all zeroes), no CSS, no `Blob.text()`. Layout-dependent helpers are
  asserted against stubbed rects — a green DOM test means "the logic is right", not "this works in
  Safari". A case that needs a runtime with no DOM at all goes in `<name>.node.spec.ts`, opting in
  with the `@jest-environment @stryker-mutator/jest-runner/jest-env/node` docblock.
- Property tests run on a fixed seed, so the mutation baseline cannot drift on its own; the nightly
  workflow explores fresh seeds. A counterexample it finds becomes a named case in the matching
  unit spec.
- `mutation-baseline.json` only moves up. Never lower it to get a run green: fix the test. A file
  that sits below 100% on purpose carries a `note` saying which mutant is equivalent and why.
