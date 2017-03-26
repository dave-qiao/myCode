
const subRoutes = [
  {
    path: 'merchants_info',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/merchants_info'));
      })
    },
  },
  {
    path: 'account_info',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/account_info'));
      })
    },
  }
];
module.exports =  {
  path: 'account',
  childRoutes: subRoutes
}
