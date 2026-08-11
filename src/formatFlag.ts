/**
 * Render a boolean as one of two labels, keeping "unset" distinct from "false".
 *
 * The distinction is the whole point: a nullish flag means nobody has answered the question, and
 * showing "No" for it asserts something the data does not say.
 *
 * @param {boolean} value - the flag
 * @param {string} trueLabel - already translated
 * @param {string} falseLabel - already translated
 * @param {string} empty - what to show when the flag is unset
 */
export default (
    value: boolean | null | undefined,
    trueLabel: string,
    falseLabel: string,
    empty = '—'
): string => {
    if (value === undefined || value === null) return empty
    return value ? trueLabel : falseLabel
}
