/**
 * Safe conversion of JSON
 * If not valid: return undefined
 *
 * @param {string} json
 * @return {Object?}
 */
export default (json?: string): unknown => {
    if (!json) return
    let decoded: unknown = undefined
    try {
        decoded = JSON.parse(json)
    } catch (error) {
        //eslint-disable-next-line no-console
        console.error(error)
    }
    return decoded
}
