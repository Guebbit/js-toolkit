import { formatDuration } from '../src'

describe('(formatDuration) Render a duration compactly', () => {
    test.each([
        [0, '0m'],
        [59, '0m'],
        [300, '5m'],
        [3600, '1h 0m'],
        [7500, '2h 5m']
    ])('renders %i seconds as %s', (seconds, expected) => {
        expect(formatDuration(seconds)).toBe(expected)
    })

    test('drops leading zero units but never the smallest one', () => {
        expect(formatDuration(300)).toBe('5m')
        expect(formatDuration(0)).toBe('0m')
    })

    test('the largest requested unit absorbs everything above it', () => {
        // three days, rendered in hours because days were not asked for
        expect(formatDuration(3 * 86_400 + 5 * 60)).toBe('72h 5m')
    })

    test('breaks out the larger unit once it is listed', () => {
        expect(formatDuration(3 * 86_400 + 5 * 60, { units: ['days', 'hours', 'minutes'] })).toBe(
            '3d 0h 5m'
        )
    })

    test('honours a single-unit list', () => {
        expect(formatDuration(7500, { units: ['minutes'] })).toBe('125m')
        expect(formatDuration(7500, { units: ['seconds'] })).toBe('7500s')
    })

    test.each([
        ['a negative duration', -100],
        ['NaN', Number.NaN],
        ['Infinity', Number.POSITIVE_INFINITY]
    ])('treats %s as zero rather than rendering nonsense', (_label, seconds) => {
        expect(formatDuration(seconds)).toBe('0m')
    })

    test('applies units largest first however the caller ordered them', () => {
        expect(formatDuration(7500, { units: ['minutes', 'hours'] })).toBe('2h 5m')
    })

    test('ignores a repeated unit rather than counting it twice', () => {
        expect(formatDuration(7500, { units: ['hours', 'minutes', 'hours'] })).toBe('2h 5m')
    })

    test('renders nothing when no unit was asked for', () => {
        expect(formatDuration(7500, { units: [] })).toBe('')
    })

    test('folds a skipped unit into the next one down instead of losing it', () => {
        // 3 days asked for as days + minutes: the hours have to land somewhere
        expect(formatDuration(3 * 86_400 + 3600, { units: ['days', 'minutes'] })).toBe('3d 60m')
    })

    test('supports the whole unit ladder', () => {
        expect(formatDuration(90 * 86_400, { units: ['months', 'days'] })).toBe('3mo 0d')
        expect(formatDuration(14 * 86_400, { units: ['weeks', 'days'] })).toBe('2w 0d')
        expect(formatDuration(400 * 86_400, { units: ['years', 'days'] })).toBe('1y 35d')
    })
})
