import { downloadBlob } from '../src'

describe('downloadBlob', () => {
    let createObjectUrl: jest.Mock
    let revokeObjectUrl: jest.Mock
    let click: jest.SpyInstance

    beforeEach(() => {
        createObjectUrl = jest.fn().mockReturnValue('blob:mock-url')
        revokeObjectUrl = jest.fn()
        URL.createObjectURL = createObjectUrl
        URL.revokeObjectURL = revokeObjectUrl
        click = jest.spyOn(HTMLAnchorElement.prototype, 'click')
    })

    afterEach(() => {
        Reflect.deleteProperty(URL, 'createObjectURL')
        Reflect.deleteProperty(URL, 'revokeObjectURL')
        jest.restoreAllMocks()
    })

    test('wraps non-Blob data and triggers a download', () => {
        downloadBlob('hello world', 'greeting.txt')

        expect(createObjectUrl).toHaveBeenCalledTimes(1)
        const [blob] = createObjectUrl.mock.calls[0] as [Blob]
        expect(blob).toBeInstanceOf(Blob)
        expect(blob.type).toBe('text/plain')
        // The content has to reach the Blob. Asserting only the type leaves the
        // wrapping free to drop the data and still look correct.
        // Size rather than text(): jsdom's Blob has no text().
        expect(blob.size).toBe('hello world'.length)
        expect(click).toHaveBeenCalledTimes(1)
        expect(revokeObjectUrl).toHaveBeenCalledWith('blob:mock-url')
    })

    test('uses the given Blob as-is', () => {
        const blob = new Blob(['{}'], { type: 'application/json' })
        downloadBlob(blob, 'data.json')

        const [passedBlob] = createObjectUrl.mock.calls[0] as [Blob]
        expect(passedBlob).toBe(blob)
    })

    test('sets href and filename on the created anchor', () => {
        const anchor = document.createElement('a')
        jest.spyOn(anchor, 'click')
        jest.spyOn(document, 'createElement').mockReturnValue(anchor)

        downloadBlob('content', 'report.csv', 'text/csv')

        expect(anchor.href).toBe('blob:mock-url')
        expect(anchor.download).toBe('report.csv')
    })
})
