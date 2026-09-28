/**
 * @module
 * Picks the largest unit that keeps the value at least 1 (or uses the one `unit` forces), then
 * divides by `step` that many times over. `step` is 1024 for binary units and 1000 for decimal
 * ones — the same number doubles as the log base for picking the unit and as the divisor.
 */

/**
 * Units for step-1024 sizes, as an OS reports them.
 */
const BINARY_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/**
 * Units for step-1000 sizes, the SI convention.
 */
const DECIMAL_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'] as const

/**
 * A unit `formatFileSize` can render, binary or decimal.
 */
export type TFileSizeUnit = (typeof BINARY_UNITS)[number] | (typeof DECIMAL_UNITS)[number]

/**
 * Options for rendering a byte count as display text.
 */
export interface IFormatFileSizeOptions {
    /**
     * Digits after the decimal point, trailing zeroes stripped.
     */
    decimals?: number
    /**
     * Binary units (1 KB = 1024 B, what an OS reports) or decimal (1 kB = 1000 B).
     */
    binary?: boolean
    /**
     * Always render in this unit instead of picking the fitting one.
     *
     * For a column of sizes, where a per-row unit makes two numbers impossible to compare at a
     * glance, and for a quoted limit that should read the same whatever it is set to.
     */
    unit?: TFileSizeUnit
}

/**
 * Render a byte count the way a person reads one: `5 MB`, `1.5 MB`, `512 KB`.
 *
 * Trailing zeroes are stripped, so a round number stays round — `5 MB`, never `5.0 MB`.
 *
 * @param bytes - size in bytes; negatives are treated as 0
 * @param options - decimals, unit system and a forced unit
 */
export default (
    bytes: number,
    { decimals = 1, binary = true, unit }: IFormatFileSizeOptions = {}
) => {
    const step = binary ? 1024 : 1000
    const units = binary ? BINARY_UNITS : DECIMAL_UNITS
    const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0

    // A forced unit wins; an unrecognised one falls through to the fitting one rather than
    // rendering `NaN undefined`
    const forced = unit ? (units as readonly string[]).indexOf(unit) : -1

    // Clamped to the last unit: a size beyond TB is absurd, but rendering it as `undefined` is worse
    const exponent =
        forced >= 0
            ? forced
            : Math.min(
                  safeBytes === 0 ? 0 : Math.floor(Math.log(safeBytes) / Math.log(step)),
                  units.length - 1
              )

    const value = safeBytes / step ** exponent
    return `${String(Number(value.toFixed(decimals)))} ${units[exponent]}`
}
