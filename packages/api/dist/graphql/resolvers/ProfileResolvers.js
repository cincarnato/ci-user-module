"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UserService = require("../../services/UserService");

var _apolloServerExpress = require("apollo-server-express");

var _default = {
  Mutation: {
    changePassword: (_, {
      currentPassword,
      newPassword
    }, {
      user
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      return (0, _UserService.changePassword)(user.id, {
        currentPassword,
        newPassword
      }, user);
    },
    avatarUpload: (_, {
      file
    }, {
      user
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      return (0, _UserService.avatarUpload)(user, file);
    }
  }
};
exports.default = _default;