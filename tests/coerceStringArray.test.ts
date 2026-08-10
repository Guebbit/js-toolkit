import { coerceStringArray } from '../src'

describe('(coerceStringArray) coerce any value into a trimmed string array', () => {
    test('maps and trims array items, dropping empty ones', () => {
        expect(coerceStringArray([' a ', 'b', '', '  ', 1, 2])).toEqual(['a', 'b', '1', '2'])
    })

    test('splits a comma-separated string and trims each item', () => {
        expect(coerceStringArray(' a, b ,c ,, ')).toEqual(['a', 'b', 'c'])
    })

    test('returns an empty array for null and undefined', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(coerceStringArray(null)).toEqual([])
        expect(coerceStringArray()).toEqual([])
    })

    test('wraps a single non-string, non-array value in a one-item array', () => {
        expect(coerceStringArray(42)).toEqual(['42'])
        expect(coerceStringArray(true)).toEqual(['true'])
    })

    test('returns an empty array when a single value normalizes to an empty string', () => {
        expect(coerceStringArray('   ')).toEqual([])
    })

    test('returns an empty array for an empty array input', () => {
        expect(coerceStringArray([])).toEqual([])
    })

    // The generic fallback stringifies whatever it is given, so a value whose
    // string form is padded still has to come out trimmed.
    test('trims the string form of a non-string, non-array value', () => {
        expect(coerceStringArray({ toString: () => '  lorem  ' })).toEqual(['lorem'])
    })

    // And a value whose string form is blank is nothing at all, not [''].
    test('returns an empty array when the string form is blank', () => {
        expect(coerceStringArray({ toString: () => '   ' })).toEqual([])
        expect(coerceStringArray({ toString: () => '' })).toEqual([])
    })
})
