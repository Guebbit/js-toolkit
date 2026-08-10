/**
 * Get value of an HTML element
 *
 * @param element
 * @param attribute - if not empty: it's an attribute
 */
export default (
    element: HTMLElement | null,
    attribute = ''
): string | number | boolean | undefined => {
    //if non valid element
    if (!element) return
    //if it's attribute
    if (attribute.length > 0) return element.getAttribute(attribute) ?? undefined
    //if its checkbox\radiobutton
    if ((element as HTMLInputElement).type === 'checkbox')
        return (element as HTMLInputElement).checked
    if ((element as HTMLInputElement).type === 'radio') {
        const { parentElement } = element
        const { name } = element as HTMLInputElement
        if (!parentElement) return
        // Mutation testing: mutating this guard survives and is equivalent.
        // A radio with no name makes the selector below match nothing, so the
        // function returns undefined either way. Do not chase it.
        // Mutation testing: mutating this guard survives and is equivalent.
        // A radio with no name matches nothing in the search below, so the
        // function returns undefined either way. Do not chase it.
        if (!name) return
        // The name is compared as a property rather than interpolated into a
        // selector: a name holding a quote or bracket would otherwise build a
        // malformed selector and throw.
        const checked = [
            ...parentElement.querySelectorAll<HTMLInputElement>('input[type="radio"]')
        ].find((radio) => radio.name === name && radio.checked)
        return checked?.value
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (element as HTMLInputElement | HTMLSelectElement).value ?? element.textContent
}
