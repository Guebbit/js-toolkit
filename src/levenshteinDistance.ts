/*
	Copyright (c) 2011 Andrei Mackenzie
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Number of single-character edits needed to turn one string into the other.
 *
 * This is a true metric: never negative, symmetric, zero exactly when the two
 * are equal, and obeying the triangle inequality. Absent and empty strings are
 * treated as the empty string, so comparing two of them is 0 — they really are
 * identical, and any other answer would break `d(x, x) === 0` and mislead a
 * caller filtering on `distance <= threshold`.
 *
 * @param a - string to check
 * @param b - same as above, order is not important
 */
export default (a?: string | null, b?: string | null): number => {
    // Not default parameters: those only fire for undefined, and null has to
    // collapse to the empty string too.
    /* eslint-disable unicorn/prefer-default-parameters */
    const first = a ?? ''
    const second = b ?? ''
    /* eslint-enable unicorn/prefer-default-parameters */

    // Mutation testing: all three of these early returns have surviving mutants
    // and all three are equivalent. Equal strings walk the matrix to 0 anyway,
    // and an empty side leaves the inner loop with nothing to do, so the matrix
    // already returns the other length. They are shortcuts, not behaviour.
    // Do not chase them.
    if (first === second) return 0
    if (first.length === 0) return second.length
    if (second.length === 0) return first.length

    const matrix: number[][] = []
    let index: number, index_: number

    // increment along the first column of each row
    for (index = 0; index <= second.length; index++) matrix[index] = [index]
    // increment each column in the first row
    for (index_ = 0; index_ <= first.length; index_++) matrix[0][index_] = index_

    // Fill in the rest of the matrix
    for (index = 1; index <= second.length; index++)
        for (index_ = 1; index_ <= first.length; index_++)
            matrix[index][index_] =
                second.charAt(index - 1) === first.charAt(index_ - 1)
                    ? matrix[index - 1][index_ - 1]
                    : Math.min(
                          matrix[index - 1][index_ - 1] + 1, // substitution
                          matrix[index][index_ - 1] + 1, // insertion
                          matrix[index - 1][index_] + 1 // deletion
                      )

    return matrix[second.length][first.length]
}
