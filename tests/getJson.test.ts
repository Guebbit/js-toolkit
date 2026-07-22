import { getJson } from '../src'

describe('(getJson) Safe conversion of JSON', () => {
    test('Empty', () => {
        expect(getJson()).toBeFalsy()
    })

    test('Random string', () => {
        expect(getJson('12345')).toBe(12_345)
    })

    test('Empty object (json)', () => {
        expect(getJson('{}')).toBeTruthy()
    })

    test('Empty array (json)', () => {
        expect(getJson('[]')).toBeTruthy()
    })

    test('Wrong object (json)', () => {
        expect(getJson("{ 'test': 'toast' }")).toBeFalsy()
    })

    test('Wrong array (json)', () => {
        expect(getJson("['bim', 'bum', 'bam']")).toBeFalsy()
    })

    test('Correct object (json)', () => {
        expect(getJson('{"test":"toast","lorem":"ipsum"}')).toBeTruthy()
    })

    test('Correct array (json)', () => {
        expect(getJson('["bim","bum","bam"]')).toBeTruthy()
    })

    test('logs the error and returns undefined on invalid JSON', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        try {
            expect(getJson("{ 'test': 'toast' }")).toBeUndefined()
            expect(spy).toHaveBeenCalledTimes(1)
        } finally {
            spy.mockRestore()
        }
    })
})
