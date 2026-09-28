/**
 * @module
 * The element's centre is derived from its layout box: `getBoundingClientRect`
 * gives the viewport-relative rect, and the centre is its top-left corner offset
 * by half its own width and height.
 */

/**
 * Centre point of an HTML element, as [x, y] viewport coordinates.
 *
 * A tuple rather than number[]: callers destructure the pair, and an array type
 * quietly drops the guarantee that there are exactly two values.
 *
 * @param element - the element to measure
 */
export default (element: Element): [number, number] => {
    // DOM: getBoundingClientRect() returns the element's box relative to the viewport,
    // not the document — it moves as the page scrolls.
    const rect = element.getBoundingClientRect()
    return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}
