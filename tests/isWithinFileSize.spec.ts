import { isWithinFileSize } from '../src'

const FIVE_MB = 5 * 1024 * 1024

describe('(isWithinFileSize) Whether a file is no larger than the given limit', () => {
    test('accepts a file under the limit', () => {
        expect(isWithinFileSize({ size: 1024 }, FIVE_MB)).toBe(true)
    })

    test('accepts a file exactly at the limit', () => {
        expect(isWithinFileSize({ size: FIVE_MB }, FIVE_MB)).toBe(true)
    })

    test('rejects a file over the limit', () => {
        expect(isWithinFileSize({ size: FIVE_MB + 1 }, FIVE_MB)).toBe(false)
    })

    test.each([
        ['zero', 0],
        ['a negative maximum', -1],
        ['NaN', Number.NaN]
    ])('treats %s as no limit', (_label, maxBytes) => {
        // a misconfigured maximum should accept everything, not reject everything
        expect(isWithinFileSize({ size: FIVE_MB }, maxBytes)).toBe(true)
    })
})
