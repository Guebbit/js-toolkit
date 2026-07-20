import { setUrlQueries } from '../src'

describe('setUrlQueries', () => {
    test('builds a query string from an object', () => {
        expect(setUrlQueries({ a: '1', b: '2' })).toBe('a=1&b=2')
    })

    test('stringifies non-string values', () => {
        expect(setUrlQueries({ page: 2, active: true })).toBe('page=2&active=true')
    })

    test('drops undefined, null, empty-string and empty-array values', () => {
        expect(
            setUrlQueries({
                a: '1',
                b: undefined,
                // eslint-disable-next-line unicorn/no-null
                c: null,
                d: '',
                e: []
            })
        ).toBe('a=1')
    })

    test('joins array values with the default separator', () => {
        const query = setUrlQueries({ groups: ['a', 'b', 'c'] })
        expect(new URLSearchParams(query).get('groups')).toBe('a,b,c')
    })

    test('supports a custom array separator', () => {
        const query = setUrlQueries({ groups: ['a', 'b'] }, false, '|')
        expect(new URLSearchParams(query).get('groups')).toBe('a|b')
    })

    test('merges into an existing query string, keeping untouched keys', () => {
        expect(setUrlQueries({ page: 2 }, 'text=hello&page=1')).toBe('text=hello&page=2')
    })

    test('removes a key from the merged query when set to empty', () => {
        expect(setUrlQueries({ text: undefined }, 'text=hello&page=1')).toBe('page=1')
    })

    test('accepts a URLSearchParams instance to merge into', () => {
        expect(setUrlQueries({ page: 3 }, new URLSearchParams('page=1'))).toBe('page=3')
    })
})
