/**
 * Check if 2 ranges overlap,
 * then return the START and END period of the overlap
 *
 * The overlap is the intersection: it starts at the later of the two starts and
 * ends at the earlier of the two ends. The result is the same whichever range is
 * passed first.
 *
 * WARNING: ranges that merely touch (A ends exactly where B starts) are NOT an
 * overlap, so [0, 0] is returned. [0, 0] is the "no overlap" answer and can
 * never be a real intersection, which always has a strictly positive width.
 *
 * https://www.get-digital-help.com/days-contained-in-a-range-that-overlap-another-range/
 * https://www.codeproject.com/Articles/168662/Time-Period-Library-for-NET
 *
 * @param {number} firstStart  - A1
 * @param {number} firstEnd    - A2
 * @param {number} secondStart - B1
 * @param {number} secondEnd   - B2
 * @return {[number, number]}
 */
export default (
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number
): [number, number] => {
    const start = Math.max(firstStart, secondStart)
    const end = Math.min(firstEnd, secondEnd)
    return end > start ? [start, end] : [0, 0]
}
