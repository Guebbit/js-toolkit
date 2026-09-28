import { arrayColumns } from '../src'

describe('(arrayColumns) php equivalent of arrayColumns - but extended to use an array of columns', () => {
    const input = [
        {
            id: 1,
            param1: 'lorem ipsum',
            param2: 'dolor'
        },
        {
            id: 2,
            param1: 'lorem ipsum',
            param2: 'sit amet',
            param3: 'consectetur'
        },
        {
            id: 3,
            param1: 'adipiscing',
            param2: 'elit sed do',
            param3: 'eiusmod'
        }
    ]

    test('Return the values from a single column ({param1} in this case)', () => {
        expect(arrayColumns(input, ['param1'])).toStrictEqual([
            ['lorem ipsum'],
            ['lorem ipsum'],
            ['adipiscing']
        ])
    })

    test('Return the values from 2 columns', () => {
        expect(arrayColumns(input, ['param1', 'param3'])).toStrictEqual([
            ['lorem ipsum', undefined],
            ['lorem ipsum', 'consectetur'],
            ['adipiscing', 'eiusmod']
        ])
    })

    test('When having a single haystack or a single column, wrap in array', () => {
        expect(arrayColumns([input[2]], ['param1'])).toStrictEqual([['adipiscing']])
    })

    test('Return the values from a single column NOT array', () => {
        expect(arrayColumns(input, 'param1')).toStrictEqual([
            'lorem ipsum',
            'lorem ipsum',
            'adipiscing'
        ])
    })

    // The guard covers rows that are not objects at all: a sparse or
    // partially-loaded haystack must yield undefined rather than throwing.
    test('returns undefined for a missing row instead of throwing', () => {
        expect(
            // eslint-disable-next-line unicorn/no-null
            arrayColumns([null as unknown as Record<string, unknown>], ['param1'])
        ).toStrictEqual([[undefined]])
        expect(
            arrayColumns([undefined as unknown as Record<string, unknown>], 'param1')
        ).toStrictEqual([undefined])
    })

    // An empty column name cannot address anything, and must not be read as
    // "every column" or as a key that happens to exist.
    test('returns undefined for an empty column name', () => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        expect(arrayColumns([{ '': 'lorem' }], [''])).toStrictEqual([[undefined]])
    })

    test('Ignores inherited properties, returning undefined for non-own columns', () => {
        // 'toString' exists on the prototype but not as an own property:
        // the hasOwnProperty guard must keep it out of the result.
        expect(arrayColumns([{ id: 1 }], ['toString'])).toStrictEqual([[undefined]])
    })
})
