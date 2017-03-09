/**
 * Created by dave on 16/12/16.
 */
/*路由地址配置文件*/
const pathPackage = {
  /*入口模块*/
  entry: {
    login: require('../pages/login'),
    register: require('../pages/register'),
    index: require('../pages/login'),
  },
  /*business业务模块*/
  business: {
    product_setup: require('../services/business/src/pages/product'),
    area: {
      list: require('../services/business/src/pages/area/list'),
      edit: require('../services/business/src/pages/area/list/edit'),
      add: require('../services/business/src/pages/area/list/add'),
      detail: require('../services/business/src/pages/area/list/detail'),
    },
    sign: {
      list: require('../services/business/src/pages/sign/list'),
      edit: require('../services/business/src/pages/sign/list/edit'),
      detail: require('../services/business/src/pages/sign/list/detail'),
    },
    seller: {
      list: require('../services/business/src/pages/seller/list'),
      edit: require('../services/business/src/pages/seller/list/edit'),
      detail: require('../services/business/src/pages/seller/list/detail'),
      check: require('../services/business/src/pages/seller/list/check'),
    },
  },
  /*statictics业务模块*/
  statictics: {
    compass: require('../services/statictics/src/pages/compass'),
    monito: require('../services/statictics/src/pages/monito'),
    shipments_area: {
      detail: require('../services/statictics/src/pages/shipments_area/list/detail'),
      list: require('../services/statictics/src/pages/shipments_area/list'),
    },
    shipments_courier: {
      detail: require('../services/statictics/src/pages/shipments_courier/list/detail'),
      list: require('../services/statictics/src/pages/shipments_courier/list'),
    },
    shipments_detail: {
      detail: require('../services/statictics/src/pages/shipments_detail/list/detail'),
      list: require('../services/statictics/src/pages/shipments_detail/list'),
    },
    shipments_detail_down: {
      detail: require('../services/statictics/src/pages/shipments_detail_down/list/detail'),
      list: require('../services/statictics/src/pages/shipments_detail_down/list'),
    },
    shipments_seller: {
      detail: require('../services/statictics/src/pages/shipments_seller/list/detail'),
      list: require('../services/statictics/src/pages/shipments_seller/list'),
    },
  },
  /*account业务模块*/
  account: {
    account_info: require('../services/account/src/pages/account_info'),
    merchants_info: require('../services/account/src/pages/merchants_info'),
  },
  /*tms业务模块*/
  tms: {
    control_panel: require('../services/tms/src/pages/control_panel'),
    detail: require('../services/tms/src/pages/control_panel/detail'),
  },
  /*finance业务模块*/
  finance: {
    seller_wallet: require('../services/finance/src/pages/seller_wallet'),
    seller_bills: {
      list: require('../services/finance/src/pages/seller_bills/list'),
    },
    courier_bills: require('../services/finance/src/pages/courier_bills/list'),
  },
  /*team业务模块*/
  team: {
    employee: {
      list: require('../services/team/src/pages/employee/list'),
      edit: require('../services/team/src/pages/employee/list/edit'),
      add: require('../services/team/src/pages/employee/list/add'),
      detail: require('../services/team/src/pages/employee/list/detail'),
    },
    courier: {
      list: require('../services/team/src/pages/courier/list'),
      edit: require('../services/team/src/pages/courier/list/edit'),
      add: require('../services/team/src/pages/courier/list/add'),
      detail: require('../services/team/src/pages/courier/list/detail'),
      check: require('../services/team/src/pages/courier/list/check'),
    }
  },
  /*error业务模块*/
  error: require('../services/core/src/noFound')
};

