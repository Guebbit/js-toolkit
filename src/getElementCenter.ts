/**
 * Centre point of an HTML element, as [x, y] viewport coordinates.
 *
 * A tuple rather than number[]: callers destructure the pair, and an array type
 * quietly drops the guarantee that there are exactly two values.
 *
 * @param element
 */
export default (element: Element): [number, number] => {
    const rect = element.getBoundingClientRect()
    return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}
