import * as toolkit from '../src'

/**
 * Guards the barrel itself: a re-export that resolves to undefined at runtime still type-checks if
 * the module shape is right, which is exactly what tests/types/surface.test-d.ts cannot see.
 */
describe('barrel', () => {
    test('every export is a callable function', () => {
        const values = Object.values(toolkit)
        expect(values).toHaveLength(46)
        expect(values.every((value) => typeof value === 'function')).toBe(true)
    })
})
