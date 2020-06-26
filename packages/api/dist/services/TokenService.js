"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _UserService = require("./UserService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    @input token
    @output {valid:Boolean!, operation:String!, message:String}
*/
const validateToken = function (token) {
  return new Promise((resolve, rejects) => {
    try {
      let decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        resolve({
          valid: false,
          operation: 'none',
          message: "common.operation.fail"
        });
      }

      if (!(0, _UserService.findUser)(decoded.id)) {
        resolve({
          valid: false,
          operation: 'none',
          message: "common.operation.fail"
        });
      }

      resolve({
        valid: true,
        operation: decoded.operation,
        message: "common.operation.success"
      });
    } catch (e) {
      rejects(e);
    }
  });
};

exports.validateToken = validateToken;