/**
 * @module
 * DOM sibling lookup: reads the parent's `children`, then filters the element
 * itself out. Equivalent to jQuery's `.siblings()`.
 */

/**
 * Equivalent of Jquery .siblings()
 *
 * @param element - element whose siblings to collect
 * @returns the sibling elements, or an empty array when there is no parent
 */
export default (element: HTMLElement | Element | null) => {
    if (!element) return [] as Element[]
    // DOM: parentNode is typed as Node, which has no children — cast to reach it.
    const { children } = (element.parentNode as HTMLElement | null) ?? {}
    if (!children) return [] as Element[]
    return Array.prototype.slice.call(children).filter((child) => child !== element) as Element[]
}
