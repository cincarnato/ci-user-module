"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseSoftdelete = _interopRequireDefault(require("mongoose-softdelete"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Defining user Mongoose Schema
const UserSchema = new _mongoose.default.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    validate: {
      validator: function (value) {
        let r = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return r.test(value);
      },
      message: "validation.emailFormat"
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: {
    type: String,
    required: false,
    validate: {
      validator: function (value) {
        let r = /[0-9]+/;
        return value ? r.test(value) : true;
      },
      message: "Telefono no tiene un formato valido"
    }
  },
  avatar: String,
  avatarurl: String,
  role: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  groups: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Group',
    required: false
  }]
}, {
  timestamps: true
});
UserSchema.set('toJSON', {
  getters: true
});
UserSchema.plugin(_mongooseUniqueValidator.default, {
  message: 'validation.unique'
});
UserSchema.plugin(_mongooseSoftdelete.default);
UserSchema.plugin(_mongoosePaginateV.default);

const UserModel = _mongoose.default.model('User', UserSchema);

module.exports = UserModel;