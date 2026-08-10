import levenshteinDistance from './levenshteinDistance.js'

export type TMatchMode = 'exact' | 'contains' | 'contained' | 'either' | 'fuzzy'

export interface IMatchOptions {
    // compare with case sensitivity, off by default
    sensitive?: boolean
    // how the two strings are compared, see TMatchMode
    mode?: TMatchMode
    // maximum edit distance accepted in 'fuzzy' mode
    maxDistance?: number
}

/**
 * Compare two strings under one of several rules.
 *
 * Both sides are trimmed first, and lowercased unless {sensitive} is set. The
 * mode says what "match" means:
 *
 *  exact     - the two are equal
 *  contains  - {check} contains {against}
 *  contained - {check} is contained in {against} (default)
 *  either    - one contains the other, whichever way round
 *  fuzzy     - their edit distance is at most {maxDistance}
 *
 * @param check
 * @param against - same role, order only matters for the one-way modes
 * @param options
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
