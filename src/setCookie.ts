export interface ISetCookieOptions {
    // number of days until the cookie expires, omit for a session cookie
    days?: number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Set a cookie.
 *
 * @param name
 * @param value
 * @param options
 */
export default (
    name: string,
    value: string,
    { days, path = '/', domain, secure, sameSite }: ISetCookieOptions = {}
): void => {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (days !== undefined) {
        const date = new Date()
        date.setTime(date.getTime() + days * 86_400_000)
        cookie += `; expires=${date.toUTCString()}`
    }
    if (path) cookie += `; path=${path}`
    if (domain) cookie += `; domain=${domain}`
    if (secure) cookie += '; secure'
    if (sameSite) cookie += `; samesite=${sameSite}`

    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = cookie
}
