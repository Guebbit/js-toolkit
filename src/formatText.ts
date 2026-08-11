/**
 * Show a string, or a fallback glyph when there is nothing to show.
 *
 * Whitespace counts as nothing: a value of `'   '` renders as an empty cell that looks like a
 * layout bug rather than like missing data.
 *
 * @param {string} value - the text, possibly empty or nullish
 * @param {string} empty - what to show instead when there is none
 */
export default (value?: string | null, empty = '—'): string =>
    value && value.trim().length > 0 ? value : empty
