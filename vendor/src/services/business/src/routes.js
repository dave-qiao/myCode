const subRoutes = [
  {
    path: 'product_setup',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/product'));
      })
    },
  },
  //产品服务设置
  {
    path: 'product_setup',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        callback(null, require('./pages/product'));
      })
    }
  },

  /*{
    path: 'area',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/area/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/area/list/edit'));
        })
      },
    }, {
      path: 'list/add',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/area/list/add'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/area/list/detail'));
        })
      },
    }]
  },*/

  {
    path: 'sign',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list/edit'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list/detail'));
        })
      },
    }]
  },

  {
    path: 'seller',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/edit'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/detail'));
        })
      },
    }, {
      path: 'list/check',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/check'));
        })
      },
    }]
  },

  /*加盟管理*/
  {
    path: 'supplier',
    childRoutes: [
      {
        path: 'list',
        getComponent: (location, callback)=> {
          require.ensure([], (require) => {
            callback(null, require('./pages/supplier/list'));
          })
        }
      },
      {
        path: 'list/suppliers',
        getComponent: (location, callback)=> {
          "use strict";
          require.ensure([], (require)=> {
            callback(null, require('./pages/supplier/list/detail'))
          })
        }
      },
      {
        path: 'list/regionalList',
        getComponent: (location, callback)=> {
          "use strict";
          require.ensure([], (require)=> {
            callback(null, require('./pages/supplier/list/regionalList'))
          })
        }
      },
    ]
  },
  //区域管理
  {
    path: 'area',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/area/list'));
        })
      },
    },
      //  {
      //   path: 'list/edit',
      //   getComponent: (location, callback) => {
      //     require.ensure([], (require) => {
      //       callback(null, require('./pages/area/list/edit'));
      //     })
      //   },
      // }, {
      //   path: 'list/add',
      //   getComponent: (location, callback) => {
      //     require.ensure([], (require) => {
      //       callback(null, require('./pages/area/list/add'));
      //     })
      //   },
      // }, {
      //   path: 'list/detail',
      //   getComponent: (location, callback) => {
      //     require.ensure([], (require) => {
      //       callback(null, require('./pages/area/list/detail'));
      //     })
      //   },
      // }
    ],
  },

  //商家管理
  {
    path: 'seller',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/edit'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/detail'));
        })
      },
    }, {
      path: 'list/check',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/seller/list/check'));
        })
      },
    },
    ],
  },

  //项目管理
  {
    path: 'manage',
    indexRoute: {
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/direct'));
        })
      },
    },
    childRoutes: [/*{
      path: 'module',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/module'));
        })
      },
    }, {
      path: 'module/:activeModule',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/module'));
        })
      },
    }, {
      path: 'module/:activeModule/:hideTabsMenu',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/module'));
        })
      },
    },*/ {
      //直营模块
      path: 'retail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/direct'));
        })
      },
    }, {
      //加盟模块
      path: 'affiliates',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/affiliates'));
        })
      },
    }, {
      //直营商家信息模块
      path: 'retail/shop',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/retail/shop'));
        })
      },
    }, {
      //直营签约信息模块
      path: 'retail/signed',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/retail/signed'));
        })
      },
    },{
      //直营订单分单规则模块
      path: 'retail/orderDispatchRules',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/orderDispatchRules'));
        })
      },
    },{
      //直营骑士分单规则模块
      path: 'retail/knightDispatchRules',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/knightDispatchRules'));
        })
      },
    }, {
      //加盟商家信息模块
      path: 'affiliates/info',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/join/info'));
        })
      },
    }, {
      //加盟骑士分担规则模块
      path: 'affiliates/knigh',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/manage/components/join/knigh'));
        })
      },
    },],
  },

  //签约管理
  {
    path: 'sign',
    childRoutes: [{
      path: 'list',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list'));
        })
      },
    }, {
      path: 'list/edit',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list/edit'));
        })
      },
    }, {
      path: 'list/detail',
      getComponent: (location, callback) => {
        require.ensure([], (require) => {
          callback(null, require('./pages/sign/list/detail'));
        })
      },
    }],
  }
];
module.exports = {
  path: 'business',
  childRoutes: subRoutes,
}
