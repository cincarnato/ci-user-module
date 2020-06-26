"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteGroup = exports.updateGroup = exports.createGroup = exports.findGroup = exports.paginateGroup = exports.fetchGroups = void 0;

var _GroupModel = _interopRequireDefault(require("./../models/GroupModel"));

var _apolloServerExpress = require("apollo-server-express");

var _UserService = require("./UserService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addUserToGroup = function (groupId, user) {
  return _GroupModel.default.findByIdAndUpdate(groupId, {
    $push: {
      users: user._id
    }
  }, {
    new: true,
    useFindAndModify: false
  });
};

const fetchGroups = async function () {
  return new Promise((resolve, reject) => {
    _GroupModel.default.find({}).isDeleted(false).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchGroups = fetchGroups;

const paginateGroup = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false) {
  function qs(search) {
    let qs = {};

    if (search) {
      qs = {
        $or: [{
          name: {
            $regex: search,
            $options: 'i'
          }
        }]
      };
    }

    return qs;
  }

  function getSort(orderBy, orderDesc) {
    if (orderBy) {
      return (orderDesc ? '-' : '') + orderBy;
    } else {
      return null;
    }
  }

  let query = {
    deleted: false,
    ...qs(search)
  };
  let populate = null;
  let sort = getSort(orderBy, orderDesc);
  let params = {
    page: pageNumber,
    limit: limit,
    populate,
    sort
  };
  return new Promise((resolve, reject) => {
    _GroupModel.default.paginate(query, params).then(result => {
      let docs = result.docs.map(async group => {
        group.users = await (0, _UserService.findUsersGroup)(group);
        return group;
      });
      resolve({
        items: docs,
        totalItems: result.totalDocs,
        page: result.page
      });
    }).catch(err => reject(err));
  });
};

exports.paginateGroup = paginateGroup;

const findGroup = async function (id) {
  return new Promise((resolve, reject) => {
    _GroupModel.default.findOne({
      _id: id
    }).exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findGroup = findGroup;

const createGroup = async function (user, {
  name,
  color,
  users
}) {
  const doc = new _GroupModel.default({
    name,
    color
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

      await (0, _UserService.setUsersGroups)(doc, users);
      doc.users = await (0, _UserService.findUsersGroup)(doc);
      resolve(doc);
    });
  });
};

exports.createGroup = createGroup;

const updateGroup = async function (user, id, {
  name,
  color,
  users = []
}) {
  return new Promise((resolve, rejects) => {
    _GroupModel.default.findOneAndUpdate({
      _id: id
    }, {
      name,
      color
    }, {
      new: true,
      runValidators: true,
      context: 'query'
    }, async (error, doc) => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      await (0, _UserService.setUsersGroups)(doc, users);
      doc.users = await (0, _UserService.findUsersGroup)(doc);
      resolve(doc);
    });
  });
};

exports.updateGroup = updateGroup;

const deleteGroup = function (id) {
  return new Promise((resolve, rejects) => {
    findGroup(id).then(doc => {
      doc.softdelete(function (err) {
        err ? rejects(err) : resolve({
          id: id,
          deleteSuccess: true
        });
      });
    });
  });
};

exports.deleteGroup = deleteGroup;