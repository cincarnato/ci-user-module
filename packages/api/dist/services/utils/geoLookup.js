"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = geoLookup;

var _geoipLite = _interopRequireDefault(require("geoip-lite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function geoLookup(ip) {
  let geo = {};

  if (ip === '127.0.0.1' || ip === '::1') {
    geo = {
      country: 'AR',
      region: 'Local',
      city: 'Local',
      timezone: ''
    };
  } else {
    geo = _geoipLite.default.lookup(ip);
  }

  return geo;
}