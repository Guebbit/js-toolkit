/**
 * Slices an associative array (object) to only include properties between specified start and end indices,
 * similar to how `Array.prototype.slice` works for arrays.
 *
 * @param obj
 * @param start - start of slice
 * @param end - end of slice
 * @return object sliced associative array / object to slice
 */
export default (object:Record<string, unknown>, start :number, end :number) :Record<string, unknown> => {
	const sliced :Record<string, unknown> = {};
	let index = 0;
	for (const k in object) {
		if(Object.prototype.hasOwnProperty.call(object, k)){
			if (index >= start && index < end){
				sliced[k] = object[k];
			}
			index++;
		}
	}
	return sliced;
}
