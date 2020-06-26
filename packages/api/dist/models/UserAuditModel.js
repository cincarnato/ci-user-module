"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Defining user Mongoose Schema
const UserAuditSchema = new _mongoose.default.Schema({
  actionBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    unique: false,
    required: false,
    dropDups: true
  },
  actionFor: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    unique: false,
    required: true,
    dropDups: true
  },
  action: {
    type: String,
    unique: false,
    required: true,
    dropDups: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});
UserAuditSchema.set('toJSON', {
  getters: true
});
module.exports = _mongoose.default.model('UserAudit', UserAuditSchema);