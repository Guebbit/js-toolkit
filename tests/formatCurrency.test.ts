import { formatCurrency } from '../src'

describe('(formatCurrency) Render an amount as money', () => {
    test('formats with the currency symbol', () => {
        expect(formatCurrency(1234.5, { locale: 'en-US', currency: 'USD' })).toBe('$1,234.50')
    })

    test('defaults to two decimals', () => {
        expect(formatCurrency(10, { locale: 'en-US', currency: 'USD' })).toBe('$10.00')
    })

    test('respects the locale’s separators', () => {
        expect(formatCurrency(1234.5, { locale: 'de-DE', currency: 'EUR' })).not.toBe(
            formatCurrency(1234.5, { locale: 'en-US', currency: 'EUR' })
        )
    })

    test('accepts Intl overrides', () => {
        expect(
            formatCurrency(1234.5, {
                locale: 'en-US',
                currency: 'USD',
                format: { maximumFractionDigits: 0, minimumFractionDigits: 0 }
            })
        ).toBe('$1,235')
    })

    test('formats zero rather than falling back', () => {
        // 0 is an amount, not a missing value
        expect(formatCurrency(0, { locale: 'en-US', currency: 'USD' })).toBe('$0.00')
    })

    test.each([
        ['undefined', undefined],
        // eslint-disable-next-line unicorn/no-null -- null handling is what this case tests
        ['null', null],
        ['NaN', Number.NaN]
    ])('falls back for %s', (_label, value) => {
        expect(formatCurrency(value)).toBe('—')
    })

    test('degrades to a plain number for an unknown currency code', () => {
        // a price without its symbol is cosmetic; a crashed render is not
        expect(formatCurrency(10, { locale: 'en-US', currency: 'NOT_A_CODE' })).toBe('10.00')
    })

    test('accepts a custom fallback', () => {
        expect(formatCurrency(undefined, { empty: 'N/A' })).toBe('N/A')
    })
})
