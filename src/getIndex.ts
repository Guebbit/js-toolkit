/**
 * @module
 * An element's index is its position among its parent's children, read straight
 * off `parentElement.children` — no element or no parent both mean "not in a tree".
 */

/**
 * Equivalent of jQuery's `.index()`: an element's position among its siblings.
 *
 * @param element - the element to locate
 * @returns the zero-based index among its parent's children, or `-1` if it has none
 */
export default (element: HTMLElement | null): number => {
    if (!element) return -1
    const parent: HTMLElement | null = element.parentElement
    if (!parent) return -1
    return [...parent.children].indexOf(element)
}