module.exports = [
  {
    /*----------------------入口模块---------------------------------------*/
    path: '/',
    childRoutes: [
      //登录
      {
        path: '/login',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.entry.login);
          });
        },
      },
      //注册
      {
        path: '/register',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.entry.register);
          })
        },
      },
      //首页
      {
        path: '/index',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.entry.login);
          })
        },
      },
    ],
  },
  /*----------------------business业务模块---------------------------------------*/
  {
    path: 'business',
    childRoutes: [
      {
        path: 'product_setup',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.business.product_setup);
          })
        },
      },
      {
        path: 'area',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.area.list);
            })
          },
        }, {
          path: 'list/edit',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.area.edit);
            })
          },
        }, {
          path: 'list/add',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.area.add);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.area.detail);
            })
          },
        }],
      },
      {
        path: 'sign',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.sign.list);
            })
          },
        }, {
          path: 'list/edit',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.sign.edit);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.sign.detail);
            })
          },
        }],
      },
      {
        path: 'seller',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.seller.list);
            })
          },
        }, {
          path: 'list/edit',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.seller.edit);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.seller.detail);
            })
          },
        }, {
          path: 'list/check',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.business.seller.check);
            })
          },
        },
        ],
      },
    ],
  },
  /*--------------------------statictics业务模块-----------------------------------*/
  {
    path: 'statictics',
    childRoutes: [
      {
        path: 'compass',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.statictics.compass);
          })
        },
      },
      {
        path: 'monito',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.statictics.monito);
          })
        },
      },
      {
        path: 'shipments_detail',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_detail.list);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_detail.detail);
            })
          },
        }],
      },
      {
        path: 'shipments_detail_down',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_detail_down.list);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_detail_down.detail);
            })
          },
        }],
      },
      {
        path: 'shipments_area',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_area.list);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_area.detail);
            })
          },
        }],
      },
      {
        path: 'shipments_seller',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_seller.list);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_seller.detail);
            })
          },
        }],
      },
      {
        path: 'shipments_courier',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_courier.list);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.statictics.shipments_courier.detail);
            })
          },
        }],
      },
    ],
  },
  /*-------------------------account业务模块------------------------------------*/
  {
    path: 'account',
    childRoutes: [
      {
        path: 'merchants_info',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.account.merchants_info);
          })
        },
      },
      {
        path: 'account_info',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.account.account_info);
          })
        },
      },
    ],
  },
  /*--------------------------tms业务模块-----------------------------------*/
  {
    path: 'tms',
    childRoutes: [
      {
        path: 'control_panel',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.tms.control_panel);
          })
        },
      }, {
        path: 'control_panel/detail',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.tms.detail);
          })
        },
      },
    ],
  },
  /*--------------------------finance业务模块-----------------------------------*/
  {
    path: 'finance',
    childRoutes: [
      {
        path: 'seller_wallet',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.finance.seller_wallet);
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
                callback(null, pathPackage.finance.seller_bills.list);
              })
            },
          }],
      },
      {
        path: 'courier_bills',
        getComponent: (location, callback) => {
          require.ensure([], (require) => {
            callback(null, pathPackage.finance.courier_bills);
          })
        },
      },
    ],
  },
  /*--------------------------团队管理业务模块-----------------------------------*/
  {
    path: 'team',
    childRoutes: [
      {
        path: 'employee',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.employee.list);
            })
          },
        }, {
          path: 'list/edit',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.employee.edit);
            })
          },
        }, {
          path: 'list/add',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.employee.add);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.employee.detail);
            })
          },
        }],
      },
      {
        path: 'courier',
        childRoutes: [{
          path: 'list',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.courier.list);
            })
          },
        }, {
          path: 'list/edit',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.courier.edit);
            })
          },
        }, {
          path: 'list/add',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.courier.add);
            })
          },
        }, {
          path: 'list/detail',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.courier.detail);
            })
          },
        }, {
          path: 'list/check',
          getComponent: (location, callback) => {
            require.ensure([], (require) => {
              callback(null, pathPackage.team.courier.check);
            })
          },
        }],
      }
    ]
  },
  /*------------------------error业务模块-------------------------------------*/
  {
    path: '/*',
    getComponent: (location, callback) => {
      require.ensure([], (require) => {
        /*eslint import/no-unresolved: [2, { caseSensitive: false }]*/
        callback(null, pathPackage.error);
      })
    },
  }];
/*-----------------------------end--------------------------------*/
