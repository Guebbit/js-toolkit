/**
 * Build a URL query string from a plain object.
 * Keys with undefined/null/empty-string/empty-array values are dropped
 * (or removed from {merge}, if present), array values are joined with {arraySeparator}.
 *
 * Framework agnostic: returns a plain query string to pass to any router,
 * or to apply with `history.replaceState`/`pushState` in a browser.
 *
 * @param query - key/value pairs to serialize, any attribute is allowed
 * @param merge - existing query string / URLSearchParams to merge into (its keys are kept unless overwritten)
 * @param arraySeparator - separator used to join array values
 */
type QueryValue = string | number | boolean | null | undefined | (string | number | boolean)[]

export default (
    query: Record<string, QueryValue>,
    merge: string | URLSearchParams | false = false,
    arraySeparator = ','
): string => {
    const parameters = new URLSearchParams(merge || '')

    for (const [key, value] of Object.entries(query)) {
        const isEmpty =
            value === undefined ||
            value === null ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)

        if (isEmpty) {
            parameters.delete(key)
            continue
        }

        parameters.set(key, Array.isArray(value) ? value.join(arraySeparator) : String(value))
    }

    return parameters.toString()
}
