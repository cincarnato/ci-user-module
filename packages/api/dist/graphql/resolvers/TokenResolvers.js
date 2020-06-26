"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TokenService = require("../../services/TokenService");

var _default = {
  Query: {
    validateToken: (_, {
      token
    }) => {
      return (0, _TokenService.validateToken)(token);
    }
  }
};
exports.default = _default;