"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseSoftdelete = _interopRequireDefault(require("mongoose-softdelete"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: function (value) {
        let r = /^[A-Za-z\s]+$/;
        return r.test(value);
      },
      message: "validation.onlyLetters"
    }
  },
  color: {
    type: String,
    required: false,
    validate: {
      validator: function (value) {
        let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return r.test(value);
      },
      message: "validation.invalidHexColor"
    }
  },
  users: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }]
});
GroupSchema.plugin(_mongooseUniqueValidator.default, {
  message: 'validation.unique'
});
GroupSchema.plugin(_mongooseSoftdelete.default);
GroupSchema.plugin(_mongoosePaginateV.default);
GroupSchema.set('toJSON', {
  transform: (doc, result) => {
    return { ...result,
      id: result._id
    };
  }
});

const Group = _mongoose.default.model('Group', GroupSchema);

module.exports = Group;