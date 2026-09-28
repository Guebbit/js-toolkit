/**
 * Shared DOM fixtures for layout-dependent specs.
 *
 * jsdom has the DOM's shape, not its behaviour: it never runs layout, so a real
 * element's `getBoundingClientRect()` is always all zeroes. `stubRect` stands in
 * for an element whose rect is asserted against, instead of every spec
 * hand-rolling the same duck-typed mock.
 */

/**
 * A stand-in for an `Element` whose `getBoundingClientRect()` returns a fixed
 * rect. Only that one method is stubbed — enough for helpers that read layout
 * and nothing else (`getElementCenter`, `isInViewport`).
 *
 * @param rect the rect the stub reports
 * @returns an object cast to `Element`; it is not a real one
 */
export const stubRect = (rect: Partial<DOMRect>): Element =>
    ({
        getBoundingClientRect: jest.fn().mockReturnValue(rect)
    }) as unknown as Element

/**
 * Mount markup as the test document's body.
 *
 * @param html the fixture markup
 */
export const mountFixture = (html: string): void => {
    document.body.innerHTML = html
}

/**
 * Clear the test document's body. Call from `afterEach` so a fixture never
 * survives into the next test.
 */
export const resetFixture = (): void => {
    document.body.innerHTML = ''
}
