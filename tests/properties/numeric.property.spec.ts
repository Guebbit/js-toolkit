import fc from 'fast-check'
import { getDelta, getMapDistance, getOverlapRange, rangeOverlaps } from '../../src'

// Integers keep the assertions exact: a float generator would force every
// equality into a tolerance and hide off-by-a-little errors behind it.
const coordinate = fc.integer({ min: -10_000, max: 10_000 })
const circumference = fc.integer({ min: 1, max: 10_000 })

// An ordered pair, so a "range" is always start <= end. Ranges with the ends
// the wrong way round are a caller error, not a contract this function has.
const range = fc
    .tuple(fc.integer({ min: -1000, max: 1000 }), fc.integer({ min: -1000, max: 1000 }))
    .map(([a, b]): [number, number] => [Math.min(a, b), Math.max(a, b)])

describe('(getDelta) properties', () => {
    test('is never negative', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                fc.integer({ min: -100, max: 10_000 }),
                (a, b, s) => getDelta(a, b, s) >= 0
            )
        )
    })

    test('is symmetric in its two operands', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                fc.integer({ min: 0, max: 10_000 }),
                (a, b, s) => getDelta(a, b, s) === getDelta(b, a, s)
            )
        )
    })

    test('is zero exactly when the two operands are equal, on a linear space', () => {
        fc.assert(
            fc.property(coordinate, coordinate, (a, b) => (getDelta(a, b) === 0) === (a === b))
        )
    })

    // The distance depends on the gap, not on where the pair sits. This is what
    // separates a distance from an arbitrary arithmetic expression on a and b.
    test('is invariant under translating both operands', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                coordinate,
                (a, b, shift) => getDelta(a + shift, b + shift) === getDelta(a, b)
            )
        )
    })

    test('equals the absolute difference on a linear space', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                fc.integer({ min: -1000, max: 0 }),
                (a, b, s) => getDelta(a, b, s) === Math.abs(a - b)
            )
        )
    })

    // The defining bound of a wrapping space: you can always reach the other
    // point in at most half a lap. Any implementation that forgets to compare
    // both routes breaks this.
    test('never exceeds half the circumference on a wrapping space', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                circumference,
                (a, b, size) => getDelta(a, b, size) <= size / 2
            )
        )
    })

    test('is unchanged by moving an operand a whole number of laps', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                circumference,
                fc.integer({ min: -5, max: 5 }),
                (a, b, size, laps) => getDelta(a + laps * size, b, size) === getDelta(a, b, size)
            )
        )
    })

    test('is never longer than the linear distance', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                circumference,
                (a, b, size) => getDelta(a, b, size) <= getDelta(a, b)
            )
        )
    })
})

describe('(getMapDistance) properties', () => {
    test('is never negative', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                coordinate,
                coordinate,
                fc.integer({ min: 0, max: 10_000 }),
                (xa, xb, ya, yb, size) => getMapDistance(xa, xb, ya, yb, size) >= 0
            )
        )
    })

    test('is zero for a point measured against itself', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                fc.integer({ min: 0, max: 10_000 }),
                (x, y, size) => getMapDistance(x, x, y, y, size) === 0
            )
        )
    })

    test('is symmetric in the two points', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                coordinate,
                coordinate,
                fc.integer({ min: 0, max: 10_000 }),
                (xa, xb, ya, yb, size) =>
                    getMapDistance(xa, xb, ya, yb, size) === getMapDistance(xb, xa, yb, ya, size)
            )
        )
    })

    // Cross-checks the X pair against the Y pair. Passing the arguments to
    // getDelta in the wrong groups still produces a plausible-looking number,
    // but not this one.
    test('is the Euclidean distance on an unbounded map', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                coordinate,
                coordinate,
                (xa, xb, ya, yb) =>
                    Math.abs(getMapDistance(xa, xb, ya, yb) - Math.hypot(xa - xb, ya - yb)) < 1e-9
            )
        )
    })

    test('wrapping never makes a distance longer', () => {
        fc.assert(
            fc.property(
                coordinate,
                coordinate,
                coordinate,
                coordinate,
                circumference,
                (xa, xb, ya, yb, size) =>
                    getMapDistance(xa, xb, ya, yb, size) <= getMapDistance(xa, xb, ya, yb) + 1e-9
            )
        )
    })
})

