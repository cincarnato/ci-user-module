"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _rbac = _interopRequireDefault(require("../rbac"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function _default(req, res, next) {
  try {
    let user = req.user;
    const rbac = await (0, _rbac.default)();

    if (user) {
      rbac.addUserRoles(user.id, [user.role.name]);
    }

    req.rbac = rbac;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}