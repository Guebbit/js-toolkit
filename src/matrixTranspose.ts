/**
 *  Transpose a matrix. Invert rows and columns
 *   [1,2,3],      [1,1,1],
 *   [1,2,3], =>   [2,2,2],
 *   [1,2,3],      [3,3,3],
 * @param m
 */
export default <T>(m: (T | undefined)[][]) :(T | undefined)[][] => {
	if(m.length === 0 || !m[0])
		return [];
	return m[0].map((_x,index) => m.map(x => x[index]))
}
