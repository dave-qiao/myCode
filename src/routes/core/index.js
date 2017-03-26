const subRoutes = [
  //登录
  {
    path: '/login',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../pages/login'));
      });
    },
  },

  //注册
  {
    path: '/register',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../pages/register'));
      })
    },
  },

  //首页
  {
    path: '/index',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('../../pages/login'));
      })
    },
  },
];

module.exports = {
  path: '/',
  childRoutes: subRoutes,
}
