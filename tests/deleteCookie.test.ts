import { deleteCookie, getCookie, setCookie } from '../src'

describe('deleteCookie', () => {
    test('removes a previously set cookie', () => {
        setCookie('theme', 'dark')
        expect(getCookie('theme')).toBe('dark')

        deleteCookie('theme')
        expect(getCookie('theme')).toBeUndefined()
    })
})
