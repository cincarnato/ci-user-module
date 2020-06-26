"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "securityResolvers", {
  enumerable: true,
  get: function () {
    return _graphql.securityResolvers;
  }
});
Object.defineProperty(exports, "securityTypes", {
  enumerable: true,
  get: function () {
    return _graphql.securityTypes;
  }
});
Object.defineProperty(exports, "sessionMiddleware", {
  enumerable: true,
  get: function () {
    return _middleware.sessionMiddleware;
  }
});
Object.defineProperty(exports, "jwtMiddleware", {
  enumerable: true,
  get: function () {
    return _middleware.jwtMiddleware;
  }
});
Object.defineProperty(exports, "rbacMiddleware", {
  enumerable: true,
  get: function () {
    return _middleware.rbacMiddleware;
  }
});
Object.defineProperty(exports, "corsMiddleware", {
  enumerable: true,
  get: function () {
    return _middleware.corsMiddleware;
  }
});
Object.defineProperty(exports, "AuthService", {
  enumerable: true,
  get: function () {
    return _services.AuthService;
  }
});
Object.defineProperty(exports, "RecoveryService", {
  enumerable: true,
  get: function () {
    return _services.RecoveryService;
  }
});
Object.defineProperty(exports, "RegisterService", {
  enumerable: true,
  get: function () {
    return _services.RegisterService;
  }
});
Object.defineProperty(exports, "GroupService", {
  enumerable: true,
  get: function () {
    return _services.GroupService;
  }
});
Object.defineProperty(exports, "RoleService", {
  enumerable: true,
  get: function () {
    return _services.RoleService;
  }
});
Object.defineProperty(exports, "UserService", {
  enumerable: true,
  get: function () {
    return _services.UserService;
  }
});
Object.defineProperty(exports, "UserAuditService", {
  enumerable: true,
  get: function () {
    return _services.UserAuditService;
  }
});
Object.defineProperty(exports, "UserEmailManager", {
  enumerable: true,
  get: function () {
    return _services.UserEmailManager;
  }
});
Object.defineProperty(exports, "LoginFailService", {
  enumerable: true,
  get: function () {
    return _services.LoginFailService;
  }
});
Object.defineProperty(exports, "SessionService", {
  enumerable: true,
  get: function () {
    return _services.SessionService;
  }
});
Object.defineProperty(exports, "InitService", {
  enumerable: true,
  get: function () {
    return _services.InitService;
  }
});
exports.permissions = void 0;

var _graphql = require("./graphql");

var _middleware = require("./middleware");

var _services = require("./services");

var permissions = _interopRequireWildcard(require("./permissions"));

exports.permissions = permissions;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }