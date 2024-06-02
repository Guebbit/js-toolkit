"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
/**
 * Divide array in N numbers of sub-arrays.
 * Sub-arrays' lengths differ as less as possible
 *
 * @param {array} array - array to split
 * @param {number} n - number of chunks
 */
exports.default = (array, n) => {
    const items = Object.assign([], array), len = items.length, output = [];
    let i = 0;
    if (n < 1)
        return [];
    if (n < 2)
        return [items];
    if (len % n === 0)
        return (0, __1.arrayDivide)(items, Math.floor(len / n));
    while (i < len)
        output.push(items.slice(i, i += Math.ceil((len - i) / n--)));
    return output;
};
//# sourceMappingURL=arrayChunks.js.map