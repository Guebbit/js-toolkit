/**
 * @module
 * An iframe's own document lives behind its `contentWindow`, which is `null`
 * until the iframe is attached and loaded. Reaching the body means checking the
 * element is really an iframe, then that its window exists, before reading in.
 */

/**
 * Get the body element of an iframe's own document.
 *
 * @param iframe - the element expected to be an `<iframe>`
 * @returns the iframe's body, or `undefined` if it is not an attached iframe
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
    // DOM: contentWindow.document is the iframe's own document, a separate tree
    // from the page that embeds it.
    return (iframe as HTMLIFrameElement).contentWindow?.document.body
}
