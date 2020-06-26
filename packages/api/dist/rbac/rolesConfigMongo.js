"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RoleModel = _interopRequireDefault(require("../models/RoleModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const roleConfigPromise = _RoleModel.default.find({});

var _default = roleConfigPromise;
exports.default = _default;