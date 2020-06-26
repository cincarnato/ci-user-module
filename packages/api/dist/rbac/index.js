"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rbac = _interopRequireDefault(require("./rbac"));

var _rolesConfigMongo = _interopRequireDefault(require("./rolesConfigMongo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rbac = function () {
  return new Promise((resolve, reject) => {
    _rolesConfigMongo.default.then(roleConfig => {
      resolve(new _rbac.default(roleConfig));
    }).catch(error => {
      console.error(error);
      return error;
    });
  });
};

var _default = rbac;
exports.default = _default;