/**
 * Javascript appendChild for arrays
 *
 * @param element
 * @param children
 */
export default (element: HTMLElement | Element, ...children: (HTMLElement | Element | (HTMLElement | Element)[])[]): HTMLElement | Element => {
    const documentFragment = document.createDocumentFragment();

    for (const child of children) {
        if (Array.isArray(child)) {
            for (const nested of child) {
                documentFragment.append(nested);
            }
        } else {
            documentFragment.append(child);
        }
    }

    element.append(documentFragment);
    return element;
};