import { getJson } from '../src'

describe('(getJson) Safe conversion of JSON', () => {
    test('Empty', () => {
        expect(getJson()).toBeUndefined()
        expect(getJson('')).toBeUndefined()
    })

    // Unlike isJson, any JSON value is acceptable here — this is the general
    // parse, so a bare number comes back as a number.
    test('Bare JSON value', () => {
        expect(getJson('12345')).toBe(12_345)
        expect(getJson('"lorem"')).toBe('lorem')
        expect(getJson('true')).toBe(true)
        expect(getJson('null')).toBeNull()
    })

    test('Empty object (json)', () => {
        expect(getJson('{}')).toStrictEqual({})
    })

    test('Empty array (json)', () => {
        expect(getJson('[]')).toStrictEqual([])
    })

    test('Wrong object (json)', () => {
        expect(getJson("{ 'test': 'toast' }")).toBeUndefined()
    })

    test('Wrong array (json)', () => {
        expect(getJson("['bim', 'bum', 'bam']")).toBeUndefined()
    })

    test('Correct object (json)', () => {
        expect(getJson('{"test":"toast","lorem":"ipsum"}')).toStrictEqual({
            test: 'toast',
            lorem: 'ipsum'
        })
    })

    test('Correct array (json)', () => {
        expect(getJson('["bim","bum","bam"]')).toStrictEqual(['bim', 'bum', 'bam'])
    })

    // The return value is the only report. Parsing something that might not be
    // JSON is the reason to reach for this over JSON.parse, so a malformed
    // string is expected input, not an event worth logging.
    test('returns undefined and writes nothing to the console on invalid JSON', () => {
        const error = jest.spyOn(console, 'error').mockImplementation(jest.fn())
        try {
            expect(getJson("{ 'test': 'toast' }")).toBeUndefined()
            expect(error).not.toHaveBeenCalled()
        } finally {
            error.mockRestore()
        }
    })
})
