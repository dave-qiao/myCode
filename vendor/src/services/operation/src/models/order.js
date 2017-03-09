/**
 * Created by user on 17/2/16.
 */
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';

import {
  fetchTotalOrderStatistics,   //获取订单状态
  fetchOrderCityList,          //获取城市列表

  fetchSellerOrderList,        //获取商家订单列表

  fetchAreaOrderList,          //获取区域订单列表

  fetchCloseOrderList,         //异常订单列表
  fetchCloseOrderDetail,       //异常订单详情
  fetchCloseOrderLog,          //异常订单日志
} from '../services/order';

  //请求的每页数据条数
const requestPagerSize = 12;
const requestPageNumber = 1;

module.exports = {
  //module层命名
  namespace: 'operationOrder',

  // 初始化数据源
  state: {
    totalOrderStatistics: [], //总订单状态
    cityList: [],             //城市选择清单

    sellerOrderList: [],      //商家订单列表

    //vendorOrderList: [],    //服务商订单列表
    areaOrderList: [],        //区域订单列表

    closeOrderList: [],       //异常订单列表
    closeOrderDetail: [],     //异常订单详情
    closeOrderLog: [],        //异常订单日志
  },

  subscriptions: [
    function ({ dispatch, history }) {
     // const detailPaths = ['/business/area/list/detail', '/business/area/list/edit'];
      history.listen((location) => {
        const AccountSet = JSON.parse(window.localStorage.getItem('accountInfo') || '{}');
        const UserSet = JSON.parse(window.localStorage.getItem('userInfo') || '{}');

        const date = window.localStorage.getItem('date') || ' ';
        const startDate = window.localStorage.setItem('startDate', '');
        const endDate = window.localStorage.setItem('endDate', '');

        const { vendor_id } = AccountSet;
        const { city_code } = UserSet;
        const { pathname } = location;

       //---------pathname用于监视是否当前路径需要请求接口----------

        //分单中心
        if (pathname === '/operation/order') {
          //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchOrderCityList',
            payload: vendor_id,
          });

          //获取订单状态
          dispatch({
            type: 'fetchTotalOrderStatistics',
            payload: {
              vendorId: vendor_id,
              cityCode: city_code ? city_code : 110000,
              shippingDate: date },
          });

          //获取商家列表
          dispatch({
            type: 'fetchSellerOrderList',
            payload: {
              vendorId: vendor_id,
              cityCode: city_code ? city_code : 110000,
              shippingDate: date,
              page: requestPageNumber,     //页码
              limit: requestPagerSize,     //分页
              sort:  '{created_at: -1}',   //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
            },
          })
        }

        //异常订单查看
        if (pathname === '/operation/order/close') {
          //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchOrderCityList',
            payload: vendor_id,
          });

          /*//异常订单列表
          dispatch({
            type: 'fetchCloseOrderList',
            payload: {
              vendorId: vendor_id,
              cityCode: city_code ? city_code : 110000,
              startDate,
              endDate,
              state: -100,
              page: requestPageNumber,     //页码
              limit: requestPagerSize,     //分页
              sort:  '{created_at: -1}',   //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
            },
          });*/
        }

        //异常订单详情---写在detail页面中增加组件复用性
        /*if (pathname === '/operation/order/close/detail') {
          dispatch({
            type: 'fetchCloseOrderDetail',
            payload: id,
          });
        }*/
      });
    },
  ],

  effects: {

    //获取城市列表
    * fetchOrderCityList({ payload: vendorId }) {
      const response = yield call(fetchOrderCityList, vendorId);
      yield put({ type: 'reducerOrderCityList', payload: response });
    },

    //获取订单状态
    * fetchTotalOrderStatistics({ payload }) {
      const { vendorId, cityCode, shippingDate } = payload;
      const response = yield call(fetchTotalOrderStatistics, vendorId, cityCode, shippingDate);
      yield put({ type: 'reducerTotalOrderStatistics', payload: response });
    },

    //获取商家订单列表---, page, limit, sort
    * fetchSellerOrderList({ payload }) {
      const { vendorId, cityCode, shippingDate, page, limit, sort } = payload;
      const response = yield call(fetchSellerOrderList, vendorId, cityCode, shippingDate);
      yield put({ type: 'reducerSellerOrderList', payload: response });
    },

    //获取区域订单列表---, page, limit, sort
    * fetchAreaOrderList({ payload }) {
      const { sellerId, vendorId, cityCode, shippingDate, page, limit, sort } = payload;
      const response = yield call(fetchAreaOrderList, sellerId, vendorId, cityCode, shippingDate);
      yield put({ type: 'reducerAreaOrderList', payload: response });
    },

    //获取异常订单列表
    * fetchCloseOrderList({ payload }) {
      const { vendorId, cityCode, startDate, endDate, state, page, limit, sort } = payload;
      const response = yield call(fetchCloseOrderList, vendorId, cityCode, startDate, endDate, state, page, limit, sort);
      yield put({ type: 'reducerCloseOrderList', payload: response });
    },

    //获取异常订单详情
    * fetchCloseOrderDetail({ payload: orderId }) {
      const response = yield call(fetchCloseOrderDetail, orderId);
      yield put({ type: 'reducerCloseOrderDetail', payload: response });
    },

    //获取异常订单日志
    * fetchCloseOrderLog({ payload: shipmentId }) {
      const response = yield call(fetchCloseOrderLog, shipmentId);
      yield put({ type: 'reducerCloseOrderLog', payload: response });
    },

  },

  reducers: {

    //分单中心城市列表
    reducerOrderCityList(state, { payload: cityList }) {
      return { ...state, cityList };
    },

    //订单状态
    reducerTotalOrderStatistics(state, { payload: totalOrderStatistics }) {
      return { ...state, totalOrderStatistics };
    },

    //商家订单列表
    reducerSellerOrderList(state, { payload: sellerOrderList }) {
      return { ...state, sellerOrderList };
    },

    //区域订单列表
    reducerAreaOrderList(state, { payload: areaOrderList }) {
      return { ...state, areaOrderList };
    },

    //异常订单列表
    reducerCloseOrderList(state, { payload: closeOrderList }) {
      return { ...state, closeOrderList };
    },

    //异常订单详情
    reducerCloseOrderDetail(state, { payload: closeOrderDetail }) {
      return { ...state, closeOrderDetail };
    },

    //异常订单日志
    reducerCloseOrderLog(state, { payload: closeOrderLog }) {
      return { ...state, closeOrderLog };
    },

  },
};
