'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seller_month_bills_find = exports.seller_day_bills_find = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// export async function seller_day_bills_find(params) {
//   return request(`bills/sellers/daily?${qs.stringify(createListParam(params))}`);
// };
//
// export async function seller_month_bills_find(params) {
//   return request(`bills/sellers/monthly?${qs.stringify(createListParam(params))}`);
// };

// 查询日账单
var seller_day_bills_find = exports.seller_day_bills_find = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var page;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = params.page;

            delete params.page;
            return _context.abrupt('return', (0, _request2.default)('bills/sellers/daily?' + _qs2.default.stringify((0, _utils.createlimitPage)(page)), {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function seller_day_bills_find(_x) {
    return _ref.apply(this, arguments);
  };
}();

// 查询月账单
var seller_month_bills_find = exports.seller_month_bills_find = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params) {
    var value, page;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            value = params;
            page = params.page;

            delete params.page;
            return _context2.abrupt('return', (0, _request2.default)('bills/sellers/monthly?' + _qs2.default.stringify((0, _utils.createlimitPage)(page)), {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function seller_month_bills_find(_x2) {
    return _ref2.apply(this, arguments);
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

;;

//# sourceMappingURL=finance-compiled.js.map