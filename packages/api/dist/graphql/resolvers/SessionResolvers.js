"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SessionService = require("../../services/SessionService");

var _apolloServerExpress = require("apollo-server-express");

var _permissions = require("../../permissions");

var _default = {
  Query: {
    sessionsByUser: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByUser)(30, 'days');
    },
    sessionsByCountry: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByCountry)(30, 'days');
    },
    sessionsByOs: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByOs)(30, 'days');
    },
    sessionsByDeviceType: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByDeviceType)(30, 'days');
    },
    sessionsByCity: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByCity)(30, 'days');
    },
    sessionsByClient: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _SessionService.sessionsByClient)(30, 'days');
    }
  }
};
exports.default = _default;