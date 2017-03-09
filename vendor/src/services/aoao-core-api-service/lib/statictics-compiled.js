'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shipments_daily_down = exports.shipments_daily_find = exports.shipments_courier_daily_detail_find = exports.shipments_courier_daily_find = exports.shipments_courier_monthly_find = exports.shipments_area_daily_detail_find = exports.shipments_area_daily_find = exports.shipments_area_monthly_find = exports.shipments_seller_daily_detail_find = exports.shipments_seller_daily_find = exports.shipments_seller_monthly_find = exports.shipments_detail_find = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 查询运单详情
var shipments_detail_find = exports.shipments_detail_find = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _request2.default)('shipments/?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function shipments_detail_find(_x) {
    return _ref.apply(this, arguments);
  };
}();

//
var shipments_seller_monthly_find = exports.shipments_seller_monthly_find = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', (0, _request2.default)('reports/orders/monthly/by_seller', {
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

  return function shipments_seller_monthly_find(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

//
var shipments_seller_daily_find = exports.shipments_seller_daily_find = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(params) {
    var page;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            page = params.page;

            delete params.page;
            return _context3.abrupt('return', (0, _request2.default)('reports/shipments/daily/by_seller?' + _qs2.default.stringify((0, _utils.createlimitPage)(page)), {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function shipments_seller_daily_find(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

//
var shipments_seller_daily_detail_find = exports.shipments_seller_daily_detail_find = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', (0, _request2.default)('reports/orders/daily_detail/by_seller', {
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

  return function shipments_seller_daily_detail_find(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

//shipments_area
var shipments_area_monthly_find = exports.shipments_area_monthly_find = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', (0, _request2.default)('reports/shipments/monthly/by_area', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function shipments_area_monthly_find(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

//
var shipments_area_daily_find = exports.shipments_area_daily_find = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params) {
    var page;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            page = params.page;

            delete params.page;
            return _context6.abrupt('return', (0, _request2.default)('reports/shipments/daily/by_area?' + _qs2.default.stringify((0, _utils.createlimitPage)(page)), {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function shipments_area_daily_find(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

//
var shipments_area_daily_detail_find = exports.shipments_area_daily_detail_find = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt('return', (0, _request2.default)('reports/shipments/daily_detail/by_area', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function shipments_area_daily_detail_find(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

//
var shipments_courier_monthly_find = exports.shipments_courier_monthly_find = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', (0, _request2.default)('reports/shipments/monthly/by_courier', {
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

  return function shipments_courier_monthly_find(_x8) {
    return _ref8.apply(this, arguments);
  };
}();

//
var shipments_courier_daily_find = exports.shipments_courier_daily_find = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(params) {
    var page;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            page = params.page;

            delete params.page;
            return _context9.abrupt('return', (0, _request2.default)('reports/shipments/daily/by_courier?' + _qs2.default.stringify((0, _utils.createlimitPage)(page)), {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function shipments_courier_daily_find(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

//
var shipments_courier_daily_detail_find = exports.shipments_courier_daily_detail_find = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(params) {
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', (0, _request2.default)('reports/shipments/daily_detail/by_courier', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function shipments_courier_daily_detail_find(_x10) {
    return _ref10.apply(this, arguments);
  };
}();

// 日运单查询
var shipments_daily_find = exports.shipments_daily_find = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(params) {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', (0, _request2.default)('reports/shipments/daily/by_vendor/?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function shipments_daily_find(_x11) {
    return _ref11.apply(this, arguments);
  };
}();

//
var shipments_daily_down = exports.shipments_daily_down = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(params) {
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', (0, _request2.default)('reports/download_file?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function shipments_daily_down(_x12) {
    return _ref12.apply(this, arguments);
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

;;;;;;;;;;;;

//# sourceMappingURL=statictics-compiled.js.map