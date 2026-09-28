import fc from 'fast-check'
import { arrayChunks, arrayColumns, arrayDepth, associativeSlice, canonicalize } from '../../src'

const item = fc.oneof(fc.string({ maxLength: 6 }), fc.integer())
const list = fc.array(item, { maxLength: 30 })

describe('(arrayChunks) properties', () => {
    // Nothing may be lost, duplicated or reordered. This is the invariant that
    // makes chunking safe to use on data you then flatten back.
    test('flattening the chunks reproduces the input exactly', () => {
        fc.assert(
            fc.property(list, fc.integer({ min: 1, max: 12 }), (array, n) => {
                expect(arrayChunks(array, n).flat()).toEqual(array)
            })
        )
    })

    test('does not mutate the input array', () => {
        fc.assert(
            fc.property(list, fc.integer({ min: 1, max: 12 }), (array, n) => {
                const before = [...array]
                arrayChunks(array, n)
                expect(array).toEqual(before)
            })
        )
    })

    test('produces no chunks at all for a non-positive count', () => {
        fc.assert(
            fc.property(list, fc.integer({ min: -5, max: 0 }), (array, n) => {
                expect(arrayChunks(array, n)).toEqual([])
            })
        )
    })

    test('produces a single chunk holding everything for a count of one', () => {
        fc.assert(
            fc.property(list, (array) => {
                expect(arrayChunks(array, 1)).toEqual([array])
            })
        )
    })

    // Asking for more chunks than there are items cannot invent items, so the
    // count saturates at the array length.
    test('produces as many chunks as asked, or as many as there are items', () => {
        fc.assert(
            fc.property(list, fc.integer({ min: 2, max: 12 }), (array, n) => {
                expect(arrayChunks(array, n)).toHaveLength(Math.min(n, array.length))
            })
        )
    })

    // "Lengths differ as less as possible" from the doc comment, stated as a
    // checkable bound rather than as a set of hand-picked examples.
    test('chunk lengths never differ by more than one', () => {
        fc.assert(
            fc.property(list, fc.integer({ min: 2, max: 12 }), (array, n) => {
                const lengths = arrayChunks(array, n).map((chunk) => chunk.length)
                if (lengths.length === 0) return true
                return Math.max(...lengths) - Math.min(...lengths) <= 1
            })
        )
    })

    test('never produces an empty chunk when there are items to place', () => {
        fc.assert(
            fc.property(
                fc.array(item, { minLength: 1, maxLength: 30 }),
                fc.integer({ min: 1, max: 12 }),
                (array, n) => arrayChunks(array, n).every((chunk) => chunk.length > 0)
            )
        )
    })
})

describe('(arrayDepth) properties', () => {
    test('is zero for anything that is not an array', () => {
        fc.assert(
            fc.property(
                // eslint-disable-next-line unicorn/no-null
                fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null)),
                (value) => arrayDepth(value) === 0
            )
        )
    })

    // The recursive definition, as a law: wrapping a value in an array adds
    // exactly one level.
    test('wrapping a value in an array adds exactly one level', () => {
        fc.assert(
            fc.property(
                fc.letrec((tie) => ({
                    node: fc.oneof(
                        { depthSize: 'small' },
                        item,
                        fc.array(tie('node'), { maxLength: 3 })
                    )
                })).node,
                (value) => arrayDepth([value]) === arrayDepth(value) + 1
            )
        )
    })

    test('is one for any flat array, empty included', () => {
        fc.assert(
            fc.property(fc.array(item, { maxLength: 10 }), (array) => arrayDepth(array) === 1)
        )
    })

    test('is the deepest branch, not the first or the last', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 5 }), (extra) => {
                let deep: unknown = 'leaf'
                for (let index = 0; index < extra; index++) deep = [deep]
                // a shallow sibling on either side must not shorten the answer
                return arrayDepth(['flat', deep, 'flat']) === Math.max(1, arrayDepth(deep) + 1)
            })
        )
    })
})

describe('(associativeSlice) properties', () => {
    const record = fc.dictionary(fc.stringMatching(/^[a-z]{1,5}$/), item, { maxKeys: 10 })
    const index = fc.integer({ min: -3, max: 12 })

    test('keeps the keys in their original order', () => {
        fc.assert(
            fc.property(record, index, index, (object, start, end) => {
                const kept = Object.keys(associativeSlice(object, start, end))
                const original = Object.keys(object).filter((key) => kept.includes(key))
                expect(kept).toEqual(original)
            })
        )
    })

    test('returns a subset of the input, with values untouched', () => {
        fc.assert(
            fc.property(record, index, index, (object, start, end) => {
                const sliced = associativeSlice(object, start, end)
                return Object.entries(sliced).every(([key, value]) => object[key] === value)
            })
        )
    })

    // Mirrors Array.prototype.slice: the whole span gives everything back, and
    // an empty or inverted span gives nothing.
    test('slicing the whole span returns an equal object', () => {
        fc.assert(
            fc.property(record, (object) => {
                expect(associativeSlice(object, 0, Object.keys(object).length)).toEqual(object)
            })
        )
    })

    test('returns nothing when the span is empty or inverted', () => {
        fc.assert(
            fc.property(record, index, fc.integer({ min: 0, max: 5 }), (object, start, back) => {
                expect(associativeSlice(object, start, start - back)).toEqual({})
            })
        )
    })

    test('never returns more entries than the span is wide', () => {
        fc.assert(
            fc.property(
                record,
                index,
                index,
                (object, start, end) =>
                    Object.keys(associativeSlice(object, start, end)).length <=
                    Math.max(0, end - start)
            )
        )
    })

    test('does not mutate the input', () => {
        fc.assert(
            fc.property(record, index, index, (object, start, end) => {
                const before = { ...object }
                associativeSlice(object, start, end)
                expect(object).toEqual(before)
            })
        )
    })
})

