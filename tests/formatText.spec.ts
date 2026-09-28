import { formatText } from '../src'

describe('(formatText) Show a string, or a fallback glyph when there is nothing to show', () => {
    test('returns the text when there is some', () => {
        expect(formatText('Hello')).toBe('Hello')
    })

    test('preserves surrounding whitespace of a non-empty value', () => {
        expect(formatText(' Hello ')).toBe(' Hello ')
    })

    test.each([
        ['undefined', undefined],
        // eslint-disable-next-line unicorn/no-null -- null handling is what this case tests
        ['null', null],
        ['empty string', ''],
        ['whitespace only', '   '],
        ['a tab', '\t']
    ])('falls back for %s', (_label, value) => {
        // whitespace renders as an empty cell that looks like a layout bug, not like missing data
        expect(formatText(value)).toBe('—')
    })

    test('accepts a custom fallback', () => {
        expect(formatText(undefined, 'N/A')).toBe('N/A')
    })
})
