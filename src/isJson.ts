/**
 * Parse a JSON structure, or report that the string is not one.
 *
 * Only objects and arrays count: a bare `5`, `"text"`, `true` or `null` is valid
 * JSON but is not a structure to walk, and accepting them makes the `false`
 * return ambiguous — `isJson('false')` could not be told apart from a parse
 * failure. Use {getJson} when any JSON value is acceptable.
 *
 * Invalid input is reported through the return value, not through the console:
 * a malformed string is an expected input here, and a library has no business
 * writing to the host's console over one.
 *
 * @param test
 * @return the parsed object or array, false if {test} is not a JSON structure
 */
export default <T>(test: string): Record<string, T> | T[] | false => {
    try {
        const parsed: unknown = JSON.parse(test)
        if (typeof parsed !== 'object' || parsed === null) return false
        return parsed as Record<string, T> | T[]
    } catch {
        return false
    }
}
