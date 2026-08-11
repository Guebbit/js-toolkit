import { expectTypeOf } from 'expect-type'
import * as toolkit from '../src'
import type { IMatchOptions, ISecondsToTimeMap, ISetCookieOptions, TMatchMode } from '../src'

/**
 * Type-level tests.
 *
 * The exported types are as much the public API as the runtime behaviour, and a
 * signature that quietly widens to `any` is a breaking change no runtime
 * assertion can see: `any` satisfies every call, so the unit tests stay green
 * while consumers lose every check they had.
 *
 * expectTypeOf assertions compile away to nothing, so ts-jest reporting a
 * diagnostic is what makes a violation fail. The one runtime assertion at the
 * bottom keeps the file from being an empty suite.
 */

describe('exported type surface', () => {
    test('nothing is typed as any', () => {
        // `any` is the failure that hides all the others: it would satisfy every
        // assertion below, so it has to be ruled out first.
        expectTypeOf(toolkit.arrayChunks).not.toBeAny()
        expectTypeOf(toolkit.canonicalize).not.toBeAny()
        expectTypeOf(toolkit.getJson).not.toBeAny()
        expectTypeOf(toolkit.getValue).not.toBeAny()
        expectTypeOf(toolkit.isJson).not.toBeAny()
        expectTypeOf(toolkit.toFormData).not.toBeAny()
        expectTypeOf(toolkit.getExecTime).not.toBeAny()
        expect(true).toBe(true)
    })

    test('numeric helpers take and return numbers, with optional trailing arguments', () => {
        expectTypeOf(toolkit.getDelta).toEqualTypeOf<
            (a: number, b: number, size?: number) => number
        >()
        expectTypeOf(toolkit.getMapDistance).toEqualTypeOf<
            (Xa: number, Xb: number, Ya: number, Yb: number, size?: number) => number
        >()
        expectTypeOf(toolkit.rangeOverlaps).parameters.toEqualTypeOf<
            [number, number, number, number, boolean?]
        >()
        expectTypeOf(toolkit.rangeOverlaps).returns.toEqualTypeOf<number>()
    })

    // A tuple, not number[]: callers destructure `const [start, end] = ...` and
    // widening to an array silently removes the length guarantee.
    test('getOverlapRange returns a fixed-length tuple', () => {
        expectTypeOf(toolkit.getOverlapRange).returns.toEqualTypeOf<[number, number]>()
        const [start, end] = toolkit.getOverlapRange(0, 1, 0, 2)
        expectTypeOf(start).toEqualTypeOf<number>()
        expectTypeOf(end).toEqualTypeOf<number>()
    })

    test('generic collection helpers carry their element type through', () => {
        expectTypeOf(toolkit.arrayChunks<string>).returns.toEqualTypeOf<string[][]>()
        expectTypeOf(toolkit.arrayChunks([1, 2, 3], 2)).toEqualTypeOf<number[][]>()
        expectTypeOf(toolkit.arrayDepth).returns.toEqualTypeOf<number>()
        expectTypeOf(toolkit.associativeSlice).returns.toEqualTypeOf<Record<string, unknown>>()
        // Overloaded: a bare column name gives a flat array, a list of names gives
        // one array per record. Without the overloads both collapse to unknown[]
        // and the caller has to cast.
        expectTypeOf(toolkit.arrayColumns([{ a: 1 }], 'a')).toEqualTypeOf<unknown[]>()
        expectTypeOf(toolkit.arrayColumns([{ a: 1 }], ['a'])).toEqualTypeOf<unknown[][]>()
    })

    // `unknown`, not `any`. The whole point of a safe JSON wrapper is that the
    // caller is forced to narrow before using the result.
    test('parsers hand back an unnarrowed value the caller must check', () => {
        expectTypeOf(toolkit.getJson).toEqualTypeOf<(json?: string) => unknown>()
        expectTypeOf(toolkit.canonicalize).toEqualTypeOf<
            (value: unknown, throwOnCircular?: boolean) => unknown
        >()
        // Objects and arrays, never a bare value: the false return has to stay
        // unambiguous, and `isJson('false')` would otherwise collide with it.
        expectTypeOf(toolkit.isJson<number>).returns.toEqualTypeOf<
            Record<string, number> | number[] | false
        >()
    })

    test('predicates return a plain boolean', () => {
        expectTypeOf(toolkit.isInViewport).toEqualTypeOf<
            (element: Element, fully?: boolean) => boolean
        >()
        expectTypeOf(toolkit.match).parameters.toEqualTypeOf<[string?, string?, IMatchOptions?]>()
        expectTypeOf(toolkit.match).returns.toEqualTypeOf<boolean>()
    })

    // The mode is a closed union, not a string: a typo has to be a compile
    // error, which is the whole reason for replacing the old magic numbers.
    test('match options are a closed union, not loose strings', () => {
        expectTypeOf<TMatchMode>().toEqualTypeOf<
            'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'
        >()
        expectTypeOf<IMatchOptions>().toEqualTypeOf<{
            sensitive?: boolean
            mode?: TMatchMode
            maxDistance?: number
        }>()
    })

    test('string helpers accept the nullable inputs they document', () => {
        expectTypeOf(toolkit.levenshteinDistance).parameters.toEqualTypeOf<
            [(string | null)?, (string | null)?]
        >()
        expectTypeOf(toolkit.coerceStringArray).toEqualTypeOf<(value?: unknown) => string[]>()
        expectTypeOf(toolkit.timeToSeconds).parameters.toEqualTypeOf<[string?, string?]>()
        expectTypeOf(toolkit.getUuid).toEqualTypeOf<() => string>()
    })

    test('async helpers resolve to the documented shape', () => {
        expectTypeOf(toolkit.copyToClipboard).toEqualTypeOf<(text: string) => Promise<boolean>>()
        expectTypeOf(toolkit.deleteFile).toEqualTypeOf<
            (filePath: string, onError?: (error: Error) => void) => Promise<boolean>
        >()
        // The measured result keeps the timed function's own return type instead
        // of collapsing to unknown.
        expectTypeOf(toolkit.getExecTime(() => 'lorem')).resolves.toEqualTypeOf<{
            result: string
            time: number
        }>()
        expectTypeOf(toolkit.getExecTime(() => Promise.resolve(1))).resolves.toEqualTypeOf<{
            result: number
            time: number
        }>()
    })

    test('DOM helpers return element types rather than a bare object', () => {
        expectTypeOf(toolkit.formatNodeList).returns.toEqualTypeOf<HTMLElement[]>()
        // An unsubscribe, not void: it is the only way to remove the listener
        expectTypeOf(toolkit.eventDelegate).returns.toEqualTypeOf<() => void>()
        expectTypeOf(toolkit.getSiblings).returns.toEqualTypeOf<Element[]>()
        expectTypeOf(toolkit.getElementCenter).returns.toEqualTypeOf<[number, number]>()
        expectTypeOf(toolkit.getIndex).toEqualTypeOf<(element: HTMLElement | null) => number>()
        expectTypeOf(toolkit.getIframe).returns.toEqualTypeOf<
            HTMLElement | HTMLBodyElement | undefined
        >()
        expectTypeOf(toolkit.getValue).returns.toEqualTypeOf<
            string | number | boolean | undefined
        >()
        expectTypeOf(toolkit.toFormData).returns.toEqualTypeOf<FormData>()
    })

    test('query helpers keep the multi-value union in the parsed result', () => {
        expectTypeOf(toolkit.getUrlQueries).returns.toEqualTypeOf<
            Record<string, string | string[]>
        >()
        expectTypeOf(toolkit.setUrlQueries).returns.toEqualTypeOf<string>()
    })

    // Both interfaces are reachable from the package root. Without them a
    // consumer cannot name the argument they are about to build, and ends up
    // re-declaring the shape by hand.
    test('the option and result interfaces are exported from the barrel', () => {
        expectTypeOf<ISetCookieOptions>().toEqualTypeOf<{
            days?: number
            path?: string
            domain?: string
            secure?: boolean
            sameSite?: 'Strict' | 'Lax' | 'None'
        }>()
        expectTypeOf<ISetCookieOptions['sameSite']>().toEqualTypeOf<
            'Strict' | 'Lax' | 'None' | undefined
        >()
        expectTypeOf(toolkit.secondsToTime).returns.toEqualTypeOf<ISecondsToTimeMap>()
        // Every field is required, so reading one never needs a non-null assertion
        expectTypeOf<ISecondsToTimeMap['hours']>().toEqualTypeOf<number>()
        expectTypeOf<ISecondsToTimeMap['millisecondsOnly']>().toEqualTypeOf<number>()
        expectTypeOf(toolkit.setCookie).parameters.toEqualTypeOf<
            [string, string, ISetCookieOptions?]
        >()
    })

    test('every barrel export is callable', () => {
        // Guards the barrel itself: a re-export that resolves to undefined at
        // runtime still type-checks if the module shape is right.
        const values = Object.values(toolkit)
        expect(values).toHaveLength(44)
        expect(values.every((value) => typeof value === 'function')).toBe(true)
    })
})
