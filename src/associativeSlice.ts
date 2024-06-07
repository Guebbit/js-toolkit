/**
* 	slice associative arrays / objects
*	  Funziona come array.slice() ma i numeri sono "immaginari", basati sull'ordine in cui sono stati inseriti
* 	@param object associative array / object to slice
* 	@param integer start = start of slice
* 	@param integer endd = end of slice
* 	@return object sliced associative array / object to slice
**/
export default (obj :Record<string, unknown>, start :number, endd :number) :Record<string, unknown> => {
	const sliced :Record<string, unknown> = {};
	let i = 0;
	for (const k in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, k)){
			if (i >= start && i < endd){
				sliced[k] = obj[k];
			}
			i++;
		}
	}
	return sliced;
}
