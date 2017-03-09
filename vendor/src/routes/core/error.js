module.exports =
  //404
  {
    path: '/*',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        /*eslint import/no-unresolved: [2, { caseSensitive: false }]*/
        callback(null, require('../../services/core/src/NoFound'));
      })
    },
  }
;
