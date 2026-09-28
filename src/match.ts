import levenshteinDistance from './levenshteinDistance.js'

/**
 * @module
 * String comparison against one of several rules, all run on trimmed and (by default)
 * lowercased text. `fuzzy` mode delegates the distance math to {@link levenshteinDistance}.
 */

/**
 * How two strings are compared.
 *
 * `exact` — the two are equal.
 * `contains` — `check` contains `against`.
 * `contained` — `check` is contained in `against` (default).
 * `either` — one contains the other, whichever way round.
 * `fuzzy` — their edit distance is at most `maxDistance`.
 */
export type TMatchMode = 'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'

/**
 * Options controlling how two strings are compared.
 */
export interface IMatchOptions {
    /**
     * Compare with case sensitivity, off by default.
     */
    sensitive?: boolean
    /**
     * How the two strings are compared, see {@link TMatchMode}.
     */
    mode?: TMatchMode
    /**
     * Maximum edit distance accepted in `fuzzy` mode.
     */
    maxDistance?: number
}

/**
 * Compare two strings under one of several rules.
 *
 * Both sides are trimmed first, and lowercased unless `sensitive` is set. See
 * {@link TMatchMode} for what each mode means.
 *
 * @param check - string being checked
 * @param against - string compared against, order only matters for the one-way modes
 * @param options - comparison rules
 */
export default (check = '', against = '', options: IMatchOptions = {}): boolean => {
    const { sensitive = false, mode = 'contained', maxDistance = 0 } = options

    let first = check.trim()
    let second = against.trim()
    if (!sensitive) {
        first = first.toLowerCase()
        second = second.toLowerCase()
    }

    // Equality satisfies every mode, so it is answered once up front rather
    // than repeated in each branch.
    if (first === second) return true

    switch (mode) {
        case 'exact': {
            return false
        }
        case 'contains': {
            return first.includes(second)
        }
        case 'contained': {
            return second.includes(first)
        }
        case 'either': {
            return first.includes(second) || second.includes(first)
        }
        case 'fuzzy': {
            return levenshteinDistance(first, second) <= maxDistance
        }
    }
}
