import { match } from '../src'

describe('(match) compare two strings under one of several rules', () => {
    // Equality satisfies every mode, so it is checked before the mode branches.
    test('a string matches itself in every mode', () => {
        for (const mode of ['exact', 'contains', 'contained', 'either', 'fuzzy'] as const)
            expect(match('lorem', 'lorem', { mode })).toBe(true)
    })

    describe('case sensitivity', () => {
        test('folds case by default', () => {
            expect(match('lorem ipsum', 'Lorem Ipsum', { mode: 'exact' })).toBe(true)
        })

        test('respects case when asked', () => {
            expect(match('lorem ipsum', 'Lorem Ipsum', { mode: 'exact', sensitive: true })).toBe(
                false
            )
        })
    })

    test('trims whitespace on both operands', () => {
        expect(match('  lorem  ', 'lorem', { mode: 'exact' })).toBe(true)
        expect(match('lorem', '\tlorem\n', { mode: 'exact' })).toBe(true)
    })

    describe("mode 'exact'", () => {
        test('requires equality and nothing less', () => {
            expect(match('abc', 'abc', { mode: 'exact' })).toBe(true)
            expect(match('abc', 'abd', { mode: 'exact' })).toBe(false)
            // a substring is not an exact match, whichever way round
            expect(match('ipsum', 'lorem ipsum', { mode: 'exact' })).toBe(false)
            expect(match('lorem ipsum', 'ipsum', { mode: 'exact' })).toBe(false)
        })
    })

    describe("mode 'contained' (the default)", () => {
        test('is the default when no mode is given', () => {
            expect(match('Ipsum', 'lorem ipsum sit dolor')).toBe(true)
            expect(match('lorem ipsum sit dolor', 'Ipsum')).toBe(false)
        })

        test('asks whether the first is inside the second', () => {
            expect(match('ipsum', 'lorem ipsum', { mode: 'contained' })).toBe(true)
            expect(match('lorem ipsum', 'ipsum', { mode: 'contained' })).toBe(false)
        })
    })

    describe("mode 'contains'", () => {
        // The mirror of 'contained'. The old numeric API had no way to ask this.
        test('asks whether the first holds the second', () => {
            expect(match('lorem ipsum', 'ipsum', { mode: 'contains' })).toBe(true)
            expect(match('ipsum', 'lorem ipsum', { mode: 'contains' })).toBe(false)
        })
    })

    describe("mode 'either'", () => {
        test('accepts containment in either direction', () => {
            expect(match('Ipsum', 'lorem ipsum sit dolor', { mode: 'either' })).toBe(true)
            expect(match('lorem ipsum sit dolor', 'Ipsum', { mode: 'either' })).toBe(true)
        })

        test('still rejects unrelated strings', () => {
            expect(match('abc', 'xyz', { mode: 'either' })).toBe(false)
        })
    })

    describe("mode 'fuzzy'", () => {
        test('accepts within the allowed edit distance', () => {
            expect(match('lorem ipsum', 'lorem ispum', { mode: 'fuzzy', maxDistance: 2 })).toBe(
                true
            )
        })

        test('rejects beyond it', () => {
            expect(match('lorem', 'xxxxx', { mode: 'fuzzy', maxDistance: 2 })).toBe(false)
        })

        // maxDistance defaults to 0, so fuzzy without one means exact.
        test('requires equality when no distance is allowed', () => {
            expect(match('abc', 'abd', { mode: 'fuzzy' })).toBe(false)
            expect(match('abc', 'abc', { mode: 'fuzzy' })).toBe(true)
        })

        test('counts a case difference as an edit only when sensitive', () => {
            expect(
                match('lorem ipsum', 'Lorem Ispum', {
                    mode: 'fuzzy',
                    maxDistance: 4,
                    sensitive: true
                })
            ).toBe(true)
            expect(
                match('lorem ipsum', 'Lorem Ispum', {
                    mode: 'fuzzy',
                    maxDistance: 1,
                    sensitive: true
                })
            ).toBe(false)
        })

        // Substring rules belong to their own modes and must not leak in here,
        // or a caller asking for a tight distance silently gets a loose match.
        test('does not accept a substring that is far away', () => {
            expect(
                match('ipsum', 'lorem ipsum dolor sit amet', { mode: 'fuzzy', maxDistance: 1 })
            ).toBe(false)
        })
    })

    test('uses empty-string defaults for missing arguments', () => {
        expect(match()).toBe(true)
        expect(match('here')).toBe(false)
    })

    test('returns false for clearly different strings', () => {
        expect(match('abc', 'xyz')).toBe(false)
    })
})
