
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

var error_flags = {courier: {}, seller: {}};
var close_flags = {courier: {}, seller: {}};

// 根据对应的编号获取相应的错误原因
['courier','seller'].forEach(name =>{

  error_flags_data[name].forEach(item=>{
    error_flags[name][item.id] = item.name;
  })
// 根据对应的编号获取相应的关闭原因
  close_flags_data[name].forEach(item=>{
    close_flags[name][item.id] = item.name;
  })

})

var error_flag_data = Object.assign(error_flags.courier,error_flags.seller);
var close_flag_data = Object.assign(close_flags.courier,close_flags.seller);
