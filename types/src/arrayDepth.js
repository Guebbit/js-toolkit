"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get array depth
 *
 * @param {*} check
 */
function arrayDepth(check) {
    return Array.isArray(check) ?
        1 + Math.max(0, ...check.map(arrayDepth)) :
        0;
}
exports.default = arrayDepth;
//# sourceMappingURL=arrayDepth.js.map