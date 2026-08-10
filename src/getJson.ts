/**
 * Safe conversion of JSON.
 * If not valid: return undefined
 *
 * Invalid input is reported through the return value, not through the console:
 * parsing something that might not be JSON is the whole reason to reach for this
 * instead of JSON.parse, so a malformed string is an expected input and a
 * library has no business writing to the host's console over one.
 *
 * @param {string} json
 * @return {unknown} the parsed value, undefined if {json} is empty or invalid
 */
export default (json?: string): unknown => {
    if (!json) return
    try {
        return JSON.parse(json)
    } catch {
        // Mutation testing: emptying this catch survives and is equivalent —
        // falling off the end of the function also yields undefined, which is
        // exactly the failure value. The explicit return states the contract;
        // it is not what produces it. Do not chase it.
        return undefined
    }
}
