/**
 * Trigger a client-side file download.
 *
 * @param data - Blob, or content to wrap in one (string, ArrayBuffer, etc.)
 * @param filename
 * @param type - MIME type used when {data} isn't already a Blob
 */
export default (data: Blob | BlobPart, filename: string, type = 'text/plain'): void => {
    const blob = data instanceof Blob ? data : new Blob([data], { type })
    const url = URL.createObjectURL(blob)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()

    URL.revokeObjectURL(url)
}
