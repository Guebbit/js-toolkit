import { formatDateTime } from '../src'

describe('(formatDateTime) Render a date for display, in the reader’s locale', () => {
    test('formats an ISO string', () => {
        expect(formatDateTime('2026-03-04T10:30:00Z', { locale: 'en-GB' })).toContain('2026')
    })

    test('respects the locale', () => {
        const value = '2026-03-04T10:30:00Z'
        expect(formatDateTime(value, { locale: 'en-US' })).not.toBe(
            formatDateTime(value, { locale: 'de-DE' })
        )
    })

    test('accepts a Date, and a timestamp', () => {
        const stamp = Date.UTC(2026, 2, 4)
        expect(formatDateTime(new Date(stamp), { locale: 'en-GB' })).toBe(
            formatDateTime(stamp, { locale: 'en-GB' })
        )
    })

    test('applies Intl options when given', () => {
        expect(
            formatDateTime('2026-03-04T10:30:00Z', {
                locale: 'en-GB',
                format: { year: 'numeric', timeZone: 'UTC' }
            })
        ).toBe('2026')
    })

    test.each([
        ['undefined', undefined],
        // eslint-disable-next-line unicorn/no-null -- null handling is what this case tests
        ['null', null],
        ['empty string', ''],
        ['an unparseable string', 'not a date']
    ])('falls back for %s', (_label, value) => {
        // "Invalid Date" is a string no user should ever be shown
        expect(formatDateTime(value)).toBe('—')
    })

    test('accepts a custom fallback', () => {
        expect(formatDateTime(undefined, { empty: 'N/A' })).toBe('N/A')
    })
})
