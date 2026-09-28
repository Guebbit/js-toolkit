/**
 * @module
 * Builds a `document.cookie` attribute string piece by piece — each optional attribute is
 * appended only when given — then writes it in a single assignment.
 */

/**
 * Options controlling how a cookie is set.
 */
export interface ISetCookieOptions {
    /**
     * Number of days until the cookie expires. Omit for a session cookie.
     */
    days?: number
    /**
     * Path the cookie is scoped to.
     */
    path?: string
    /**
     * Domain the cookie is scoped to.
     */
    domain?: string
    /**
     * Only send the cookie over HTTPS.
     */
    secure?: boolean
    /**
     * Cross-site sending policy.
     */
    sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Set a cookie.
 *
 * @param name - cookie name
 * @param value - cookie value
 * @param options - cookie attributes
 */
export default (
    name: string,
    value: string,
    { days, path = '/', domain, secure, sameSite }: ISetCookieOptions = {}
): void => {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (days !== undefined) {
        const date = new Date()
        // DOM: Date#setTime takes epoch milliseconds, so days has to be converted first.
        date.setTime(date.getTime() + days * 86_400_000)
        cookie += `; expires=${date.toUTCString()}`
    }
    if (path) cookie += `; path=${path}`
    if (domain) cookie += `; domain=${domain}`
    if (secure) cookie += '; secure'
    if (sameSite) cookie += `; samesite=${sameSite}`

    // DOM: there is no "set one cookie" call — assigning a single
    // "name=value; attr=..." string to document.cookie adds or updates just that cookie,
    // leaving every other cookie untouched.
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = cookie
}
