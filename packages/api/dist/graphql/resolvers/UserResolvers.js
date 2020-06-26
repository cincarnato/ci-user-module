"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UserService = require("../../services/UserService");

var _apolloServerExpress = require("apollo-server-express");

var _permissions = require("../../permissions");

var _default = {
  Query: {
    users: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.findUsers)();
    },
    user: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.findUser)(id);
    },
    paginateUsers: (_, {
      limit,
      pageNumber,
      search,
      orderBy,
      orderDesc
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.paginateUsers)(limit, pageNumber, search, orderBy, orderDesc);
    }
  },
  Mutation: {
    createUser: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_CREATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.createUser)(input, user);
    },
    updateUser: (_, {
      id,
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_EDIT)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.updateUser)(id, input, user);
    },
    deleteUser: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_DELETE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.deleteUser)(id, user);
    },
    changePasswordAdmin: (_, {
      id,
      password,
      passwordVerify
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_USER_EDIT)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _UserService.changePasswordAdmin)(id, {
        password,
        passwordVerify
      }, user);
    }
  }
};
exports.default = _default;