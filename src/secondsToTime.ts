/**
 * @module
 * Splits a millisecond duration into calendar-style units by repeated integer division:
 * each unit is peeled off from largest to smallest, and the "Only" fields recompute the
 * same duration expressed in a single unit instead of as a remainder.
 */

/**
 * A duration broken into every unit at once, both as remainders and as single-unit totals.
 */
export interface ISecondsToTimeMap {
    /**
     * Whole years, after nothing larger has been taken out.
     */
    years: number
    /**
     * Remainder months, after years have been taken out.
     */
    months: number
    /**
     * Remainder weeks, after years and months have been taken out.
     */
    weeks: number
    /**
     * Remainder days, after years, months and weeks have been taken out.
     */
    days: number
    /**
     * Remainder hours, after years, months, weeks and days have been taken out.
     */
    hours: number
    /**
     * Remainder minutes, after every larger unit has been taken out.
     */
    minutes: number
    /**
     * Remainder seconds, after every larger unit has been taken out.
     */
    seconds: number
    /**
     * Remainder milliseconds, after every larger unit has been taken out.
     */
    milliseconds: number
    /**
     * The whole duration expressed in years alone.
     */
    yearsOnly: number
    /**
     * The whole duration expressed in months alone.
     */
    monthsOnly: number
    /**
     * The whole duration expressed in weeks alone.
     */
    weeksOnly: number
    /**
     * The whole duration expressed in days alone.
     */
    daysOnly: number
    /**
     * The whole duration expressed in hours alone.
     */
    hoursOnly: number
    /**
     * The whole duration expressed in minutes alone.
     */
    minutesOnly: number
    /**
     * The whole duration expressed in seconds alone.
     */
    secondsOnly: number
    /**
     * The whole duration expressed in milliseconds alone (same as the input).
     */
    millisecondsOnly: number
}

/**
 * Milliseconds in one of each unit.
 *
 * A "month" is 30 days and a "year" 365, since a duration has no calendar to anchor to.
 * Use a date library when the answer has to respect real months.
 */
const factors = {
    years: 31_536_000_000,
    months: 2_592_000_000,
    weeks: 604_800_000,
    days: 86_400_000,
    hours: 3_600_000,
    minutes: 60_000,
    seconds: 1000,
    milliseconds: 1
} as const

/**
 * Break a duration in milliseconds into every unit at once.
 *
 * Each unit appears twice: `hours` is what is left after years, months, weeks
 * and days have been taken out, while `hoursOnly` is the whole duration counted
 * in hours. Recombine whichever set the caller needs.
 *
 * Every field is always present, so callers never need a non-null assertion to
 * read one.
 *
 * @param time - duration in milliseconds
 */
export default (time = 0): ISecondsToTimeMap => {
    const result = {} as ISecondsToTimeMap
    let remaining = time

    for (const [unit, factor] of Object.entries(factors) as [keyof typeof factors, number][]) {
        result[`${unit}Only`] = Math.floor(time / factor)
        result[unit] = Math.floor(remaining / factor)
        remaining -= result[unit] * factor
    }

    return result
}
