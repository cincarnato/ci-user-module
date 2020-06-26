"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = exports.session = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _SessionService = require("./SessionService");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _LoginFailService = require("./LoginFailService");

var _UserService = require("./UserService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const session = function (user, req) {
  return new Promise((resolve, reject) => {
    (0, _SessionService.createSession)(user, req).then(newSession => {
      let token = _jsonwebtoken.default.sign({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        groups: user.groups,
        avatarurl: user.avatarurl,
        idSession: newSession.id
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1d'
      });

      resolve(token);
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
};

exports.session = session;

const auth = async function ({
  username,
  password
}, req) {
  return new Promise((resolve, reject) => {
    (0, _UserService.findUserByUsername)(username).then(user => {
      if (!user) {
        reject('UserDoesntExist');
      }

      if (!user.active) {
        reject('DisabledUser');
      }

      if (user) {
        if (_bcryptjs.default.compareSync(password, user.password)) {
          //Registrar session
          session(user, req).then(token => {
            resolve({
              token: token
            });
          }).catch(err => reject(err));
        } else {
          (0, _LoginFailService.createLoginFail)(username, req);
          reject('BadCredentials');
        }
      }
    });
  });
};

exports.auth = auth;