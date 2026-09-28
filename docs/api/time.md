# Time

Conversions between a raw duration and every calendar-style unit, execution timing, and the two
date/duration display formatters.

## secondsToTime

```ts
secondsToTime(time?: number): ISecondsToTimeMap
```

Break a duration **in milliseconds** into every unit at once, both as a remainder (`hours`: what
is left after years, months, weeks and days have been taken out) and as a single-unit total
(`hoursOnly`: the whole duration expressed in hours alone). Every field is always present, so a
caller never needs a non-null assertion to read one. Defaults to `0`.

A "month" is 30 days and a "year" 365 throughout, since a bare duration has no calendar to anchor
to — reach for a date library when the answer has to respect real months.

`ISecondsToTimeMap` has `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`,
`milliseconds` (each a remainder after every larger unit), plus the matching `yearsOnly` …
`millisecondsOnly` totals.

```ts
secondsToTime(3_725_000).hours // 1 — remainder after 0 days
secondsToTime(3_725_000).hoursOnly // 1 — same duration expressed entirely in hours (rounds down)
```

## formatDuration

```ts
formatDuration(seconds: number, options?: IFormatDurationOptions): string
```

Render a duration compactly — `'2h 15m'`, `'15m'`, `'3d 4h 5m'` — cascading it through a
largest-first list of units. `seconds` is negative- and non-finite-safe (treated as `0`).

`IFormatDurationOptions`:

| Field   | Type                       | Default                | Purpose                                                            |
| ------- | -------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `units` | `readonly TDurationUnit[]` | `['hours', 'minutes']` | which units to render, in any order — always applied largest first |

`TDurationUnit` is `'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'`. The
largest requested unit absorbs everything above it — `['hours', 'minutes']` on a three-day duration
renders `'72h 5m'` rather than dropping the days on the floor. Leading units that come out zero are
dropped, but the smallest requested unit is always kept, so a zero duration renders `'0m'` rather
than an empty string. Labels are ASCII abbreviations, deliberately not localised — reach for
`Intl.RelativeTimeFormat` when the duration is prose the reader is meant to absorb.

```ts
formatDuration(8100) // '2h 15m'
formatDuration(0) // '0m'
formatDuration(259_500, { units: ['days', 'hours'] }) // '3d 0h'
```

## timeToSeconds

```ts
timeToSeconds(date?: string, delimiter?: string): number
```

Transform an `'HH:MM:SS:ms'`-shaped string **into milliseconds**, despite the name. `delimiter`
defaults to `':'`. Components may be omitted from the right — `'14:30'` reads as 14 hours 30
minutes. An absent or blank component counts as zero, so the empty default (`''`) returns `0`
rather than poisoning the caller's arithmetic with `NaN` — but text that is present and not a
number still yields `NaN`, so malformed input stays visible instead of quietly counting as zero.

```ts
timeToSeconds('14:30') // 52200000
timeToSeconds('') // 0
```

## getExecTime

```ts
getExecTime<T>(fn: () => T | Promise<T>): Promise<{ result: T; time: number }>
```

Time a sync or async function, resolving with its own result alongside the elapsed time in
milliseconds. The function's return is normalised through `Promise.resolve`, so both kinds are
timed the same way. Uses `process.hrtime.bigint()` — a monotonic clock, immune to system-clock
adjustments, unlike `Date.now()`.

```ts
const { result, time } = await getExecTime(() => heavyComputation())
```

## formatDateTime

```ts
formatDateTime(
    value?: string | number | Date | null,
    options?: IFormatDateTimeOptions
): string
```

Render a date for display, in the reader's locale, via `Intl.DateTimeFormat` — or
`Date#toLocaleString` when no `format` is given. An unparseable or missing `value` renders `empty`
instead of the string `'Invalid Date'`, which is never something a user should see, and an unusable
`locale` falls back to the runtime's own default.

`IFormatDateTimeOptions`:

| Field    | Type                         | Default | Purpose                                                                                              |
| -------- | ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `locale` | `string`                     | —       | BCP 47 tag, e.g. `'it-IT'`. Omitted or unusable, the runtime's own default is used.                  |
| `empty`  | `string`                     | `'—'`   | shown when there is no date, or an unparseable one                                                   |
| `format` | `Intl.DateTimeFormatOptions` | —       | passed straight to `Intl.DateTimeFormat`; without it, formatting falls back to `Date#toLocaleString` |

```ts
formatDateTime('2026-01-15') // locale-formatted date
formatDateTime('not a date') // '—'
formatDateTime('2026-01-15', { locale: 'en_US' }) // malformed tag: the runtime's default locale
```

Throws a `RangeError` or `TypeError` when `format` is invalid — a caller bug, not bad data. See
[What the formatters throw](/guide/getting-started#what-the-formatters-throw).
