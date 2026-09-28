/**
 * TYPES — arrays and objects: generic collection helpers carry their element type through instead
 * of collapsing to `unknown[]`.
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'

expectTypeOf(toolkit.arrayChunks).not.toBeAny()
expectTypeOf(toolkit.arrayColumns).not.toBeAny()
expectTypeOf(toolkit.arrayDepth).not.toBeAny()
expectTypeOf(toolkit.associativeSlice).not.toBeAny()
expectTypeOf(toolkit.coerceStringArray).not.toBeAny()
expectTypeOf(toolkit.canonicalize).not.toBeAny()

expectTypeOf(toolkit.arrayChunks<string>).returns.toEqualTypeOf<string[][]>()
expectTypeOf(toolkit.arrayChunks([1, 2, 3], 2)).toEqualTypeOf<number[][]>()

// Overloaded: a bare column name gives a flat array, a list of names gives one array per record.
// Without the overloads both collapse to unknown[] and the caller has to cast.
expectTypeOf(toolkit.arrayColumns([{ a: 1 }], 'a')).toEqualTypeOf<unknown[]>()
expectTypeOf(toolkit.arrayColumns([{ a: 1 }], ['a'])).toEqualTypeOf<unknown[][]>()

expectTypeOf(toolkit.arrayDepth).returns.toEqualTypeOf<number>()
expectTypeOf(toolkit.associativeSlice).returns.toEqualTypeOf<Record<string, unknown>>()

expectTypeOf(toolkit.coerceStringArray).toEqualTypeOf<(value?: unknown) => string[]>()

// `unknown`, not `any`: canonicalize returns whatever shape it was given, and the caller still
// has to narrow before using it.
expectTypeOf(toolkit.canonicalize).toEqualTypeOf<
    (value: unknown, throwOnCircular?: boolean) => unknown
>()

// @ts-expect-error -- the chunk count is a number, not a string
toolkit.arrayChunks(['a', 'b'], '2')

// @ts-expect-error -- start and end are both required
toolkit.associativeSlice({ a: 1 }, 0)
