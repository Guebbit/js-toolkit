import { match } from '../src'

describe('(match) Check 2 strings', () => {
    test('[case insensitive] Check if they are the same string', () => {
        expect(match('lorem ipsum', 'Lorem Ipsum')).toBeTruthy()
    })

    test('[case sensitive] Check if they are the same string', () => {
        expect(match('lorem ipsum', 'Lorem Ipsum', true)).toBeFalsy()
    })

    test('[distance -1, case insensitive] 1-way check if 1° parameter is substring contained in the 2°', () => {
        expect(match('Ipsum', 'lorem ipsum sit dolor')).toBeTruthy()
    })

    test('[distance -1, case sensitive] 1-way check if 1° parameter is substring contained in the 2°', () => {
        expect(match('Ipsum', 'lorem ipsum sit dolor', true)).toBeFalsy()
    })

    test('[distance -2] 2-way Check substring contained in a string', () => {
        expect(
            match('Ipsum', 'lorem ipsum sit dolor', false, -2) &&
                match('lorem ipsum sit dolor', 'Ipsum', false, -2)
        ).toBeTruthy()
    })

    test('[distance 2, case insensitive] Check if they are similar (Levenshtein Distance)', () => {
        expect(match('lorem ipsum', 'lorem ispum', false, 2)).toBeTruthy()
    })

    test('[distance 4, case sensitive] Check if they are similar (sensitive count as distance)', () => {
        expect(match('lorem ipsum', 'Lorem Ispum', true, 4)).toBeTruthy()
    })

    test('Returns false for clearly different strings', () => {
        expect(match('abc', 'xyz')).toBe(false)
    })

    test('Trims whitespace on both operands', () => {
        expect(match('  lorem  ', 'lorem')).toBe(true)
        // distance 0 so the substring fallback cannot mask a missing trim
        expect(match('lorem', 'lorem  ', false, 0)).toBe(true)
    })

    test('Uses empty-string defaults for missing arguments', () => {
        expect(match()).toBe(true)
        expect(match('here')).toBe(false)
    })

    test('[distance 0] Requires an exact match', () => {
        expect(match('abc', 'abc', false, 0)).toBe(true)
        expect(match('abc', 'abd', false, 0)).toBe(false)
    })

    test('[distance -2] Only matches on real substrings', () => {
        expect(match('abc', 'xyz', false, -2)).toBe(false)
    })

    test('Substring matching does not apply outside distance -1/-2 modes', () => {
        expect(match('lorem ipsum', 'ipsum', true, 0)).toBe(false)
    })

    test('Fuzzy match fails when the distance is exceeded', () => {
        expect(match('lorem', 'xxxxx', false, 2)).toBe(false)
    })
})
