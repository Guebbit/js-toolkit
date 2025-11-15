/**
 * php array_column
 * Return the values from a single or multiple {columns} from a single record or array {haystack}
 * Return always an array of arrays, to keep the same indexes and
 * return the intact the array structure to easy pair haystack with results
 *
 * @param {array} haystack
 * @param {string} columns
 * @return {Array<Array<unknown>>>}
 */
export default (haystack: Record<string, unknown>[], columns: string | string[]): unknown[] => {
  const resultArray = [];
  const isMulticolumn = Array.isArray(columns);
  const columnsArray = isMulticolumn ? columns : [columns];
  // filter
  for(let index = 0, length_ = haystack.length; index < length_; index++){
    const semiResultArray = [];
    for(let k = 0, lenk = columnsArray.length; k < lenk; k++)
      semiResultArray.push(
        haystack[index] &&
        columnsArray[k] &&
        Object.prototype.hasOwnProperty.call(haystack[index], columnsArray[k]) ?
          haystack[index][columnsArray[k]] : undefined
      )
    // Remove the extra layer if I added it
    resultArray.push(isMulticolumn ? semiResultArray : semiResultArray[0]);
  }
  return resultArray;
}
