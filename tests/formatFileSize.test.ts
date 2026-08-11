import { formatFileSize } from '../src'

describe('(formatFileSize) Render a byte count the way a person reads one', () => {
    test.each([
        [0, '0 B'],
        [512, '512 B'],
        [1024, '1 KB'],
        [1536, '1.5 KB'],
        [5 * 1024 * 1024, '5 MB'],
        [1.5 * 1024 * 1024, '1.5 MB'],
        [3 * 1024 * 1024 * 1024, '3 GB']
    ])('renders %i bytes as %s', (bytes, expected) => {
        expect(formatFileSize(bytes)).toBe(expected)
    })

    test('strips trailing zeroes, so a round number stays round', () => {
        expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
        expect(formatFileSize(5 * 1024 * 1024)).not.toBe('5.0 MB')
    })

    test('honours the decimals option', () => {
        expect(formatFileSize(1_600_000, { decimals: 3 })).toBe('1.526 MB')
        expect(formatFileSize(1_600_000, { decimals: 0 })).toBe('2 MB')
    })

    test('supports decimal units', () => {
        expect(formatFileSize(1000, { binary: false })).toBe('1 kB')
        expect(formatFileSize(1024, { binary: false })).toBe('1 kB')
    })

    test('clamps beyond the largest unit rather than running off the end', () => {
        // absurd, but rendering it as `undefined` would be worse
        expect(formatFileSize(1024 ** 6)).toContain('TB')
    })

    test('can be forced to one unit, so a column of sizes stays comparable', () => {
        expect(formatFileSize(512 * 1024, { unit: 'MB' })).toBe('0.5 MB')
        expect(formatFileSize(5 * 1024 * 1024, { unit: 'MB' })).toBe('5 MB')
        expect(formatFileSize(1024, { unit: 'B' })).toBe('1024 B')
    })

    test('falls back to the fitting unit for an unrecognised forced one', () => {
        // rendering `NaN undefined` would be worse than quietly picking
        expect(formatFileSize(1024, { unit: 'PB' as 'MB' })).toBe('1 KB')
    })

    test.each([
        ['a negative size', -100],
        ['NaN', Number.NaN],
        ['Infinity', Number.POSITIVE_INFINITY]
    ])('treats %s as zero', (_label, bytes) => {
        expect(formatFileSize(bytes)).toBe('0 B')
    })
})
