/**
 * @module
 * Walks a form's field elements (in reverse document order) and collects each
 * one's current value under its `name` attribute, delegating the read of each
 * element's value to `getValue` so every field type is handled the same way.
 */

import getValue from './getValue.js'

/**
 * Get all values from different inputs, textareas and selects inside a form.
 *
 * @param form - the container to search within, or `null` for an empty result
 * @param selectors - CSS selector matching the fields to collect
 * @returns a map of field name to its current value
 */
export default (
    form: HTMLElement | null,
    selectors = 'input, textarea, select'
): Record<string, unknown> => {
    if (!form) return {}
    let index: number
    let temporary: string | null

    const results: Record<string, unknown> = {}
    const elementsArray = [...form.querySelectorAll(selectors)]

    for (index = elementsArray.length; index--;) {
        temporary = (elementsArray[index] as HTMLElement).getAttribute('name')
        if (temporary) results[temporary] = getValue(elementsArray[index] as HTMLElement)
    }
    return results
}
