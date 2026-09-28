/**
 * @module
 * Renders a date via `Intl.DateTimeFormat`, or `Date#toLocaleString` when no `format` is given.
 * An unparseable or missing value renders `empty` instead of the string `Invalid Date`, which is
 * never something a user should see. An unusable locale falls back to the runtime's default.
 */

import resolveLocale from './internal/resolveLocale.js'

/**
 * Options for rendering a date as display text.
 */
export interface IFormatDateTimeOptions {
    /**
     * BCP 47 tag, e.g. `'it-IT'`. Omitted or unusable (malformed, or unknown to `Intl`), the
     * runtime's own default is used.
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
 * Bad data never throws: an unparseable value is treated as missing rather than rendered as
 * `Invalid Date`, which is a string no user should ever be shown, and an unusable `locale` falls
 * back to the runtime's default.
 *
 * @param value - anything the Date constructor accepts
 * @param options - locale, fallback text and `Intl.DateTimeFormat` options
 * @returns the formatted date, or `empty`
 * @throws {RangeError | TypeError} when `format` is invalid — written in code, so a caller bug
 */
export default (
    value?: string | number | Date | null,
    { locale: givenLocale, empty = '—', format }: IFormatDateTimeOptions = {}
): string => {
    if (value === undefined || value === null || value === '') return empty
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return empty
    const locale = resolveLocale(givenLocale)
    return format
        ? new Intl.DateTimeFormat(locale, format).format(date)
        : date.toLocaleString(locale)
}
