import fc from 'fast-check'
import {
    getJson,
    getUrlQueries,
    isJson,
    secondsToTime,
    setUrlQueries,
    timeToSeconds,
    toFormData
} from '../../src'

// Values that survive a query string unambiguously: non-empty (empty ones are
// dropped by contract) and free of the array separator (which would re-split on
// the way back and change the shape).
const queryValue = fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !s.includes(','))
const queryKey = fc.stringMatching(/^[A-Za-z]\w{0,7}$/)

describe('(setUrlQueries → getUrlQueries) round trip', () => {
    test('a record of plain values survives serializing and parsing', () => {
        fc.assert(
            fc.property(fc.dictionary(queryKey, queryValue, { maxKeys: 8 }), (query) => {
                expect(getUrlQueries(setUrlQueries(query))).toEqual(query)
            })
        )
    })

    // Multi-value params are the interesting half: they are joined on the way
    // out and split on the way back, and both halves have to agree on the
    // separator or a filter list silently becomes one long string.
    test('a multi-value array survives serializing and parsing', () => {
        fc.assert(
            fc.property(
                queryKey,
                fc.array(queryValue, { minLength: 2, maxLength: 6 }),
                (key, values) => {
                    expect(getUrlQueries(setUrlQueries({ [key]: values }))).toEqual({
                        [key]: values
                    })
                }
            )
        )
    })

    // A single-item array cannot round-trip as an array: one value in a query
    // string is indistinguishable from a scalar. Pinning it stops someone
    // "fixing" the asymmetry into an always-array return that breaks callers.
    test('a single-item array comes back as a bare value', () => {
        fc.assert(
            fc.property(queryKey, queryValue, (key, value) => {
                expect(getUrlQueries(setUrlQueries({ [key]: [value] }))).toEqual({ [key]: value })
            })
        )
    })

    test('a custom separator round-trips just as well', () => {
        fc.assert(
            fc.property(
                queryKey,
                fc.array(fc.stringMatching(/^[a-z]{1,6}$/), { minLength: 2, maxLength: 5 }),
                (key, values) => {
                    const query = setUrlQueries({ [key]: values }, false, '|')
                    expect(getUrlQueries(query, '|')).toEqual({ [key]: values })
                }
            )
        )
    })

    test('numbers and booleans come back as their string form', () => {
        fc.assert(
            fc.property(queryKey, fc.oneof(fc.integer(), fc.boolean()), (key, value) => {
                expect(getUrlQueries(setUrlQueries({ [key]: value }))).toEqual({
                    [key]: String(value)
                })
            })
        )
    })

    // Empty means absent, in both directions. Anything else and a cleared
    // filter would keep showing up in the URL.
    test('empty values are dropped, never serialized', () => {
        fc.assert(
            fc.property(
                queryKey,
                // eslint-disable-next-line unicorn/no-null
                fc.constantFrom<'' | null | undefined | []>('', null, undefined, []),
                (key, empty) => {
                    expect(setUrlQueries({ [key]: empty })).toBe('')
                    expect(getUrlQueries(setUrlQueries({ [key]: empty }))).toEqual({})
                }
            )
        )
    })

    test('an empty value removes a key already present in the merged query', () => {
        fc.assert(
            fc.property(queryKey, queryValue, (key, value) => {
                const existing = setUrlQueries({ [key]: value })
                expect(setUrlQueries({ [key]: '' }, existing)).toBe('')
            })
        )
    })

    test('serializing is idempotent through a parse', () => {
        fc.assert(
            fc.property(fc.dictionary(queryKey, queryValue, { maxKeys: 6 }), (query) => {
                const once = setUrlQueries(query)
                expect(setUrlQueries(getUrlQueries(once) as Record<string, string>)).toBe(once)
            })
        )
    })
})

describe('(secondsToTime → timeToSeconds) round trip', () => {
    // Bounded to under a day: past that, secondsToTime rolls the excess into
    // days/weeks/months, and an HH:MM:SS:ms string has nowhere to put them.
    const withinADay = fc.integer({ min: 0, max: 86_399_999 })

    test('a sub-day duration survives being split and recombined', () => {
        fc.assert(
            fc.property(withinADay, (ms) => {
                const { hours, minutes, seconds, milliseconds } = secondsToTime(ms)
                expect(timeToSeconds(`${hours}:${minutes}:${seconds}:${milliseconds}`)).toBe(ms)
            })
        )
    })

    test('every component stays inside its own unit', () => {
        fc.assert(
            fc.property(withinADay, (ms) => {
                const time = secondsToTime(ms)
                return (
                    time.hours < 24 &&
                    time.minutes < 60 &&
                    time.seconds < 60 &&
                    time.milliseconds < 1000
                )
            })
        )
    })

    // The "Only" variants are the same duration expressed in one unit, so each
    // is the total divided by that unit — independent of the depletion loop.
    test('the total-only variants are the whole duration in that unit', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 4_000_000_000 }), (ms) => {
                const time = secondsToTime(ms)
                return (
                    time.millisecondsOnly === ms &&
                    time.secondsOnly === Math.floor(ms / 1000) &&
                    time.minutesOnly === Math.floor(ms / 60_000) &&
                    time.hoursOnly === Math.floor(ms / 3_600_000) &&
                    time.daysOnly === Math.floor(ms / 86_400_000)
                )
            })
        )
    })

    test('the depleting components add back up to the original duration', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 4_000_000_000 }), (ms) => {
                const t = secondsToTime(ms)
                const total =
                    t.years * 31_536_000_000 +
                    t.months * 2_592_000_000 +
                    t.weeks * 604_800_000 +
                    t.days * 86_400_000 +
                    t.hours * 3_600_000 +
                    t.minutes * 60_000 +
                    t.seconds * 1000 +
                    t.milliseconds
                return total === ms
            })
        )
    })
})

