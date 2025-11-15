import arrayDivide from './arrayDivide';

/**
 * Divide array in N numbers of sub-arrays.
 * Sub-arrays' lengths differ as less as possible
 *
 * @param {array} array - array to split
 * @param {number} n - number of chunks
 */
export default <T>(array: T[], n: number) :T[][] => {
  const items = Object.assign([] as T[], array),
    length_ = items.length,
    output: T[][] = [];
  let index = 0;

  if (n < 1)
    return [];
  if (n < 2)
    return [items];
  if (length_ % n === 0)
    return arrayDivide(items, Math.floor(length_ / n));

  while (index < length_)
    output.push(
      items.slice(index, index += Math.ceil((length_ - index) / n--))
    );
  return output;
}
