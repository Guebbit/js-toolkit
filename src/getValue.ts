/**
 * Get value of an HTML element
 *
 * @param element
 * @param attribute - if not empty: it's an attribute
 */
export default (element :HTMLElement | null, attribute = '') :string | number | boolean | undefined => {
	//if non valid element
	if(!element)
		return;
	//if it's attribute
	if(attribute.length > 0)
		return element.getAttribute(attribute) ?? undefined;
	//if its checkbox\radiobutton
	if((element as HTMLInputElement).type === 'checkbox')
		return (element as HTMLInputElement).checked;
	if((element as HTMLInputElement).type === 'radio'){
		const { parentElement } = element;
		if(!parentElement)
			return;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const checked = parentElement.querySelector<HTMLInputElement>(`input[name="${element.getAttribute('name')}"]:checked`);
    return checked?.value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return (element as HTMLInputElement | HTMLSelectElement).value ?? element.textContent;
}
