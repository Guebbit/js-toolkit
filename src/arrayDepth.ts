/**
 * @module
 * Measures nesting depth by recursing into array elements: a non-array is
 * depth 0, and an array's depth is one more than its deepest element.
 */

/**
 * Get the nesting depth of a (possibly nested) array.
 *
 * @param check - value to measure; a non-array is depth 0
 * @returns 0 for a non-array, otherwise 1 plus the deepest nested array's depth
 */
function arrayDepth<T>(check: T | T[]): number {
    return Array.isArray(check)
        ? 1 + Math.max(0, ...check.map((element) => arrayDepth(element)))
        : 0
}

export default arrayDepth
