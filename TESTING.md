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

The seed is fixed in `tests/setup.ts` so the mutation baseline is stable. To
explore further:

```sh
FAST_CHECK_SEED=$RANDOM npm test
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

Builds a tarball with `npm pack`, installs it into a throwaway directory and
imports it as both CommonJS and ESM, then calls a real function. Also checks
that the published file set has no module without a matching source.

Jest resolves `../src` through ts-jest and never touches `main`, `exports`,
`files` or `dist`, so every packaging failure ships green without this.

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
