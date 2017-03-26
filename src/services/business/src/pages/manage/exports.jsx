//统一加载配置文件
//

//直营模块列表
module.exports.modules = [
  {
    name: '商家信息',
    key: 'Shop',
  }, {
    name: '签约信息',
    key: 'SignInfo',
  },{
    name: '订单分单规则',
    key: 'OrderDispatchRules',
  },{
    name: '骑士分单规则',
    key: 'KnightDispatchRules',
  },
];
//加盟模块列表
module.exports.affModules = [
  {
    name: '商家信息',
    key: 'Shop',
  }, {
    name: '骑士分单规则',
    key: 'KnightDispatchRules',
  }, {
    name: '加盟定价',
    key: 'Affiliates'
  }
]

//商户信息
module.exports.Shop = require('./components/retail/shop');

//签约信息
module.exports.Signed = require('./components/retail/signed');

//订单分单规则
module.exports.OrderDispatchRules = require('./components/orderDispatchRules');

//骑士分单规则
module.exports.KnightDispatchRules = require('./components/knightDispatchRules');


//一级模块 tab切换
module.exports.Tabs = [
  {
    name: '直营项目',
    key: 'oneLevelList',
    type: 'primary',
  }, {
    name: '加盟项目',
    key: 'Affiliates',
    type: ''
  }
]

//直营项目组件
module.exports.OneLevelList = require('./components/retail/oneLevelList');

//加盟项目组件
module.exports.Affiliates = require('./affiliates');
