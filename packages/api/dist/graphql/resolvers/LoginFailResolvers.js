"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _LoginFailService = require("../../services/LoginFailService");

var _apolloServerExpress = require("apollo-server-express");

var _default = {
  Query: {
    loginFailByUsername: (_, {
      time,
      unit
    }, {
      user,
      rbac
    }) => {
      if (!user) throw new _apolloServerExpress.AuthenticationError("Unauthenticated");
      return (0, _LoginFailService.loginFailByUsername)(time, unit);
    }
  }
};
exports.default = _default;