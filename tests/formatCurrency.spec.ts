import { formatCurrency } from '../src'

describe('(formatCurrency) Render an amount as money', () => {
    test('formats with the currency symbol', () => {
        expect(formatCurrency(1234.5, { locale: 'en-US', currency: 'USD' })).toBe('$1,234.50')
    })

    test('defaults to EUR when no currency is given', () => {
        expect(formatCurrency(10, { locale: 'en-US' })).toBe('€10.00')
    })

    test.each([
        ['USD', 10, '$10.00'],
        ['JPY', 1234, '¥1,234'],
        ['KWD', 1234.5, 'KWD 1,234.500']
    ])('uses the currency’s own decimals (%s)', (currency, amount, expected) => {
        expect(formatCurrency(amount, { locale: 'en-US', currency })).toBe(expected)
    })

    test('rounds to the minor unit', () => {
        expect(formatCurrency(1234.5, { locale: 'en-US', currency: 'JPY' })).toBe('¥1,235')
    })

    test('a format without digits keeps the currency’s own decimals', () => {
        // pins replace-not-merge: the caller's format is used as is, not merged with a default
        expect(
            formatCurrency(1234, {
                locale: 'en-US',
                currency: 'JPY',
                format: { currencyDisplay: 'code' }
            })
        ).toBe('JPY 1,234')
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

    test.each([
        ['empty string', ''],
        ['too short', 'EU'],
        ['too long', 'EUR1'],
        ['leading digit', '1EUR'],
        ['non-ASCII letter', 'ÄBC'],
        ['not a code at all', 'NOT_A_CODE']
    ])('degrades to a plain number for a malformed currency code (%s)', (_label, currency) => {
        // a price without its symbol is cosmetic; a crashed render is not
        expect(formatCurrency(10, { locale: 'en-US', currency })).toBe('10.00')
    })

    test('a malformed currency code with a format uses it as is', () => {
        expect(
            formatCurrency(1234.5, {
                locale: 'en-US',
                currency: '',
                format: { maximumFractionDigits: 0 }
            })
        ).toBe('1,235')
    })

    test('a well-formed but unknown currency code stays in currency style', () => {
        // 'XYZ' is well-formed (three ASCII letters) but has no ISO 4217 data: Intl prints it
        // as-is with its own 2-decimal fallback, rather than throwing
        expect(formatCurrency(10, { locale: 'en-US', currency: 'XYZ' })).toBe('XYZ 10.00')
    })

    test('currency code is case-insensitive', () => {
        expect(formatCurrency(10, { locale: 'en-US', currency: 'eur' })).toBe('€10.00')
    })

    test.each([
        ['underscore', 'en_US'],
        ['empty string', ''],
        ['well-formed but unknown', 'zz']
    ])('uses the runtime’s default locale for an unusable one (%s)', (_label, locale) => {
        // a locale is often runtime data (a header, a user setting): a bad one must not crash a render
        expect(formatCurrency(1234.5, { locale, currency: 'USD' })).toBe(
            formatCurrency(1234.5, { currency: 'USD' })
        )
    })

    test('an unusable locale falls back on the plain-number path too', () => {
        expect(formatCurrency(1234.5, { locale: 'en_US', currency: '' })).toBe(
            formatCurrency(1234.5, { currency: '' })
        )
    })

    test('still throws on a malformed format, even next to a malformed locale', () => {
        // format is written in code, not data: the locale fallback must not swallow its error
        expect(() =>
            formatCurrency(10, {
                locale: 'en_US',
                currency: 'USD',
                format: { maximumFractionDigits: 101 }
            })
        ).toThrow(RangeError)
    })

    test('accepts a custom fallback', () => {
        expect(formatCurrency(undefined, { empty: 'N/A' })).toBe('N/A')
    })
})
