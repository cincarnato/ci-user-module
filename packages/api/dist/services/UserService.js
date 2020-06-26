"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUsersGroups = exports.findUsersGroup = exports.avatarUpload = exports.changePassword = exports.changePasswordAdmin = exports.findUserByUsername = exports.findUser = exports.paginateUsers = exports.findUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.hashPassword = void 0;

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

require("../models/GroupModel");

var _UserAuditService = require("../services/UserAuditService");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _apolloServerExpress = require("apollo-server-express");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hashPassword = function (password) {
  let salt = _bcryptjs.default.genSaltSync(10);

  let hashPassword = _bcryptjs.default.hashSync(password, salt);

  return hashPassword;
};

exports.hashPassword = hashPassword;

const createUser = async function ({
  username,
  password,
  name,
  email,
  phone,
  role,
  groups,
  active
}, actionBy = null) {
  const newUser = new _UserModel.default({
    username,
    email,
    password: hashPassword(password),
    name,
    phone,
    active,
    role,
    groups,
    createdAt: Date.now()
  });
  return new Promise((resolve, rejects) => {
    newUser.save((error, doc) => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      } else {
        (0, _UserAuditService.createUserAudit)(actionBy ? actionBy.id : null, doc._id, 'userCreated');
        doc.populate('role').populate('groups').execPopulate(() => resolve(doc));
      }
    });
  });
};

exports.createUser = createUser;

const updateUser = async function (id, {
  username,
  name,
  email,
  phone,
  role,
  groups,
  active
}, actionBy = null) {
  let updatedAt = Date.now();
  return new Promise((resolve, rejects) => {
    _UserModel.default.findOneAndUpdate({
      _id: id
    }, {
      username,
      name,
      email,
      phone,
      role,
      groups,
      active,
      updatedAt
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
      } else {
        (0, _UserAuditService.createUserAudit)(actionBy ? actionBy.id : null, doc._id, 'userModified');
        doc.populate('role').populate('groups').execPopulate(() => resolve(doc));
      }
    });
  });
};

exports.updateUser = updateUser;

const deleteUser = function (id, actionBy = null) {
  return new Promise((resolve, rejects) => {
    findUser(id).then(doc => {
      doc.softdelete(function (err) {
        (0, _UserAuditService.createUserAudit)(actionBy ? actionBy.id : null, doc._id, 'userDeleted');
        err ? rejects(err) : resolve({
          success: true,
          id: id
        });
      });
    });
  });
};

exports.deleteUser = deleteUser;

