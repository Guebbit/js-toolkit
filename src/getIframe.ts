/**
 * Get content of Iframe
 *
 * @param iframe
 */
export default (iframe ?:HTMLElement | HTMLIFrameElement | Element | null) :HTMLElement | HTMLBodyElement | undefined => {
	if(iframe?.tagName !== 'IFRAME')
		return undefined;
	if(!(iframe as HTMLIFrameElement).contentWindow)
		return undefined;
	return (iframe as HTMLIFrameElement).contentWindow?.document.body;
}
