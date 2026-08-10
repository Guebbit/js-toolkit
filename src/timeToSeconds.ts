/**
 * Transform an 'HH:MM:SS:ms' string into milliseconds.
 *
 * Components may be omitted from the right ('14:30' is 14 hours 30 minutes).
 * An absent or blank component counts as zero, so the empty default returns 0
 * rather than poisoning the caller's arithmetic with NaN. Text that is present
 * but not a number still yields NaN, so malformed input stays visible instead
 * of quietly counting as zero.
 *
 * @param {string} date - HH:MM:SS:ms string
 * @param {string} delimiter
 */
export default (date = '', delimiter = ':'): number => {
    const [hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = date
        .split(delimiter)
        .map((part) => (part.trim() === '' ? 0 : Number.parseInt(part)))
    return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds
}
