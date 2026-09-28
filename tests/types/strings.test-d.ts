/**
 * TYPES — strings: fuzzy matching, edit distance, id generation, and the two plain-text display
 * formatters (formatFlag, formatText).
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'
import type { IMatchOptions, TMatchMode } from '../../src'

expectTypeOf(toolkit.levenshteinDistance).not.toBeAny()
expectTypeOf(toolkit.match).not.toBeAny()
expectTypeOf(toolkit.getUuid).not.toBeAny()
expectTypeOf(toolkit.formatFlag).not.toBeAny()
expectTypeOf(toolkit.formatText).not.toBeAny()

expectTypeOf(toolkit.levenshteinDistance).parameters.toEqualTypeOf<
    [(string | null)?, (string | null)?]
>()
expectTypeOf(toolkit.getUuid).toEqualTypeOf<() => string>()

expectTypeOf(toolkit.match).parameters.toEqualTypeOf<[string?, string?, IMatchOptions?]>()
expectTypeOf(toolkit.match).returns.toEqualTypeOf<boolean>()

// The mode is a closed union, not a string: a typo has to be a compile error, which is the whole
// reason for replacing the old magic numbers.
expectTypeOf<TMatchMode>().toEqualTypeOf<'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'>()
expectTypeOf<IMatchOptions>().toEqualTypeOf<{
    sensitive?: boolean
    mode?: TMatchMode
    maxDistance?: number
}>()

// Keeping "unset" distinct from "false" is the point: value takes the nullable boolean, and both
// labels are required so a caller can never forget the negative case.
expectTypeOf(toolkit.formatFlag).toEqualTypeOf<
    (value: boolean | null | undefined, trueLabel: string, falseLabel: string, empty?: string) => string
>()
expectTypeOf(toolkit.formatText).toEqualTypeOf<(value?: string | null, empty?: string) => string>()

// @ts-expect-error -- mode has to be one of the closed union's members
toolkit.match('a', 'b', { mode: 'loose' })

// @ts-expect-error -- both labels are required, not just the true one
toolkit.formatFlag(true, 'Yes')

// @ts-expect-error -- value has to be a string, null or undefined, not a number
toolkit.formatText(123)