const findUsers = function () {
  return new Promise((resolve, reject) => {
    _UserModel.default.find({}).isDeleted(false).populate('role').populate('groups').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findUsers = findUsers;

const paginateUsers = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false) {
  function getQuery(search) {
    let qs = {};

    if (search) {
      qs = {
        $or: [{
          name: {
            $regex: search,
            $options: 'i'
          }
        }, {
          username: {
            $regex: search,
            $options: 'i'
          }
        }, {
          email: {
            $regex: search,
            $options: 'i'
          }
        }, {
          phone: {
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
    ...getQuery(search)
  };
  let populate = ['role', 'groups'];
  let sort = getSort(orderBy, orderDesc);
  let params = {
    page: pageNumber,
    limit: limit,
    populate: populate,
    sort
  };
  console.log(params);
  return new Promise((resolve, reject) => {
    _UserModel.default.paginate(query, params).then(result => {
      resolve({
        users: result.docs,
        totalItems: result.totalDocs,
        page: result.page
      });
    }).catch(err => reject(err));
  });
};

exports.paginateUsers = paginateUsers;

const findUser = function (id) {
  return new Promise((resolve, reject) => {
    _UserModel.default.findOne({
      _id: id
    }).populate('role').populate('groups').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findUser = findUser;

const findUserByUsername = function (name) {
  return new Promise((resolve, reject) => {
    _UserModel.default.findOne({
      username: name
    }).populate('role').populate('groups').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.findUserByUsername = findUserByUsername;

const changePasswordAdmin = function (id, {
  password,
  passwordVerify
}, actionBy = null) {
  console.log('admin', password);

  if (password == passwordVerify) {
    return new Promise((resolve, rejects) => {
      _UserModel.default.findOneAndUpdate({
        _id: id
      }, {
        password: hashPassword(password)
      }, {
        new: true
      }, (error, doc) => {
        if (error) {
          rejects({
            status: false,
            message: "Falla al intentar modificar password"
          });
        } else {
          (0, _UserAuditService.createUserAudit)(actionBy.id, id, actionBy.id === id ? 'userPasswordChange' : 'changePasswordAdmin');
          resolve({
            success: true,
            message: "PasswordChange",
            operation: "changePasswordAdmin"
          });
        }
      });
    });
  } else {
    return new Promise((resolve, rejects) => {
      resolve({
        status: false,
        message: "Las password no concuerdan"
      });
    });
  }
};

exports.changePasswordAdmin = changePasswordAdmin;

const changePassword = function (id, {
  currentPassword,
  newPassword
}, actionBy = null) {
  return new Promise(async (resolve, rejects) => {
    let user = await _UserModel.default.findOne({
      _id: id
    });

    if (_bcryptjs.default.compareSync(currentPassword, user.password)) {
      _UserModel.default.findOneAndUpdate({
        _id: id
      }, {
        password: hashPassword(newPassword)
      }, {
        new: true
      }, (error, doc) => {
        if (error) {
          rejects(error);
        } else {
          (0, _UserAuditService.createUserAudit)(actionBy.id, id, actionBy.id === id ? 'userPasswordChange' : 'adminPasswordChange');
          resolve({
            success: true,
            message: "PasswordChange",
            operation: "changePassword"
          });
        }
      });
    } else {
      rejects(new _apolloServerExpress.UserInputError('auth.wrongPassword', {
        inputErrors: {
          currentPassword: {
            properties: {
              message: 'auth.wrongPassword'
            }
          }
        }
      }));
    }
  });
};

exports.changePassword = changePassword;

const storeFS = (stream, dst) => {
  return new Promise((resolve, reject) => stream.on('error', error => {
    if (stream.truncated) _fs.default.unlinkSync(dst);
    reject(error);
  }).pipe(_fs.default.createWriteStream(dst)).on('error', error => reject(error)).on('finish', () => resolve(true)));
};

const avatarUpload = function (user, file) {
  return new Promise(async (resolve, rejects) => {
    //@TODO validate image size, extension
    const {
      filename,
      mimetype,
      encoding,
      createReadStream
    } = await file;

    const parseFileName = _path.default.parse(filename);

    const finalFileName = user.username + parseFileName.ext;

    const dst = _path.default.join("media", "avatar", finalFileName); //Store


    let fileResult = await storeFS(createReadStream(), dst);

    if (fileResult) {
      const rand = randomstring(3);
      const url = process.env.APP_API_URL + "/media/avatar/" + finalFileName + "?" + rand;

      _UserModel.default.findOneAndUpdate({
        _id: user.id
      }, {
        avatar: finalFileName,
        avatarurl: url
      }, {
        useFindAndModify: false
      }, error => {
        if (error) {
          rejects(error);
        } else {
          (0, _UserAuditService.createUserAudit)(user.id, user.id, 'avatarChange');
          resolve({
            filename,
            mimetype,
            encoding,
            url
          });
        }
      });
    } else {
      rejects(new Error("Upload Fail"));
    }
  });
};

exports.avatarUpload = avatarUpload;

function randomstring(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const findUsersGroup = function (group) {
  return new Promise((resolve, reject) => {
    _UserModel.default.find({
      groups: group.id
    }).then(users => {
      resolve(users);
    }).catch(err => {
      reject(err);
    });
  });
};

exports.findUsersGroup = findUsersGroup;

const setUsersGroups = function (group, users) {
  function getDeletePromises(oldUsers) {
    return oldUsers.map(oldUser => {
      let index = users.indexOf(oldUser.id);

      if (index !== -1) {
        users.splice(index, 1);
      } else {
        // console.log("Deleting user " + oldUser.username + ' for ' + group.id)
        return _UserModel.default.findOneAndUpdate({
          _id: oldUser.id
        }, {
          $pullAll: {
            groups: [group.id]
          }
        }, {
          new: true,
          runValidators: true,
          context: 'query'
        });
      }
    });
  }

  function getPushPromises() {
    return users.map(user => {
      // console.log("Adding user " + user + ' for ' + group.id)
      return _UserModel.default.findOneAndUpdate({
        _id: user
      }, {
        $push: {
          groups: group.id
        }
      }, {
        new: true,
        runValidators: true,
        context: 'query'
      });
    });
  }

  return new Promise(async (resolve, reject) => {
    //0. Find actual users with this group
    let oldUsers = await findUsersGroup(group); //1. Delete group for old users that doesnt exist anymore

    let deletePromises = getDeletePromises(oldUsers);
    Promise.all(deletePromises).then(() => {
      console.log("All Delete Promise Finish"); //2. Push group in new users

      let pushPromises = getPushPromises();
      Promise.all(pushPromises).then(() => {
        console.log("All Push Promise Finish");
        resolve(true);
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  });
};

exports.setUsersGroups = setUsersGroups;