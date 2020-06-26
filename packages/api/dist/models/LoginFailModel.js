"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

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

const LoginFailSchema = new _mongoose.default.Schema({
  username: {
    type: String,
    unique: false,
    required: false,
    dropDups: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
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
LoginFailSchema.set('toJSON', {
  getters: true
});
module.exports = _mongoose.default.model('LoginFail', LoginFailSchema);