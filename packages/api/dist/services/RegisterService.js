"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activationUser = exports.registerUser = void 0;

var _RoleService = require("./RoleService");

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

var _apolloServerExpress = require("apollo-server-express");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _UserAuditService = require("./UserAuditService");

var _UserEmailManager = _interopRequireDefault(require("./UserEmailManager"));

var _UserService = require("./UserService");

var _AuthService = require("./AuthService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registerUser = async function ({
  username,
  password,
  name,
  email,
  phone
}) {
  //TODO improve this hardcode role
  const ROLE_NAME = "operator";
  let roleObject = await (0, _RoleService.findRoleByName)(ROLE_NAME);
  return new Promise((resolve, rejects) => {
    let active = false;
    const newUser = new _UserModel.default({
      username,
      email,
      password: (0, _UserService.hashPassword)(password),
      name,
      phone,
      active,
      role: roleObject,
      createdAt: Date.now()
    });
    newUser.id = newUser._id;
    newUser.save(error => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      } else {
        let token = _jsonwebtoken.default.sign({
          id: newUser.id,
          operation: 'register'
        }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_REGISTER_EXPIRED_IN || '30d'
        });

        let url = process.env.APP_WEB_URL + "/activation/" + token;
        (0, _UserAuditService.createUserAudit)(newUser.id, newUser.id, 'userRegistered');

        _UserEmailManager.default.activation(newUser.email, url, newUser);

        resolve({
          status: true,
          id: newUser.id,
          email: newUser.email
        });
      }
    });
  });
};

exports.registerUser = registerUser;

const activationUser = function (token, req) {
  return new Promise((resolve, rejects) => {
    let decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET); //Todo specific message


    if (!decoded) {
      resolve({
        status: false,
        message: "common.operation.fail"
      });
    }

    _UserModel.default.findOneAndUpdate({
      _id: decoded.id
    }, {
      active: true
    }, (error, user) => {
      if (error) {
        rejects({
          status: false,
          message: "common.operation.fail"
        });
      }

      (0, _UserAuditService.createUserAudit)(user._id, user._id, 'userActivated');
      (0, _AuthService.session)(user, req).then(authToken => {
        resolve({
          status: true,
          token: authToken,
          message: "common.operation.success"
        });
      }).catch(err => {
        rejects(err);
      });
    });
  });
};

exports.activationUser = activationUser;