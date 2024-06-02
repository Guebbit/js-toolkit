"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* 	Determino se si tratta di una mail
*	@param string string
*	@return boolean
**/
exports.default = (string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string);
};
//# sourceMappingURL=isEmail.js.map