"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const osSchema = new _mongoose.default.Schema({
  family: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  version: {
    type: String,
    required: false
  },
  platform: {
    type: String,
    required: false
  }
});
const clientSchema = new _mongoose.default.Schema({
  type: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  version: {
    type: String,
    required: false
  }
});
const deviceSchema = new _mongoose.default.Schema({
  type: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  model: {
    type: String,
    required: false
  }
});
const geoSchema = new _mongoose.default.Schema({
  country: {
    type: String,
    required: false
  },
  region: {
    type: String,
    required: false
  },
  timezone: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  }
}); // Defining user Mongoose Schema

const SessionSchema = new _mongoose.default.Schema({
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    unique: false,
    required: true
  },
  username: {
    type: String,
    unique: false,
    required: false,
    dropDups: true
  },
  since: {
    type: Date,
    required: true,
    default: Date.now
  },
  until: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: false,
    default: 0
  },
  request: {
    type: Number,
    required: false,
    default: 1
  },
  agent: {
    type: String,
    unique: false,
    required: true,
    dropDups: true
  },
  ip: {
    type: String,
    unique: false,
    required: true,
    dropDups: true
  },
  geo: geoSchema,
  device: deviceSchema,
  client: clientSchema,
  os: osSchema
});
SessionSchema.set('toJSON', {
  getters: true
});
SessionSchema.plugin(_mongooseUniqueValidator.default, {
  message: '{VALUE} ya existe. {PATH} debe ser unico.'
});

var _default = _mongoose.default.model('Session', SessionSchema);

exports.default = _default;