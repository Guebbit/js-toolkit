import { copyToClipboard } from '../src'

const mockExecCommand = (result: boolean) => {
    const fn = jest.fn().mockReturnValue(result)
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand = fn
    return fn
}

describe('copyToClipboard', () => {
    afterEach(() => {
        Reflect.deleteProperty(navigator, 'clipboard')
        Reflect.deleteProperty(document, 'execCommand')
        jest.restoreAllMocks()
    })

    test('uses the Clipboard API when available', async () => {
        const writeText = jest.fn().mockResolvedValue()
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true
        })

        await expect(copyToClipboard('hello')).resolves.toBe(true)
        expect(writeText).toHaveBeenCalledWith('hello')
    })

    test('returns false when the Clipboard API rejects and execCommand fails', async () => {
        const writeText = jest.fn().mockRejectedValue(new Error('denied'))
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockExecCommand(false)

        await expect(copyToClipboard('hello')).resolves.toBe(false)
    })

    test('falls back to execCommand when the Clipboard API is unavailable', async () => {
        const execCommand = mockExecCommand(true)

        await expect(copyToClipboard('hello')).resolves.toBe(true)
        expect(execCommand).toHaveBeenCalledWith('copy')
    })
})
