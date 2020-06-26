"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _permissions = require("../permissions");

var _PermissionService = require("../services/PermissionService");

async function adminRole() {
  let permissions = [];
  const p = await (0, _PermissionService.fetchPermissions)();
  permissions = p.map(p => p.name);

  if (!permissions) {
    permissions = [_permissions.SECURITY_USER_CREATE, _permissions.SECURITY_USER_EDIT, _permissions.SECURITY_USER_DELETE, _permissions.SECURITY_USER_SHOW, _permissions.SECURITY_GROUP_CREATE, _permissions.SECURITY_GROUP_EDIT, _permissions.SECURITY_GROUP_DELETE, _permissions.SECURITY_GROUP_SHOW, _permissions.SECURITY_ROLE_CREATE, _permissions.SECURITY_ROLE_SHOW, _permissions.SECURITY_ROLE_EDIT, _permissions.SECURITY_ROLE_DELETE, _permissions.SECURITY_DASHBOARD_SHOW];
  }

  return {
    name: "admin",
    permissions: permissions
  };
}

var _default = adminRole();

exports.default = _default;