describe('(arrayColumns) properties', () => {
    const row = fc.dictionary(fc.stringMatching(/^[a-z]{1,4}$/), item, { maxKeys: 5 })
    const column = fc.stringMatching(/^[a-z]{1,4}$/)

    // The doc comment promises the result pairs index-for-index with the
    // haystack, which is what lets callers zip the two together.
    test('returns one entry per haystack row, always', () => {
        fc.assert(
            fc.property(fc.array(row, { maxLength: 10 }), column, (haystack, name) => {
                expect(arrayColumns(haystack, name)).toHaveLength(haystack.length)
                expect(arrayColumns(haystack, [name])).toHaveLength(haystack.length)
            })
        )
    })

    test('a list of columns adds a nesting level a bare column does not', () => {
        fc.assert(
            fc.property(
                fc.array(row, { maxLength: 8 }),
                fc.array(column, { minLength: 1, maxLength: 3 }),
                (haystack, names) => {
                    const nested = arrayColumns(haystack, names)
                    return nested.every(
                        (entry) => Array.isArray(entry) && entry.length === names.length
                    )
                }
            )
        )
    })

    test('a single bare column matches the first slot of the same column as a list', () => {
        fc.assert(
            fc.property(fc.array(row, { maxLength: 8 }), column, (haystack, name) => {
                const bare = arrayColumns(haystack, name)
                const nested = arrayColumns(haystack, [name])
                expect(bare).toEqual(nested.map(([first]) => first))
            })
        )
    })

    test('reads the value when the row has the column and undefined when it does not', () => {
        fc.assert(
            fc.property(fc.array(row, { maxLength: 8 }), column, (haystack, name) => {
                const values = arrayColumns(haystack, name)
                return haystack.every((entry, position) =>
                    Object.hasOwn(entry, name)
                        ? values[position] === entry[name]
                        : values[position] === undefined
                )
            })
        )
    })
})

describe('(canonicalize) properties', () => {
    // JSON-shaped values only: canonicalize's contract is about producing a
    // stable JSON key, so anything JSON cannot express is out of scope.
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

    const shuffleKeys = (value: unknown): unknown => {
        if (Array.isArray(value)) return value.map((element) => shuffleKeys(element))
        if (value && typeof value === 'object') {
            const entries = [...Object.entries(value as Record<string, unknown>)].reverse()
            return Object.fromEntries(entries.map(([key, item_]) => [key, shuffleKeys(item_)]))
        }
        return value
    }

    // The whole reason the function exists: two objects that differ only in
    // insertion order must serialize identically.
    test('key insertion order never changes the serialized result', () => {
        fc.assert(
            fc.property(jsonValue, (value) => {
                expect(JSON.stringify(canonicalize(value))).toBe(
                    JSON.stringify(canonicalize(shuffleKeys(value)))
                )
            })
        )
    })

    // Already-canonical input must survive untouched, or the output is not a
    // normal form and callers cannot cache on it.
    test('is idempotent', () => {
        fc.assert(
            fc.property(jsonValue, (value) => {
                const once = canonicalize(value)
                expect(canonicalize(once)).toEqual(once)
                expect(JSON.stringify(canonicalize(once))).toBe(JSON.stringify(once))
            })
        )
    })

    test('preserves the data, only the key order changes', () => {
        fc.assert(
            fc.property(jsonValue, (value) => {
                expect(canonicalize(value)).toEqual(value)
            })
        )
    })

    test('preserves array order', () => {
        fc.assert(
            fc.property(fc.array(jsonValue, { maxLength: 6 }), (values) => {
                expect(canonicalize(values)).toEqual(values)
            })
        )
    })

    test('sorts every object key at every depth', () => {
        const keysAreSorted = (node: unknown): boolean => {
            if (Array.isArray(node)) return node.every((element) => keysAreSorted(element))
            if (node && typeof node === 'object') {
                const keys = Object.keys(node)
                return (
                    keys.every((key, position) => position === 0 || keys[position - 1] <= key) &&
                    Object.values(node).every((element) => keysAreSorted(element))
                )
            }
            return true
        }
        fc.assert(fc.property(jsonValue, (value) => keysAreSorted(canonicalize(value))))
    })

    test('never throws on an acyclic value', () => {
        fc.assert(
            fc.property(jsonValue, (value) => {
                canonicalize(value, true)
                return true
            })
        )
    })
})
