"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseSoftdelete = _interopRequireDefault(require("mongoose-softdelete"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const RoleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  permissions: [{
    type: String,
    required: true
  }]
});
RoleSchema.plugin(_mongooseUniqueValidator.default, {
  message: 'validation.unique'
});
RoleSchema.plugin(_mongooseSoftdelete.default);
RoleSchema.plugin(_mongoosePaginateV.default);
RoleSchema.set('toJSON', {
  getters: true
});

const RoleModel = _mongoose.default.model('Role', RoleSchema);

module.exports = RoleModel;