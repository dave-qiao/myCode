'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vendor_merchant_find = exports.seller_shop_query = exports.sign_update = exports.sign_find_detail = exports.sign_find = exports.service_active = exports.service_update_one_version = exports.service_find_versions = exports.service_update = exports.service_create = exports.service_find_one = exports.service_find = exports.seller_approve_verify = exports.seller_update = exports.seller_find_one = exports.seller_find_100 = exports.seller_find = exports.courier_find_100 = exports.courier_approve_verify = exports.courier_update = exports.courier_create = exports.courier_find_one_audit_logs = exports.courier_find_one = exports.courier_find = exports.account_update = exports.account_create = exports.account_find_one = exports.account_find = exports.area_regions_update = exports.area_regions_create = exports.area_regions_find_one = exports.area_update = exports.area_create = exports.area_find_one = exports.area_find_50 = exports.area_find_100 = exports.area_find = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

//area

//查询多个区域
var area_find = exports.area_find = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _request2.default)('areas?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function area_find(_x) {
    return _ref.apply(this, arguments);
  };
}();

// 查询一百个区域
var area_find_100 = exports.area_find_100 = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', (0, _request2.default)('areas?' + _qs2.default.stringify((0, _extends3.default)({}, params, { limit: 99 }))));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function area_find_100(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// 查询50个区域
var area_find_50 = exports.area_find_50 = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(params) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', (0, _request2.default)('areas?' + _qs2.default.stringify((0, _extends3.default)({}, params, { limit: 50 }))));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function area_find_50(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

//查询单个区域
var area_find_one = exports.area_find_one = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(id) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', (0, _request2.default)('areas/' + id));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function area_find_one(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

