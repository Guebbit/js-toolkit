# Testing

Five layers, each catching something the others cannot.

| Layer     | Command                                                | What it catches                                 |
| --------- | ------------------------------------------------------ | ----------------------------------------------- |
| Unit      | `npm test`                                             | Behaviour of every public export                |
| Property  | `npm test`                                             | Invariants across generated inputs              |
| Types     | `npm run typecheck`                                    | Signatures widening to `any`, exports vanishing |
| Packaging | `npm run test:pack`                                    | A broken `exports` map, a missing `files` entry |
| Mutation  | `npm run test:mutation && npm run test:mutation:check` | Tests that run code without asserting on it     |

## Unit tests — `tests/*.test.ts`

One file per export, imported through the barrel (`from '../src'`) so the barrel
is exercised too. Written against the contract, not the implementation: a
refactor that preserves behaviour keeps them green.

Comments say why a case exists and what breaks without it. A case that pins
surprising-but-correct behaviour says so, to stop the next reader "fixing" it.

## Property tests — `tests/properties/*.property.test.ts`

[fast-check](https://fast-check.dev) over the pure functions. These state laws
rather than examples: round trips (`getUrlQueries(setUrlQueries(x)) === x`),
idempotence (`canonicalize`), symmetry and the triangle inequality
(`levenshteinDistance`), bounds that hold for every input (`getDelta` never
exceeds half the circumference).

The seed is fixed in `tests/setup.ts` so the mutation baseline is stable. That
keeps the gate honest but stops the suite exploring — the same 100 cases forever.
The `Nightly` workflow re-runs everything on a fresh random seed with ten times
the cases, so new counterexamples still surface without destabilising the
per-commit gate. Locally:

```sh
FAST_CHECK_SEED=$RANDOM FAST_CHECK_RUNS=1000 npm test
```

Anything a new seed finds gets committed as a named regression case in the
matching unit test file, so it is caught by every run afterwards rather than
waiting for that seed to come round again.

## Type tests — `tests/types.test.ts`

`expectTypeOf` assertions on the exported signatures.

**These are enforced by `tsc`, not by jest.** `isolatedModules` in
`tsconfig.json` puts ts-jest in transpile-only mode, so a type error in a test
never fails a jest run. `npm run typecheck` runs `tsconfig.tests.json`, which is
what makes this file mean anything. It is wired into CI as its own job.

## Packaging smoke test — `scripts/pack-smoke.mjs`

Builds a tarball with `npm pack`, installs it into a throwaway directory, and
imports it every way a consumer can: `require` and `import`, from the barrel and
from a subpath. Then it type-checks a consumer of each module kind.

Jest resolves `../src` through ts-jest and never touches `main`, `exports`,
`files` or `dist`, so every packaging failure ships green without this.

The dual build has two traps this catches and nothing else does:

- The root package is `"type": "module"`, so `dist/cjs` only parses as CommonJS
  because the build writes a `{"type":"commonjs"}` marker into it. Lose that file
  and `require()` dies at runtime.
- Declarations are emitted **per format**, and the `types` condition sits inside
  `import`/`require`. One shared declaration folder is read as ESM by TypeScript,
  and a CommonJS consumer then cannot import the package at all.

A note on the test itself: the generated consumer must not use `paths`/`baseUrl`
to find the package. A path mapping resolves it directly and skips the exports
map, which is exactly the thing under test.

## What jsdom does not cover

The DOM helpers run against jsdom, not a browser. jsdom implements the shape of
the DOM but not all of its behaviour — `Blob.text()` is absent, layout is not
computed, so `getBoundingClientRect` returns zeroes unless stubbed, and CSS is
not applied. Tests for `getElementCenter`, `isInViewport` and anything
layout-dependent therefore assert against stubbed rects rather than real
geometry, and confirm the arithmetic rather than the rendering.

Treat a green DOM test as "the logic is right", not "this works in Safari".

## Mutation testing — Stryker

```sh
npm run test:mutation        # produces reports/mutation/
npm run test:mutation:check  # gates on mutation-baseline.json
```

`mutation-baseline.json` is committed and holds **two scores per file**:

- `covered` — of the mutants a test executes, how many an assertion catches
- `total` — the same, also counting mutants no test reaches at all

They call for different work. `total` well below `covered` means code nothing
executes: write a test that runs it. Both low and close together means tests run
the code without asserting on it: sharpen an assertion that already exists.

A file below its baseline fails the run and the baseline is **not** rewritten —
a regression must never become the new normal. A file above its baseline has it
raised, locking the gain in. Per file, never a single global percentage: a
global number lets a strong file carry a weak one.

To start a baseline from scratch:

```sh
node scripts/mutation-baseline.mjs --init
```

### Survivors that are meant to survive

Some mutants change nothing observable — a fast path that produces the same
answer as the general path, a shortcut for a case another guard already handles.
Chasing them means writing a test that asserts on an implementation detail.

They are marked in the source with a comment saying why, so nobody re-chases
them. See `arrayChunks.ts`, `levenshteinDistance.ts`, `match.ts`, `getValue.ts`,
`getIframe.ts` and `getJson.ts`.

A file can also lose percentage points without losing a single test, by getting
smaller: a survivor that is one of two mutants scores 50%, the same survivor
among twenty scores 95%. When the gate reports a regression, check whether the
mutant count moved before touching a test.

## Falsifying a test

A test nobody has watched fail is not evidence. Before trusting one, break the
source it covers on purpose and confirm it goes red.

Two traps have produced false "all clear" results here, both in the harness
rather than the tests:

- **Jest colourises its summary even when piped.** `grep '^Tests:'` silently
  matches nothing, and a script reading an empty result as "no failures" reports
  a clean pass for every mutation. Strip ANSI first:
  `npx jest 2>&1 | sed 's/\x1b\[[0-9;]*m//g'`.
- **A patch that does not apply looks exactly like a test that caught nothing.**
  Assert the edit landed before drawing a conclusion from the run.

Any script that falsifies in bulk should fail loudly when it cannot parse a
result, rather than treating an unparsed run as a pass.
