/**
 * TYPES — numbers and ranges: distances, overlaps, and formatCurrency (a number rendered for
 * display, so it belongs with the other numeric helpers rather than with the string formatters).
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'
import type { IFormatCurrencyOptions } from '../../src'

expectTypeOf(toolkit.getDelta).not.toBeAny()
expectTypeOf(toolkit.getMapDistance).not.toBeAny()
expectTypeOf(toolkit.rangeOverlaps).not.toBeAny()
expectTypeOf(toolkit.getOverlapRange).not.toBeAny()
expectTypeOf(toolkit.formatCurrency).not.toBeAny()

expectTypeOf(toolkit.getDelta).toEqualTypeOf<(a: number, b: number, size?: number) => number>()
expectTypeOf(toolkit.getMapDistance).toEqualTypeOf<
    (Xa: number, Xb: number, Ya: number, Yb: number, size?: number) => number
>()
expectTypeOf(toolkit.rangeOverlaps).parameters.toEqualTypeOf<
    [number, number, number, number, boolean?]
>()
expectTypeOf(toolkit.rangeOverlaps).returns.toEqualTypeOf<number>()

// A tuple, not number[]: callers destructure `const [start, end] = ...` and widening to an array
// silently removes the length guarantee.
expectTypeOf(toolkit.getOverlapRange).returns.toEqualTypeOf<[number, number]>()
const [start, end] = toolkit.getOverlapRange(0, 1, 0, 2)
expectTypeOf(start).toEqualTypeOf<number>()
expectTypeOf(end).toEqualTypeOf<number>()

expectTypeOf(toolkit.formatCurrency).toEqualTypeOf<
    (value?: number | null, options?: IFormatCurrencyOptions) => string
>()
expectTypeOf(toolkit.formatCurrency(10)).toEqualTypeOf<string>()
expectTypeOf<IFormatCurrencyOptions>().toEqualTypeOf<{
    currency?: string
    locale?: string
    empty?: string
    format?: Intl.NumberFormatOptions
}>()

// @ts-expect-error -- size is a number, not a boolean
toolkit.getDelta(1, 2, true)

// @ts-expect-error -- currency has to be a string
toolkit.formatCurrency(10, { currency: 978 })