describe('(rangeOverlaps) properties', () => {
    test('is never negative', () => {
        fc.assert(
            fc.property(
                range,
                range,
                fc.boolean(),
                ([a1, a2], [b1, b2], same) => rangeOverlaps(a1, a2, b1, b2, same) >= 0
            )
        )
    })

    test('is symmetric in the two ranges', () => {
        fc.assert(
            fc.property(
                range,
                range,
                fc.boolean(),
                ([a1, a2], [b1, b2], same) =>
                    rangeOverlaps(a1, a2, b1, b2, same) === rangeOverlaps(b1, b2, a1, a2, same)
            )
        )
    })

    // An overlap is a shared piece of both ranges, so it cannot be bigger than
    // the smaller one. A sign error or a swapped min/max breaks this immediately.
    test('never exceeds the length of the shorter range', () => {
        fc.assert(
            fc.property(
                range,
                range,
                ([a1, a2], [b1, b2]) => rangeOverlaps(a1, a2, b1, b2) <= Math.min(a2 - a1, b2 - b1)
            )
        )
    })

    test('is the full length when a range is measured against itself', () => {
        fc.assert(fc.property(range, ([a1, a2]) => rangeOverlaps(a1, a2, a1, a2) === a2 - a1))
    })

    test('is zero for ranges that do not reach each other', () => {
        fc.assert(
            fc.property(
                range,
                fc.integer({ min: 1, max: 500 }),
                fc.integer({ min: 0, max: 500 }),
                ([a1, a2], gap, length_) =>
                    rangeOverlaps(a1, a2, a2 + gap, a2 + gap + length_) === 0
            )
        )
    })

    test('counting the shared unit adds exactly one to a real overlap', () => {
        fc.assert(
            fc.property(range, range, ([a1, a2], [b1, b2]) => {
                const plain = rangeOverlaps(a1, a2, b1, b2)
                const inclusive = rangeOverlaps(a1, a2, b1, b2, true)
                return plain > 0 ? inclusive === plain + 1 : inclusive <= 1
            })
        )
    })
})

describe('(getOverlapRange) properties', () => {
    // The bug this pins: ranges sharing a start or an end used to be reported as
    // overlapping in one argument order and not overlapping in the other.
    test('is symmetric in the two ranges', () => {
        fc.assert(
            fc.property(range, range, ([a1, a2], [b1, b2]) => {
                expect(getOverlapRange(a1, a2, b1, b2)).toEqual(getOverlapRange(b1, b2, a1, a2))
            })
        )
    })

    test('returns a range contained in both inputs whenever it reports an overlap', () => {
        fc.assert(
            fc.property(range, range, ([a1, a2], [b1, b2]) => {
                const [start, end] = getOverlapRange(a1, a2, b1, b2)
                if (start === 0 && end === 0) return true
                return start >= a1 && start >= b1 && end <= a2 && end <= b2
            })
        )
    })

    test('never returns an inverted or empty range', () => {
        fc.assert(
            fc.property(range, range, ([a1, a2], [b1, b2]) => {
                const [start, end] = getOverlapRange(a1, a2, b1, b2)
                return (start === 0 && end === 0) || end > start
            })
        )
    })

    // The two range functions must agree: the width of the intersection is the
    // number of overlapping units. Either one drifting from the other is a bug
    // in whichever moved.
    test('its width agrees with rangeOverlaps', () => {
        fc.assert(
            fc.property(range, range, ([a1, a2], [b1, b2]) => {
                const [start, end] = getOverlapRange(a1, a2, b1, b2)
                return end - start === rangeOverlaps(a1, a2, b1, b2)
            })
        )
    })

    test('returns the range itself when measured against itself', () => {
        fc.assert(
            fc.property(range, ([a1, a2]) => {
                const expected: [number, number] = a2 > a1 ? [a1, a2] : [0, 0]
                expect(getOverlapRange(a1, a2, a1, a2)).toEqual(expected)
            })
        )
    })
})
