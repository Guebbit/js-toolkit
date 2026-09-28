/**
 * @module
 * Normalises the several shapes a DOM query can return — one element, an array, a live
 * `NodeList` or `HTMLCollection` — into a single plain array, so callers only ever iterate one
 * shape.
 */

/**
 * Converts a single HTMLElement or a collection of HTMLElements into a standardized array of HTMLElements.
 *
 * NodeList and HTMLCollection are both expanded: they are iterable collections,
 * not elements, and wrapping one whole would hand the caller a single-item array
 * holding the collection itself.
 *
 * @param elementsArray - a single element, an array of them, or a live DOM collection
 */
export default (
    elementsArray?: HTMLElement | HTMLElement[] | NodeList | HTMLCollection | null
): HTMLElement[] => {
    if (!elementsArray) return []
    if (Array.isArray(elementsArray)) return [...elementsArray]
    if (elementsArray instanceof NodeList || elementsArray instanceof HTMLCollection)
        return [...elementsArray] as HTMLElement[]
    return [elementsArray]
}
