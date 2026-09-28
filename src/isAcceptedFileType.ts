/**
 * @module
 * Mime type matching against a file input's `accept` list: both sides are
 * folded to a common case (unless `caseSensitive`), then compared verbatim or
 * against a `type/*` wildcard.
 */

/**
 * Options for matching a file's mime type against an accepted list.
 */
export interface IIsAcceptedFileTypeOptions {
    /**
     * Compare verbatim instead of case-insensitively, default false.
     *
     * Case-insensitive is the correct reading — RFC 2045 says a mime type's type and subtype are
     * case-insensitive, and so is the `accept` attribute. Turn this on only to mirror a server
     * that compares verbatim: a client that accepted `IMAGE/PNG` where the server does not would
     * wave the file through and let the upload fail, which is worse than rejecting it early.
     */
    caseSensitive?: boolean
}

/**
 * Whether a file's declared mime type is one of the accepted ones.
 *
 * A UX affordance, never a security control: the type is what the *browser* declared, and a
 * server must re-check the actual bytes regardless. This only spares someone waiting out an
 * upload to be told no.
 *
 * Wildcards are supported (`image/*`), since that is what a file input's `accept` attribute
 * takes and keeping one list for both is the point.
 *
 * @param file - anything carrying a mime `type`
 * @param accepted - mime types, optionally with a `/*` wildcard
 * @param options - matching options
 */
export default (
    file: { type: string },
    accepted: readonly string[],
    { caseSensitive = false }: IIsAcceptedFileTypeOptions = {}
): boolean => {
    const fold = (value: string) => (caseSensitive ? value : value.toLowerCase())
    const type = fold(file.type)
    if (!type) return false
    return accepted.some((pattern) => {
        const accept = fold(pattern.trim())
        if (!accept) return false
        if (accept === '*/*') return true
        if (accept.endsWith('/*')) return type.startsWith(accept.slice(0, -1))
        return accept === type
    })
}
