import { getDelta } from '../src'

describe('(getDelta) distance between two numbers, optionally on a wrapping space', () => {
    describe('linear space (size omitted or non-positive)', () => {
        test('is the absolute difference', () => {
            expect(getDelta(40, 70)).toBe(30)
            expect(getDelta(70, 40)).toBe(30)
        })

        // A distance feeds Math.hypot in getMapDistance; a negative one would
        // still square to a positive and silently inflate the result.
        test('is never negative, whichever argument is larger', () => {
            expect(getDelta(1, 9)).toBeGreaterThanOrEqual(0)
            expect(getDelta(9, 1)).toBeGreaterThanOrEqual(0)
            expect(getDelta(-5, 5)).toBe(10)
        })

        test('is zero for identical numbers', () => {
            expect(getDelta(7, 7)).toBe(0)
        })

        // A negative circumference describes no space; it must not flip the sign
        // of the result the way arithmetic on a raw `size` would.
        test('treats a negative size as linear', () => {
            expect(getDelta(40, 70, -400)).toBe(30)
        })
    })

    describe('wrapping space (positive size)', () => {
        test('takes the direct route when it is the shorter one', () => {
            expect(getDelta(40, 70, 400)).toBe(30)
        })

        // The whole point of `size`: on a circle of 360, 350 and 10 are 20 apart,
        // not 340. Without the wrap branch this returns 340.
        test('takes the route across the boundary when it is the shorter one', () => {
            expect(getDelta(350, 10, 360)).toBe(20)
        })

        test('never exceeds half the circumference', () => {
            expect(getDelta(0, 180, 360)).toBe(180)
            expect(getDelta(0, 200, 360)).toBe(160)
        })

        // Two points exactly opposite each other are equidistant both ways;
        // the value must not depend on which branch of Math.min wins.
        test('is half the circumference for diametrically opposite points', () => {
            expect(getDelta(0, 50, 100)).toBe(50)
        })

        test('reduces a gap wider than the space itself', () => {
            // 810 apart on a circle of 100 is 8 full loops plus 10
            expect(getDelta(0, 810, 100)).toBe(10)
            // an exact number of loops lands back on the same point
            expect(getDelta(0, 800, 100)).toBe(0)
        })

        test('is symmetric', () => {
            expect(getDelta(350, 10, 360)).toBe(getDelta(10, 350, 360))
        })
    })
})
