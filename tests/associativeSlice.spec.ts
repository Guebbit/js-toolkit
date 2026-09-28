import { associativeSlice } from '../src'

describe('(associativeSlice) like array.slice() but with associative arrays (objects)', () => {
    const object = {
        lorem: 'ipsum',
        adipiscing: ['elit', 'sed do', 'eiusmod'],
        dolor: {
            sit: 'consectetur'
        },
        elit: 'sed do',
        sit: 'consectetur'
    }

    test('Generic object / associative array', () => {
        expect(associativeSlice(object, 2, 4)).toEqual({
            dolor: {
                sit: 'consectetur'
            },
            elit: 'sed do'
        })
    })

    test('takes from the start when the start index is zero', () => {
        expect(Object.keys(associativeSlice(object, 0, 2))).toEqual(['lorem', 'adipiscing'])
    })

    // The end index is exclusive, matching Array.prototype.slice. Off by one here
    // means every caller silently gets one entry too many or too few.
    test('excludes the entry at the end index', () => {
        expect(Object.keys(associativeSlice(object, 1, 2))).toEqual(['adipiscing'])
    })

    test('stops at the last entry when the end index runs past it', () => {
        expect(Object.keys(associativeSlice(object, 3, 99))).toEqual(['elit', 'sit'])
    })

    test('returns nothing when the start index is past the last entry', () => {
        expect(associativeSlice(object, 99, 200)).toEqual({})
    })

    test('returns nothing for an empty or inverted span', () => {
        expect(associativeSlice(object, 2, 2)).toEqual({})
        expect(associativeSlice(object, 4, 1)).toEqual({})
    })

    // A negative start behaves as 0 rather than counting back from the end:
    // the index counter only ever moves forward, so nothing can match a
    // negative position.
    test('treats a negative start as the beginning', () => {
        expect(Object.keys(associativeSlice(object, -2, 2))).toEqual(['lorem', 'adipiscing'])
    })

    test('returns an empty object for an empty input', () => {
        expect(associativeSlice({}, 0, 5)).toEqual({})
    })

    // Values are carried by reference, so a nested object is the same object.
    // Callers rely on this to slice large structures cheaply.
    test('carries values by reference rather than copying them', () => {
        expect(associativeSlice(object, 2, 3).dolor).toBe(object.dolor)
    })

    test('does not mutate the input', () => {
        const before = { ...object }
        associativeSlice(object, 1, 3)
        expect(object).toEqual(before)
    })

    // Inherited keys are not part of the object's own sequence, so they must not
    // consume a position in the index count either.
    test('ignores inherited properties', () => {
        const child = Object.create({ inherited: 'nope' }) as Record<string, unknown>
        child.first = 1
        child.second = 2
        expect(associativeSlice(child, 0, 2)).toEqual({ first: 1, second: 2 })
        // slot 2 is past the end of the own keys, so nothing inherited slides
        // into it
        expect(associativeSlice(child, 0, 3)).toEqual({ first: 1, second: 2 })
        expect(associativeSlice(child, 2, 3)).toEqual({})
    })
})
