export interface IFormatDateTimeOptions {
    // BCP 47 tag, e.g. 'it-IT'. Omit to use the runtime's own default
    locale?: string
    // what to show when there is no date, or an unparseable one
    empty?: string
    // passed straight to Intl.DateTimeFormat
    format?: Intl.DateTimeFormatOptions
}

/**
 * Render a date for display, in the reader's locale.
 *
 * An unparseable value is treated as missing rather than rendered as `Invalid Date`, which is a
 * string no user should ever be shown.
 *
 * @param {string|number|Date} value - anything the Date constructor accepts
 * @param {IFormatDateTimeOptions} options
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
