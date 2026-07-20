import { getUrlQueries } from '../src'

describe('getUrlQueries', () => {
    test('parses simple key/value pairs', () => {
        expect(getUrlQueries('?a=1&b=2')).toEqual({ a: '1', b: '2' })
    })

    test('works without a leading "?"', () => {
        expect(getUrlQueries('a=1&b=2')).toEqual({ a: '1', b: '2' })
    })

    test('splits comma-separated values into an array', () => {
        expect(getUrlQueries('?groups=a,b,c')).toEqual({ groups: ['a', 'b', 'c'] })
    })

    test('merges repeated keys into an array', () => {
        expect(getUrlQueries('?a=1&a=2')).toEqual({ a: ['1', '2'] })
    })

    test('disables array splitting when arraySeparator is false', () => {
        expect(getUrlQueries('?groups=a,b', false)).toEqual({ groups: 'a,b' })
    })

    test('supports a custom array separator', () => {
        expect(getUrlQueries('?groups=a|b|c', '|')).toEqual({ groups: ['a', 'b', 'c'] })
    })

    test('accepts a URLSearchParams instance', () => {
        expect(getUrlQueries(new URLSearchParams('a=1&b=2'))).toEqual({ a: '1', b: '2' })
    })

    test('returns an empty object for an empty query string', () => {
        expect(getUrlQueries('')).toEqual({})
    })
})
