"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GroupService = require("../../services/GroupService");

var _permissions = require("../../permissions");

var _apolloServerExpress = require("apollo-server-express");

var _default = {
  Query: {
    groups: (_, {}, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.fetchGroups)();
    },
    group: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.findGroup)(id);
    },
    groupsPaginate: (_, {
      limit,
      pageNumber,
      search,
      orderBy,
      orderDesc
    }, {
      user,
      rbac
    }) => {
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_SHOW)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.paginateGroup)(limit, pageNumber, search, orderBy, orderDesc);
    }
  },
  Mutation: {
    groupCreate: (_, {
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!user || !rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_CREATE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.createGroup)(user, input);
    },
    groupUpdate: (_, {
      id,
      input
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_EDIT)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.updateGroup)(user, id, input);
    },
    groupDelete: (_, {
      id
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, _permissions.SECURITY_GROUP_DELETE)) throw new _apolloServerExpress.ForbiddenError("Not Authorized");
      return (0, _GroupService.deleteGroup)(id);
    }
  }
};
exports.default = _default;