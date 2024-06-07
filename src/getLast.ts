/**
* 	tiro fuori l'ultimo elemento di un array
* 	@param object myArray
* 	@return mixed ultimo elemento dell'array
**/
export default (myArray :unknown[]) :unknown => {
	return myArray[ myArray.length-1 ];
}
