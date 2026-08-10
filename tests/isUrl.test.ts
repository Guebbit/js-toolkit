import { isUrl } from '../src'

describe('(isObject) check if object', () => {
    test('Empty string', () => {
        expect(isUrl('')).toBeFalsy()
    })
    test('Some string', () => {
        expect(isUrl('lorem ipsum')).toBeFalsy()
    })

    test('Email', () => {
        expect(isUrl('lorem@ipsum.it')).toBeFalsy()
    })
    test('Url but not quite 1 (return true)', () => {
        expect(isUrl('lorem.ipsum')).toBeTruthy()
    })
    test('Url but not quite 2 (return false)', () => {
        expect(isUrl('lorem.ipsum:')).toBeFalsy()
    })
    test('Real URL', () => {
        expect(isUrl('https://lodash.com/')).toBeTruthy()
    })

    // The query-string group is a separate alternation; drop it and a perfectly
    // ordinary tracked link stops validating.
    test('accepts a query string', () => {
        expect(isUrl('https://lorem.com/ipsum?dolor=sit&amet=1')).toBe(true)
    })

    test('accepts a fragment', () => {
        expect(isUrl('https://lorem.com/ipsum#dolor')).toBe(true)
    })

    test('accepts a port', () => {
        expect(isUrl('http://lorem.com:8080/ipsum')).toBe(true)
    })

    // The pattern is built with the 'i' flag. Hostnames are case-insensitive,
    // so an uppercase URL is valid and must not depend on the flag surviving.
    test('accepts an uppercase url', () => {
        expect(isUrl('HTTPS://LOREM.COM/IPSUM')).toBe(true)
    })
})
