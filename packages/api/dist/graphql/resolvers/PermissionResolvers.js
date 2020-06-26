"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PermissionService = require("../../services/PermissionService");

var _apolloServerExpress = require("apollo-server-express");

var _permissions = require("../../permissions");

var _default = {
  Query: {
    permissions: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return new Promise((resolve, reject) => {
        (0, _PermissionService.fetchPermissions)().then(permissions => {
          resolve({
            permissions: permissions.map(p => p.name)
          });
        }).catch(e => reject(e));
      });
    }
  }
};
exports.default = _default;