//添加单个区域
var area_create = exports.area_create = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', (0, _request2.default)('areas', {
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

  return function area_create(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
//更新单个区域


var area_update = exports.area_update = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params) {
    var area_id;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            area_id = params.area_id;

            delete params.area_id;
            delete params.region_id;
            delete params.vendor_id;
            return _context6.abrupt('return', (0, _request2.default)('areas/' + area_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function area_update(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

//查询单个区域区域
var area_regions_find_one = exports.area_regions_find_one = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt('return', (0, _request2.default)('maps/regions?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function area_regions_find_one(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

//添加单个区域区域
var area_regions_create = exports.area_regions_create = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', (0, _request2.default)('maps/regions', {
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

  return function area_regions_create(_x8) {
    return _ref8.apply(this, arguments);
  };
}();

//更新单个区域区域
var area_regions_update = exports.area_regions_update = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(params) {
    var region_id;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            region_id = params.region_id;

            delete params.region_id;
            delete params.vendor_id;
            return _context9.abrupt('return', (0, _request2.default)('maps/regions/' + region_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 4:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function area_regions_update(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

//employee

//查询多个员工
var account_find = exports.account_find = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(params) {
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', (0, _request2.default)('accounts?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function account_find(_x10) {
    return _ref10.apply(this, arguments);
  };
}();

//查询单个员工
var account_find_one = exports.account_find_one = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(id) {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', (0, _request2.default)('accounts/' + id));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function account_find_one(_x11) {
    return _ref11.apply(this, arguments);
  };
}();

//添加单个员工
var account_create = exports.account_create = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(params) {
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', (0, _request2.default)('accounts', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function account_create(_x12) {
    return _ref12.apply(this, arguments);
  };
}();
//更新单个员工


var account_update = exports.account_update = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(params) {
    var user_id;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            user_id = params.user_id;

            delete params.user_id;
            delete params.type;
            return _context13.abrupt('return', (0, _request2.default)('accounts/' + user_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 4:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function account_update(_x13) {
    return _ref13.apply(this, arguments);
  };
}();

//courier

//查询多个骑士
var courier_find = exports.courier_find = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(params) {
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt('return', (0, _request2.default)('couriers?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function courier_find(_x14) {
    return _ref14.apply(this, arguments);
  };
}();

//查询单个骑士
var courier_find_one = exports.courier_find_one = function () {
  var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(id) {
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt('return', (0, _request2.default)('couriers/' + id));

          case 1:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function courier_find_one(_x15) {
    return _ref15.apply(this, arguments);
  };
}();

//查询单个骑士操作日志
var courier_find_one_audit_logs = exports.courier_find_one_audit_logs = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(params) {
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            return _context16.abrupt('return', (0, _request2.default)('audit_logs/?' + _qs2.default.stringify(params)));

          case 1:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function courier_find_one_audit_logs(_x16) {
    return _ref16.apply(this, arguments);
  };
}();

//添加单个骑士
var courier_create = exports.courier_create = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(params) {
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            return _context17.abrupt('return', (0, _request2.default)('couriers', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 1:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function courier_create(_x17) {
    return _ref17.apply(this, arguments);
  };
}();
//更新单个骑士


var courier_update = exports.courier_update = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(params) {
    var courier_id;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            courier_id = params.courier_id;

            delete params.courier_id;
            return _context18.abrupt('return', (0, _request2.default)('couriers/' + courier_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function courier_update(_x18) {
    return _ref18.apply(this, arguments);
  };
}();

//审核单个骑士
var courier_approve_verify = exports.courier_approve_verify = function () {
  var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(params) {
    var courier_id;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            courier_id = params.courier_id;

            delete params.courier_id;
            return _context19.abrupt('return', (0, _request2.default)('couriers/' + courier_id + '/approve_verify', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function courier_approve_verify(_x19) {
    return _ref19.apply(this, arguments);
  };
}();

//查询100个骑士
var courier_find_100 = exports.courier_find_100 = function () {
  var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(params) {
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            return _context20.abrupt('return', (0, _request2.default)('couriers?' + _qs2.default.stringify((0, _extends3.default)({}, params, { limit: 99 }))));

          case 1:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function courier_find_100(_x20) {
    return _ref20.apply(this, arguments);
  };
}();

//seller

//查询多个商家
var seller_find = exports.seller_find = function () {
  var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(params) {
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            return _context21.abrupt('return', (0, _request2.default)('contracts/?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this);
  }));

  return function seller_find(_x21) {
    return _ref21.apply(this, arguments);
  };
}();

//查询100个商家
var seller_find_100 = exports.seller_find_100 = function () {
  var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(params) {
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            return _context22.abrupt('return', (0, _request2.default)('contracts?' + _qs2.default.stringify((0, _extends3.default)({}, params, { limit: 99 }))));

          case 1:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, this);
  }));

  return function seller_find_100(_x22) {
    return _ref22.apply(this, arguments);
  };
}();

//查询单个商家
var seller_find_one = exports.seller_find_one = function () {
  var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(id) {
    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            return _context23.abrupt('return', (0, _request2.default)('sellers/' + id));

          case 1:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, this);
  }));

  return function seller_find_one(_x23) {
    return _ref23.apply(this, arguments);
  };
}();

//更新单个商家
var seller_update = exports.seller_update = function () {
  var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(params) {
    var seller_id;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            seller_id = params.seller_id;

            delete params.seller_id;
            return _context24.abrupt('return', (0, _request2.default)('sellers/' + seller_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, this);
  }));

  return function seller_update(_x24) {
    return _ref24.apply(this, arguments);
  };
}();

//审核单个商家
var seller_approve_verify = exports.seller_approve_verify = function () {
  var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(params) {
    var seller_id;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            seller_id = params.seller_id;

            delete params.seller_id;
            return _context25.abrupt('return', (0, _request2.default)('sellers/' + seller_id + '/approve_verify', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, this);
  }));

  return function seller_approve_verify(_x25) {
    return _ref25.apply(this, arguments);
  };
}();

//service

//查询多个产品
var service_find = exports.service_find = function () {
  var _ref26 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(params) {
    return _regenerator2.default.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            return _context26.abrupt('return', (0, _request2.default)('service?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, this);
  }));

  return function service_find(_x26) {
    return _ref26.apply(this, arguments);
  };
}();

//查询单个产品
var service_find_one = exports.service_find_one = function () {
  var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(id) {
    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            return _context27.abrupt('return', (0, _request2.default)('service/' + id));

          case 1:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, this);
  }));

  return function service_find_one(_x27) {
    return _ref27.apply(this, arguments);
  };
}();

//添加单个产品
var service_create = exports.service_create = function () {
  var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(params) {
    return _regenerator2.default.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            delete params.service_id;
            delete params.version_id;
            return _context28.abrupt('return', (0, _request2.default)('service', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context28.stop();
        }
      }
    }, _callee28, this);
  }));

  return function service_create(_x28) {
    return _ref28.apply(this, arguments);
  };
}();
//更新单个产品


var service_update = exports.service_update = function () {
  var _ref29 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29(params) {
    var service_id;
    return _regenerator2.default.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            service_id = params.service_id;

            delete params.service_id;
            return _context29.abrupt('return', (0, _request2.default)('service/' + service_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context29.stop();
        }
      }
    }, _callee29, this);
  }));

  return function service_update(_x29) {
    return _ref29.apply(this, arguments);
  };
}();

