# Numbers and ranges

Distances (plain and wrapping), interval overlap, and currency display — formatCurrency renders a
number, so it sits here rather than with the string formatters.

## getDelta

```ts
getDelta(a: number, b: number, size?: number): number
```

Distance between two numbers. With `size` (default `0`) at or below `0`, this is the plain linear
distance `|a - b|`. With a positive `size`, the numbers live on a circle of that circumference (an
angle in degrees, a looping timeline, a wrapping map axis), so the distance is the shorter of the
two ways around and never exceeds `size / 2`. Always non-negative.

```ts
getDelta(10, 350, 360) // 20 — the short way around a 360° circle
```

## getMapDistance

```ts
getMapDistance(Xa: number, Xb: number, Ya: number, Yb: number, size?: number): number
```

Euclidean distance between two points, like coordinates on a map. Reuses [`getDelta`](#getdelta)
per axis so each axis gets the same wrap-around treatment, then combines them with `Math.hypot`.
With a positive `size` (default `0`, unbounded) both axes wrap, the usual behaviour for a tiled or
toroidal map.

```ts
getMapDistance(0, 3, 0, 4) // 5
```

## rangeOverlaps

```ts
rangeOverlaps(
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number,
    sameUnitOverlap?: boolean
): number
```

Number of overlapping units between two ranges, `0` when they do not overlap. By default
(`sameUnitOverlap: false`), two ranges that merely touch — B starts exactly where A ends — score
`0`, not an overlap. Pass `sameUnitOverlap: true` to count that shared boundary as 1 unit instead,
for data where touching itself is meaningful.

```ts
rangeOverlaps(0, 10, 5, 15) // 5
rangeOverlaps(0, 5, 5, 10) // 0 — touching, not overlapping, by default
```

## getOverlapRange

```ts
getOverlapRange(
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number
): [number, number]
```

The intersection itself, as `[start, end]` — a tuple, not a two-element array, so a caller
destructuring `const [start, end] = ...` keeps the length guarantee. `[0, 0]` when there is no
overlap; ranges that merely touch (one ends exactly where the other starts) do **not** count as an
overlap, since `[0, 0]` must stay unambiguous as "no overlap" and a real intersection always has a
strictly positive width.

```ts
getOverlapRange(0, 10, 5, 15) // [5, 10]
getOverlapRange(0, 5, 5, 10) // [0, 0] — touching, not overlapping
```

## formatCurrency

```ts
formatCurrency(value?: number | null, options?: IFormatCurrencyOptions): string
```

Render an amount as money, with the reader's separators and the currency's own symbol and decimals
— via `Intl.NumberFormat` in currency style. Bad data never throws: a non-number renders `empty`,
and a malformed currency code renders a plain number instead (with `format` if given, otherwise 2
decimals).

`IFormatCurrencyOptions`:

| Field      | Type                       | Default | Purpose                                                                                                          |
| ---------- | -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `currency` | `string`                   | `'EUR'` | ISO 4217 code, e.g. `'EUR'`. Any case.                                                                           |
| `locale`   | `string`                   | —       | BCP 47 tag, e.g. `'it-IT'`. Omitted uses the runtime's own default.                                              |
| `empty`    | `string`                   | `'—'`   | shown when `value` is not a number                                                                               |
| `format`   | `Intl.NumberFormatOptions` | —       | passed straight to `Intl.NumberFormat`; without it, decimals come from the currency itself (JPY 0, EUR 2, KWD 3) |

```ts
formatCurrency(1234.5) // '1.234,50 €' (locale-dependent)
formatCurrency(1234.5, { currency: 'JPY' }) // '¥1,235' — JPY has 0 decimals
formatCurrency(null) // '—'
```

Throws a `RangeError` when `locale` or `format` is malformed — a caller bug, not bad data.
