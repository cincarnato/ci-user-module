"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginFailByUsername = exports.createLoginFail = void 0;

var _LoginFailModel = _interopRequireDefault(require("../models/LoginFailModel"));

var _moment = _interopRequireDefault(require("moment"));

var _nodeDeviceDetector = _interopRequireDefault(require("node-device-detector"));

var _geoLookup = _interopRequireDefault(require("./utils/geoLookup"));

var _getMatchIpv = _interopRequireDefault(require("./utils/getMatchIpv4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const detector = new _nodeDeviceDetector.default();

const createLoginFail = async function (username, req) {
  return new Promise((resolve, reject) => {
    let userAgent = 'NoAgent';
    let result = {
      os: {},
      client: {},
      device: {}
    };
    let ip = '127.0.0.1';
    let geo = {};

    if (req && req.headers && req.headers['user-agent']) {
      userAgent = req.headers['user-agent'];
      result = detector.detect(userAgent);
    }

    if (req && req.headers && (req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
      ip = (0, _getMatchIpv.default)(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
      geo = (0, _geoLookup.default)(ip);
    }

    const doc = new _LoginFailModel.default({
      username: username,
      agent: userAgent,
      ip: ip,
      os: result.os,
      client: result.client,
      device: result.device,
      geo: geo
    });
    doc.save().then(() => {
      resolve(doc);
    }).catch(err => {
      reject(err);
    });
  });
};

exports.createLoginFail = createLoginFail;

const loginFailByUsername = async function (time = 72, unit = 'hours') {
  return new Promise((resolve, reject) => {
    let now = (0, _moment.default)();
    let from = now.subtract(time, unit);

    _LoginFailModel.default.aggregate([{
      $match: {
        date: {
          $gte: from.toDate()
        }
      }
    }, {
      $group: {
        _id: "$username",
        username: {
          $last: "$username"
        },
        attempts: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.loginFailByUsername = loginFailByUsername;