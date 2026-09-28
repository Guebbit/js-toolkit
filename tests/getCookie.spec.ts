import { getCookie } from '../src'
import { clearCookies } from './_helpers/cookies'

// eslint-disable-next-line unicorn/no-document-cookie
const setRawCookie = (cookie: string) => (document.cookie = cookie)

describe('getCookie', () => {
    afterEach(clearCookies)

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
