//TODO: 未开发
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {MONITO} from '../ActionsName.js';
import { monito_find,monito_state } from 'aoao-core-api-service/lib/monito.js';
import { area_find_500 } from 'aoao-core-api-service/lib/business.js';

module.exports =   {
  namespace: 'statictics_monito',
  state: {

    areas:[],
    stats_data:{},
    couriers_data:{},
    shipments_data:{},
    imports_data: {}
  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        const AccountSet = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        const UserSet = JSON.parse(window.getStorageItem('userInfo') || '{}');
        const { vendor_id } = AccountSet;
        const { city_code } = UserSet.account_info || {} ;
        if (location.pathname === '/statictics/monito') {
          dispatch({
            type: MONITO.find,
            payload: location.query
          });
          dispatch({
            type: 'statictics/monito/area_query',
            payload: {city_code, vendor_id}
          });
        };
      });
    },
  ],

  effects: {
    *['monito/querys'](params){
      const { data } = yield call(monito_find, params.payload);
      if (data) {
        yield put({
          type: 'monito/querySuccess',
          payload: {
            data: data.data,
          }
        });
      }
    },
    *['statictics/monito/area_query'](params){
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
    *['monito/courier_state'](params){
      const { data } = yield call(monito_state, params.payload);
      if (data) {
        yield put({
          type: MONITO.stateList,
          payload: {
            data: data.data,
            total: data.page.total,
            current: data.page.current
          }
        });
      }
    },
  },

  reducers: {
    ['monito/querySuccess'](state, action){
      const {
        on_guard,
        off_guard,
        order_data,
        yesterday_data,
        last_week_data,
        today_data
      } = action.payload.data;
      const _data = {
        stats_data:{
          p1: 33,
          p2: 44,
          p3: 55,
          p4: 66
        },
        couriers_data:{ on_guard, off_guard },
        shipments_data: order_data,
        imports_data: {
          yesterday_data,last_week_data,today_data
        }
      };

      return {
        ...state,
        ..._data
      };
    },
    ['statictics/areaQuerySuccess'](state,action){
      state.areas = action.payload;
      return state;
    },
    ['monito/courierStateSuccess'](state,action){
      const courier_state = {
        ...state.courier_state,
        ...action.payload,
      };
      return {
        ...state,
        courier_state
      };
    },
  },
}
