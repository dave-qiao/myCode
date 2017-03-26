
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {ACCOUNT} from '../ActionsName.js';
import { account_find_one } from 'aoao-core-api-service/lib/public.js';

module.exports =   {
  namespace: 'account_account',
  state: {
    details: {},
  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const {account_id} = JSON.parse(_accountInfo);
        if (location.pathname === '/account/account_info') {
          dispatch({
            type: ACCOUNT.getDetail,
            payload: {account_id}
          });
        };
      });
    },
  ],

  effects: {
      // 查询服务商的账户信息
    *['account/getDetail'](params){
      const {account_id} = params.payload;
      const result_account = yield call(account_find_one, account_id);

      if (result_account.err) {
        message.success('查询账号信息失败, 稍后请重新登录');

        setTimeout(() => {
          //暂时只是清除本地存储 需要发送请求
          window.localStorage.clear();

          // 清除window 上的账户数据
          window.currentAppVendorInfo = null;
          window.currentAppUserInfo = null;
          window.location.href = '/#/login';
        }, 3000);

      } else {
        yield put({
          type: ACCOUNT.showAccount, //account/querySuccess 对应reduce 对应相应模块下的ActionName.js
          payload: result_account.data
        });
      };
    },
  },

  reducers: {
    ['account/querySuccess'](state, action){
      return {
        ...state,
        ...{details: action.payload}
      };
    }
  },
}
