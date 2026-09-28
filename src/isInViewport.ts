/**
 * @module
 * Viewport hit test: the element's rect from `getBoundingClientRect` is
 * compared against the viewport size, either requiring all four edges inside
 * (`fully`) or just any overlap.
 */

/**
 * Check if an element is within the viewport.
 *
 * @param element - element to test
 * @param fully - require the element to be entirely inside the viewport, instead of just partially
 */
export default (element: Element, fully = false): boolean => {
    const { top, left, bottom, right } = element.getBoundingClientRect()
    // DOM: innerHeight/innerWidth are 0 outside a browsing context (some iframes) —
    // documentElement's client size is the fallback.
    const height = window.innerHeight || document.documentElement.clientHeight
    const width = window.innerWidth || document.documentElement.clientWidth

    if (fully) return top >= 0 && left >= 0 && bottom <= height && right <= width

    return top < height && bottom > 0 && left < width && right > 0
}
