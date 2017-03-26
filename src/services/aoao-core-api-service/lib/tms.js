'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tms_courier_shipments_statistics = exports.tms_shipments_statistics = exports.tms_reassign = exports.tms_couriers_find = exports.tms_shipments_close = exports.tms_shipments_find_one_logs = exports.tms_shipments_find_one = exports.tms_shipments_find = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

//运单查询
var tms_shipments_find = exports.tms_shipments_find = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _request2.default)('shipments/?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function tms_shipments_find(_x) {
    return _ref.apply(this, arguments);
  };
}();

//运单详情查询
var tms_shipments_find_one = exports.tms_shipments_find_one = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', (0, _request2.default)('shipments/' + id));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function tms_shipments_find_one(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

//运单操作日志查询
var tms_shipments_find_one_logs = exports.tms_shipments_find_one_logs = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(id) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', (0, _request2.default)('shipments/' + id + '/track_logs'));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function tms_shipments_find_one_logs(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

//运单关闭
var tms_shipments_close = exports.tms_shipments_close = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', (0, _request2.default)('shipments/close', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function tms_shipments_close(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
//其实查询


var tms_couriers_find = exports.tms_couriers_find = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', (0, _request2.default)('couriers/?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function tms_couriers_find(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

//运单改派
var tms_reassign = exports.tms_reassign = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', (0, _request2.default)('shipments/reassign', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function tms_reassign(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

//实时运单统计
var tms_shipments_statistics = exports.tms_shipments_statistics = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt('return', (0, _request2.default)('statistics/shipments?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function tms_shipments_statistics(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

//实时骑士运单统计
var tms_courier_shipments_statistics = exports.tms_courier_shipments_statistics = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', (0, _request2.default)('statistics/courier_shipments', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function tms_courier_shipments_statistics(_x8) {
    return _ref8.apply(this, arguments);
  };
}();

var _request = require('./utils/request');

var _request2 = _interopRequireDefault(_request);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _utils = require('./utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;;;;;;;