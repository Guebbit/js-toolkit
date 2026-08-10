import { levenshteinDistance } from '../src'

describe('(levenshteinDistance) Levenshtein Distance from 2 strings (0)', () => {
    test('Same string', () => {
        expect(levenshteinDistance('lorem ipsum', 'lorem ipsum')).toBe(0)
    })
    test('Same strings but 1 is capitalized (2)', () => {
        expect(levenshteinDistance('lorem ipsum', 'Lorem Ipsum')).toBe(2)
    })
    test('Very similar strings (2)', () => {
        expect(levenshteinDistance('lorem ipsum', 'lorem pisum')).toBe(2)
    })
    test('A little more different strings (4)', () => {
        expect(levenshteinDistance('lorem ipsum', 'melor ipsum')).toBe(4)
    })
    test('Completely different strings (11)', () => {
        expect(levenshteinDistance('lorem ipsum', 'DOLOR')).toBe(11)
    })
    test('An empty string (11)', () => {
        expect(levenshteinDistance('lorem ipsum', '')).toBe(11)
    })
    test('A missing string (11)', () => {
        expect(levenshteinDistance('lorem ipsum')).toBe(11)
    })

    // Two absent strings return a large sentinel, not 0. Returning 0 would say
    // "identical" and a caller filtering on `distance <= 2` would treat two
    // blank fields as a match. Pinned because the value is arbitrary and would
    // otherwise be free to drift.
    test('Both strings missing or empty (999 sentinel)', () => {
        expect(levenshteinDistance()).toBe(999)
        expect(levenshteinDistance('', '')).toBe(999)
        // eslint-disable-next-line unicorn/no-null
        expect(levenshteinDistance(null, null)).toBe(999)
    })
})
