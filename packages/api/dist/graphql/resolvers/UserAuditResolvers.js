"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UserAuditService = require("../../services/UserAuditService");

var _apolloServerExpress = require("apollo-server-express");

var _permissions = require("../../permissions");

var _default = {
  Query: {
    userAuditsFrom: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserAuditService.fetchUserAuditsFrom)(30, 'days');
    },
    userAuditsLimit: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserAuditService.fetchUserAuditsLimit)(10);
    }
  }
};
exports.default = _default;