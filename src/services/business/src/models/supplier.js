/**
 *  Created by dave 17/1/2
 *  供应商管理model层
 */

import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {
  getSupplierList,
  getSupplierDetail,
  editSupplierDetail,
  closeBusiness,
  openBusiness,
  getVendorSupplier,
  addSupplier,
  getAreas,
  submitAdd,
  editArea,
  getAddAreas,
} from '../../../aoao-core-api-service/src/supplier.js';
import { fetchCityList } from '../../../aoao-core-api-service/src/public';
const { err_codeTransform } = window.tempAppTool;
module.exports = {
  namespace: 'supplierModel',
  state: {
    city_code: '110000',
    // 供应商Id
    biz_info_id: sessionStorage.getItem('biz_info_id') || '',
    // 供应商列表
    supplierList: {
      _meta: {},
      data: [],
    },
    // 供应商信息详情
    supplierDetail: {
      company_business_assets: ['', '', ''],
      integrate_paper_assets: [''],
      legal_passport_assets: ['', '', ''],
      food_paper_assets: [''],
      expresses_paper_assets: [''],
    },
    visible: false,
    formData: {
      userName: '',
      password: ''
    },
    VendorSupplierList: [],
    areaList: {
      _meta: {},
      data: [],
    },
    addAreaList: {
      _meta: {},
      data: [],
    },
    serviceCityList: [],
  },
  subscriptions: [
    function ({ dispatch, history }) {
      const detailPaths = ['/business/supplier/list/detail', '/business/supplier/list/regionalList']
      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const userInfo = window.getStorageItem('userInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const { city_code } = JSON.parse(userInfo);
        const { pathname } = location;
        const page = 1;
        const limit = 10;
        const sort = '{"created_at":-1}';
        // 供应商列表
        if (pathname === '/business/supplier/list') {
          dispatch({
            type: 'getSupplierListE',
            payload: { vendor_id, city_code, page, limit },
          });

          dispatch({
            type: 'getServiceCityE',
            payload: { vendor_id },
          });

          dispatch({
            type: 'changeCityCodeR',
            payload: { city_code },
          })
        }

        // 供应商详情
        if (pathname === '/business/supplier/list/suppliers') {
          const biz_info_id = location.query.id;
          dispatch({
            type: 'getSupplierDetailE',
            payload: { biz_info_id },
          })
        }

        //  区域合作列表
        if (pathname == '/business/supplier/list/regionalList') {
          const supply_vendor_id = sessionStorage.getItem('supply_vendor_id');
          const userInfo = window.getStorageItem('userInfo') || '{}';
          const _accountInfo = window.getStorageItem('accountInfo') || '{}';
          const { vendor_id } = JSON.parse(_accountInfo);
          const { city_code } = JSON.parse(userInfo);
          const biz_info_id = sessionStorage.getItem('biz_info_id');
          const page = 1;
          const limit = 10;
          dispatch({
            type: 'getAreaStateE',
            payload: { vendor_id, supply_vendor_id, city_code, page, limit, },
          });

          dispatch({
            type: 'getSupplierDetailE',
            payload: { biz_info_id },
          });

          dispatch({
            type: 'getServiceCityE',
            payload: { vendor_id },
          });
        }
        if (pathname !== '/business/supplier/list/regionalList') {
          const areaList = {
            _meta: {},
            data: [],
          }
          dispatch({
            type: 'getAreaStateR',
            payload: { areaList },
          })
        }
      });
    },
  ],

  effects: {

    // 服务商服务的城市
    *getServiceCityE(params) {
      const servieCityList = yield call(fetchCityList, params.payload.vendor_id);
      yield put({
        type: 'getServiceCityR',
        payload: servieCityList,
      })
    },

    /*进入业务中心供应商页面初始数据*/
    *getSupplierListE(params){
      const supplierList = yield call(getSupplierList, params.payload);
      yield put({
        type: 'getSupplierListR',
        payload: supplierList,
      })

    },

    // 获取供应商信息详情
    *getSupplierDetailE(params) {
      const supplierDetail = yield call(getSupplierDetail, params.payload);
      yield put({
        type: 'getSupplierDetailR',
        payload: supplierDetail,
      })
    },

    // 增加供应商
    *addSupplierE(params) {
      const result = yield call(addSupplier, params.payload);
      console.log(result, 'result');
      const city_code = params.payload.city_code;
      if (result) {
        if (result.id) {
          message.success('添加成功');
          location.href = '/#/business/supplier/list';
          const _accountInfo = window.getStorageItem('accountInfo') || '{}';
          const { vendor_id } = JSON.parse(_accountInfo);
          params.payload = {
            vendor_id: vendor_id,
            city_code: city_code,
          }
          const supplierList = yield call(getSupplierList, params.payload);
          yield put({
            type: 'getSupplierListR',
            payload: supplierList,
          })
        }
      } else {
        message.error(`请检查该供应商是否已经添加`, 2);
      }
    },

    // 查询某服务商所有供应商列表
    *getVendorSupplierE(params) {
      const value = yield call(getVendorSupplier, params.payload);
      const VendorSupplierList = value.data.data;
      yield put({
        type: 'getVendorSupplierR',
        payload: VendorSupplierList,
      })
    },

    // 编辑供应商信息详情
    *editSupplierDetailE(params) {
      const result = yield call(editSupplierDetail, params.payload);
    },

    // 服务商关闭业务
    *closeBusinessE(params) {
      const result = yield call(closeBusiness, params.payload);
      if (result.ok) {
        message.success('已关闭')
      }
    },

    // 服务商开启业务
    *openBusinessE(params) {
      const result = yield call(openBusiness, params.payload);
      if (result.ok) {
        message.success('已开启')
      }
    },

    // 获取区域列表
    *getAreaStateE(params) {
      params.payload.sort = '{"created_at":-1}';
      const areaList = yield call(getAreas, params.payload);
      yield put({
        type: 'getAreaStateR',
        payload: areaList,
      })
    },

    // 查询获取区域列表
    *getAreaSearchE(params) {
      const areaList = yield call(getAddAreas, params.payload);
      yield put({
        type: 'getAreaStateR',
        payload: areaList,
      })
    },


    // 提交添加的区域信息
    *submitAddE(params) {
      const result = yield call(submitAdd, params.payload);
      if (result) {
        message.success('添加成功');
        /*location.href = '/#/business/supplier/list/regionalList';*/

        params.payload.getValue = {
          vendor_id: params.payload.values.vendor_id,
          supply_vendor_id: params.payload.values.supply_vendor_id,
          city_code: params.payload.values.city_code,
          sort: '{"created_at":-1}',
          page: 1,
          limit: 10,
        };

        const areaList = yield call(getAreas, params.payload.getValue);
        yield put({
          type: 'getAreaStateR',
          payload: areaList,
        });
      } else {
        message.error('添加失败,已经存在');
      }
      if (result == 'undefined') {
        message.error('添加失败,已经存在');
      }

    },

    // 可供选择添加的区域列表
    *getAddAreaE(params) {
      const addAreaList = yield call(getAddAreas, params.payload);
      yield put({
        type: 'getAddAreaR',
        payload: addAreaList,
      })
    },

    // 编辑信息
    *editAreaE(params) {
      const result = yield call(editArea, params.payload);
      if (result) {
        message.success('编辑成功');
        location.href = '/#/business/supplier/list/regionalList';
      } else {
        message.error('请检查是否有正在使用的订单规则');
      }
      if (result == 'undefined') {
        message.error('请检查是否有正在使用的订单规则');
      }

    },


    /*改变弹出框的状态*/
    *['supplierModel/changeBox'](params){
      let { visible }=params.payload;
    }
  },

  reducers: {

    // 服务商服务的城市
    getServiceCityR(state, action){
      const { serviceCityList }= state;
      Object.assign(serviceCityList, action.payload);
      return {
        ...state,
        serviceCityList,
      }
    },

    // 获取供应商区域列表
    getSupplierListR(state, action){
      const { supplierList } = state;
      Object.assign(supplierList, action.payload);
      return {
        ...state,
        supplierList,
      }
    },

    // 获取供应商信息详情
    getSupplierDetailR(state, action){
      const { supplierDetail } = state;
      Object.assign(supplierDetail, action.payload);
      return {
        ...state,
        supplierDetail,
      }
    },

    // 查询某服务商所有供应商列表
    getVendorSupplierR(state, action){
      const { VendorSupplierList } = state;
      return {
        ...state,
        VendorSupplierList: action.payload,
      }
    },

    // 保存供应商Id
    saveIdR(state, action){
      const { biz_info_id } =state;
      return {
        ...state,
        biz_info_id: action.payload.biz_info_id,
      }
    },

    // 获取区域列表
    getAreaStateR(state, action) {
      const { areaList } = state;
      Object.assign(areaList, action.payload);
      return {
        ...state,
        areaList,
      }
    },

    // 可供添加选择的区域列表
    getAddAreaR(state, action) {
      const { addAreaList } = state;
      Object.assign(addAreaList, action.payload);
      return {
        ...state,
        addAreaList,
      }
    },

    // 城市更改
    changeCityCodeR(state, action){
      let { city_code } = state;
      city_code = action.payload.city_code;
      return {
        ...state,
        city_code: action.payload.city_code,
      }
    }

  },
}
