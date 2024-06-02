"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Control if parameter is json
 * @param test
 * @return json or false
 */
exports.default = (test) => {
    try {
        return JSON.parse(test);
    }
    catch (e) {
        return false;
    }
};
//# sourceMappingURL=isJson.js.map