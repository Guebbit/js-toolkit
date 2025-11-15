import getValue from "./getValue";

/**
 * Get all values from different input and textareas
 * @param form
 * @param selectors
 * @return array of ["name":"value"]
 */
export default (form :HTMLElement | null, selectors = "input, textarea, select") :Record<string, unknown> => {
	if(!form)
		return {};
	let index:number;
  let temporary:string | null;

	const results :Record<string, unknown> = {};
  const	elementsArray = [...form.querySelectorAll(selectors)];

	for (index = elementsArray.length; index--; ){
		temporary = (elementsArray[index] as HTMLElement).getAttribute("name");
		if(temporary)
			results[temporary] = getValue(elementsArray[index] as HTMLElement);
	}
	return results;
}
