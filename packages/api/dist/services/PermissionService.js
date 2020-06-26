"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePermission = exports.updatePermission = exports.createPermission = exports.findPermissionByName = exports.findPermission = exports.fetchPermissionsInName = exports.fetchPermissions = void 0;

var _PermissionModel = _interopRequireDefault(require("../models/PermissionModel"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchPermissions = function () {
  return new Promise((resolve, reject) => {
    _PermissionModel.default.find({}).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchPermissions = fetchPermissions;

const fetchPermissionsInName = function (permissions) {
  return new Promise((resolve, reject) => {
    _PermissionModel.default.find({
      name: {
        $in: permissions
      }
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchPermissionsInName = fetchPermissionsInName;

const findPermission = function (id) {
  return new Promise((resolve, reject) => {
    _PermissionModel.default.findOne({
      _id: id
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findPermission = findPermission;

const findPermissionByName = function (name) {
  return new Promise((resolve, reject) => {
    _PermissionModel.default.findOne({
      name: name
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findPermissionByName = findPermissionByName;

const createPermission = function (name) {
  const newPermission = new _PermissionModel.default({
    name
  });
  newPermission.id = newPermission._id;
  return new Promise((resolve, rejects) => {
    newPermission.save(error => {
      error ? rejects(error) : resolve(newPermission);
    });
  });
};

exports.createPermission = createPermission;

const updatePermission = async function (id, name) {
  return new Promise((resolve, rejects) => {
    _PermissionModel.default.findOneAndUpdate({
      _id: id
    }, {
      name,
      permissions
    }, {
      new: true,
      runValidators: true,
      context: 'query'
    }, (error, doc) => {
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

exports.updatePermission = updatePermission;

const deletePermission = function (id) {
  return new Promise((resolve, rejects) => {
    findPermission(id).then(doc => {
      doc.softdelete(function (err) {
        err ? rejects(err) : resolve({
          id: id,
          success: true
        });
      });
    });
  });
};

exports.deletePermission = deletePermission;