/**
 * @module
 * Splits an array into `n` chunks whose lengths differ by at most one element.
 * An evenly divisible input takes a fast splice-based path; otherwise each pass
 * shrinks the remaining divisor by one, spreading the remainder across the
 * first chunks instead of dumping it all into the last one.
 */

/**
 * Divide an array into `n` sub-arrays, with lengths as close to equal as possible.
 *
 * @param array - array to split
 * @param n - number of chunks
 * @returns `n` chunks in order; an empty array when `n` is less than 1
 */
export default <T>(array: T[], n: number): T[][] => {
    const items = Object.assign([] as T[], array),
        length_ = items.length,
        output: T[][] = []
    let index = 0

    if (n < 1) return []
    if (n < 2) return [items]
    // Mutation testing: the mutants on this branch survive and are meant to.
    // It is a fast path, not a behaviour — the general loop below produces the
    // same chunks for an evenly divisible array, so deleting the branch changes
    // nothing observable. Do not chase it.
    if (length_ % n === 0) {
        const size = Math.floor(length_ / n)
        while (items.length > 0) output.push(items.splice(0, size))
        return output
    }

    while (index < length_)
        output.push(items.slice(index, (index += Math.ceil((length_ - index) / n--))))
    return output
}
