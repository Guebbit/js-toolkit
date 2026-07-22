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

    test('Ignores inherited properties, returning undefined for non-own columns', () => {
        // 'toString' exists on the prototype but not as an own property:
        // the hasOwnProperty guard must keep it out of the result.
        expect(arrayColumns([{ id: 1 }], ['toString'])).toStrictEqual([[undefined]])
    })
})
