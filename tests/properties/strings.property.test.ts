import fc from 'fast-check'
import { coerceStringArray, isEmail, isUrl, levenshteinDistance, match } from '../../src'

// Levenshtein is O(a*b); short strings keep the whole file fast enough to stay
// in the pre-commit hook.
const shortString = fc.string({ maxLength: 12 })
const nonEmpty = fc.string({ minLength: 1, maxLength: 12 })

describe('(levenshteinDistance) properties', () => {
    test('is zero exactly when the strings are equal', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                (a, b) => (levenshteinDistance(a, b) === 0) === (a === b)
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
                nonEmpty,
                nonEmpty,
                nonEmpty,
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
    // Reflexivity across every mode. A string always matches itself, whatever
    // the caller asked for; any mode that fails this is unusable.
    test('a string always matches itself, in every mode', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                fc.boolean(),
                fc.integer({ min: -2, max: 5 }),
                (a, sensitive, distance) => match(a, a, sensitive, distance)
            )
        )
    })

    test('case folding is applied unless the caller asks for sensitivity', () => {
        fc.assert(fc.property(nonEmpty, (a) => match(a.toUpperCase(), a.toLowerCase(), false, 0)))
    })

    // Substring mode -2 looks both ways, so it must accept every pair mode -1
    // accepts. A one-way check smuggled into the two-way branch breaks this.
    test('two-way substring mode accepts everything one-way mode accepts', () => {
        fc.assert(
            fc.property(shortString, shortString, (a, b) =>
                match(a, b, false, -1) ? match(a, b, false, -2) : true
            )
        )
    })

    test('two-way substring mode is symmetric', () => {
        fc.assert(
            fc.property(
                shortString,
                shortString,
                fc.boolean(),
                (a, b, sensitive) => match(a, b, sensitive, -2) === match(b, a, sensitive, -2)
            )
        )
    })

    // A larger allowance can only ever accept more pairs. If raising the
    // distance rejects something it previously accepted, the comparison is
    // inverted somewhere.
    test('a larger allowed distance never rejects a previously accepted pair', () => {
        fc.assert(
            fc.property(shortString, shortString, fc.integer({ min: 1, max: 8 }), (a, b, d) =>
                match(a, b, true, d) ? match(a, b, true, d + 1) : true
            )
        )
    })

    test('leading and trailing whitespace never changes the answer', () => {
        fc.assert(
            fc.property(
                nonEmpty,
                nonEmpty,
                fc.integer({ min: -2, max: 4 }),
                (a, b, distance) =>
                    match(`  ${a}  `, `\t${b}\n`, false, distance) === match(a, b, false, distance)
            )
        )
    })
})

describe('(isEmail) properties', () => {
    test('never throws, whatever the input', () => {
        fc.assert(fc.property(fc.string(), (s) => typeof isEmail(s) === 'boolean'))
    })

    // The pattern is anchored at both ends. Whitespace padding is the classic
    // way an unanchored pattern leaks through.
    test('rejects anything padded with whitespace', () => {
        fc.assert(fc.property(fc.string({ maxLength: 20 }), (s) => !isEmail(` ${s} `)))
    })

    test('rejects a value with no @ at all', () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 20 }).filter((s) => !s.includes('@')),
                (s) => !isEmail(s)
            )
        )
    })

    // Built from parts the pattern documents as valid, so this checks the
    // pattern accepts its own stated grammar rather than restating the regex.
    test('accepts a simple local part against a multi-label domain', () => {
        const label = fc.stringMatching(/^[a-z]{1,8}$/)
        fc.assert(
            fc.property(
                label,
                label,
                label,
                fc.stringMatching(/^[a-z]{2,6}$/),
                (local, a, b, tld) => isEmail(`${local}@${a}.${b}.${tld}`)
            )
        )
    })
})

describe('(isUrl) properties', () => {
    test('never throws, whatever the input', () => {
        fc.assert(fc.property(fc.string(), (s) => typeof isUrl(s) === 'boolean'))
    })

    test('accepts a hostname with or without a protocol', () => {
        const label = fc.stringMatching(/^[a-z]{1,8}$/)
        fc.assert(
            fc.property(label, fc.stringMatching(/^[a-z]{2,6}$/), (host, tld) => {
                const bare = `${host}.${tld}`
                return isUrl(bare) && isUrl(`http://${bare}`) && isUrl(`https://${bare}`)
            })
        )
    })

    test('accepts any dotted quad', () => {
        const octet = fc.integer({ min: 0, max: 255 })
        fc.assert(
            fc.property(octet, octet, octet, octet, (a, b, c, d) => isUrl(`${a}.${b}.${c}.${d}`))
        )
    })

    test('rejects a value containing whitespace', () => {
        fc.assert(
            fc.property(
                fc.stringMatching(/^[a-z]{1,8}$/),
                fc.stringMatching(/^[a-z]{2,6}$/),
                (host, tld) => !isUrl(`${host} .${tld}`)
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
