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

    // Partial branch: top < height && bottom > 0 && left < width && right > 0
    // Each case makes exactly one boundary fail so every comparison is exercised.
    describe('partial branch boundaries', () => {
        test('false when top equals the viewport height', () => {
            expect(isInViewport(mockElement({ top: 768, left: 10, bottom: 800, right: 100 }))).toBe(
                false
            )
        })
        test('false when bottom sits exactly on the top edge', () => {
            expect(isInViewport(mockElement({ top: -50, left: 10, bottom: 0, right: 100 }))).toBe(
                false
            )
        })
        test('false when left equals the viewport width', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 1024, bottom: 100, right: 1100 }))
            ).toBe(false)
        })
        test('false when right sits exactly on the left edge', () => {
            expect(isInViewport(mockElement({ top: 10, left: -50, bottom: 100, right: 0 }))).toBe(
                false
            )
        })
    })

    // Fully branch: top >= 0 && left >= 0 && bottom <= height && right <= width
    describe('fully branch boundaries', () => {
        test('true when top rests exactly on 0', () => {
            expect(
                isInViewport(mockElement({ top: 0, left: 10, bottom: 100, right: 100 }), true)
            ).toBe(true)
        })
        test('false when top is just above 0', () => {
            expect(
                isInViewport(mockElement({ top: -1, left: 10, bottom: 100, right: 100 }), true)
            ).toBe(false)
        })
        test('true when left rests exactly on 0', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 0, bottom: 100, right: 100 }), true)
            ).toBe(true)
        })
        test('false when left is just off the left edge', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: -1, bottom: 100, right: 100 }), true)
            ).toBe(false)
        })
        test('true when bottom rests exactly on the viewport height', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 10, bottom: 768, right: 100 }), true)
            ).toBe(true)
        })
        test('false when bottom is one pixel below the viewport', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 10, bottom: 769, right: 100 }), true)
            ).toBe(false)
        })
        test('true when right rests exactly on the viewport width', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 10, bottom: 100, right: 1024 }), true)
            ).toBe(true)
        })
        test('false when right is one pixel past the viewport', () => {
            expect(
                isInViewport(mockElement({ top: 10, left: 10, bottom: 100, right: 1025 }), true)
            ).toBe(false)
        })
    })
})
