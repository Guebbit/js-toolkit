/**
 * Converts a single HTMLElement or a collection of HTMLElements into a standardized array of HTMLElements.
 *
 * NodeList and HTMLCollection are both expanded: they are iterable collections,
 * not elements, and wrapping one whole would hand the caller a single-item array
 * holding the collection itself.
 *
 * @param elementsArray
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
