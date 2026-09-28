/**
 * @module
 * Appends one or more children — or arrays of children — to a parent element.
 * Children are collected into a DocumentFragment first, so the DOM receives a
 * single append regardless of how many children were passed.
 */

/**
 * Append any number of children (or arrays of children) to an element in one DOM operation.
 *
 * @param element - the parent node to append to
 * @param children - nodes, or arrays of nodes, appended in the given order
 * @returns the same `element`, for chaining
 */
export default (
    element: HTMLElement | Element,
    ...children: (HTMLElement | Element | (HTMLElement | Element)[])[]
): HTMLElement | Element => {
    // DOM: batch children into a fragment so the live tree is touched once, not per child.
    const documentFragment = document.createDocumentFragment()

    for (const child of children) {
        if (Array.isArray(child)) {
            for (const nested of child) {
                documentFragment.append(nested)
            }
        } else {
            documentFragment.append(child)
        }
    }

    element.append(documentFragment)
    return element
}
