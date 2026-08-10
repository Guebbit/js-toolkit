/**
 * Distance between two numbers.
 *
 * With {size} <= 0 this is the plain linear distance |a - b|.
 * With a positive {size} the numbers live on a circle of circumference {size}
 * (an angle in degrees, a looping timeline, a wrapping map axis), so the
 * distance is the shorter of the two ways around and never exceeds {size} / 2.
 *
 * The result is always non-negative: it is a distance, and callers such as
 * {getMapDistance} feed it straight into Math.hypot.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} size - circumference of the wrapping space, 0 for a linear one
 */
export default (a: number, b: number, size = 0): number => {
    const delta = Math.abs(a - b)
    if (size <= 0) return delta
    // reduce first: a gap wider than the space itself wraps around more than once
    const wrapped = delta % size
    return Math.min(wrapped, size - wrapped)
}
