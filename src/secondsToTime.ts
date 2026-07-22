export interface ISecondsToTimeMap {
    years?: number
    yearsOnly?: number
    months?: number
    monthsOnly?: number
    weeks?: number
    weeksOnly?: number
    days?: number
    daysOnly?: number
    hours?: number
    hoursOnly?: number
    minutes?: number
    minutesOnly?: number
    seconds?: number
    secondsOnly?: number
    milliseconds?: number
    millisecondsOnly?: number
}

/**
 * Transform milliseconds in minutes/hours/days/etc
 * Return object with numerous variantions, to recombine later as one want
 *
 * @param {number} time
 * @return {Object}
 */
export default (time = 0) => {
    // millisecondsOnly = is the same
    // secondsOnly = same but /1000
    const timeFactory: Record<string, number> = {
        years: 31_536_000_000,
        months: 2_592_000_000,
        weeks: 604_800_000,
        days: 86_400_000,
        hours: 3_600_000,
        minutes: 60_000,
        seconds: 1000,
        milliseconds: 1
    }
    let timeDepletion = time
    const timeObject: ISecondsToTimeMap = {}
    // loop
    for (const [key, factor] of Object.entries(timeFactory)) {
        timeObject[(key + 'Only') as keyof ISecondsToTimeMap] = Math.floor(time / factor)
        timeObject[key as keyof ISecondsToTimeMap] = Math.floor(timeDepletion / factor)
        timeDepletion -= timeObject[key as keyof ISecondsToTimeMap]! * factor
    }
    // final object
    return timeObject
}
