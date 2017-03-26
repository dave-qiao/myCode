
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {SELLER_BILLS,SELLER_BILLS_MONTH} from '../ActionsName.js';
import { seller_day_bills_find,seller_month_bills_find} from 'aoao-core-api-service/lib/finance.js';
var dateFormat = window.tempAppTool.dateFormat;
const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;

module.exports =   {
  namespace: 'business_seller_bills',
  state: {
    Day_list_tables: {  //商户日账单信息
      data: [],//日账单数据
      _meta:{}//服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    Month_list_tables: {//商户月账单信息
      data: [], //月账单数据
      _meta:{}//服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    }
  },

  subscriptions: [

    function({ dispatch, history }) {

      let start_date = 0;
      let end_date = 0;
      // 取当前日期的前一天
      var yes_date = new Date(new Date()-24*60*60*1000);
      yes_date = utcToDate(yes_date);
      yes_date = yes_date.date.join('');
      //取上个月的日期
      var last_month= new Date();
      last_month = last_month.getMonth() + 1
      last_month = (last_month < 10) ? `0${last_month}` : last_month;
      var month_date = dateFormat();
      month_date.length = 1;
      month_date = month_date.join('') + last_month ;


      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const _vendorInfo = window.getStorageItem('vendorInfo') || '{}';
        const {vendor_id} = JSON.parse(_accountInfo);

        if (location.pathname === '/finance/seller_bills/list') {
        //获取日账单的列表数据 初始查昨日的账单
          dispatch({
            type: SELLER_BILLS.find,
            payload: {vendor_id,start_date:yes_date,end_date:yes_date}
          });
        // 获取月账单的列表数据默认查上个月的信息
        dispatch({
          type: SELLER_BILLS_MONTH.find,
          payload: {vendor_id,start_date:month_date,end_date:month_date}
        });
        };

      });
    },
  ],

  effects: {
  // 财务模块的商家账单列表
    *['finance/seller_bills/querys'](params){
      //请求接口
      const result_seller  = yield call(seller_day_bills_find, params.payload);
      // 返回数据的处理
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 数据返回成功
        yield put({
          type: SELLER_BILLS.list, //财务模块的商家账单列表
          payload: {
            data: result_seller.data.data,
            _meta:result_seller.data._meta
          }
        });

      };

    },
    // 商家月账单
  *['finance/seller_bills_month/querys'](params){
    //获取到月账单的数据//请求接口
    const { data } = yield call(seller_month_bills_find, params.payload);
    if (data) {
      // put到reducer中
      yield put({
        type: SELLER_BILLS_MONTH.list,//获取月账单列表
        payload: {
          data: data.data,
          _meta:data._meta
        }
      });
    }
  },
  // 商家账单详情
    *['seller_bills/getDetail'](params){
      //请求接口
      const { data } = yield call(seller_bills_find, params.payload);
      // 返回数据的处理
      if (data) {
        yield put({
          type: PARNTER_BILLS.updateDetail,  //更新商家账单的详情信息
          payload: {
            data: data.data,
          }
        });
      }
    },
  },

  reducers: {
    // 财务管理模块的商家日账单列表数据
    ['finance/seller_bills/querysSucess'](state, action){
      const Day_list_tables = {
        ...state.Day_list_tables,
        ...action.payload,
      };
      return {
        ...state,
        Day_list_tables
      };
    },
    // 财务管理模块的商家月账单列表数据
      ['finance/seller_bills_month/querysSucess'](state, action){
            const Month_list_tables = {
                ...state.Month_list_tables,
                ...action.payload,
            };
            return {
              ...state,
              Month_list_tables
          };
    },
    // 商家账单的创建
    ['seller_bills/createSuccess'](state, action){},
    // 商家账单的更新
    ['seller_bills/updateSuccess'](state, action){},
  },
}
