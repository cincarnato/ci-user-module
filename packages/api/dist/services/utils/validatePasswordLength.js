"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const validatePasswordLength = function (password) {
  const minimunLength = process.env.PASSWORD_MINIMUN_LENGTH ? process.env.PASSWORD_MINIMUN_LENGTH : 1;

  if (password.length >= minimunLength) {
    return true;
  } else {
    return false;
  }
};

var _default = validatePasswordLength;
exports.default = _default;