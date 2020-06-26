"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RegisterService = require("../../services/RegisterService");

var _default = {
  Mutation: {
    register: (_, {
      input
    }) => {
      return (0, _RegisterService.registerUser)(input);
    },
    activationUser: (_, {
      token
    }, {
      req
    }) => {
      return (0, _RegisterService.activationUser)(token, req);
    }
  }
};
exports.default = _default;