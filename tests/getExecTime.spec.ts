import { getExecTime } from '../src'

describe('(getExecTime) measure execution time of a function', () => {
    test('resolves with the result of a synchronous function', async () => {
        const { result } = await getExecTime(() => 42)
        expect(result).toBe(42)
    })

    test('resolves with the result of an asynchronous function', async () => {
        const { result } = await getExecTime(() => Promise.resolve('done'))
        expect(result).toBe('done')
    })

    test('measures a non-negative elapsed time in milliseconds', async () => {
        const { time } = await getExecTime(() => {
            let total = 0
            for (let index = 0; index < 1e5; index++) total += index
            return total
        })
        expect(typeof time).toBe('number')
        expect(time).toBeGreaterThanOrEqual(0)
        // An upper bound is what makes this a measurement rather than a type
        // check: without it the unit conversion could be inverted, or the two
        // timestamps added instead of subtracted, and nothing would notice.
        // A minute is far past any plausible runtime for the loop above, so the
        // bound cannot flake on a loaded machine.
        expect(time).toBeLessThan(60_000)
    })

    test('throws synchronously when the timed function throws synchronously', () => {
        expect(() =>
            getExecTime(() => {
                throw new Error('boom')
            })
        ).toThrow('boom')
    })

    test('rejects when the timed function returns a rejected promise', async () => {
        await expect(getExecTime(() => Promise.reject(new Error('async boom')))).rejects.toThrow(
            'async boom'
        )
    })
})
