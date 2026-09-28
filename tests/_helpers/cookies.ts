/**
 * Shared cookie teardown for `getCookie`/`setCookie`/`deleteCookie` specs.
 *
 * jsdom's cookie jar persists across tests within a file, so a cookie one test
 * writes is visible to the next unless something clears it. `clearCookies`
 * removes every cookie by rewriting each one already expired — the same trick
 * `deleteCookie` itself uses — so specs share one teardown instead of each
 * re-implementing the loop.
 */

/**
 * Remove every cookie currently set on the test document.
 */
export const clearCookies = (): void => {
    for (const row of document.cookie.split('; ')) {
        const name = row.split('=')[0]
        // DOM: there is no delete API — a cookie is removed by rewriting it
        // already expired.
        // eslint-disable-next-line unicorn/no-document-cookie
        if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
}
