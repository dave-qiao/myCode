
const subRoutes = [
  //分单中心
  {
    path: 'order',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/order'));
      })
    },
  },
  //异常单列表
  {
    path: 'order/close',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/close'));
      })
    },
  },
  //异常订单详情
  {
    //path: 'order/close/detail/:recordId',
    path: 'order/close/detail',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/close/detail'));
      })
    },
  },
  //商家列表
  {
    path: 'order/seller',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/seller'));
      })
    },
  },

];

module.exports = {
  path: 'operation',
  childRoutes: subRoutes,
};
