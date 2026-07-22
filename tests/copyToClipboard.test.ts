import { copyToClipboard } from '../src'

const mockExecCommand = (result: boolean | (() => boolean)) => {
    const fn = jest.fn(typeof result === 'function' ? result : () => result)
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand = fn as typeof document.execCommand
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
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        mockExecCommand(false)

        await expect(copyToClipboard('hello')).resolves.toBe(false)
        expect(errorSpy).toHaveBeenCalled()
    })

    test('falls back to execCommand when the Clipboard API is unavailable', async () => {
        const execCommand = mockExecCommand(true)

        await expect(copyToClipboard('hello')).resolves.toBe(true)
        expect(execCommand).toHaveBeenCalledWith('copy')
    })

    test('returns false and logs when execCommand throws', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        mockExecCommand(() => {
            throw new Error('nope')
        })

        await expect(copyToClipboard('hello')).resolves.toBe(false)
        expect(errorSpy).toHaveBeenCalled()
    })

    test('configures a hidden textarea for the fallback', async () => {
        const created: HTMLTextAreaElement[] = []
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const realCreateElement = document.createElement.bind(document)
        jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            const element = realCreateElement(tag)
            if (tag === 'textarea') created.push(element as HTMLTextAreaElement)
            return element
        })
        mockExecCommand(true)

        await copyToClipboard('payload')

        expect(created).toHaveLength(1)
        expect(created[0].value).toBe('payload')
        expect(created[0].style.position).toBe('fixed')
        expect(created[0].style.opacity).toBe('0')
    })
})
