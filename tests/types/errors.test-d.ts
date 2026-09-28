/**
 * TYPES — errors: extractErrorMessage takes `unknown`, the same reason a caught value's type is
 * `unknown` — the thrower controls the shape, not the reader.
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'

expectTypeOf(toolkit.extractErrorMessage).not.toBeAny()

expectTypeOf(toolkit.extractErrorMessage).toEqualTypeOf<
    (error: unknown, fallback?: string) => string
>()
expectTypeOf(toolkit.extractErrorMessage(new Error('boom'))).toEqualTypeOf<string>()
// Any caught value type-checks — that's the point of `unknown` here.
expectTypeOf(toolkit.extractErrorMessage('boom')).toEqualTypeOf<string>()
expectTypeOf(toolkit.extractErrorMessage({ status: 400 })).toEqualTypeOf<string>()

// @ts-expect-error -- fallback has to be a string, not a number
toolkit.extractErrorMessage(new Error('boom'), 0)
