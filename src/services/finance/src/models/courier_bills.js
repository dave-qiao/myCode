//TODO: 未开发
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {COURIER_BILLS_LIST,COURIER} from '../ActionsName.js';
import { courier_bills_find } from 'aoao-core-api-service/lib/finance.js';

module.exports = {
  namespace: 'business_courier_bills',
  state: {
    list_searchs: {
      arae: 'lucy',
    },
    list_tables: {  //骑士的列表数据
      data: [],
      loading: false,
      total: null,
      current: 1,
      currentItem: {},
      modalVisible: false,
      modalType: 'create'
    },
    list_details: {//骑士详情信息

    },
    list_adds: { //添加骑士的信息

    },
    list_edits:{ //编辑

    }

  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {

      });
    },
  ],

  effects: {
  // 骑士账单查询
    *['finance/courier/querys'](params){
      const { data } = yield call(courier_bills_find, params.payload);
      if (data) {
        yield put({
          type: COURIER_BILLS_LIST.list,
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
    ['finance/courier/querysuccess'](state, action){
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