//查询产品某个版本信息
var service_find_versions = exports.service_find_versions = function () {
  var _ref30 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30(params) {
    var service_id;
    return _regenerator2.default.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            service_id = params.service_id;

            delete params.service_id;
            return _context30.abrupt('return', (0, _request2.default)('service/' + service_id + '/versions?' + _qs2.default.stringify(params)));

          case 3:
          case 'end':
            return _context30.stop();
        }
      }
    }, _callee30, this);
  }));

  return function service_find_versions(_x30) {
    return _ref30.apply(this, arguments);
  };
}();

//编辑产品某个版本信息
var service_update_one_version = exports.service_update_one_version = function () {
  var _ref31 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee31(params) {
    var service_id, version_id;
    return _regenerator2.default.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            service_id = params.service_id, version_id = params.version_id;

            delete params.service_id;
            delete params.version_id;
            return _context31.abrupt('return', (0, _request2.default)('service/' + service_id + '/versions/' + version_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 4:
          case 'end':
            return _context31.stop();
        }
      }
    }, _callee31, this);
  }));

  return function service_update_one_version(_x31) {
    return _ref31.apply(this, arguments);
  };
}();

//启用服务商产品
var service_active = exports.service_active = function () {
  var _ref32 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee32(params) {
    var service_id;
    return _regenerator2.default.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            service_id = params.service_id;

            delete params.service_id;
            return _context32.abrupt('return', (0, _request2.default)('service/' + service_id + '/active', {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context32.stop();
        }
      }
    }, _callee32, this);
  }));

  return function service_active(_x32) {
    return _ref32.apply(this, arguments);
  };
}();

// 查询签约列表
var sign_find = exports.sign_find = function () {
  var _ref33 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee33(params) {
    return _regenerator2.default.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            return _context33.abrupt('return', (0, _request2.default)('contracts/?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context33.stop();
        }
      }
    }, _callee33, this);
  }));

  return function sign_find(_x33) {
    return _ref33.apply(this, arguments);
  };
}();

// 获取签约详情
var sign_find_detail = exports.sign_find_detail = function () {
  var _ref34 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee34(params) {
    var contract_id;
    return _regenerator2.default.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            contract_id = params.contract_id;
            return _context34.abrupt('return', (0, _request2.default)('contracts/' + contract_id + '?' + _qs2.default.stringify(params)));

          case 2:
          case 'end':
            return _context34.stop();
        }
      }
    }, _callee34, this);
  }));

  return function sign_find_detail(_x34) {
    return _ref34.apply(this, arguments);
  };
}();

// 更新签约信息
var sign_update = exports.sign_update = function () {
  var _ref35 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee35(params) {
    var contract_id;
    return _regenerator2.default.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            contract_id = params.contract_id;

            delete params.contract_id;
            return _context35.abrupt('return', (0, _request2.default)('contracts/' + contract_id, {
              method: 'post',
              body: (0, _stringify2.default)(params)
            }));

          case 3:
          case 'end':
            return _context35.stop();
        }
      }
    }, _callee35, this);
  }));

  return function sign_update(_x35) {
    return _ref35.apply(this, arguments);
  };
}();

// 获取商家的店铺列表
var seller_shop_query = exports.seller_shop_query = function () {
  var _ref36 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee36(params) {
    return _regenerator2.default.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            return _context36.abrupt('return', (0, _request2.default)('shops/?' + _qs2.default.stringify((0, _utils.createListParam)(params))));

          case 1:
          case 'end':
            return _context36.stop();
        }
      }
    }, _callee36, this);
  }));

  return function seller_shop_query(_x36) {
    return _ref36.apply(this, arguments);
  };
}();

//获取服务商签约的历史商户
var vendor_merchant_find = exports.vendor_merchant_find = function () {
  var _ref37 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee37(params, page) {
    return _regenerator2.default.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            return _context37.abrupt('return', (0, _request2.default)('sellers/?' + _qs2.default.stringify((0, _utils.createListParam)(params, page))));

          case 1:
          case 'end':
            return _context37.stop();
        }
      }
    }, _callee37, this);
  }));

  return function vendor_merchant_find(_x37, _x38) {
    return _ref37.apply(this, arguments);
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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

//# sourceMappingURL=business-compiled.js.map