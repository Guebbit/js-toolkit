import { getCookie } from '../src'

// eslint-disable-next-line unicorn/no-document-cookie
const setRawCookie = (cookie: string) => (document.cookie = cookie)

describe('getCookie', () => {
    afterEach(() => {
        for (const row of document.cookie.split('; ')) {
            const name = row.split('=')[0]
            if (name) setRawCookie(`${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
        }
    })

    test('reads an existing cookie', () => {
        setRawCookie('theme=dark')
        expect(getCookie('theme')).toBe('dark')
    })

    test('decodes the value', () => {
        setRawCookie(`data=${encodeURIComponent('a b&c')}`)
        expect(getCookie('data')).toBe('a b&c')
    })

    test('returns undefined for a missing cookie', () => {
        expect(getCookie('missing')).toBeUndefined()
    })

    test('does not match a cookie whose name is only a prefix', () => {
        setRawCookie('themeExtra=dark')
        expect(getCookie('theme')).toBeUndefined()
    })
})
