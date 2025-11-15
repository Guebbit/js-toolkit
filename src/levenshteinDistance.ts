/*
	Copyright (c) 2011 Andrei Mackenzie
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Compute the edit distance between the two given strings
 * Mathematical formula
 *
 * @param a - string to check
 * @param b - same as above, order is not important
 */
export default (a ?:string | null, b ?:string | null) :number => {
	//declaration
	const matrix:number[][] = [];
	let index:number,
		index_:number;

	if(!a && !b)
		return 999;
	if(a === b)
		return 0;
	//checks
	if(!a || a.length === 0)
		return b!.length;
  if(!b || b.length === 0)
		return a.length;


	// increment along the first column of each row
	for(index = 0; index <= b.length; index++)
		matrix[index] = [index];
    // increment each column in the first row
	for(index_ = 0; index_ <= a.length; index_++)
		matrix[0][index_] = index_;

	// Fill in the rest of the matrix
	for(index = 1; index <= b.length; index++)
		for(index_ = 1; index_ <= (a).length; index_++)
			matrix[index][index_] =
                b.charAt(index - 1) == a.charAt(index_ - 1)
                    ? matrix[index - 1][index_ - 1]
                    : Math.min(
                          matrix[index - 1][index_ - 1] + 1, // substitution
                          Math.min(
                              matrix[index][index_ - 1] + 1, // insertion
                              matrix[index - 1][index_] + 1 // deletion
                          )
                      )

  	//result
    return matrix[b.length][a.length];
};
