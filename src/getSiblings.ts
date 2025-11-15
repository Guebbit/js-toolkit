/**
 * Equivalent of Jquery .siblings()
 *
 * @param element
 */
export default (element: HTMLElement | Element | null) => {
	if(!element)
		return [] as Element[];
	const { children } = element.parentNode as HTMLElement | null ?? {};
    if(!children)
        return [] as Element[];
	return Array.prototype.slice.call(children).filter(child => child !== element) as Element[];
}
