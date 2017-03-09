
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {message} from 'antd';
import { tms_shipments_find, tms_shipments_find_one, tms_shipments_find_one_logs } from 'aoao-core-api-service/lib/tms.js';
import { area_find_500, seller_find_500, courier_find_500, area_find_one, seller_find_one } from 'aoao-core-api-service/lib/business.js';
import { fetchAreasTotalList } from './../../../business/src/services/supplier';

module.exports =   {
  namespace: 'statictics_shipments_detail',
  state: {
    areas:{
      data: [],
    }, //区域
    couriers:[],//骑士
    sellers: [],//商家
    list_tables: {//订单详情页面
      _meta: {},// 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
      data: [],//订单详情页面列表数据
    },
    list_details: {},//订单详情列表的详情
    shipment_detail: {},//运单详情信息
    shipment_area: {},//区域运单信息
    shipment_log: {}//运单日志信息
  },
  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        // 获取相关的账号信息
        const {vendor_id} = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        // 获取城市编码
        const {city_code} = JSON.parse(window.getStorageItem('userInfo') || '{}');
        // 简单的路由判断
        if (location.pathname === '/statictics/shipments_detail/list') {
          // 根据服务商和城市编码进行初始化查询
          dispatch({
            type: 'shipments_detail/querys',
            payload: {vendor_id,city_code}
          });

          // 查询该服务商所有的直营及加盟区域数据
          const is_filter_sub_area = true;
            dispatch({
              type: 'shipments_detail/AreasTotalList',
              payload: { vendor_id, is_filter_sub_area },
            })

        };
      // 如果路由到了详情页面
        if (location.pathname === '/statictics/shipments_detail/list/detail') {
          dispatch({
            type: 'shipments_detail/query/one',
            payload: location.query
          });
        };
      });
    },
  ],
  effects: {
     // 运单详情查询
    *['shipments_detail/querys'](params){
      // const {state} = params.payload;
      let shipments = {...params.payload};
      // //如果是全部就什么也不传
      // delete shipments.state;
      delete shipments.city_code;
      // delete shipments.vendor_id;
      // //需要 delivery_state
      // if(['1','2'].indexOf(state) !== -1) {
      //   shipments.delivery_state = shipment_states_dict[state];
      // };
      // //需要 state
      // if(['3', '4', '5', '6'].indexOf(state) !== -1) {
      //   shipments.state = shipment_states_dict[state];
      // };
      // 查询运单的接口
      const result_shipments = yield call(tms_shipments_find, shipments);
      // 返回的数据处理
      if (result_shipments.err) {
          message.error('运单查询失败！');
      } else {
        // 查询成功的化put数据
        yield put({
          type: 'shipments_detail/query/success',//订单详情查询成功
          payload: result_shipments.data
        });
      }
    },
     // 没用到
    // TODO: 未使用
    *['shipments_detail/search_item_load'](params){
      const {vendor_id, city_code} = params.payload;
      const result_areas = yield call(area_find_500, {vendor_id});
      const result_seller = yield call(seller_find_500, {city_code});
      const result_courier = yield call(courier_find_500, {vendor_id});
      if (result_areas.err) {
      } else {
        yield put({
          type: 'shipments_detail/search_item_load/query/success',
          payload: {
            areas:result_areas.data.data,
            sellers:result_seller.data.data,
            couriers:result_courier.data.data,
          }
        });
      }
    },
    // 运单详情查询
    *['shipments_detail/query/one'](params) {
      // 查询运单基础详情
      let detail_shipments = yield call(tms_shipments_find_one, params.payload.id);
      // 查询运单的日志信息
      let log_shipments = yield call(tms_shipments_find_one_logs, params.payload.id);
      // 数据处理
      if (detail_shipments.err) {
        message.error('运单详情查询失败！');
      } else {
        const {seller_id,courier} = detail_shipments.data;
        // 获取到数据存放到相应的对象中
        let _result = {
          shipment_detail: detail_shipments.data,
          shipment_log: log_shipments.data,
        };
        // 根据商户的ID查询商家的信息
        const result_seller = yield call(seller_find_one, seller_id);
        // 进行数据判断
        if(result_seller.data) {
          // 返回值的赋值
          _result.shipment_detail.seller_type = result_seller.data.seller_type;
        };
        // 如果骑士信息存在就用骑士的ID查询当前骑士的信息
        if(detail_shipments.data) {
          let result_area  = yield call(area_find_one, detail_shipments.data.area_id);
          _result.shipment_area = result_area.data;
        };
         // 运单详情查询成功
        yield put({
          type: 'shipments_detail/query/one/success',     // 运单详情查询成功
          payload: {..._result}
        });
      };
    },

    /**
     Created by dave 2017/3/1
     * */
    // 获取直营以及加盟的区域总列表
    *['shipments_detail/AreasTotalList'](params){
      const areas = yield call(fetchAreasTotalList, params.payload);
      yield put({
        type: 'shipments_detail/AreasTotalList/success',
        payload: areas,
      })
    }
  },
  reducers: {
    //订单详情查询成功
    ['shipments_detail/query/success'](state, action){
      let {list_tables} = state;
      // ES6语法 更新state的状态
      Object.assign(list_tables,action.payload);
      return {
        ...state,
        list_tables
      };
    },
    // TODO: 未使用
    ['shipments_detail/search_item_load/query/success'](state,action){
      return {...state, ...action.payload};
    },
    // 运单详情查询成功
    ['shipments_detail/query/one/success'](state, action) {
      let _result = {...state,
        ...action.payload
      };
      let {shipment_detail} = _result;
      // 数据结构的整理
      const { distance = 0, o3_order_amount = 0, shipping_fee = 0, shipping_fee_courier_rate = 0, tip_fee = 0, tip_fee_courier_rate = 0} = shipment_detail;
      // 骑士的小费
      let local_calc_fee_courier = (shipping_fee*shipping_fee_courier_rate + tip_fee*tip_fee_courier_rate)/10000;
      // 取两位小数
      local_calc_fee_courier = local_calc_fee_courier.toFixed(2);
      // 服务商的消费
      let local_calc_fee_vendor = (shipping_fee + tip_fee) / 100 - local_calc_fee_courier * 1;
      // 取两位小数
      local_calc_fee_vendor = local_calc_fee_vendor.toFixed(2);
       // 数据结构整理
      Object.assign(shipment_detail,{
        local_calc_distance: distance / 1000,//配送距离
        local_calc_o3_order_amount: o3_order_amount / 100,//订单的数量
        local_calc_shipping_fee: shipping_fee / 100,//运单的费用
        local_calc_tip_fee: tip_fee / 100,//运单的小费
        local_calc_fee_courier,//骑士的服务费
        local_calc_fee_vendor//服务商的服务费
      });
      return {..._result,shipment_detail};
    },

    /**
     Created by dave 2017/3/1
     * */
    // 获取直营以及加盟的区域总列表
    ['shipments_detail/AreasTotalList/success'](state, action){
      const { areas } = state;
      Object.assign(areas, action.payload);
      return {
        ...state,
        areas,
      }
    },

  },
}
