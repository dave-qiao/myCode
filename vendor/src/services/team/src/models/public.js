
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {AREA} from '../ActionsName.js';
import { message } from 'antd';
import { area_find, area_find_500, courier_find_500, seller_find_500 } from 'aoao-core-api-service/lib/business.js';
import {utils_apk_download_url_find,logout} from 'aoao-core-api-service/lib/public.js';
module.exports =   {
  namespace: 'business_publics',
  state: {
    areas: [],
    couriers: [],
    sellers: [],
    apk_url: ''
  },
  subscriptions: [
    function({ dispatch, history }) {
      const needAreas = ['courier','employee'];
      const stats = ['area','detail','seller','courier'].map(item => `/statictics/shipments_${item}/list`);
      history.listen(location => {
        if (['/login','/register'].indexOf(location.pathname) === -1 && typeof window.dont_load_apk_download_url === 'undefined') {
          const accountInfoStr =  window.getStorageItem('accountInfo');
          if (accountInfoStr) {
            dispatch({ type: 'get/qrcode', payload: {} });
          };
        };
        const _pathArr = location.pathname.split('/');
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const {vendor_id} = JSON.parse(_accountInfo);
        if (['/tms/control_panel',...stats].indexOf(location.pathname) !== -1) {
          dispatch({ type: 'getAreas', payload: {vendor_id}});
          dispatch({ type: 'getCouriers', payload: {vendor_id}});
          dispatch({ type: 'getSellers', payload: {vendor_id}});
        };

        if (['/finance/seller_bills/list','/business/sign/list'].indexOf(location.pathname) !== -1) {
          dispatch({ type: 'getSellers', payload: {vendor_id}});
        };

        if (['/statictics/shipments_area/list'].indexOf(location.pathname) !== -1) {
          dispatch({
            type: 'getAreas',
            payload: {vendor_id}
          });
        };
        if (['/statictics/shipments_courier/list'].indexOf(location.pathname) !== -1) {
          dispatch({ type: 'getCouriers', payload: {vendor_id}});
        };

        if (_pathArr[1] == '' && needAreas.indexOf(_pathArr[2])!== -1) {
          dispatch({
            type: 'getAreas',
            payload: {vendor_id}
          });
        };

      });
    },
  ],

  effects: {
    *['getAreas'](params){
      const { payload } = params;
      const result_first = yield call(area_find_500, payload);
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page] = [data.data,2];
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(area_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      yield put({
        type: 'getAreas/success',
        payload: result_arr
      });
    },
    *getCouriers(params){
      const { payload } = params;
      const result_first = yield call(courier_find_500, payload);
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page] = [data.data,2];
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(courier_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      yield put({
        type: 'getCouriers/success',
        payload: result_arr
      });
    },
    *getSellers(params){
      const { payload } = params;
      const result_first = yield call(seller_find_500, payload);
      if (result_first.err) {
        return;
      };
      const {data} = result_first;
      const last_page = Math.ceil(data._meta.result_count/500);
      let [result_arr,page, checkArr] = [data.data,2, []];
      while (page <= last_page) {
        payload.page = page;
        let result_other = yield call(seller_find_500, payload);
        result_arr.push(...result_other.data.data);
        page++;
      };
      let _data = result_arr.filter((item,index,arr)=>{
        let _r = true;
        if(checkArr.indexOf(item.seller_id) !== -1) {
          _r = false;
        } else {
          checkArr.push(item.seller_id);
        };
        return _r;
      });
      yield put({
        type: 'getSellers/success',
        payload: _data
      });
    },
    *['get/qrcode'](params){
      const result_apk_download = yield call(utils_apk_download_url_find,null);
      if (result_apk_download.err) {

      } else {
        const {apk_url} = result_apk_download.data;

        window.dont_load_apk_download_url = true;
        yield put({
          type: 'get/qrcode/success',
          payload: apk_url
        });
      }
    },
    *['logout'](params){
      const { payload } = params;
      const { data } = yield call(logout, payload);

      if (data) {
        yield put({
          type: 'logoutSucess',
          payload: {
            data: data.data
          }
        });
        window.localStorage.clear();
        window.location.href = '/#/login';
        window.currentAppVendorInfo = null;
        window.currentAppAccountInfo = null;
        window.currentAppUserInfo = null;
        window.currentAppPathname = null;
      }
    },

  },

  reducers: {
    ['getAreas/success'](state, action){
      return {
        ...state,
        areas:action.payload
      };
    },
    ['getCouriers/success'](state, action){
      return {
        ...state,
        couriers:action.payload
      };
    },
    ['getSellers/success'](state, action){
      return {
        ...state,
        sellers:action.payload
      };
    },
    ['logoutSucess'](state, action){

      return {};
    },
    ['get/qrcode/success'](state, action){
      return {
        ...state,
        apk_url: action.payload
      };
    },
  },
}
