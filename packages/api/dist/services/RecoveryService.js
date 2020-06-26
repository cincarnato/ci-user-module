"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recoveryChangePassword = exports.recoveryPassword = void 0;

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

var _UserAuditService = require("./UserAuditService");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _UserEmailManager = _interopRequireDefault(require("./UserEmailManager"));

var _UserService = require("./UserService");

var _validatePasswordLength = _interopRequireDefault(require("./utils/validatePasswordLength"));

var _AuthService = require("./AuthService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    @input email: String
    @output {status:Boolean!,message:String}
 */
const recoveryPassword = function (email) {
  return new Promise((resolve, rejects) => {
    _UserModel.default.findOne({
      email: email
    }).populate('role').then(user => {
      if (user) {
        let token = _jsonwebtoken.default.sign({
          id: user.id,
          operation: 'recovery'
        }, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });

        let url = process.env.APP_WEB_URL + "/recovery/" + token;

        _UserEmailManager.default.recovery(email, url, user).then(result => {
          (0, _UserAuditService.createUserAudit)(user.id, user.id, 'passwordRecovery');
          resolve({
            status: result,
            message: 'common.operation.success'
          });
        }).catch(error => {
          rejects(new Error('common.operation.fail'));
        });
      } else resolve({
        status: false,
        message: "user.notFound"
      });
    }).catch(error => {
      if (error) rejects(new Error('common.operation.fail'));
    });
  });
};
/*
    @input (token: String, newPassword:String, actionBy: Object, req: Object )
    @output {status:Boolean!, message:String}
 */


exports.recoveryPassword = recoveryPassword;

const recoveryChangePassword = function (token, newPassword, req) {
  return new Promise((resolve, rejects) => {
    let decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET); //Todo specific message


    if (!decoded) {
      resolve({
        status: false,
        message: "common.operation.fail"
      });
    } //Todo specific message


    if (!(0, _validatePasswordLength.default)(newPassword)) {
      resolve({
        status: false,
        message: "common.operation.fail"
      });
    }

    _UserModel.default.findOneAndUpdate({
      _id: decoded.id
    }, {
      password: (0, _UserService.hashPassword)(newPassword)
    }, {
      new: true
    }, (error, user) => {
      if (error) {
        resolve({
          status: false,
          message: "common.operation.fail"
        });
      } else {
        (0, _AuthService.session)(user, req).then(authToken => {
          (0, _UserAuditService.createUserAudit)(decoded.id, decoded.id, 'userRecoveryPasswordChange');
          resolve({
            status: true,
            token: authToken,
            message: "common.operation.success"
          });
        }).catch(err => {
          rejects(err);
        });
      }
    });
  });
};

exports.recoveryChangePassword = recoveryChangePassword;