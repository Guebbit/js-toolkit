/**
 * @module
 * Slices an object the way `Array.prototype.slice` slices an array: own keys
 * are counted in enumeration order, and only the ones whose index falls in
 * range make it into the result. Inherited keys never count.
 */

/**
 * Slice an object to only the own properties whose enumeration index falls
 * within `[start, end)`, mirroring `Array.prototype.slice`.
 *
 * @param object - object to slice
 * @param start - start index of the slice, inclusive
 * @param end - end index of the slice, exclusive
 * @returns a new object containing only the selected properties
 */
export default (
    object: Record<string, unknown>,
    start: number,
    end: number
): Record<string, unknown> => {
    const sliced: Record<string, unknown> = {}
    let index = 0
    for (const k in object) {
        if (Object.prototype.hasOwnProperty.call(object, k)) {
            if (index >= start && index < end) {
                sliced[k] = object[k]
            }
            index++
        }
    }
    return sliced
}
