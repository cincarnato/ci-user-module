"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRole = exports.createRole = exports.deleteRole = exports.findRoleByName = exports.findRole = exports.findRoles = exports.fetchRolesInName = void 0;

var _RoleModel = _interopRequireDefault(require("../models/RoleModel"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchRolesInName = function (roleNames) {
  return new Promise((resolve, reject) => {
    _RoleModel.default.find({
      name: {
        $in: roleNames
      }
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchRolesInName = fetchRolesInName;

const findRoles = function () {
  return new Promise((resolve, reject) => {
    _RoleModel.default.find({}).isDeleted(false).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findRoles = findRoles;

const findRole = function (id) {
  return new Promise((resolve, reject) => {
    _RoleModel.default.findOne({
      _id: id
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findRole = findRole;

const findRoleByName = function (roleName) {
  return new Promise((resolve, reject) => {
    _RoleModel.default.findOne({
      name: roleName
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findRoleByName = findRoleByName;

const deleteRole = function (id) {
  return new Promise((resolve, rejects) => {
    findRole(id).then(doc => {
      doc.softdelete(function (err) {
        err ? rejects(err) : resolve({
          id: id,
          success: true
        });
      });
    });
  });
};

exports.deleteRole = deleteRole;

const createRole = function ({
  name,
  permissions
}) {
  const newRole = new _RoleModel.default({
    name,
    permissions
  });
  newRole.id = newRole._id;
  return new Promise((resolve, rejects) => {
    newRole.save(error => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      } else {
        resolve(newRole);
      }
    });
  });
};

exports.createRole = createRole;

const updateRole = async function (id, {
  name,
  permissions = []
}) {
  return new Promise((resolve, rejects) => {
    _RoleModel.default.findOneAndUpdate({
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

exports.updateRole = updateRole;