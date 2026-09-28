/**
 * @module
 * Normalizes an arbitrary value into a flat, trimmed string array so callers
 * don't need to special-case "one string", "comma-separated string" and
 * "already an array" separately.
 */

/**
 * Coerce any value into a trimmed string array.
 *
 * Arrays are stringified item by item, comma-separated strings are split into
 * items, `null`/`undefined` become an empty array, and anything else becomes a
 * single-item array.
 *
 * @param value - value to coerce
 * @returns a flat array of trimmed, non-empty strings
 */
export default (value?: unknown): string[] => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
    if (typeof value === 'string')
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    if (value === undefined || value === null) return []
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- intentional generic fallback stringification
    const normalized = String(value).trim()
    return normalized ? [normalized] : []
}
