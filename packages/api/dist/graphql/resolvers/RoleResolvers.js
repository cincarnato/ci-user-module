"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RoleService = require("../../services/RoleService");

var _permissions = require("../../permissions");

var _apolloServerExpress = require("apollo-server-express");

var _default = {
  Query: {
    roles: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _RoleService.findRoles)();
    },
    role: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _RoleService.findRole)(id);
    }
  },
  Mutation: {
    roleCreate: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_CREATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _RoleService.createRole)(input);
    },
    roleUpdate: (_, {
      id,
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_EDIT)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _RoleService.updateRole)(id, input);
    },
    roleDelete: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_ROLE_DELETE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _RoleService.deleteRole)(id);
    }
  }
};
exports.default = _default;