/**
 * @module
 * Copies text to the clipboard the modern way when possible, and falls back to
 * the older `execCommand` selection trick otherwise. Both paths report success
 * or failure as a boolean instead of throwing, since a clipboard write should
 * never crash the caller.
 */

/**
 * Copy a string to the clipboard.
 *
 * Uses the async Clipboard API when available (secure context), falls back to
 * a hidden textarea + `execCommand` otherwise. Never throws.
 *
 * @param text - text to copy
 * @returns true if the copy succeeded
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

    // DOM: execCommand('copy') only acts on the current selection, so a
    // throwaway textarea is created, filled and selected just to be copied.
    const textarea = document.createElement('textarea')
    textarea.value = text
    // kept in the layout (not display:none) so selection still works, but
    // invisible and off-screen so it never affects or is seen by the page.
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
