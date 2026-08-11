import { formatFlag } from '../src'

describe('(formatFlag) Render a boolean as one of two labels', () => {
    test('picks the true label', () => {
        expect(formatFlag(true, 'Active', 'Inactive')).toBe('Active')
    })

    test('picks the false label', () => {
        expect(formatFlag(false, 'Active', 'Inactive')).toBe('Inactive')
    })

    test.each([
        ['undefined', undefined],
        // eslint-disable-next-line unicorn/no-null -- null handling is what this case tests
        ['null', null]
    ])('keeps %s distinct from false', (_label, value) => {
        // nobody has answered the question; "Inactive" would assert what the data does not say
        expect(formatFlag(value, 'Active', 'Inactive')).toBe('—')
    })

    test('accepts a custom fallback', () => {
        expect(formatFlag(undefined, 'Active', 'Inactive', 'Unknown')).toBe('Unknown')
    })
})
