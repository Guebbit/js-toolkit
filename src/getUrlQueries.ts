/**
 * Parse a URL query string into a plain object.
 * A value is returned as an array if the key appears more than once
 * or its value contains {arraySeparator}.
 *
 * Framework agnostic: works with any router by passing its query string,
 * or defaults to the current page's when used in a browser.
 *
 * @param search - query string / URLSearchParams to parse (defaults to location.search)
 * @param arraySeparator - separator used to split multi-value params into arrays, false to disable
 */
export default (
    search: string | URLSearchParams = typeof location === 'undefined' ? '' : location.search,
    arraySeparator: string | false = ','
): Record<string, string | string[]> => {
    const parameters = new URLSearchParams(search)
    const output: Record<string, string | string[]> = {}

    for (const key of new Set(parameters.keys())) {
        const values = parameters
            .getAll(key)
            .flatMap((value) => (arraySeparator ? value.split(arraySeparator) : [value]))
        output[key] = values.length > 1 ? values : values[0]
    }

    return output
}
