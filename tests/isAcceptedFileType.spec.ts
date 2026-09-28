import { isAcceptedFileType } from '../src'

const IMAGES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

describe('(isAcceptedFileType) Whether a file’s declared mime type is accepted', () => {
    test('accepts a listed type', () => {
        expect(isAcceptedFileType({ type: 'image/png' }, IMAGES)).toBe(true)
    })

    test('rejects an unlisted type', () => {
        expect(isAcceptedFileType({ type: 'application/pdf' }, IMAGES)).toBe(false)
    })

    test('is case insensitive by default, as RFC 2045 says a mime type is', () => {
        expect(isAcceptedFileType({ type: 'IMAGE/PNG' }, IMAGES)).toBe(true)
        expect(isAcceptedFileType({ type: 'image/png' }, ['IMAGE/PNG'])).toBe(true)
    })

    test('compares verbatim when asked, to mirror a strict server', () => {
        // accepting what the server will reject is worse than rejecting early
        const strict = { caseSensitive: true }
        expect(isAcceptedFileType({ type: 'IMAGE/PNG' }, IMAGES, strict)).toBe(false)
        expect(isAcceptedFileType({ type: 'image/png' }, IMAGES, strict)).toBe(true)
    })

    test('rejects a file whose type the browser could not determine', () => {
        expect(isAcceptedFileType({ type: '' }, IMAGES)).toBe(false)
    })

    test('rejects everything against an empty accept list', () => {
        expect(isAcceptedFileType({ type: 'image/png' }, [])).toBe(false)
    })

    describe('wildcards', () => {
        test('matches a subtype wildcard', () => {
            expect(isAcceptedFileType({ type: 'image/gif' }, ['image/*'])).toBe(true)
        })

        test('does not match across the type', () => {
            expect(isAcceptedFileType({ type: 'video/mp4' }, ['image/*'])).toBe(false)
        })

        test('matches the catch-all', () => {
            expect(isAcceptedFileType({ type: 'application/zip' }, ['*/*'])).toBe(true)
        })
    })

    test('tolerates the spacing of an accept attribute', () => {
        // `accept="image/png, image/jpeg"` split on the comma leaves the spaces behind
        expect(isAcceptedFileType({ type: 'image/jpeg' }, [' image/png', ' image/jpeg'])).toBe(true)
    })

    test('ignores empty entries', () => {
        expect(isAcceptedFileType({ type: 'image/png' }, ['', '  '])).toBe(false)
    })
})
