import fc from 'fast-check'
import { coerceStringArray, levenshteinDistance, match } from '../../src'

// Levenshtein is O(a*b); short strings keep the whole file fast enough to stay
// in the pre-commit hook.
const shortString = fc.string({ maxLength: 12 })
const nonEmpty = fc.string({ minLength: 1, maxLength: 12 })
// The metric holds for the empty string too now that it is not a special case
const anyString = fc.string({ maxLength: 12 })

describe('(levenshteinDistance) properties', () => {
    test('is zero exactly when the strings are equal', () => {
        fc.assert(
            fc.property(
                anyString,
                anyString,
                (a, b) => (levenshteinDistance(a, b) === 0) === (a === b)
            )
        )
    })

    // A metric has no exceptions: d(x, x) must be 0 for every x, the empty
    // string included. The old sentinel returned 999 here.
    test('is zero for any string against itself', () => {
        fc.assert(fc.property(anyString, (a) => levenshteinDistance(a, a) === 0))
    })

    test('treats an absent string as the empty string', () => {
        fc.assert(
            fc.property(
                anyString,
                (a) =>
                    levenshteinDistance(a) === levenshteinDistance(a, '') &&
                    // eslint-disable-next-line unicorn/no-null
                    levenshteinDistance(a, null) === levenshteinDistance(a, '')
            )
        )
    })

    test('is symmetric', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                (a, b) => levenshteinDistance(a, b) === levenshteinDistance(b, a)
            )
        )
    })

    test('is never negative', () => {
        fc.assert(fc.property(nonEmpty, nonEmpty, (a, b) => levenshteinDistance(a, b) >= 0))
    })

    // You can always rewrite the shorter string into the longer one by editing
    // every character and appending the rest, so the distance can never beat
    // the longer length. An off-by-one in the matrix walk breaks this.
    test('never exceeds the length of the longer string', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                (a, b) => levenshteinDistance(a, b) <= Math.max(a.length, b.length)
            )
        )
    })

    test('is at least the difference in length', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                (a, b) => levenshteinDistance(a, b) >= Math.abs(a.length - b.length)
            )
        )
    })

    // The triangle inequality is what makes this a metric. It is the single
    // strongest check on the matrix: a wrong cost anywhere makes some triple
    // violate it, and fast-check will find that triple.
    test('satisfies the triangle inequality', () => {
        fc.assert(
            fc.property(
                anyString,
                anyString,
                anyString,
                (a, b, c) =>
                    levenshteinDistance(a, c) <=
                    levenshteinDistance(a, b) + levenshteinDistance(b, c)
            )
        )
    })

    test('is the other string length when one side is empty', () => {
        fc.assert(fc.property(nonEmpty, (a) => levenshteinDistance(a, '') === a.length))
        fc.assert(fc.property(nonEmpty, (a) => levenshteinDistance('', a) === a.length))
    })

    test('appending the same suffix to both strings does not change the distance', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                shortString,
                (a, b, suffix) =>
                    levenshteinDistance(a + suffix, b + suffix) === levenshteinDistance(a, b)
            )
        )
    })
})

describe('(match) properties', () => {
    const modes = ['exact', 'contains', 'contained', 'either', 'fuzzy'] as const

    // Reflexivity across every mode. A string always matches itself, whatever
    // the caller asked for; any mode that fails this is unusable.
    test('a string always matches itself, in every mode', () => {
        fc.assert(
            fc.property(anyString, fc.boolean(), fc.constantFrom(...modes), (a, sensitive, mode) =>
                match(a, a, { mode, sensitive })
            )
        )
    })

    test('case folding is applied unless the caller asks for sensitivity', () => {
        fc.assert(
            fc.property(anyString, (a) =>
                match(a.toUpperCase(), a.toLowerCase(), { mode: 'exact' })
            )
        )
    })

    // 'either' is the union of the two one-way modes, by definition.
    test("'either' accepts exactly what 'contains' or 'contained' accept", () => {
        fc.assert(
            fc.property(
                shortString,
                shortString,
                (a, b) =>
                    match(a, b, { mode: 'either' }) ===
                    (match(a, b, { mode: 'contains' }) || match(a, b, { mode: 'contained' }))
            )
        )
    })

    test("'either' is symmetric, the one-way modes are mirrors", () => {
        fc.assert(
            fc.property(shortString, shortString, (a, b) => {
                const symmetric =
                    match(a, b, { mode: 'either' }) === match(b, a, { mode: 'either' })
                const mirrored =
                    match(a, b, { mode: 'contains' }) === match(b, a, { mode: 'contained' })
                return symmetric && mirrored
            })
        )
    })

    // A larger allowance can only ever accept more pairs. If raising the
    // distance rejects something it previously accepted, the comparison is
    // inverted somewhere.
    test('a larger allowed distance never rejects a previously accepted pair', () => {
        fc.assert(
            fc.property(shortString, shortString, fc.integer({ min: 0, max: 8 }), (a, b, d) =>
                match(a, b, { mode: 'fuzzy', maxDistance: d, sensitive: true })
                    ? match(a, b, { mode: 'fuzzy', maxDistance: d + 1, sensitive: true })
                    : true
            )
        )
    })

    // 'exact' is the tightest rule, so anything it accepts every other mode
    // must accept too.
    test('every mode accepts what exact accepts', () => {
        fc.assert(
            fc.property(shortString, shortString, fc.constantFrom(...modes), (a, b, mode) =>
                match(a, b, { mode: 'exact' }) ? match(a, b, { mode }) : true
            )
        )
    })

    test('leading and trailing whitespace never changes the answer', () => {
        fc.assert(
            fc.property(
                anyString,
                anyString,
                fc.constantFrom(...modes),
                (a, b, mode) => match(`  ${a}  `, `\t${b}\n`, { mode }) === match(a, b, { mode })
            )
        )
    })
})

describe('(coerceStringArray) properties', () => {
    const anyValue = fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        // eslint-disable-next-line unicorn/no-null
        fc.constant(null),
        // eslint-disable-next-line unicorn/no-useless-undefined
        fc.constant(undefined),
        fc.array(fc.oneof(fc.string(), fc.integer()), { maxLength: 8 })
    )

    test('always returns an array of strings', () => {
        fc.assert(
            fc.property(anyValue, (value) => {
                const result = coerceStringArray(value)
                return Array.isArray(result) && result.every((item) => typeof item === 'string')
            })
        )
    })

    // The function's whole job: nothing blank survives. An item that is empty or
    // pure whitespace after trimming is indistinguishable from an absent one.
    test('never returns an empty or untrimmed item', () => {
        fc.assert(
            fc.property(anyValue, (value) =>
                coerceStringArray(value).every((item) => item.length > 0 && item === item.trim())
            )
        )
    })

    // Idempotence: the output is already the normal form, so putting it back
    // through must be a no-op. This catches a second pass re-splitting on a
    // comma that legitimately survived the first.
    test('is idempotent on its own output', () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.string({ maxLength: 10 }).filter((s) => !s.includes(',')),
                    {
                        maxLength: 8
                    }
                ),
                (values) => {
                    const once = coerceStringArray(values)
                    expect(coerceStringArray(once)).toEqual(once)
                }
            )
        )
    })

    test('splits a comma-joined string back into its parts', () => {
        fc.assert(
            fc.property(
                fc.array(fc.stringMatching(/^[a-z]{1,6}$/), { minLength: 1, maxLength: 6 }),
                (parts) => {
                    expect(coerceStringArray(parts.join(','))).toEqual(parts)
                }
            )
        )
    })
})
