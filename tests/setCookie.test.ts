import { getCookie, setCookie } from '../src'

describe('setCookie', () => {
    afterEach(() => {
        for (const row of document.cookie.split('; ')) {
            const name = row.split('=')[0]
            // eslint-disable-next-line unicorn/no-document-cookie
            if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
    })

    test('writes a readable cookie', () => {
        setCookie('theme', 'dark')
        expect(getCookie('theme')).toBe('dark')
    })

    test('encodes the value', () => {
        setCookie('data', 'a b&c')
        expect(getCookie('data')).toBe('a b&c')
    })

    test('accepts expiration and attribute options without throwing', () => {
        expect(() => {
            setCookie('theme', 'dark', { days: 7, path: '/', sameSite: 'Lax' })
        }).not.toThrow()
        expect(getCookie('theme')).toBe('dark')
    })
})
