
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {message} from 'antd';
import {shipments_daily_find,shipments_daily_down} from 'aoao-core-api-service/lib/statictics.js';
const {utcToDate,downloadURI} =  window.tempAppTool;
//全局变量 在 aoao-core-service／src/util/util.js中查找

module.exports =   {
  namespace: 'statictics_shipments_detail_down',
  state: {
    areas:[], //区域集合
    couriers:[],//骑士集合
    sellers: [],//商家集合
    list_tables: {//订单明细下载
      _meta: {},// 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
      data: [],//订单明细下载列表数据
    }
  },
  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        // 获取相关的信息
        const {vendor_id} = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        // 获取城市的编码
        const {city_code} = JSON.parse(window.getStorageItem('userInfo') || '{}');
        // 取当前日期的前一天
        let start_date = 0;
        let end_date = 0;
        let yes_date = 0;
        yes_date = new Date(new Date()-24*60*60*1000);
        yes_date = utcToDate(yes_date);
        yes_date = yes_date.date.join('');

         // 路由判断
        if (location.pathname === '/statictics/shipments_detail_down/list') {
          // 根据昨日 和服务商查询运单详情列表
          dispatch({
            type: 'shipments_detail_down/querys',
            payload: {vendor_id,start_date:yes_date,end_date:yes_date}
          });
        };
      });
    },
  ],
  effects: {
   // 订单明细下载列表查询
    *['shipments_detail_down/querys'](params){
      // 获取请求的参数
      let shipments = {...params.payload};
      //请求接口
      const result_shipments = yield call(shipments_daily_find, shipments);
      // 返回数据的处理
      if (result_shipments.err) {
        message.error('查询失败');
      } else {
        // 查询成功返回数据
        yield put({
          type: 'shipments_detail/query/success', // 订单明细下载列表查询成功
          payload: result_shipments.data
        });
      }
    },

    // 获取下载地址
    *['shipments_detail/down'](params){
      let file_name = {...params.payload};
      const result_shipments_url = yield call(shipments_daily_down, file_name);
      if (result_shipments_url.err) {
        message.error('下载失败');
      } else {
        // 动态下载文件
        downloadURI(result_shipments_url.data.url);
      }

    }

  },
  reducers: {
    // 订单明细下载列表查询成功
    ['shipments_detail/query/success'](state, action){
      let {list_tables} = state;
      // 数据结构整理更新state
      Object.assign(list_tables,action.payload);
      return {
        ...state,
        list_tables
      };
    },
    // 获取下载地址成功更新state
    ['shipments_detail/url'](state, action){
      let {list_tables} = state;
      // 更新新的state
      Object.assign(list_tables,action.payload);
      return {
        ...state,
        list_tables
      };
    },

  }
}
