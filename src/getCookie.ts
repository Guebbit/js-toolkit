/**
 * Read a cookie's value by name.
 *
 * @param name
 */
export default (name: string): string | undefined => {
    const cookieRow = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))

    return cookieRow ? decodeURIComponent(cookieRow.slice(cookieRow.indexOf('=') + 1)) : undefined
}
