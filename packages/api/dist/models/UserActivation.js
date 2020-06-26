"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActivation = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserActivationSchema = new _mongoose.default.Schema({
  code: {
    type: String,
    required: true
  },
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
});
UserActivationSchema.set('toJSON', {
  getters: true
});

const UserActivation = _mongoose.default.model('UserActivation', UserActivationSchema);

exports.UserActivation = UserActivation;