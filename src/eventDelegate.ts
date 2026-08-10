/**
 * Listen for an event on {parent} and run {callback} only when it originated
 * inside a matching child. One listener covers children that do not exist yet,
 * which is the point of delegating.
 *
 * Inside the callback `this` is the matched child, not {parent}.
 *
 * @param eventName - click, pointerdown, etc
 * @param childSelector - a CSS selector, or a Node the target must be inside
 * @param callback
 * @param parent
 * @return a function that removes the listener — the only way to remove it,
 *         since the registered listener is created here and never exposed
 */
export default (
    eventName: string,
    childSelector: string | Node,
    callback: (this: Element, event: Event) => void,
    parent: Node | Window | typeof globalThis = globalThis
): (() => void) => {
    const listener = (event: Event): void => {
        const target = event.target as Element | null
        if (!target) return

        const matchingChild =
            typeof childSelector === 'string'
                ? target.closest(childSelector)
                : // a Node contains itself, so clicking the delegate target counts
                  childSelector.contains(target)
                  ? target
                  : undefined

        if (matchingChild) callback.call(matchingChild, event)
    }

    parent.addEventListener(eventName, listener)
    return () => {
        parent.removeEventListener(eventName, listener)
    }
}
