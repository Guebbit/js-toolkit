/**
 * @module
 * Renders a date via `Intl.DateTimeFormat`, or `Date#toLocaleString` when no `format` is given.
 * An unparseable or missing value renders `empty` instead of the string `Invalid Date`, which is
 * never something a user should see.
 */

/**
 * Options for rendering a date as display text.
 */
export interface IFormatDateTimeOptions {
    /**
     * BCP 47 tag, e.g. `'it-IT'`. Omit to use the runtime's own default.
     */
    locale?: string
    /**
     * What to show when there is no date, or an unparseable one.
     */
    empty?: string
    /**
     * Passed straight to `Intl.DateTimeFormat`. Without it, formatting falls back to
     * `Date#toLocaleString`.
     */
    format?: Intl.DateTimeFormatOptions
}

/**
 * Render a date for display, in the reader's locale.
 *
 * An unparseable value is treated as missing rather than rendered as `Invalid Date`, which is a
 * string no user should ever be shown.
 *
 * @param value - anything the Date constructor accepts
 * @param options - locale, fallback text and `Intl.DateTimeFormat` options
 */
export default (
    value?: string | number | Date | null,
    { locale, empty = '—', format }: IFormatDateTimeOptions = {}
): string => {
    if (value === undefined || value === null || value === '') return empty
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return empty
    return format
        ? new Intl.DateTimeFormat(locale, format).format(date)
        : date.toLocaleString(locale)
}
