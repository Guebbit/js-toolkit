import { getOverlapRange } from '../src'

describe('(getOverlapRange) check if 2 range overlap then return the START and END period of the overlap', () => {
    test('Same time', () => {
        expect(getOverlapRange(50, 100, 50, 100)).toEqual([50, 100])
    })

    test('No intersection', () => {
        expect(getOverlapRange(50, 100, 150, 200)).toEqual([0, 0])
    })

    test('No intersection (same number, same unit DO overlap)', () => {
        expect(getOverlapRange(50, 100, 100, 200)).toEqual([0, 0])
    })

    test('A starts in B  || B ends in A', () => {
        expect(getOverlapRange(150, 300, 100, 200)).toEqual([150, 200])
    })

    test('A ends in B || B starts in A', () => {
        expect(getOverlapRange(50, 100, 80, 200)).toEqual([80, 100])
    })

    test('A in B', () => {
        expect(getOverlapRange(50, 100, 10, 200)).toEqual([50, 100])
    })

    test('B in A', () => {
        expect(getOverlapRange(50, 100, 70, 80)).toEqual([70, 80])
    })

    // Regression, from a fast-check counterexample: [0,2] vs [0,1].
    // Two ranges that share a start (or an end) are a genuine overlap, and the
    // answer must not depend on which one is passed first. Shared-endpoint pairs
    // are the common case in practice — a day range against a week range, an
    // event against the calendar slot it opens.
    test('reports the same overlap for ranges sharing a start, in both argument orders', () => {
        expect(getOverlapRange(0, 2, 0, 1)).toEqual([0, 1])
        expect(getOverlapRange(0, 1, 0, 2)).toEqual([0, 1])
    })

    test('reports the same overlap for ranges sharing an end, in both argument orders', () => {
        expect(getOverlapRange(0, 10, 5, 10)).toEqual([5, 10])
        expect(getOverlapRange(5, 10, 0, 10)).toEqual([5, 10])
    })

    // A range with no width cannot overlap anything, itself included: an
    // intersection always has a strictly positive width.
    test('reports a zero-width range as no overlap', () => {
        expect(getOverlapRange(50, 50, 50, 50)).toEqual([0, 0])
    })
})
