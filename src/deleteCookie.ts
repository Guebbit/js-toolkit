/**
 * @module
 * Deletes a cookie the only way the platform allows: rewriting it with the
 * same name, path and domain but an already-expired date, so the browser
 * discards it on the next read.
 */

/**
 * Delete a cookie by name.
 *
 * @param name - cookie name
 * @param path - cookie path; must match the path the cookie was set with
 * @param domain - cookie domain; must match the domain the cookie was set with
 */
export default (name: string, path = '/', domain?: string): void => {
    // DOM: there is no delete API — a cookie is removed by rewriting it already expired.
    let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    if (path) cookie += `; path=${path}`
    if (domain) cookie += `; domain=${domain}`
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = cookie
}
