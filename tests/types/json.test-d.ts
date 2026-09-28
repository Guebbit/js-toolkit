/**
 * TYPES — JSON: both parsers hand back an unnarrowed value the caller must check, never `any`.
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'

expectTypeOf(toolkit.getJson).not.toBeAny()
expectTypeOf(toolkit.isJson).not.toBeAny()

expectTypeOf(toolkit.getJson).toEqualTypeOf<(json?: string) => unknown>()

// Objects and arrays, never a bare value: the false return has to stay unambiguous, and
// isJson('false') would otherwise collide with it.
expectTypeOf(toolkit.isJson<number>).returns.toEqualTypeOf<
    Record<string, number> | number[] | false
>()

// @ts-expect-error -- json has to be a string
toolkit.getJson(42)
