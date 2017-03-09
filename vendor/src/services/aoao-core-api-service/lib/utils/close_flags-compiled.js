"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// 错误标记字典表
var error_flags_data = {
  "courier": [{
    "id": 20,
    "name": "骑士车坏了"
  }, {
    "id": 21,
    "name": "货损"
  }, {
    "id": 22,
    "name": "骑士其他原因"
  }],
  "seller": [{
    "id": 1,
    "name": "配送费计算错误"
  }, {
    "id": 2,
    "name": "商家取消"
  }, {
    "id": 3,
    "name": "货损"
  }, {
    "id": 4,
    "name": "顾客失联"
  }, {
    "id": 5,
    "name": "顾客拒签"
  }, {
    "id": 6,
    "name": "商家出餐太慢"
  }, {
    "id": 7,
    "name": "商家地址错误"
  }, {
    "id": 8,
    "name": "商家其他原因"
  }]
};

// 关闭标记字典表
var close_flags_data = {
  "courier": [{
    "id": 20,
    "name": "骑士车坏了"
  }, {
    "id": 21,
    "name": "货损"
  }, {
    "id": 22,
    "name": "骑士其他原因"
  }],
  "seller": [{
    "id": 1,
    "name": "配送费计算错误"
  }, {
    "id": 2,
    "name": "商家取消"
  }, {
    "id": 3,
    "name": "货损"
  }, {
    "id": 4,
    "name": "顾客失联"
  }, {
    "id": 5,
    "name": "顾客拒签"
  }, {
    "id": 6,
    "name": "商家出餐太慢"
  }, {
    "id": 7,
    "name": "商家地址错误"
  }, {
    "id": 8,
    "name": "商家其他原因"
  }]
};

var error_flags = { courier: {}, seller: {} };
var close_flags = { courier: {}, seller: {} };

['courier', 'seller'].forEach(function (name) {

  error_flags_data[name].forEach(function (item) {
    error_flags[name][item.id] = item.name;
  });

  close_flags_data[name].forEach(function (item) {
    close_flags[name][item.id] = item.name;
  });
});

var error_flag_data = (0, _assign2.default)(error_flags.courier, error_flags.seller);
var close_flag_data = (0, _assign2.default)(close_flags.courier, close_flags.seller);

//# sourceMappingURL=close_flags-compiled.js.map