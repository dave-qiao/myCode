'use strict';

var CryptoJS = require("crypto-js");
var config = window.appSystemConfigInfo;

var _require = require('./utils'),
    getTOKEN = _require.getTOKEN,
    getSTAMP = _require.getSTAMP;

function create_AUTH_SIGN(stamp) {
  var _msg = [stamp, stamp].join(':');

  var _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}

function create_TOKEN_SIGN(token, stamp) {
  var _msg = [token, stamp, stamp].join(':');
  var _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}

function create_Head(type) {

  var stamp = getSTAMP();
  var _result = {
    'X-APP-KEY': config.access_key,
    'X-MSG-ID': [stamp, stamp].join(',')
  };
  var _sign = null;
  if (type === 'X-AUTH') {
    _sign = create_AUTH_SIGN(stamp);
    _result[type] = [_sign].join(','); // [_sign,'publisher'].join(',')
  } else {
    var token = getTOKEN();
    _sign = create_TOKEN_SIGN(token, stamp);
    _result[type] = [token, _sign].join(',');
  };
  return _result;
};

module.exports = create_Head;

//# sourceMappingURL=createHead-compiled.js.map