"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SessionService = require("../services/SessionService");

const sessionMiddleware = (req, res, next) => {
  if (req.user) (0, _SessionService.updateSession)(req.user);
  next();
};

var _default = sessionMiddleware;
exports.default = _default;