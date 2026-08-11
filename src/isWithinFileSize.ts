/**
 * Whether a file is no larger than the given limit.
 *
 * Like {@link isAcceptedFileType}, this is a UX affordance rather than a control — the server
 * enforces the real limit — so it exists to fail fast, before the bytes are uploaded.
 *
 * A limit of 0 or less means "no limit", which is what makes a misconfigured maximum accept
 * everything instead of rejecting everything.
 *
 * @param {File} file - anything carrying a byte `size`
 * @param {number} maxBytes - largest accepted size
 */
export default (file: { size: number }, maxBytes: number): boolean =>
    maxBytes > 0 ? file.size <= maxBytes : true
