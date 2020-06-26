"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUserAudit = exports.createUserAudit = exports.findUserAudit = exports.fetchUserAuditsLimit = exports.fetchUserAuditsFrom = void 0;

var _UserAuditModel = _interopRequireDefault(require("./../models/UserAuditModel"));

var _apolloServerExpress = require("apollo-server-express");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFromDate(time, unit) {
  let now = (0, _moment.default)();
  let from = now.subtract(time, unit);
  return from.toDate();
}

const fetchUserAuditsFrom = async function (time = 7, unit = 'days') {
  return new Promise((resolve, reject) => {
    _UserAuditModel.default.find({
      date: {
        $gte: getFromDate(time, unit)
      }
    }).sort({
      date: -1
    }).populate('actionBy').populate('actionFor').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchUserAuditsFrom = fetchUserAuditsFrom;

const fetchUserAuditsLimit = async function (limit = 10) {
  return new Promise((resolve, reject) => {
    _UserAuditModel.default.find({}).sort({
      date: -1
    }).limit(limit).populate('actionBy').populate('actionFor').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchUserAuditsLimit = fetchUserAuditsLimit;

const findUserAudit = async function (id) {
  return new Promise((resolve, reject) => {
    _UserAuditModel.default.findOne({
      _id: id
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findUserAudit = findUserAudit;

const createUserAudit = async function (actionBy, actionFor, action) {
  const doc = new _UserAuditModel.default({
    actionBy,
    actionFor,
    action
  });
  doc.id = doc._id;
  return new Promise((resolve, rejects) => {
    doc.save(async error => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      resolve(doc);
    });
  });
};

exports.createUserAudit = createUserAudit;

const deleteUserAudit = function (id) {
  return new Promise((resolve, rejects) => {
    findUserAudit(id).then(doc => {
      doc.softdelete(function (err) {
        err ? rejects(err) : resolve({
          id: id,
          deleteSuccess: true
        });
      });
    });
  });
};

exports.deleteUserAudit = deleteUserAudit;