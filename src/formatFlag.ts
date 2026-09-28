/**
 * @module
 * Renders a tri-state boolean (`true` / `false` / nullish) as one of three labels, treating
 * nullish as its own state rather than coercing it to `false`.
 */

/**
 * Render a boolean as one of two labels, keeping "unset" distinct from "false".
 *
 * The distinction is the whole point: a nullish flag means nobody has answered the question, and
 * showing "No" for it asserts something the data does not say.
 *
 * @param value - the flag
 * @param trueLabel - already translated
 * @param falseLabel - already translated
 * @param empty - what to show when the flag is unset
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
