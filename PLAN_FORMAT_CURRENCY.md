# Plan: `formatCurrency` — the currency's own decimals, and a fallback scoped to its purpose

**Decided 2026-09-28** (`boilerplate-node-backend/DECISIONS.md`, D18, option A): fix it once, here,
not at each call site in a consuming app.

This file replaces `BUG_FORMAT_CURRENCY_DECIMALS.md`. It is ephemeral, like
`PLAN_TEST_AND_DEV_STRUCTURE.md`. Delete it once the fix is published.

---

## Goal

`formatCurrency` turns an amount and an ISO 4217 code into a display string. It serves many
projects, so it must not assume any one of them:

- **The currency picks the decimals**, not a hardcoded default: JPY 0, EUR 2, KWD 3.
- **`format` is the only override.** It is passed to `Intl` as is.
- **Bad data never throws.** A non-number renders `empty`, and a malformed code renders a plain
  number.
- **Only data takes the fallback.** A malformed `locale` or `format` is a bug in the caller's
  config, and it throws, as it does in `formatDateTime`.

## What is wrong today (`src/formatCurrency.ts`)

| #   | Problem                                                                                                                                                                                | Effect                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `format` defaults to `{ minimumFractionDigits: 2, maximumFractionDigits: 2 }`, which overrides the currency's own digits                                                               | JPY `1234` → `¥1,234.00`. KWD `1234.567` → `KWD 1,234.57`, rounded to 2 decimals on screen. EUR/USD/GBP are unaffected, which is why nobody noticed         |
| 2   | The `format` comment says it applies "on top of the 2-decimal default". It doesn't: passing any `format` replaces the default completely                                               | The comment is wrong. A caller passing `{ currencyDisplay: 'code' }` already gets the currency's own digits                                                 |
| 3   | The `try`/`catch` wraps the whole call. It catches every error, but only a malformed code is ever recovered. A bad `locale` or `format` is caught, then thrown again from the fallback | The fallback's real scope is hidden, and the JSDoc's "an unknown or malformed currency code" is wrong: `'XYZ'` never reaches it (`Intl` prints `XYZ 10.00`) |
| 4   | The file isn't up to `CLAUDE.md` yet: no `@module` header, `//` comments on the interface fields instead of JSDoc, and a `try`/`catch` where a check would do                          | Convention debt, fixed while the file is open anyway                                                                                                        |

## Design

**Decimals.** Don't pass any digits unless the caller does. `Intl.NumberFormat` in currency style
already takes them from the currency.

**The malformed-code fallback, as a check instead of a `catch`.**

- `Intl` throws on a currency code only when it isn't well-formed. Per ECMA-402
  (`IsWellFormedCurrencyCode`), that means anything other than exactly three ASCII letters, in any
  case.
