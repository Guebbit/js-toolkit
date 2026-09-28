# Arrays and objects

Reshaping, slicing and coercing plain arrays and objects — no class instances, no mutation of the
input.

## arrayChunks

```ts
arrayChunks<T>(array: T[], n: number): T[][]
```

Divide an array into `n` sub-arrays, with lengths as close to equal as possible — the remainder is
spread across the first chunks rather than dumped into the last one. Returns an empty array when
`n` is less than 1.

```ts
arrayChunks(['a', 'b', 'c', 'd', 'e'], 2) // [['a', 'b', 'c'], ['d', 'e']]
```

## arrayColumns

```ts
arrayColumns(haystack: Record<string, unknown>[], columns: string): unknown[]
arrayColumns(haystack: Record<string, unknown>[], columns: string[]): unknown[][]
```

PHP's `array_column`, extended to several columns at once. The result always has one entry per
record, in the same order, so it can be zipped straight back onto the input — a single column name
yields a flat array of values, a list of names yields one value-array per record. A record missing
a column, or not an object at all, contributes `undefined` rather than throwing; inherited
properties never count.

```ts
arrayColumns(
    [
        { id: 1, name: 'Ada' },
        { id: 2, name: 'Bo' }
    ],
    'name'
) // ['Ada', 'Bo']
arrayColumns([{ id: 1, name: 'Ada' }], ['id', 'name']) // [[1, 'Ada']]
```

## arrayDepth

```ts
arrayDepth<T>(check: T | T[]): number
```

Nesting depth of a (possibly nested) array: `0` for a non-array, otherwise `1` plus the deepest
nested array's own depth.

```ts
arrayDepth('x') // 0
arrayDepth([1, [2, [3]]]) // 3
```

## associativeSlice

```ts
associativeSlice(
    object: Record<string, unknown>,
    start: number,
    end: number
): Record<string, unknown>
```

`Array.prototype.slice` for an object's own keys: keys are counted in enumeration order, and only
the ones whose index falls within `[start, end)` make it into the result. Inherited keys never
count.

```ts
associativeSlice({ a: 1, b: 2, c: 3, d: 4 }, 1, 3) // { b: 2, c: 3 }
```

## coerceStringArray

```ts
coerceStringArray(value?: unknown): string[]
```

Coerce any value into a trimmed, non-empty `string[]`. Arrays are stringified item by item,
comma-separated strings are split into items, `null`/`undefined` become an empty array, and
anything else becomes a single-item array.

```ts
coerceStringArray('a, b ,c') // ['a', 'b', 'c']
coerceStringArray([1, 2]) // ['1', '2']
coerceStringArray(undefined) // []
```

## canonicalize

```ts
canonicalize(value: unknown, throwOnCircular?: boolean): unknown
```

Rebuild a value into a canonical form, so `JSON.stringify` of the result is a stable cache key
regardless of property insertion order. Recurses into nested objects — a shallow
`Object.keys().sort()` replacer only sorts the top level. Arrays keep their order (meaningful in a
filter, e.g. sort priority), `undefined` values are dropped (an absent filter and an explicitly
unset one share a key), and `Date` becomes its ISO string.

| Parameter         | Type      | Default | Purpose                                                        |
| ----------------- | --------- | ------- | -------------------------------------------------------------- |
| `value`           | `unknown` | —       | the value to canonicalize                                      |
| `throwOnCircular` | `boolean` | `false` | throw instead of emitting the string `'[Circular]'` on a cycle |

A circular reference should never reach this function, but if one does it is replaced with
`'[Circular]'` by default, so a stable key can still be produced. Pass `throwOnCircular` when a
cycle would mean a bug upstream rather than acceptable data.

```ts
canonicalize({ b: 1, a: 2 }) // { a: 2, b: 1 } — stable key order
```

Throws a `TypeError` when `throwOnCircular` is `true` and a circular reference is found.
