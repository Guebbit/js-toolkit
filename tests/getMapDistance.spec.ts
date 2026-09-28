import { getMapDistance } from '../src'

describe('(getMapDistance) distance between two points on a map', () => {
    test('is zero for the same point', () => {
        expect(getMapDistance(40, 40, 70, 70)).toBe(0)
    })

    // Plain Pythagoras on an unbounded map. Pinning a 3-4-5 triangle makes a
    // swapped-argument regression visible as a wrong number, not just a
    // different-looking one.
    test('is the Pythagorean distance on an unbounded map', () => {
        expect(getMapDistance(0, 3, 0, 4)).toBe(5)
    })

    test('measures along a single axis when the other does not move', () => {
        expect(getMapDistance(10, 25, 5, 5)).toBe(15)
        expect(getMapDistance(5, 5, 10, 25)).toBe(15)
    })

    // The X pair and the Y pair must reach getDelta as pairs. Feeding it
    // (size, Xa, Xb) instead mixes the map size into a coordinate and returns
    // 417.73 here rather than 22.36.
    test('pairs each axis correctly', () => {
        expect(getMapDistance(40, 50, 70, 50, 400)).toBeCloseTo(22.36, 2)
        // the map size must not change a distance that never reaches an edge
        expect(getMapDistance(40, 50, 70, 50)).toBeCloseTo(22.36, 2)
    })

    test('is never negative', () => {
        expect(getMapDistance(50, 40, 50, 70, 400)).toBeGreaterThanOrEqual(0)
    })

    // On a wrapping map the short way out of one edge and in through the
    // opposite one is the real distance.
    test('measures across the map edge when that is shorter', () => {
        expect(getMapDistance(5, 95, 0, 0, 100)).toBe(10)
        expect(getMapDistance(0, 0, 5, 95, 100)).toBe(10)
        expect(getMapDistance(5, 95, 5, 95, 100)).toBeCloseTo(Math.hypot(10, 10), 10)
    })

    test('is symmetric in the two points', () => {
        expect(getMapDistance(12, 87, 34, 65, 100)).toBe(getMapDistance(87, 12, 65, 34, 100))
    })
})
