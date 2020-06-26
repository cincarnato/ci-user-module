"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressJwt = _interopRequireDefault(require("express-jwt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const jwtMiddleware = (0, _expressJwt.default)({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});
var _default = jwtMiddleware;
exports.default = _default;