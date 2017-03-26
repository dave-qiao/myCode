
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {SELLER} from '../ActionsName.js';
import { shipments_seller_monthly_find, shipments_seller_daily_find } from 'aoao-core-api-service/lib/statictics.js';

const {stateTransform, utcToDate, numberDateToStr, getMonthDays} =  window.tempAppTool;

module.exports =   {
  namespace: 'statictics_shipments_seller',
  state: {
    list_tables: {  //商家订单统计
      data: [],//区域订单统计数据
      _meta: {},// 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    list_details: {},//商家订单的详细信息
  },

  subscriptions: [
    function({ dispatch, history }) {

      history.listen(location => {
        // 获取服务商的id
        const {vendor_id} = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        // 获取城市代码
        const {city_code} = JSON.parse(window.getStorageItem('userInfo') || '{}');

        let start_date = 0;
        let end_date = 0;

        // 取当前日期的前一天
        var yes_date = new Date(new Date()-24*60*60*1000);
        yes_date = utcToDate(yes_date);
        yes_date = yes_date.date.join('');

        if (location.pathname === '/statictics/shipments_seller/list') {
          dispatch({
            type: SELLER.find,
            payload: {vendor_id,start_date:yes_date,end_date:yes_date}
          });
        };
      });
    },
  ],

  effects: {
    // 商户运单查询
    *['shipments_seller/querys'](params){
      //请求接口
      const result_seller = yield call(shipments_seller_daily_find, params.payload);
      // 返回数据的处理
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 数据返回成功
        yield put({
          type: 'shipments_seller/querySuccess',  // 商户运单查询数据返回成功
          payload: {
             data: result_seller.data.data,
            _meta:result_seller.data._meta
          }
        });

      };

    },
  },

  reducers: {
    // 商户运单查询数据返回成功
    ['shipments_seller/querySuccess'](state, action){
      const list_tables = {
        ...state.list_tables,
        ...action.payload,
      };
      return {
        ...state,
        list_tables
      };
    },
  },
}
