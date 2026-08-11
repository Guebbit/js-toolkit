export interface IFormatCurrencyOptions {
    // ISO 4217 code, e.g. 'EUR'
    currency?: string
    // BCP 47 tag, e.g. 'it-IT'. Omit to use the runtime's own default
    locale?: string
    // what to show when the value is not a number
    empty?: string
    // passed straight to Intl.NumberFormat, on top of the 2-decimal default
    format?: Intl.NumberFormatOptions
}

const DEFAULT_FORMAT: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}

/**
 * Render an amount as money, with the reader's separators and the currency's symbol.
 *
 * An unknown or malformed currency code degrades to a plain number rather than throwing: a price
 * shown without its symbol is a cosmetic problem, a crashed render is not.
 *
 * @param {number} value - the amount
 * @param {IFormatCurrencyOptions} options
 */
export default (
    value?: number | null,
    { currency = 'EUR', locale, empty = '—', format = DEFAULT_FORMAT }: IFormatCurrencyOptions = {}
): string => {
    if (typeof value !== 'number' || Number.isNaN(value)) return empty
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency, ...format }).format(
            value
        )
    } catch {
        return new Intl.NumberFormat(locale, format).format(value)
    }
}
