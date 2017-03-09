'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var fetch = require('dva/fetch');
var config = window.appSystemConfigInfo;
var create_Head = require('./createHead');
var baseUrl = config[config.env];
function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.response = response;
  throw error;
}
function request(api, options, type) {

  var _options = options || { method: 'get' };
  var _api = baseUrl + api;
  var noStop = true;
  _options.headers = {};
  if (['https://up.qbox.me'].indexOf(api) !== -1) {
    _api = api;
    noStop = false;
  };
  if (noStop) {
    _options.headers = create_Head(type ? 'X-AUTH' : 'X-TOKEN');
    if (_options.method !== 'get') {
      _options.headers["Content-Type"] = "application/json";
    };
  };
  (0, _assign2.default)(_options, {
    "mode": "cors"
  });
  return fetch(_api, _options).then(checkStatus).then(parseJSON).then(function (data) {
    return { data: data };
  }).catch(function (err) {
    return { err: err };
  });
};
module.exports = request;

//# sourceMappingURL=request-compiled.js.map