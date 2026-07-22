import { deleteCookie, getCookie, setCookie } from '../src'

describe('deleteCookie', () => {
    test('removes a previously set cookie', () => {
        setCookie('theme', 'dark')
        expect(getCookie('theme')).toBe('dark')

        deleteCookie('theme')
        expect(getCookie('theme')).toBeUndefined()
    })
})

describe('deleteCookie attributes', () => {
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

    test('writes an expired, encoded name with the default path', () => {
        deleteCookie('the me')
        expect(written).toContain('the%20me=;')
        expect(written).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
        expect(written).toContain('; path=/')
        expect(written).not.toContain('; domain=')
    })

    test('writes an explicit path', () => {
        deleteCookie('theme', '/admin')
        expect(written).toContain('; path=/admin')
    })

    test('omits the path when it is empty', () => {
        deleteCookie('theme', '')
        expect(written).not.toContain('; path=')
    })

    test('writes the domain when provided', () => {
        deleteCookie('theme', '/', 'example.com')
        expect(written).toContain('; domain=example.com')
    })
})