describe('(timeToSeconds) properties', () => {
    test('is monotonic in each component', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 23 }),
                fc.integer({ min: 0, max: 59 }),
                fc.integer({ min: 0, max: 59 }),
                (h, m, s) =>
                    timeToSeconds(`${h}:${m}:${s}`) < timeToSeconds(`${h}:${m}:${s + 1}`) &&
                    timeToSeconds(`${h}:${m}:${s}`) < timeToSeconds(`${h}:${m + 1}:${s}`) &&
                    timeToSeconds(`${h}:${m}:${s}`) < timeToSeconds(`${h + 1}:${m}:${s}`)
            )
        )
    })

    test('omitted components default to zero rather than to NaN', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 23 }), (h) => {
                expect(timeToSeconds(`${h}`)).toBe(h * 3_600_000)
                expect(timeToSeconds(`${h}`)).toBe(timeToSeconds(`${h}:0:0:0`))
            })
        )
    })

    test('the delimiter is honoured', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 23 }),
                fc.integer({ min: 0, max: 59 }),
                (h, m) => timeToSeconds(`${h}-${m}`, '-') === timeToSeconds(`${h}:${m}`)
            )
        )
    })
})

describe('(getJson / isJson) properties', () => {
    const jsonValue = fc.letrec((tie) => ({
        node: fc.oneof(
            { depthSize: 'small' },
            fc.string({ maxLength: 6 }),
            fc.integer(),
            fc.boolean(),
            // eslint-disable-next-line unicorn/no-null
            fc.constant(null),
            fc.array(tie('node'), { maxLength: 4 }),
            fc.dictionary(fc.stringMatching(/^[a-z]{1,4}$/), tie('node'), { maxKeys: 4 })
        )
    })).node

    test('getJson parses back whatever JSON.stringify produced', () => {
        fc.assert(
            fc.property(jsonValue, (value) => {
                expect(getJson(JSON.stringify(value))).toEqual(value)
            })
        )
    })

    // The point of the wrapper: a malformed payload must come back as undefined
    // instead of throwing into the caller's control flow.
    test('getJson never throws, whatever the string', () => {
        fc.assert(
            fc.property(fc.string(), (s) => {
                getJson(s)
                return true
            })
        )
    })

    test('isJson never throws, whatever the string', () => {
        fc.assert(
            fc.property(fc.string(), (s) => {
                isJson(s)
                return true
            })
        )
    })

    test('isJson returns the parsed object for a serialized object', () => {
        fc.assert(
            fc.property(
                fc.dictionary(fc.stringMatching(/^[a-z]{1,4}$/), jsonValue, { maxKeys: 5 }),
                (object) => {
                    expect(isJson(JSON.stringify(object))).toEqual(object)
                }
            )
        )
    })
})

describe('(toFormData) properties', () => {
    const flatRecord = fc.dictionary(
        fc.stringMatching(/^[a-z]{1,5}$/),
        fc.string({ maxLength: 8 }),
        { maxKeys: 6 }
    )

    test('every key of a flat object reaches the form data with its value', () => {
        fc.assert(
            fc.property(flatRecord, (object) => {
                const fd = toFormData(object)
                return Object.entries(object).every(([key, value]) => fd.get(key) === value)
            })
        )
    })

    test('adds no key the input did not have', () => {
        fc.assert(
            fc.property(flatRecord, (object) => {
                expect([...toFormData(object).keys()].sort()).toEqual(Object.keys(object).sort())
            })
        )
    })

    // Nesting has to accumulate the full path. Passing only the innermost
    // property name down loses every ancestor above the second level, so two
    // different branches with the same inner shape land on the same key.
    test('a nested path becomes the full bracket chain, at any depth', () => {
        fc.assert(
            fc.property(
                fc.array(fc.stringMatching(/^[a-z]{1,4}$/), { minLength: 1, maxLength: 5 }),
                fc.string({ maxLength: 6 }),
                (path, leaf) => {
                    let nested: Record<string, unknown> = { [path.at(-1)!]: leaf }
                    for (const key of path.slice(0, -1).reverse()) nested = { [key]: nested }
                    const expected =
                        path[0] +
                        path
                            .slice(1)
                            .map((key) => `[${key}]`)
                            .join('')
                    expect([...toFormData(nested).keys()]).toEqual([expected])
                }
            )
        )
    })

    test('a Blob value is appended whole rather than walked into', () => {
        fc.assert(
            fc.property(
                fc.stringMatching(/^[a-z]{1,5}$/),
                fc.string({ maxLength: 8 }),
                (key, body) => {
                    const fd = toFormData({ [key]: new Blob([body]) })
                    expect([...fd.keys()]).toEqual([key])
                    expect(fd.get(key)).toBeInstanceOf(Blob)
                }
            )
        )
    })
})
