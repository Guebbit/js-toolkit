import { extractErrorMessage } from '../src'

describe('(extractErrorMessage) Pull a human-readable message out of a rejection', () => {
    test('returns a non-empty string as-is', () => {
        expect(extractErrorMessage('Boom')).toBe('Boom')
    })

    test('reads an Error message', () => {
        expect(extractErrorMessage(new Error('Boom'))).toBe('Boom')
    })

    test('reads a message off a plain object, which is the whole reason it exists', () => {
        // what an HTTP interceptor that normalises failures rejects with
        expect(extractErrorMessage({ status: 400, message: 'Email already taken' })).toBe(
            'Email already taken'
        )
    })

    test('digs into an unwrapped body', () => {
        expect(extractErrorMessage({ status: 400, data: { message: 'Nested' } })).toBe('Nested')
    })

    test('digs into a raw axios error shape', () => {
        expect(extractErrorMessage({ response: { data: { message: 'From axios' } } })).toBe(
            'From axios'
        )
    })

    test('prefers the shallower message, so nesting can add one but never replace one', () => {
        expect(extractErrorMessage({ message: 'Top', data: { message: 'Nested' } })).toBe('Top')
    })

    describe('nothing readable', () => {
        test.each([
            ['undefined', undefined],
            // eslint-disable-next-line unicorn/no-null -- null handling is what this case tests
            ['null', null],
            ['an empty string', ''],
            ['a number', 42],
            ['an empty object', {}],
            // eslint-disable-next-line unicorn/error-message -- an empty message is the case
            ['an Error with no message', new Error('')],
            ['a non-string message', { message: 42 }],
            ['an empty message', { message: '' }],
            ['a nested empty message', { data: { message: '' } }]
        ])('falls back for %s', (_label, value) => {
            expect(extractErrorMessage(value, 'Fallback')).toBe('Fallback')
        })
    })

    test('falls back to an empty string when the caller supplied no wording', () => {
        // eslint-disable-next-line unicorn/no-useless-undefined -- the absent rejection is the case
        expect(extractErrorMessage(undefined)).toBe('')
    })
})
