/**
 * Get content of Iframe
 *
 * @param iframe
 */
export default (
    iframe?: HTMLElement | HTMLIFrameElement | Element | null
): HTMLElement | HTMLBodyElement | undefined => {
    if (iframe?.tagName !== 'IFRAME') return undefined
    // Mutation testing: mutating this guard survives and is equivalent. A
    // detached iframe has a null contentWindow, and the optional chain below
    // already yields undefined for it. The guard states the intent; it is not
    // the only thing preventing the throw. Do not chase it.
    if (!(iframe as HTMLIFrameElement).contentWindow) return undefined
    return (iframe as HTMLIFrameElement).contentWindow?.document.body
}
