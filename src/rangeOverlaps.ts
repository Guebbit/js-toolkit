/**
 * @module
 * Interval overlap as a magnitude: the distance between the closer end and the further
 * start, clamped to zero when the ranges do not intersect at all.
 */

/**
 * Check whether two ranges overlap, and by how many units.
 *
 * WARNING: if B starts right where A ends (the same boundary number), this counts as an
 * overlap of 1 unit. For some data (dates, for example) that boundary should not count,
 * and `sameUnitOverlap` controls it.
 *
 * @param firstStart - start of range A
 * @param firstEnd - end of range A
 * @param secondStart - start of range B
 * @param secondEnd - end of range B
 * @param sameUnitOverlap - whether touching at the same boundary counts as 1 unit of overlap
 * @returns the number of overlapping units, `0` when the ranges do not overlap
 */
export default (
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number,
    sameUnitOverlap = false
): number => {
    return Math.max(
        Math.min(firstEnd, secondEnd) -
            Math.max(firstStart, secondStart) +
            (sameUnitOverlap ? 1 : 0),
        0
    )
}
