/**
 * TYPES — time: conversions between seconds and every unit, execution timing, and the two date
 * formatters (formatDuration, formatDateTime).
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'
import type {
    IFormatDateTimeOptions,
    IFormatDurationOptions,
    ISecondsToTimeMap,
    TDurationUnit
} from '../../src'

expectTypeOf(toolkit.secondsToTime).not.toBeAny()
expectTypeOf(toolkit.formatDuration).not.toBeAny()
expectTypeOf(toolkit.timeToSeconds).not.toBeAny()
expectTypeOf(toolkit.getExecTime).not.toBeAny()
expectTypeOf(toolkit.formatDateTime).not.toBeAny()

expectTypeOf(toolkit.secondsToTime).returns.toEqualTypeOf<ISecondsToTimeMap>()
// Every field is required, so reading one never needs a non-null assertion.
expectTypeOf<ISecondsToTimeMap['hours']>().toEqualTypeOf<number>()
expectTypeOf<ISecondsToTimeMap['millisecondsOnly']>().toEqualTypeOf<number>()

expectTypeOf(toolkit.timeToSeconds).parameters.toEqualTypeOf<[string?, string?]>()

// The measured result keeps the timed function's own return type instead of collapsing to
// unknown.
expectTypeOf(toolkit.getExecTime(() => 'lorem')).resolves.toEqualTypeOf<{
    result: string
    time: number
}>()
expectTypeOf(toolkit.getExecTime(() => Promise.resolve(1))).resolves.toEqualTypeOf<{
    result: number
    time: number
}>()

expectTypeOf(toolkit.formatDuration).toEqualTypeOf<
    (seconds: number, options?: IFormatDurationOptions) => string
>()
expectTypeOf<TDurationUnit>().toEqualTypeOf<
    'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
>()

expectTypeOf(toolkit.formatDateTime).toEqualTypeOf<
    (value?: string | number | Date | null, options?: IFormatDateTimeOptions) => string
>()
expectTypeOf<IFormatDateTimeOptions>().toEqualTypeOf<{
    locale?: string
    empty?: string
    format?: Intl.DateTimeFormatOptions
}>()

// @ts-expect-error -- seconds is required, not optional
toolkit.formatDuration()

// @ts-expect-error -- units has to be an array of TDurationUnit, not a bare string
toolkit.formatDuration(90, { units: 'hours' })

// @ts-expect-error -- a Date, string or number is accepted, not a plain object
toolkit.formatDateTime({})
