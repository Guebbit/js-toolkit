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
export default (a :string | null | undefined, b :string | null | undefined) :number => {
	//declaration
	const matrix:number[][] = [];
	let i :number,
		j :number;

	if(!a && !b)
		return 999;
	if(a === b)
		return 0;
	//checks
	if(!a || a.length == 0)
		return b!.length;
  if(!b || b.length == 0)
		return a.length;


	// increment along the first column of each row
	for(i = 0; i <= b.length; i++)
		matrix[i] = [i];
    // increment each column in the first row
	for(j = 0; j <= a.length; j++)
		matrix[0][j] = j;

	// Fill in the rest of the matrix
	for(i = 1; i <= b.length; i++)
		for(j = 1; j <= (a as string).length; j++)
			if(b.charAt(i-1) == (a as string).charAt(j-1))
				matrix[i][j] = matrix[i-1][j-1];
			else
				matrix[i][j] = Math.min(
					matrix[i-1][j-1] + 1, // substitution
					Math.min(
						matrix[i][j-1] + 1, // insertion
						matrix[i-1][j] + 1	// deletion
					)
				);

  	//result
    return matrix[b.length][a.length];
};
