import { isJson } from '../src'

describe('(isJson) parse a JSON structure, or report that the string is not one', () => {
    test('Empty string', () => {
        expect(isJson('')).toBe(false)
    })

    test('Empty JSON array', () => {
        expect(isJson('[]')).toStrictEqual([])
    })

    test('Empty JSON object', () => {
        expect(isJson('{}')).toStrictEqual({})
    })

    test('Populated JSON array', () => {
        expect(isJson('["lorem", "ipsum"]')).toStrictEqual(['lorem', 'ipsum'])
    })

    test('Populated JSON object', () => {
        expect(isJson('{"lorem": "ipsum"}')).toStrictEqual({ lorem: 'ipsum' })
    })

    test('returns the parsed value, not merely a boolean', () => {
        expect(isJson<string>('{"lorem":"ipsum"}')).toEqual({ lorem: 'ipsum' })
    })

    test('Malformed JSON', () => {
        expect(isJson("{ 'lorem': 'ipsum' }")).toBe(false)
        expect(isJson('{"lorem":}')).toBe(false)
        expect(isJson('lorem ipsum')).toBe(false)
    })

    // A bare JSON value parses, but there is nothing to walk and the caller
    // asked "is this a structure". Rejecting them is also what keeps `false`
    // unambiguous: the input 'false' parses to the same value used to signal
    // failure, so it cannot be allowed through as a success.
    test('rejects a valid JSON value that is not a structure', () => {
        expect(isJson('5')).toBe(false)
        expect(isJson('"lorem"')).toBe(false)
        expect(isJson('true')).toBe(false)
        expect(isJson('false')).toBe(false)
        expect(isJson('null')).toBe(false)
    })

    // The return value is the only report. A library writing to the console on
    // an input the caller explicitly handed over to be checked is noise the
    // caller cannot switch off.
    test('does not write to the console for invalid input', () => {
        const error = jest.spyOn(console, 'error').mockImplementation(jest.fn())
        try {
            expect(isJson('nope')).toBe(false)
            expect(error).not.toHaveBeenCalled()
        } finally {
            error.mockRestore()
        }
    })

    test('nested structures are parsed whole', () => {
        expect(isJson('{"a":{"b":[1,2]}}')).toStrictEqual({ a: { b: [1, 2] } })
    })
})
