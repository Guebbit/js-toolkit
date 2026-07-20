/**
 * Copy a string to the clipboard.
 * Uses the async Clipboard API when available (secure context),
 * falls back to a hidden textarea + execCommand otherwise.
 *
 * @param text
 * @return true if the copy succeeded
 */
export default async (text: string): Promise<boolean> => {
    if ('clipboard' in navigator) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
        }
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()

    let succeeded = false
    try {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        succeeded = document.execCommand('copy')
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    }
    textarea.remove()

    return succeeded
}
