import { isInViewport } from '../src'

const mockElement = (rect: Partial<DOMRect>) =>
    ({
        getBoundingClientRect: jest.fn().mockReturnValue(rect)
        // @ts-expect-error this is a poor mock of an Element
    }) as Element

beforeAll(() => {
    Object.defineProperty(globalThis, 'innerWidth', { value: 1024, configurable: true })
    Object.defineProperty(globalThis, 'innerHeight', { value: 768, configurable: true })
})

describe('isInViewport', () => {
    test('true for an element fully inside the viewport', () => {
        expect(isInViewport(mockElement({ top: 10, left: 10, bottom: 100, right: 100 }))).toBe(true)
    })

    test('true for an element only partially inside the viewport', () => {
        expect(isInViewport(mockElement({ top: -50, left: 10, bottom: 50, right: 100 }))).toBe(true)
    })

    test('false for an element entirely outside the viewport', () => {
        expect(isInViewport(mockElement({ top: 2000, left: 10, bottom: 2100, right: 100 }))).toBe(
            false
        )
    })

    test('fully: false for a partially visible element', () => {
        expect(
            isInViewport(mockElement({ top: -50, left: 10, bottom: 50, right: 100 }), true)
        ).toBe(false)
    })

    test('fully: true only when entirely inside the viewport', () => {
        expect(
            isInViewport(mockElement({ top: 10, left: 10, bottom: 100, right: 100 }), true)
        ).toBe(true)
    })
})
