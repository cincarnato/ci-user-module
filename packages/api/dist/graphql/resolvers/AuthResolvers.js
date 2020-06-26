"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UserService = require("../../services/UserService");

var _AuthService = require("../../services/AuthService");

var _apolloServerExpress = require("apollo-server-express");

var _default = {
  Query: {
    me: (_, {}, {
      user
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("UNAUTHENTICATED");
      return (0, _UserService.findUser)(user.id);
    }
  },
  Mutation: {
    auth: (_, {
      username,
      password
    }, {
      req
    }) => {
      return new Promise((resolve, reject) => {
        (0, _AuthService.auth)({
          username,
          password
        }, req).then(result => resolve(result)).catch(err => {
          console.warn('Auth error: ', err.message);
          reject(new _apolloServerExpress.AuthenticationError("BadCredentials"));
        });
      });
    }
  }
};
exports.default = _default;