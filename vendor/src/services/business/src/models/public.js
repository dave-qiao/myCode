
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {AREA} from '../ActionsName.js';
import { message } from 'antd';
import { area_find, area_find_500, courier_find_500, seller_find_500 } from 'aoao-core-api-service/lib/business.js';

import {utils_apk_download_url_find,logout} from 'aoao-core-api-service/lib/public.js';
module.exports =   {
  namespace: 'business_public',
  state: {
    areas: [], //区域区域
    couriers: [], //所有的骑士
    sellers: [],//获取商家
    apk_url: ''//获取手持端二维码的URL
  },

  subscriptions: [
    function({ dispatch, history }) {
    // 路由判断
      const needAreas = ['courier','employee'];
      const stats = ['area','detail','seller','courier'].map(item => `/statictics/shipments_${item}/list`);
      history.listen(location => {
        // 如果是登陆注册页面
        if (['/login','/register'].indexOf(location.pathname) === -1 && typeof window.dont_load_apk_download_url === 'undefined') {
          // 获取账户的信息
          const accountInfoStr =  window.getStorageItem('accountInfo');
          // 获取二维码的url
          if (accountInfoStr) {
            dispatch({ type: 'get/qrcode', payload: {} });
          };
        };
        // 切割hash值
        const _pathArr = location.pathname.split('/');
        // 获取账号信息
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        // 获取服务商信息
        const {vendor_id} = JSON.parse(_accountInfo);
        // 如果是调度页面触发的几个行为
        if (['/tms/control_panel',...stats].indexOf(location.pathname) !== -1) {
          // 触发获取区域的行为
          dispatch({ type: 'getAreas', payload: {vendor_id}});
          //触发获取骑士的行为
          dispatch({ type: 'getCouriers', payload: {vendor_id}});
          //触发获取商家的行为
          dispatch({ type: 'getSellers', payload: {vendor_id}});
        };
        // 如果是财务模块
        if (['/finance/seller_bills/list','/business/sign/list'].indexOf(location.pathname) !== -1) {
          dispatch({ type: 'getSellers', payload: {vendor_id}});
        };
        // 如果是运单区域页面模块
        if (['/statictics/shipments_area/list'].indexOf(location.pathname) !== -1) {
          dispatch({
            type: 'getAreas',
            payload: {vendor_id}
          });
        };
        // 如果是数据中心模块
        if (['/statictics/shipments_courier/list'].indexOf(location.pathname) !== -1) {
          dispatch({ type: 'getCouriers', payload: {vendor_id}});
        };
        // 如果是业务管理模块
        if (_pathArr[1] === 'business' && needAreas.indexOf(_pathArr[2])!== -1) {
          dispatch({
            type: 'getAreas',
            payload: {vendor_id}
          });
        };

      });
    },
  ],

  effects: {
      // 获取区域区域
    *getAreas(params){
      // 请求获取区域区域
      const result_first = yield call(area_find_500, params.payload);
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page] = [data.data,2];
      // 循环请求获取所有的区域
      const payload = params.payload;
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(area_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      // 获取区域区域成功
      yield put({
        type: 'getAreas/success',//对应reducer中的类型
        payload: result_arr
      });
    },
    // 获取骑士
    *getCouriers(params){
      // 请求骑士接口
      const result_first = yield call(courier_find_500, params.payload);
      // 数据的处理
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page] = [data.data,2];
      // 循环请求所有的骑士
      const payload = params.payload;
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(courier_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      // 获取骑士列表成功
      yield put({
        type: 'getCouriers/success',//对应如educer的类型
        payload: result_arr
      });
    },
    // 获取该服务商的签约商家
    *getSellers(params){
      //获取该服务商的签约商家的接口
      const result_first = yield call(seller_find_500, params.payload);
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page, checkArr] = [data.data,2, []];
      // 循环获取该服务商的签约商家
      const payload = params.payload;
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(seller_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      // 返回值的数据处理
      let _data = result_arr.filter((item,index,arr)=>{
        let _r = true;
        if(checkArr.indexOf(item.seller_id) !== -1) {
          _r = false;
        } else {
          checkArr.push(item.seller_id);
        };
        return _r;
      });
      // 如果成功获取到商家
      yield put({
        type: 'getSellers/success',//对应reducer的函数名
        payload: _data
      });
    },
    // 获取骑士端二维码
    *['get/qrcode'](params){
      // 获取骑士端二维码接口
      const result_apk_download = yield call(utils_apk_download_url_find,null);
      // 返回数据的判断
      if (result_apk_download.err) {
      } else {
        // 获取下载的url
        const {apk_url} = result_apk_download.data;
        // 可下载状态
        window.dont_load_apk_download_url = true;
        // 如果获取二维码的请求成功
        yield put({
          type: 'get/qrcode/success',//获取验证码成功
          payload: apk_url
        });
      }
    },
    // 登出接口
    *['logout'](params){
      // 请求登出接口
      const { data } = yield call(logout, params.payload);
// 数据处理
      if (data) {
        yield put({
          type: 'logoutSucess',
          payload: {
            data: data.data
          }
        });
        // 登出成功清除相关的数据
        window.localStorage.clear();
        // 清除各种全局变量
        window.currentAppVendorInfo = null;
        window.currentAppAccountInfo = null;
        window.currentAppUserInfo = null;
        window.currentAppPathname = null;
        window.location.href = '/#/login';
      }
    },

  },

  reducers: {
    //获取区域区域列表
    ['getAreas/success'](state, action){
      return {
        ...state,
        areas:action.payload
      };
    },
    //获取所有的骑士
    ['getCouriers/success'](state, action){
      return {
        ...state,
        couriers:action.payload
      };
    },
    //获取所有的签约商家
    ['getSellers/success'](state, action){
      return {
        ...state,
        sellers:action.payload
      };
    },
    // 登出成功
    ['logoutSucess'](state, action){

      return {};
    },
    // 获取二维码url成功
    ['get/qrcode/success'](state, action){
      return {
        ...state,
        apk_url: action.payload
      };
    },
  },
}
