/**
 * Created by user on 17/2/15.
 */

module.exports = {

  OrderAction: {
    fetchTotalOrderStatistics: 'fetchTotalOrderStatistics', //获取分单中心－订单状态
    fetchSellerOrderList: 'fetchSellerOrderList',           //获取分单中旬－商家列表
    fetchOrderCityList: 'fetchOrderCityList',               //获取分单中心－城市列表
  },

  CloseAction: {
    fetchCloseOrderList: 'fetchCloseOrderList',             //获取异常列表－异常订单列表
    fetchCloseOrderDetail: 'fetchCloseOrderDetail',         //获取异常列表－异常订单详情
    fetchCloseOrderLog: 'fetchCloseOrderLog',               //获取异常列表－异常订单日志
    fetchCloseOrderRedivides: 'fetchCloseOrderRedivides',   //获取异常列表－异常订单详情页操作：重新分单
    fetchCloseOrder: 'fetchCloseOrder',                     //获取异常列表－异常订单详情页操作：关闭订单
  },

  SellerAction: {
    fetchSellerOrderStatistics: 'fetchSellerOrderStatistics', //获取商家订单状态
    fetchAreaOrderList: 'fetchAreaOrderList',                 //获取区域订单
  },
};
