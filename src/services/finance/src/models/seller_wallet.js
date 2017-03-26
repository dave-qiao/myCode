//TODO: 未开发
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {PARNTER_WALLET,PARNTER} from '../ActionsName.js';
import { wallet_detail_find, wallet_trans_logs_find } from 'aoao-core-api-service/lib/finance.js';

module.exports =   {
  namespace: 'business_seller_wallet',
  state: {
    details: {   //商户钱包的详情信息
      "balance": 0,
      "begining_balance": 0,
      "begining_frozen_balance": 0,
      "begining_withdraw_balance": 0,
      "frozen_amount": 0,
      "recharge_amount": 0,
      "withdraw_amount": 0
    },
    trans_logs: []
  },

  subscriptions: [
    function({ dispatch, history }) {
      const _accountInfo = window.getStorageItem('accountInfo') || '{}';
      const _vendorInfo = window.getStorageItem('vendorInfo') || '{}';
      const {vendor_id} = JSON.parse(_accountInfo);
      const {wallet_id} = JSON.parse(_vendorInfo);
      history.listen(location => {
        if (location.pathname === '/finance/seller_wallet') {
          dispatch({
            type: 'finance/seller_wallet/querys',
            payload: {wallet_id}
          });
          // dispatch({
          //   type: 'finance/seller_wallet_trans_logs/querys',
          //   payload: {wallet_id}
          // });
        };
      });
    },
  ],

  effects: {
      // 商户钱包信息查询
    *['finance/seller_wallet/querys'](params){
      const {wallet_id} = params.payload;
      let _id = wallet_id || window.currentAppVendorInfo.wallet_id;
      const result_wallet = yield call(wallet_detail_find, wallet_id);
      if (result_wallet.err) {
        message.error('钱包信息查询失败');
      } else {
        yield put({
          type: 'finance/seller_wallet/querys/success',
          payload: result_wallet.data
        });
      };
    },
  },

  reducers: {
    ['finance/seller_wallet/querys/success'](state, action){
      let details = action.payload;
      ['balance','frozen', 'withdraw'].forEach(item=> {
        if(item === 'balance') {
          details[`calc_${item}`] = (details[item] + details[`begining_${item}`]) / 100;
        } else {
          details[`calc_${item}_balance`] = (details[`${item}_amount`] + details[`begining_${item}_balance`]) / 100;
        };
      });

      return { ...state, details };
    },
  },
}
