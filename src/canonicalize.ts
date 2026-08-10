/**
 * Rebuilds a value into a canonical form, so JSON.stringify of the result is a
 * stable cache key regardless of property insertion order. Recurses into nested
 * objects — a single-level `Object.keys().sort()` replacer only sorts the
 * top level and silently corrupts nested keys.
 *
 * Arrays keep their order (meaningful in a filter, e.g. sort priority);
 * `undefined` values are dropped (an absent filter and an explicitly unset one
 * share a key); `Date` becomes its ISO string.
 *
 * A circular reference should never reach this function, but if one does it is
 * replaced with the string '[Circular]' so a stable key can still be produced.
 * Pass `throwOnCircular` to surface it as an error instead — useful when a cycle
 * would mean a bug upstream rather than acceptable data.
 *
 * @param {*} value - the value to canonicalize
 * @param {boolean} throwOnCircular - throw on a cycle instead of emitting '[Circular]'
 */
const canonicalize = (value: unknown, throwOnCircular = false): unknown => {
    // objects currently on the path from the root to `node`, used to spot a loop
    const seen = new WeakSet()
    const walk = (node: unknown): unknown => {
        if (!node || typeof node !== 'object') return node
        if (node instanceof Date) return node.toISOString()
        if (seen.has(node)) {
            if (throwOnCircular) throw new TypeError('canonicalize: circular reference detected')
            return '[Circular]'
        }
        // track only the current path: added on the way down, removed on the way
        // back up, so a repeated-but-acyclic reference (a "diamond") is not
        // mistaken for a cycle
        seen.add(node)
        let result: unknown
        if (Array.isArray(node)) result = node.map((item) => walk(item))
        else {
            const source = node as Record<string, unknown>
            const normalized: Record<string, unknown> = {}
            for (const key of Object.keys(source).sort())
                if (source[key] !== undefined) normalized[key] = walk(source[key])
            result = normalized
        }
        seen.delete(node)
        return result
    }
    return walk(value)
}

export default canonicalize
