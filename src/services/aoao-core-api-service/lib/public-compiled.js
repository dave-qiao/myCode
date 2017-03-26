'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.close_type_find = exports.utils_apk_download_url_find = exports.vendor_apply_verify = exports.vendor_update = exports.vendor_find_one = exports.account_find_one = exports.qiniu_upload = exports.assets = exports.qiniu_tokens = exports.sms_send = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

//短信发送
var sms_send = exports.sms_send = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _request2.default)('io/sms/send', { method: 'post', body: (0, _stringify2.default)(params) }, 'AUTH'));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sms_send(_x) {
    return _ref.apply(this, arguments);
  };
}();

//获取上传资源Token接口
var qiniu_tokens = exports.qiniu_tokens = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', (0, _request2.default)('io/qiniu/tokens', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function qiniu_tokens(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

//上传资源信息接口,资源持久化
var assets = exports.assets = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(params) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', (0, _request2.default)('storage/assets', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function assets(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

//上传资源到七牛
var qiniu_upload = exports.qiniu_upload = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', (0, _request2.default)('https://up.qbox.me', {
              method: 'post',
              body: params
            }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function qiniu_upload(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

//查询员工详情
var account_find_one = exports.account_find_one = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(id) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', (0, _request2.default)('accounts/' + id));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function account_find_one(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
//查询服务商详情


var vendor_find_one = exports.vendor_find_one = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(id) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', (0, _request2.default)('vendors/' + id));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function vendor_find_one(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
//编辑服务商详情


var vendor_update = exports.vendor_update = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {
    var vendor_id;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            vendor_id = params.vendor_id;

            delete params.vendor_id;
            return _context7.abrupt('return', (0, _request2.default)('vendors/' + vendor_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function vendor_update(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
//服务商提交审核


var vendor_apply_verify = exports.vendor_apply_verify = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
    var vendor_id;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            vendor_id = params.vendor_id;

            delete params.vendor_id;
            return _context8.abrupt('return', (0, _request2.default)('vendors/' + vendor_id + '/apply_verify', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function vendor_apply_verify(_x8) {
    return _ref8.apply(this, arguments);
  };
}();
//二维码链接获取


var utils_apk_download_url_find = exports.utils_apk_download_url_find = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt('return', (0, _request2.default)('utils/apk_download_url'));

          case 1:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function utils_apk_download_url_find() {
    return _ref9.apply(this, arguments);
  };
}();
//错误类型获取


var close_type_find = exports.close_type_find = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(id) {
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', (0, _request2.default)('utils/shipment_tags'));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function close_type_find(_x9) {
    return _ref10.apply(this, arguments);
  };
}();
// 登出接口


var logout = exports.logout = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(params) {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', (0, _request2.default)('accounts/logout', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function logout(_x10) {
    return _ref11.apply(this, arguments);
  };
}();

var _request = require('./utils/request');

var _request2 = _interopRequireDefault(_request);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _utils = require('./utils/utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

;;;;

//# sourceMappingURL=public-compiled.js.map