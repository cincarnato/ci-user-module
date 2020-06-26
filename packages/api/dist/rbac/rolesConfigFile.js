"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const rolesConfigFile = [{
  name: 'admin',
  permissions: ["SECURITY-ADMIN-CREATE", "SECURITY-ADMIN-UPDATE", "SECURITY-ADMIN-DELETE"]
}, {
  name: 'user',
  permissions: []
}];
const roleConfigPromise = new Promise(resolve => {
  resolve(rolesConfigFile);
});
var _default = roleConfigPromise;
exports.default = _default;