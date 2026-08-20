/**
 * Seconds per unit, and the ASCII label each renders with.
 *
 * A "month" is 30 days and a "year" 365, since a bare duration has no calendar to anchor to.
 * Reach for a date library when the answer has to respect real months.
 */
const UNITS = {
    years: { seconds: 31_536_000, suffix: 'y' },
    months: { seconds: 2_592_000, suffix: 'mo' },
    weeks: { seconds: 604_800, suffix: 'w' },
    days: { seconds: 86_400, suffix: 'd' },
    hours: { seconds: 3600, suffix: 'h' },
    minutes: { seconds: 60, suffix: 'm' },
    seconds: { seconds: 1, suffix: 's' }
} as const

export type TDurationUnit = keyof typeof UNITS

export interface IFormatDurationOptions {
    /**
     * Which units to render. Order does not matter — they are always applied largest first.
     *
     * The largest one absorbs everything above it, so `['hours', 'minutes']` on a three-day
     * duration renders `72h 5m` rather than dropping the days on the floor. Only the units named
     * here take part: asking for `['days', 'minutes']` folds the hours into the minutes rather
     * than losing them, which is why the cascade runs over this list and not over every unit that
     * exists.
     */
    units?: readonly TDurationUnit[]
}

/**
 * Render a duration compactly: `2h 15m`, `15m`, `3d 4h 5m`.
 *
 * Leading units that come out zero are dropped, so a short duration reads as `15m` rather than
 * `0h 15m`. The smallest requested unit is always kept, which is what makes a zero duration
 * render as `0m` instead of as an empty string.
 *
 * The labels are ASCII abbreviations and deliberately not localised — this is for a status line
 * or a metrics panel, where they sit beside other machine-shaped values. Reach for
 * `Intl.RelativeTimeFormat` when the duration is prose the reader is meant to absorb.
 *
 * @param {number} seconds - duration in seconds; negatives and non-finite values are treated as 0
 * @param {IFormatDurationOptions} options
 */
export default (
    seconds: number,
    { units = ['hours', 'minutes'] }: IFormatDurationOptions = {}
): string => {
    // Sorted here rather than trusted from the caller: a list in the wrong order would otherwise
    // give the smallest unit the whole duration and leave the rest at zero
    const ordered = [...new Set(units)].sort((a, b) => UNITS[b].seconds - UNITS[a].seconds)
    if (ordered.length === 0) return ''

    let remaining = Number.isFinite(seconds) && seconds > 0 ? seconds : 0

    const values = ordered.map((unit) => {
        const value = Math.floor(remaining / UNITS[unit].seconds)
        remaining -= value * UNITS[unit].seconds
        return value
    })

    // Never past the last entry, so the smallest unit survives however small the duration is
    const firstNonZero = values.findIndex((value) => value > 0)
    const from = firstNonZero === -1 ? values.length - 1 : firstNonZero

    return ordered
        .slice(from)
        .map((unit, index) => `${String(values[from + index])}${UNITS[unit].suffix}`)
        .join(' ')
}
