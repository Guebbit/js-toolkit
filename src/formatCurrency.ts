/**
 * @module
 * Money for display, via `Intl.NumberFormat` in currency style.
 * The currency sets the decimals (JPY 0, EUR 2, KWD 3); `format` can override them.
 * A malformed currency code prints a plain number instead of throwing.
 */

/**
 * Options for rendering an amount as money.
 */
export interface IFormatCurrencyOptions {
    /**
     * ISO 4217 code, e.g. `'EUR'`. Any case.
     */
    currency?: string
    /**
     * BCP 47 tag, e.g. `'it-IT'`. Omit to use the runtime's own default.
     */
    locale?: string
    /**
     * What to show when the value is not a number.
     */
    empty?: string
    /**
     * Passed straight to `Intl.NumberFormat`. Without it, the decimals are the currency's own.
     */
    format?: Intl.NumberFormatOptions
}

/**
 * A well-formed currency code: three ASCII letters, any case (ECMA-402 `IsWellFormedCurrencyCode`).
 * `Intl.NumberFormat` throws on anything else, and accepts anything that matches.
 */
const WELL_FORMED_CURRENCY = /^[A-Za-z]{3}$/

/**
 * Decimals for an amount with no usable currency.
 * 2 is what `Intl` itself gives a well-formed code it has no data for.
 */
const NO_CURRENCY_FORMAT: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}

/**
 * Render an amount as money, with the reader's separators and the currency's symbol and decimals.
 *
 * Bad data never throws: a non-number renders `empty`, and a malformed currency code renders a
 * plain number (with `format` if given, otherwise 2 decimals).
 *
 * @param value - the amount
 * @param options - currency, locale, empty-value text and format overrides
 * @returns the formatted amount
 * @throws {RangeError} when `locale` or `format` is malformed — a caller bug, not data
 */
export default (
    value?: number | null,
    { currency = 'EUR', locale, empty = '—', format }: IFormatCurrencyOptions = {}
): string => {
    if (typeof value !== 'number' || Number.isNaN(value)) return empty
    // no usable currency: a plain decimal number, no symbol
    if (!WELL_FORMED_CURRENCY.test(currency))
        return new Intl.NumberFormat(locale, format ?? NO_CURRENCY_FORMAT).format(value)
    // the currency picks the symbol and the default decimals; `format` overrides any of it
    return new Intl.NumberFormat(locale, { style: 'currency', currency, ...format }).format(value)
}
