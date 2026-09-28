import { canonicalize } from '../src'

describe('(canonicalize) Build a stable canonical form of a value', () => {
    test('Sorts object keys so stringify is insertion-order independent', () => {
        const a = canonicalize({ b: 1, a: 2, c: 3 })
        const b = canonicalize({ c: 3, a: 2, b: 1 })
        expect(JSON.stringify(a)).toBe(JSON.stringify(b))
        expect(Object.keys(a as object)).toEqual(['a', 'b', 'c'])
    })

    test('Recurses into nested objects', () => {
        const a = canonicalize({ outer: { z: 1, a: 2 }, first: true })
        const b = canonicalize({ first: true, outer: { a: 2, z: 1 } })
        expect(JSON.stringify(a)).toBe(JSON.stringify(b))
        expect(JSON.stringify(a)).toBe('{"first":true,"outer":{"a":2,"z":1}}')
    })

    test('Preserves array order', () => {
        expect(canonicalize([3, 1, 2])).toEqual([3, 1, 2])
    })

    test('Sorts keys of objects inside arrays', () => {
        expect(JSON.stringify(canonicalize([{ b: 1, a: 2 }]))).toBe('[{"a":2,"b":1}]')
    })

    test('Drops undefined values (absent === explicitly unset)', () => {
        const withUndefined = canonicalize({ a: 1, b: undefined })
        // toStrictEqual (not toEqual) so a leaked `b: undefined` key is caught
        expect(withUndefined).toStrictEqual({ a: 1 })
        expect(Object.keys(withUndefined as object)).toEqual(['a'])
        expect(JSON.stringify(withUndefined)).toBe(JSON.stringify(canonicalize({ a: 1 })))
    })

    test('Converts Date to its ISO string', () => {
        const date = new Date('2026-07-23T10:00:00.000Z')
        expect(canonicalize(date)).toBe('2026-07-23T10:00:00.000Z')
        expect(canonicalize({ when: date })).toEqual({ when: '2026-07-23T10:00:00.000Z' })
    })

    test('Returns primitives untouched', () => {
        expect(canonicalize(42)).toBe(42)
        expect(canonicalize('lorem')).toBe('lorem')
        expect(canonicalize(true)).toBe(true)
        expect(canonicalize(JSON.parse('null'))).toBeNull()
        let notSet: unknown
        expect(canonicalize(notSet)).toBeUndefined()
    })

    test('Produces equal keys for deeply nested reordered structures', () => {
        const first = { filters: { name: 'a', tags: [2, 1] }, page: 1, sort: undefined }
        const second = { page: 1, filters: { tags: [2, 1], name: 'a' } }
        expect(JSON.stringify(canonicalize(first))).toBe(JSON.stringify(canonicalize(second)))
    })

    test('Replaces a circular reference with [Circular] by default', () => {
        const node: Record<string, unknown> = { name: 'root' }
        node.self = node
        expect(canonicalize(node)).toEqual({ name: 'root', self: '[Circular]' })
    })

    test('Handles a circular reference nested inside an array', () => {
        const node: Record<string, unknown> = { id: 1 }
        node.children = [node]
        expect(canonicalize(node)).toEqual({ children: ['[Circular]'], id: 1 })
    })

    test('Throws on a circular reference when throwOnCircular is set', () => {
        const node: Record<string, unknown> = { name: 'root' }
        node.self = node
        expect(() => canonicalize(node, true)).toThrow('circular reference')
    })

    test('Does not flag a repeated but acyclic reference (diamond)', () => {
        const shared = { a: 1, b: 2 }
        const diamond = { left: shared, right: shared }
        expect(canonicalize(diamond, true)).toEqual({
            left: { a: 1, b: 2 },
            right: { a: 1, b: 2 }
        })
    })
})
