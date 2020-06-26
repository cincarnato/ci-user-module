"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RecoveryService = require("../../services/RecoveryService");

var _default = {
  Mutation: {
    recoveryChangePassword: (_, {
      token,
      newPassword
    }, {
      user,
      req
    }) => {
      return (0, _RecoveryService.recoveryChangePassword)(token, newPassword, req);
    },
    recoveryByEmail: (_, {
      email
    }) => {
      return (0, _RecoveryService.recoveryPassword)(email);
    }
  }
};
exports.default = _default;