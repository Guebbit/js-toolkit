"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Divide array in equals sub arrays
 *
 * @param {array} array - array to split
 * @param {number} n - number of chunks (sub arrays)
 */
exports.default = (array, n = 0) => {
    const items = Object.assign([], array);
    return new Array(Math.ceil(items.length / n)).fill([]).map(() => items.splice(0, n));
};
//# sourceMappingURL=arrayDivide.js.map