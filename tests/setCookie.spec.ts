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

describe('setCookie attributes', () => {
    // jsdom's cookie jar drops attributes on read, so capture the raw string
    // written to document.cookie instead.
    let written: string

    beforeEach(() => {
        written = ''
        Object.defineProperty(document, 'cookie', {
            configurable: true,
            get: () => written,
            set: (value: string) => {
                written = value
            }
        })
    })

    afterEach(() => {
        delete (document as unknown as { cookie?: string }).cookie
    })

    test('encodes name and value and adds the default path', () => {
        setCookie('the me', 'a b&c')
        expect(written).toContain('the%20me=a%20b%26c')
        expect(written).toContain('; path=/')
        expect(written).not.toContain('; expires=')
        expect(written).not.toContain('; domain=')
        expect(written).not.toContain('; secure')
        expect(written).not.toContain('; samesite=')
    })

    test('adds an expiry roughly `days` in the future', () => {
        const before = Date.now()
        setCookie('theme', 'dark', { days: 7 })
        const match = /; expires=([^;]+)/.exec(written)
        expect(match).not.toBeNull()
        const expiry = new Date(match![1]).getTime()
        expect(Math.abs(expiry - (before + 7 * 86_400_000))).toBeLessThan(5000)
    })

    test('writes an explicit path', () => {
        setCookie('theme', 'dark', { path: '/admin' })
        expect(written).toContain('; path=/admin')
    })

    test('omits the path when it is empty', () => {
        setCookie('theme', 'dark', { path: '' })
        expect(written).not.toContain('; path=')
    })

    test('writes the domain when provided', () => {
        setCookie('theme', 'dark', { domain: 'example.com' })
        expect(written).toContain('; domain=example.com')
    })

    test('writes the secure flag when set', () => {
        setCookie('theme', 'dark', { secure: true })
        expect(written).toContain('; secure')
    })

    test('writes the samesite attribute when set', () => {
        setCookie('theme', 'dark', { sameSite: 'Lax' })
        expect(written).toContain('; samesite=Lax')
    })
})
