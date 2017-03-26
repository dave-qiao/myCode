
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {SIGN} from '../ActionsName.js';
import {sign_find,sign_find_detail,sign_update} from 'aoao-core-api-service/lib/business.js';
const {err_codeTransform} = window.tempAppTool;
function toDetail(id) {
  window.location.href = `/#/business/sign/list/detail?id=${id}`;
}
// help函数
function toList() {
  setTimeout(()=>{
    window.location.href = '/#/business/sign/list';
    window.location.reload ();
},500);
}
// const _accountInfo = window.getStorageItem('accountInfo') || '{}';
// const {vendor_id} = JSON.parse(_accountInfo);

module.exports =   {
  namespace: 'business_sign',
  state: {
    list_details: {
      // 基础定价表，重置的时候用
      plan_temp: {
        base_price : 300,               //基础定价
        ext_distance: 1000,             //增加的距离
        ext_price : 0,                  //额外的定价
        max_distance: 3000,             //最大距离
        min_distance: 0,                //最小距离
        time_span: ["08:30", "23:00"],  //一条规则的时间段
      },
      biz_time : ["08:30", "23:00"],    // 营业时间
      price_mode: 2,//定价模式
      plan_type: 21,//定价类型

      // 定价方案 数据结构结合接口文档
      price_plan : [
        {
          base_price : 300,             //基础定价
          ext_distance: 1000,           //增加的距离
          ext_price : 0,                //额外的定价
          max_distance: 3000,           //最大距离
          min_distance: 0,              //最小距离
          time_span: ["08:30", "23:00"] //一条规则的时间段
        }
      ]
    },
    // 签约页面的列表数据
    list_tables: { //  签约页面的列表数据
      _meta: {},// 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
      data: [],//签约页面列表数据字段
    },
    // 搜索
    list_searchs: {  //商家列表模块的搜索模块
     state:'100' //状态值
    },
  },

  subscriptions: [
    function({ dispatch, history }) {

      const detailPaths = [
        '/business/sign/list/detail',
        '/business/sign/list/edit',
      ];

      history.listen(location => {
      //初始化账户信息
      const _accountInfo = window.getStorageItem('accountInfo') || '{}';
      const _vendorInfo = window.getStorageItem('vendorInfo') || '{}';
      const {vendor_id} = JSON.parse(_accountInfo);
      const {pathname} = location;

      //判断路径
      if (pathname === '/business/sign/list') {
        dispatch({
          type: SIGN.find,
          payload: {vendor_id,state:100}
        });

        dispatch({
          type: SIGN.search,
          payload: {state:'100'}
        });
        return;
      }

      //获取详情信息
      if (detailPaths.indexOf(pathname) !== -1) {
        dispatch({
          type: SIGN.getDetail,
          payload: location.query
        });
      }
    })
    },
  ],

  effects: {
    // 签约列表查询
  *['sign/querys'](params){
    //请求接口
  const result_account = yield call(sign_find, params.payload);
    // 返回数据的处理
  if (result_account.err) {
    const _response = result_account.err.response.json();
    _response.then((err_obj)=> {
      message.error(`列表查询失败,${err_codeTransform(err_obj.err_code)}`);
  });
  } else {
    // 查询成功  dispatch到相应的reducer里面
    yield put({
      type: 'sign/querySuccess', // 查询成功
      payload: result_account.data
    });
  }
},
  // 获取签约商家的详情
    *['sign/getDetail'](params){
      // 获取返回的数据
      const result_account = yield call(sign_find_detail, params.payload);
      // 判断错误
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 查询成功
        yield put({
          type: 'sign/queryDetailSuccess', // 查询成功
          payload: result_account.data
        });
      }
    },
    // 更新签约的商户
    *['sign/updates'](params){
      //请求接口
      const result_account = yield call(sign_update, {...params.payload});
      // 判断错误信息
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`更新失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        if(result_account.data.ok){
          message.success('更新成功')
        }
        // 数据更新成功
        yield put({
          type: 'sign/updateSuccess', // 更新签约的商户数据更新成功
          payload: result_account.data
        });
      }
    },
    // 签约列表的搜索reducer
    *['sign/search'](params){
      yield put({
        type: 'sign/searchInitState',//对应reducer类型
        payload: params.payload
      });
   }
},

reducers: {
  // 获取签约列表成功
  ['sign/querySuccess'](state, action){
    let {list_tables} = state;
    Object.assign(list_tables,action.payload);
    return {
      ...state,
      list_tables
  };
  },
  // 签约列表的搜索reducer
  ['sign/searchInitState'](state, action){
    let {list_searchs} = state;
    Object.assign(list_searchs,action.payload);
    return {
      ...state,
      list_searchs
    };
  },

  // 获取签约详情成功
  ['sign/queryDetailSuccess'](state, action){
  // let {list_details} = state;
  // Object.assign(list_details,action.payload);
  // return {
  //   ...state,
  //   list_details
  // };
    console.log('sign/queryDetailSuccess', state, action);
    const list_details = {
      ...state.list_details,
      ...action.payload,
    };
    return {
      ...state,
      list_details
    };
},
// 跟新签约列表成功
  ['sign/updateSuccess'](state, action){

    setTimeout(function () {
      toList()
    },500)
    let {list_tables} = state;
    Object.assign(list_tables,action.payload);
    return {
      ...state,
      list_tables
    };
},
},
}