- Any well-formed code is accepted, even one that doesn't exist.
- So `/^[A-Za-z]{3}$/` predicts the throw exactly. It is a stable spec rule, not a copy of the
  ISO 4217 list, so there is nothing to keep in sync. (The backend's `money.ts` rejected a check
  like this because it would have meant tracking ISO 4217. This regex doesn't.)
- With the check in place, the `catch` goes away. Bad `locale`/`format` errors surface where they
  happen, as in every other formatter.

**Fallback output.** A plain decimal number with no symbol:

- If the caller passed `format`, it is used as is.
- Otherwise the number gets **2 decimals**. That is the digit count `Intl` gives a well-formed code
  it has no data for (`XYZ 10.00`), so a malformed code and an unknown one print the same digits.
  It is `Intl`'s own rule, not a guess tuned for one app.

**`format` replaces, it doesn't merge.** The fallback does not merge the caller's `format` with the
2-decimal default. Merging `{ maximumFractionDigits: 0 }` with a minimum of 2 makes `Intl` throw a
`RangeError`.

## Change

```ts
/**
 * @module
 * Money for display, via `Intl.NumberFormat` in currency style.
 * The currency sets the decimals (JPY 0, EUR 2, KWD 3); `format` can override them.
 * A malformed currency code prints a plain number instead of throwing.
 */

/**
 * Options for rendering an amount as money.
 */
export interface IFormatCurrencyOptions {
    /**
     * ISO 4217 code, e.g. `'EUR'`. Any case.
     */
    currency?: string
    /**
     * BCP 47 tag, e.g. `'it-IT'`. Omit to use the runtime's own default.
     */
    locale?: string
    /**
     * What to show when the value is not a number.
     */
    empty?: string
    /**
     * Passed straight to `Intl.NumberFormat`. Without it, the decimals are the currency's own.
     */
    format?: Intl.NumberFormatOptions
}

/**
 * A well-formed currency code: three ASCII letters, any case (ECMA-402 `IsWellFormedCurrencyCode`).
 * `Intl.NumberFormat` throws on anything else, and accepts anything that matches.
 */
const WELL_FORMED_CURRENCY = /^[A-Za-z]{3}$/

/**
 * Decimals for an amount with no usable currency.
 * 2 is what `Intl` itself gives a well-formed code it has no data for.
 */
const NO_CURRENCY_FORMAT: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}

/**
 * Render an amount as money, with the reader's separators and the currency's symbol and decimals.
 *
 * Bad data never throws: a non-number renders `empty`, and a malformed currency code renders a
 * plain number (with `format` if given, otherwise 2 decimals).
 *
 * @param {number} value - the amount
 * @param {IFormatCurrencyOptions} options
 * @returns the formatted amount
 * @throws {RangeError} when `locale` or `format` is malformed — a caller bug, not data
 */
export default (
    value?: number | null,
    { currency = 'EUR', locale, empty = '—', format }: IFormatCurrencyOptions = {}
): string => {
    if (typeof value !== 'number' || Number.isNaN(value)) return empty
    // no usable currency: a plain decimal number, no symbol
    if (!WELL_FORMED_CURRENCY.test(currency))
        return new Intl.NumberFormat(locale, format ?? NO_CURRENCY_FORMAT).format(value)
    // the currency picks the symbol and the default decimals; `format` overrides any of it
    return new Intl.NumberFormat(locale, { style: 'currency', currency, ...format }).format(value)
}
```

## What changes for consumers

I compared the old and new code in Node 24 over 1,275 input combinations: 3 locales × 17 currency
inputs (valid, lowercase, well-formed but unknown, malformed, `null`, a number) × 5 `format`s ×
5 values.

- **75 outputs change, all of one kind:** no `format`, and a currency whose digits aren't 2. For
  example JPY `¥0.00` → `¥0`, KWD `KWD 0.00` → `KWD 0.000`, CLF gets 4 decimals.
- **Everything else is identical:** EUR/USD/GBP, every caller-supplied `format`, and every
  malformed code (still `10.00`).
- A bad `locale` or `format` throws a `RangeError`, exactly as before.

No signature changes, so this is a **patch: 2.2.1**.

## Tests (`tests/formatCurrency.test.ts`, or `.spec.ts` if the other plan's Phase 1 renames have landed)

Expected strings are for `en-US`. ICU puts a **non-breaking space** after a currency code, so
write `\u00A0` in those strings or the assertion fails.

| Case                                                              | Input                                                               | Expected                                   | Fails today                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ | -------------------------- |
| The currency's own decimals (replaces "defaults to two decimals") | `10` USD · `1234` JPY · `1234.5` KWD                                | `$10.00` · `¥1,234` · `KWD\u00A01,234.500` | JPY, KWD                   |
| Rounds to the minor unit                                          | `1234.5` JPY                                                        | `¥1,235`                                   | yes                        |
| A `format` without digits keeps the currency's                    | `1234` JPY, `{ currencyDisplay: 'code' }`                           | `JPY\u00A01,234`                           | no; pins replace-not-merge |
| Malformed code → plain number, 2 decimals                         | `10` with `''`, `'EU'`, `'EUR1'`, `'1EUR'`, `'ÄBC'`, `'NOT_A_CODE'` | `10.00`                                    | no                         |
| Malformed code with `format` → `format` as is                     | `1234.5`, `''`, `{ maximumFractionDigits: 0 }`                      | `1,235`                                    | no                         |
| A well-formed unknown code stays currency style                   | `10` `'XYZ'`                                                        | `XYZ\u00A010.00`                           | no; pins the boundary      |
| Case doesn't matter                                               | `10` `'eur'`                                                        | `€10.00`                                   | no                         |
| A bad locale throws                                               | `10` USD, locale `'en_US'`                                          | throws `RangeError`                        | no; pins `@throws`         |

Keep the rest as they are: symbol, locale separators, `Intl` overrides (`$1,235`), zero (`$0.00`),
the nullish fallbacks, and a custom `empty`.

The malformed codes kill the regex mutants: `'EU'` kills `{3}` → `{2}`, `'EUR1'`/`'1EUR'` kill a
dropped anchor, and `'eur'` kills `[A-Za-z]` → `[A-Z]`.

## Steps

1. Apply the change and the tests. Every new "fails today" case must fail before the change and
   pass after (CLAUDE.md: a bug fix comes with a regression test).
2. Run `npm run complete:check`.
3. Run `npm run test:mutation && npm run test:mutation:check`. `formatCurrency.ts` has no baseline
   entry yet (`PLAN_TEST_AND_DEV_STRUCTURE.md` item 0.3). Commit its entry. It should be 100%;
   if it isn't, add a `note` explaining why.
4. Add this to `CHANGELOG`, under `## [2.2.1] - <date>` / `### Fixed`:
    > `formatCurrency` — without a `format`, amounts now use the currency's own decimals: JPY/KRW
    > print none, KWD/BHD print 3. A hardcoded 2-decimal default overrode them. Output for
    > 2-decimal currencies, for any caller-supplied `format`, and for a malformed currency code
    > is unchanged.
5. Bump to `2.2.1` and commit as `fix(formatCurrency): use the currency's own decimals`.
6. The user publishes with `npm run publish:public`. Ask first; it goes to npm.
7. Delete this file.

**Docs:** `docs/` has no API pages yet; `PLAN_TEST_AND_DEV_STRUCTURE.md` Phase 7 builds them. The
`formatCurrency` section there must describe the contract in [Design](#design).

## Consumers (checked across `~/Work/Guebbit`, 2026-09-28)

| Project                                                  | js-toolkit | Uses `formatCurrency`                                                                                                              |
| -------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `boilerplate-vue-frontend`                               | `^2.2.0`   | **Yes**, through a wrapper, at every money render. It never passes a `format`. Follow-up is in its backend's `HANDOFF.md`, step 8c |
| `boilerplate-node-backend`                               | `^2.2.0`   | No. It formats money with `Intl` directly                                                                                          |
| `vue-toolkit`                                            | `^2.2.0`   | No                                                                                                                                 |
| `react-toolkit`, `js-toolkit-scroll`, `guebbit-frontend` | `^1.x`     | No; `guebbit-frontend` has its own local helper                                                                                    |

The package is public on npm, so there may be consumers outside this workspace. The CHANGELOG line
covers them.

## Not in this change: needs your call

1. **`currency = 'EUR'` default.** This is the same kind of hidden assumption as the 2-decimal
   default: a missing currency silently becomes euros. `boilerplate-vue-frontend` already works
   around it; its wrapper makes `currency` required (FA37). Removing the default is **breaking**:
   it means 3.0.0, a **BREAKING** CHANGELOG entry and a migration note. It also means every
   consumer's `^2` range needs bumping.
   **Decided 2026-09-28:** make `currency` required in the next major, batched with whatever else
   ships there. A `TODO(next major)` comment on the default in `src/formatCurrency.ts` marks it.
2. **A `getCurrencyDigits(code)` helper.** The frontend's price inputs need the digit count too;
   they hardcode `:precision="2"`, see step 8c. The backend already has its own copy
   (`money.ts` `minorUnitExponent`). A pure, agnostic helper would give both one source.
   **Decided 2026-09-28:** add it in the next minor (2.3.0 went to the locale fallback) when the
   frontend's price-input item is picked up.
3. **Every formatter throws on a malformed `locale`** (`formatDateTime` too). `CLAUDE.md` says a
   render-path formatter must not throw. Whether a bad locale counts as data or as caller config
   is a toolkit-wide decision, not this fix's.
   **Decided 2026-09-28:** a locale is data. A malformed one falls back to the runtime's default,
   in both formatters, through `src/internal/resolveLocale.ts`; `format` still throws. Shipped in
   2.3.0, with the rule in `CLAUDE.md` and `docs/guide/getting-started.md`.
