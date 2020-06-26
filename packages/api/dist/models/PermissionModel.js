"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const PermissionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    index: true
  }
});
PermissionSchema.plugin(_mongooseUniqueValidator.default, {
  message: 'validation.unique'
});
PermissionSchema.set('toJSON', {
  getters: true
});

const PermissionModel = _mongoose.default.model('Permission', PermissionSchema);

module.exports = PermissionModel;