//TODO: 未开发
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import { compass_find } from 'aoao-core-api-service/lib/compass.js';
import { area_find_500 } from 'aoao-core-api-service/lib/business.js';
 module.exports =   {
  namespace: 'statictics_compass',
  state: {
    areas:[],
    income:{
      "yes_income":'',
      "yes_line_income":'',
      "yes_offline_income":'',
      "yesterday_income":[],
      "average_income":[],
      "yesterday_order":[],
      "average_order":[]
    },
    stats_data:{
      "profit":'',
      "Earnings":'',
      "gain":'',
      "Payoff":'',
    },


  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        const AccountSet = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        const UserSet = JSON.parse(window.getStorageItem('userInfo') || '{}');
        const { vendor_id } = AccountSet;
        const { city_code } = UserSet.account_info || {} ;
        if (location.pathname === '/statictics/compass') {
          dispatch({
            type: 'compass/query',
            payload: location.query
          });
          dispatch({
            type: 'statictics/compass/area_query',
            payload: {city_code, vendor_id}
          });
        };
      });
    },
  ],
  effects: {
      // 数据罗盘
    *['compass/query'](params){
      const { data } = yield call(compass_find, params.payload);
      if (data) {
        yield put({
          type: 'compass/querySuccess',
          payload: {
            data: data.data,
          }
        });
      }
    },
    // 数据罗盘模块区域查询
    *['statictics/compass/area_query'](params){
      const result_areas = yield call(area_find_500, params.payload);
      if (result_areas.err) {
        message.error('区域查询失败！');
      } else {
        yield put({
          type: 'statictics/areaQuerySuccess',
          payload: result_areas.data.data
        });
      };
    },
  },

  reducers: {
    ['compass/querySuccess'](state, action){
      const income = {
        ...state.income,
        ...action.payload.data
      };
      return {
        ...state,
        income
      };
    },
    ['statictics/areaQuerySuccess'](state,action){
      state.areas = action.payload;
      return state;
    },
  },
}
