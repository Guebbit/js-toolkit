export interface ISecondsToTimeMap {
    // remainder after every larger unit has been taken out
    years: number
    months: number
    weeks: number
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
    // the whole duration expressed in that one unit
    yearsOnly: number
    monthsOnly: number
    weeksOnly: number
    daysOnly: number
    hoursOnly: number
    minutesOnly: number
    secondsOnly: number
    millisecondsOnly: number
}

// A "month" is 30 days and a "year" 365, since a duration has no calendar to
// anchor to. Use a date library when the answer has to respect real months.
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
 * @param {number} time - duration in milliseconds
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
