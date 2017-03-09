
const subRoutes = [
  {
    path: 'seller_wallet',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/seller_wallet'));
      })
    },
  },
{
  path: 'seller_bills',
      childRoutes: [
        {
            path: 'list',
            getComponent: (location, callback) => {
            require.ensure([], (require) => {
            callback(null, require('./pages/seller_bills/list'));
            })}
      }]
},
  {
    path: 'courier_bills',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/courier_bills/list'));
      })
    },
  },
];
module.exports =  {
  path: 'finance' ,
  childRoutes: subRoutes ,
};
