"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _securityPermissions = require("./include/security-permissions.js");

Object.keys(_securityPermissions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _securityPermissions[key];
    }
  });
});