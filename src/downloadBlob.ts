/**
 * @module
 * Downloads by faking a click on an off-DOM anchor pointed at an object URL — the browser has no
 * direct "save this Blob" API. The object URL is revoked right after the click so the buffered
 * data doesn't outlive the download.
 */

/**
 * Trigger a client-side file download.
 *
 * @param data - Blob, or content to wrap in one (string, ArrayBuffer, etc.)
 * @param filename - name the browser suggests for the saved file
 * @param type - MIME type used when {data} isn't already a Blob
 */
export default (data: Blob | BlobPart, filename: string, type = 'text/plain'): void => {
    const blob = data instanceof Blob ? data : new Blob([data], { type })
    // DOM: an object URL is a temporary in-memory reference to the blob, not a network address
    const url = URL.createObjectURL(blob)

    // DOM: the anchor never needs to join the document for `.click()` to start a download
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()

    // DOM: releases the buffered blob data now that the download has started
    URL.revokeObjectURL(url)
}
