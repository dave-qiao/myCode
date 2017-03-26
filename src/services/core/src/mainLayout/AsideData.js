const _menu = [
  {
    title: '运营中心',
    icon: 'user',
    subItems: [
      {
        icon: 'user',
        title: '分单中心',
        a_path: '/#/operation/order',
        hasThird: false,
        /*thirdItems: [
          {
            title: '异常单列表',
            a_path: '/#/operation/order/close',
          },
        ],*/
      },
    ],
  },
  {
    title: '调度中心',
    icon: 'share-alt',
    subItems: [
      {
        title: '调度控制台',
        a_path: '/#/tms/control_panel',
        hasThird: false,
      },
    ],
  },
  {
    title: '数据中心',
    icon: 'line-chart',
    subItems: [
      {
        title: '订单详情查询',
        a_path: '/#/statictics/shipments_detail/list',
        hasThird: false,
      },
      {
        title: '骑士订单统计',
        a_path: '/#/statictics/shipments_courier/list',
        hasThird: false,
      },
      {
        title: '商家订单统计',
        a_path: '/#/statictics/shipments_seller/list',
        hasThird: false,
      },
      {
        title: '区域订单统计',
        a_path: '/#/statictics/shipments_area/list',
        hasThird: false,
      },
      {
        title: '订单明细下载',
        a_path: '/#/statictics/shipments_detail_down/list',
        hasThird: false,
      },
    ],
  },
  {
    title: '业务中心',
    icon: 'user',
    subItems: [
      {
        icon: 'user',
        title: '产品服务设置',
        a_path: '/#/business/product_setup',
        hasThird: false,
      }, //产品服务设置
      {
        icon: 'user',
        title: '区域管理',
        hasThird: false,
        a_path: '/#/business/area/list',
        thirdItems: [],
      }, //区域管理
      {
        title: '团队管理',
        icon: 'team',
        hasThird: true,
        thirdItems: [
          {
            title: '员工列表',
            a_path: '/#/team/employee/list',
          },
          {
            title: '团队列表',
            a_path: '/#/team/courier/list',
          },
        ],
      },
      {
        icon: 'user',
        title: '商家管理',
        hasThird: true,
        thirdItems: [
          {
            title: '商家列表',
            a_path: '/#/business/seller/list',
          },
          {
            title: '签约列表',
            a_path: '/#/business/sign/list',
          },
        ],
      }, //商家管理
      {
        icon: 'user',
        title: '供应商管理',
        hasThird: false,
        a_path: '/#/business/supplier/list',
        thirdItems: [],
      }, //供应商管理
      {
        icon: 'user',
        title: '项目管理',
        hasThird: false,
        a_path: '/#/business/manage',
        thirdItems: [],
      }, //项目管理
    ],
  },
  {
    title: '财务中心',
    icon: 'credit-card',
    subItems: [
      {
        title: '商家账单',
        a_path: '/#/finance/seller_bills/list',
        hasThird: false,
      },
    ],
  },
  {
    title: '个人中心',
    icon: 'team',
    subItems: [
      {
        title: '我的服务商',
        a_path: '/#/account/merchants_info',
        hasThird: false,
      },
      {
        title: '我的账号',
        a_path: '/#/account/account_info',
        hasThird: false,
      },
    ],
  },
  {
    title: '新手指南',
    icon: 'question',
    subItems: [
      {
        title: '新手指南',
        a_path: '/#/guide/greenhands',
      },
      {
        title: '业务指南',
        a_path: '/#/guide/newbusiness',
      },
    ],
  },

];

module.exports = _menu;
