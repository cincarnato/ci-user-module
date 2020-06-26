"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionsByClient = exports.sessionsByCity = exports.sessionsByDeviceType = exports.sessionsByOs = exports.sessionsByCountry = exports.sessionsByUser = exports.updateSession = exports.createSession = void 0;

var _SessionModel = _interopRequireDefault(require("../models/SessionModel"));

var _moment = _interopRequireDefault(require("moment"));

var _nodeDeviceDetector = _interopRequireDefault(require("node-device-detector"));

var _geoLookup = _interopRequireDefault(require("./utils/geoLookup"));

var _getMatchIpv = _interopRequireDefault(require("./utils/getMatchIpv4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const detector = new _nodeDeviceDetector.default();

const createSession = async function (user, req) {
  return new Promise((resolve, reject) => {
    //Init values
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

    const newSession = new _SessionModel.default({
      user: user._id,
      username: user.username,
      agent: userAgent,
      ip: ip,
      os: result.os,
      client: result.client,
      device: result.device,
      geo: geo
    });
    newSession.id = newSession._id;
    newSession.save().then(() => {
      resolve(newSession);
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
}; //TODO improve: Think in performance and high demand


exports.createSession = createSession;

const updateSession = async function (user) {
  if (user.idSession) {
    _SessionModel.default.findOne({
      _id: user.idSession
    }).then(doc => {
      let now = (0, _moment.default)();
      doc.until = now;
      doc.duration = now.diff(doc.since, 'seconds');
      doc.request++;
      doc.save();
    });
  }
};

exports.updateSession = updateSession;

function getFromDate(time, unit) {
  let now = (0, _moment.default)();
  let from = now.subtract(time, unit);
  return from.toDate();
}

const sessionsByUser = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$username",
        username: {
          $last: "$username"
        },
        sessionCount: {
          $sum: 1
        },
        durationMin: {
          $min: "$duration"
        },
        durationMax: {
          $max: "$duration"
        },
        durationAvg: {
          $avg: "$duration"
        },
        durationSum: {
          $sum: "$duration"
        },
        durationLast: {
          $last: "$duration"
        },
        requestSum: {
          $sum: "$request"
        },
        requestAvg: {
          $avg: "$request"
        }
      }
    }], function (err, result) {
      console.log(result);
      resolve(result);
    });
  });
};

exports.sessionsByUser = sessionsByUser;

const sessionsByCountry = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$geo.country",
        country: {
          $last: "$geo.country"
        },
        sum: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.sessionsByCountry = sessionsByCountry;

const sessionsByOs = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$os.name",
        osname: {
          $last: "$os.name"
        },
        sum: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.sessionsByOs = sessionsByOs;

const sessionsByDeviceType = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$device.type",
        devicetype: {
          $last: "$device.type"
        },
        sum: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.sessionsByDeviceType = sessionsByDeviceType;

const sessionsByCity = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$geo.city",
        city: {
          $last: "$geo.city"
        },
        sum: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.sessionsByCity = sessionsByCity;

const sessionsByClient = async function (time, unit = 'days') {
  return new Promise((resolve, reject) => {
    _SessionModel.default.aggregate([{
      $match: {
        since: {
          $gte: getFromDate(time, unit)
        }
      }
    }, {
      $group: {
        _id: "$client.name",
        clientname: {
          $last: "$client.name"
        },
        sum: {
          $sum: 1
        }
      }
    }], function (err, result) {
      resolve(result);
    });
  });
};

exports.sessionsByClient = sessionsByClient;