/**
 * @module
 * `document.cookie` is one string of `name=value` pairs joined by `'; '`. Reading a
 * cookie means splitting that string, matching the encoded name, and decoding the
 * matched pair's value.
 */

/**
 * Read a cookie's value by name.
 *
 * @param name - the cookie's name, encoded the same way it was set
 */
export default (name: string): string | undefined => {
    // DOM: document.cookie has no lookup-by-name API, only the raw "a=1; b=2" string.
    const cookieRow = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))

    return cookieRow ? decodeURIComponent(cookieRow.slice(cookieRow.indexOf('=') + 1)) : undefined
}
