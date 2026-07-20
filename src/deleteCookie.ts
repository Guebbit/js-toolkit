/**
 * Delete a cookie by name.
 *
 * @param name
 * @param path
 * @param domain
 */
export default (name: string, path = '/', domain?: string): void => {
    let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    if (path) cookie += `; path=${path}`
    if (domain) cookie += `; domain=${domain}`
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = cookie
}
