import { timeToSeconds } from '../src'

describe("(timeToSeconds) Transform 'HH:MM:SS:ms' string in milliseconds integer", () => {
    test('default', () => {
        expect(timeToSeconds('14:30:20:50')).toBe(52_220_050)
    })

    test('without milliseconds', () => {
        expect(timeToSeconds('14:30:20')).toBe(52_220_000)
    })

    test('minutes and hours only', () => {
        expect(timeToSeconds('14:30')).toBe(52_200_000)
    })

    test('hours only', () => {
        expect(timeToSeconds('14')).toBe(50_400_000)
    })

    // The parameter defaults to an empty string, so calling with no argument has
    // to mean "no time at all". Returning NaN instead would spread silently
    // through any sum the caller feeds it into.
    test('returns zero when called with no argument', () => {
        expect(timeToSeconds()).toBe(0)
    })

    test('returns zero for an empty string', () => {
        expect(timeToSeconds('')).toBe(0)
        expect(timeToSeconds('', '-')).toBe(0)
    })

    // A blank component is an absent one, not a broken one.
    test('treats a blank component as zero', () => {
        expect(timeToSeconds(':30')).toBe(1_800_000)
        expect(timeToSeconds('14::20')).toBe(50_420_000)
        expect(timeToSeconds('  :30')).toBe(1_800_000)
    })

    // Garbage that is actually present stays NaN: silently reading it as zero
    // would turn a typo into a plausible-looking duration.
    test('returns NaN for a component that is present but not a number', () => {
        expect(timeToSeconds('lorem:30')).toBeNaN()
    })

    test('honours a custom delimiter', () => {
        expect(timeToSeconds('14-30-20', '-')).toBe(52_220_000)
    })

    // parseInt reads the leading digits and stops, so a string split on the
    // wrong delimiter degrades to its first number instead of failing loudly.
    // Pinned because it looks like a bug at a glance and is not one.
    test('reads only the leading number when the delimiter does not match', () => {
        expect(timeToSeconds('14:30', '-')).toBe(50_400_000)
    })

    test('ignores components past the milliseconds slot', () => {
        expect(timeToSeconds('14:30:20:50:99')).toBe(52_220_050)
    })

    test('accepts a leading zero without reading it as octal', () => {
        expect(timeToSeconds('08:09')).toBe(29_340_000)
    })
})
