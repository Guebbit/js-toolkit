/**
 * @module
 * Times a function by bracketing its call with two `process.hrtime.bigint()`
 * readings. The function's own return is normalised through `Promise.resolve`, so
 * a sync or async function is timed the same way.
 */

/**
 * Get execution time of any function.
 *
 * @param function_ - the function to time, sync or async
 * @returns the function's own result alongside the elapsed time in milliseconds
 */
export default <T>(function_: () => T | Promise<T>) => {
    // Node: hrtime.bigint() is a monotonic clock in nanoseconds, immune to
    // system-clock adjustments — unlike Date.now(), safe to subtract for a duration.
    const start = process.hrtime.bigint()
    return Promise.resolve(function_()).then((result) => {
        const end = process.hrtime.bigint()
        return {
            result,
            // nanoseconds -> milliseconds
            time: Number(end - start) / 1_000_000
        }
    })
}
