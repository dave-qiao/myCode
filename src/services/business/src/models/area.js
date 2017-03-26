
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';

import {
  fetchSupplyVendorList,
  fetchVendorList,
  fetchCityList,
  fetchAreaList,
  fetchAreaDetail,
  fetchAreaDraftDetail,
  publishArea,
  createArea,
  updateArea,
} from '../services/area';

const { err_codeTransform } = window.tempAppTool;

//请求的每页数据条数
const requestPagerSize = 12;

module.exports = {
  namespace: 'businessArea',
  state: {
    supplyVendorList: [],       //当前服务商的供应商的列表
    cityList: [],               //城市选择清单

    directAreaList: [],         //直营区域列表
    franchiseAreaList: [],      //加盟区域列表

    areaDetail: {},             //选中的区域详情
    areaDraftDetail: {},        //选中的区域草稿详情

    createAreaId: '',             //创建区域成功后的数据id
    isCreateAreaCallback: false,  //创建区域后的回调

    publishAreaId: '',            //发布区域的id
    isPublishAreaCallback: false, //发布成功后的回调

    isUpdateAreaCallback: false,  //保存成功后的回调
  },

  subscriptions: [
    function ({ dispatch, history }) {
      const detailPaths = ['/business/area/list/detail', '/business/area/list/edit'];
      history.listen((location) => {
        const AccountSet = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        const UserSet = JSON.parse(window.getStorageItem('userInfo') || '{}');
        const { vendor_id } = AccountSet;
        const { city_code } = UserSet;
        const { pathname } = location;

        if (pathname === '/business/area/list') {
           //filter获取此服务商存在的城市列表
          dispatch({
            type: 'fetchCityList',
            payload: vendor_id,
          });

          //获取当前服务商的供应商列表
          dispatch({
            type: 'fetchSupplyVendorList',
            payload: { vendorId: vendor_id, cityCode: city_code ? city_code : 110000 },
          });
        }
      });
    },
  ],

  effects: {

    //获取城市列表
    * fetchCityList({ payload: vendorId }) {
      const response = yield call(fetchCityList, vendorId);
      yield put({ type: 'reduceCityList', payload: response });
    },

    //当前服务商的供应商的列表
    * fetchSupplyVendorList({ payload }) {
      const { cityCode, vendorId } = payload;
      const response = yield call(fetchSupplyVendorList, vendorId, cityCode);
      yield put({ type: 'reduceSupplyVendorList', payload: response });
    },

    //获取直营区域列表
    * fetchDirectAreaList({ payload }) {
      const { vendorId, cityCode, relateType, areaState, page } = payload;
      const response = yield call(fetchAreaList, vendorId, '', relateType, cityCode, areaState, page, requestPagerSize);

      //处理分页数据
      const result = {
        data: response.data,
        total: response._meta.result_count,
        page,
        size: requestPagerSize,
        totalPage: Math.ceil(response._meta.result_count / requestPagerSize),
      }
      yield put({ type: 'reduceDirectAreaList', payload: result });
    },

    //获取加盟区域列表
    * fetchFranchiseAreaList({ payload }) {
      const { vendorId, supplyVendorId, cityCode, relateType, areaState, page } = payload;
      const response = yield call(fetchAreaList, vendorId, supplyVendorId, relateType, cityCode, areaState, page, requestPagerSize);

      //处理分页数据
      const result = {
        data: response.data,
        total: response._meta.result_count,
        page,
        size: requestPagerSize,
        totalPage: Math.ceil(response._meta.result_count / requestPagerSize),
      }
      yield put({ type: 'reduceFranchiseAreaList', payload: result });
    },

    //获取区域详情
    * fetchAreaDetail({ payload: areaId }) {
      const response = yield call(fetchAreaDetail, areaId);
      yield put({ type: 'reduceAreaDetail', payload: response });
    },

    //获取区域草稿详情
    * fetchAreaDraftDetail({ payload: areaId }) {
      const response = yield call(fetchAreaDraftDetail, areaId);
      yield put({ type: 'reduceAreaDraftDetail', payload: response });
    },

    //发布区域
    * publishArea({ payload }) {
      //更新区域数据
      const { areaId, areaName, areaState, vendorId, cityCode, coordinates } = payload;
      const updateResponse = yield call(updateArea, areaId, areaName, areaState, vendorId, cityCode, coordinates);
      if (updateResponse.err) {
        message.error(`区域更新失败, ${updateResponse.err.message}`);
        return;
      }

      //发布数据
      const response = yield call(publishArea, areaId);
      if (response.err) {
        message.error(`区域发布失败, ${response.err.message}`);
      } else {
        message.success('区域发布成功！')
        const payload = { publishAreaId: areaId }
        yield put({ type: 'callbackPublishArea', payload });
      }
    },

    //创建父区域
    * createArea({ payload }) {
      const { vendorId, areaName, cityCode } = payload;
      const response = yield call(createArea, vendorId, areaName, cityCode);
      if (response.err) {
        message.error(`区域创建失败, ${response.err.message}`);
      } else {
        message.success('区域创建成功！');
        const payload = { createAreaId: response.data.id }
        yield put({ type: 'callbackCreateArea', payload });
      }
    },

    //创建子区域
    * createSubArea({ payload }) {
      const { vendorId, areaName, cityCode, parentId } = payload;
      const response = yield call(createArea, vendorId, areaName, cityCode, parentId);
      if (response.err) {
        message.error(`区域创建失败, ${response.err.message}`);
      } else {
        message.success('区域创建成功！');
        const payload = { createAreaId: response.data.id }
        yield put({ type: 'callbackCreateArea', payload });
      }
    },

    //更新区域
    * updateArea({ payload }) {
      const { areaId, areaName, areaState, vendorId, cityCode, coordinates } = payload;
      const response = yield call(updateArea, areaId, areaName, areaState, vendorId, cityCode, coordinates);
      if (response.err) {
        message.error(`区域更新失败, ${response.err.message}`);
      } else {
        message.success('区域更新成功！');
        yield put({ type: 'callbackUpdateArea' });
      }
    },

    //重置保存成功后的回调
    * resetUpdateAreaCallback() {
      yield put({ type: 'resetUpdateAreaCallback' });
    },

    //重置创建区域后的回调
    * resetCreateAreaCallback() {
      yield put({ type: 'resetCreateAreaCallback' });
    },

    //重置发布成功后的回调
    * resetPublishAreaCallback() {
      yield put({ type: 'resetPublishAreaCallback' });
    },

    //重置创建成功后区域的id(主要用于区域创建后，自动显示详情页，显示详情页后清除该数据)
    * resetCreateAreaId() {
      yield put({ type: 'resetCreateAreaId' });
    },

    //重置刷新页面
    * resetReloadPage() {
      yield put({ type: 'resetReloadPage' });
    },

    //重置详情数据
    * resetAreaDetail() {
      yield put({ type: 'resetAreaDetail' });
    },

    //重置草稿数据
    * resetAreaDraftDetail() {
      yield put({ type: 'resetAreaDraftDetail' });
    },

    //重置加盟列表数据
    * resetFranchiseAreaList() {
      yield put({ type: 'resetFranchiseAreaList' });
    },

    //重置直营列表数据
    * resetDirectAreaList() {
      yield put({ type: 'resetDirectAreaList' });
    },
  },

  reducers: {

    //区域城市列表
    reduceSupplyVendorList(state, { payload: supplyVendorList }) {
      return { ...state, supplyVendorList };
    },

    //区域城市列表
    reduceCityList(state, { payload: cityList }) {
      return { ...state, cityList };
    },

    //获取直营区域列表
    reduceDirectAreaList(state, { payload: directAreaList }) {
      return { ...state, directAreaList };
    },

    //获取加盟区域列表
    reduceFranchiseAreaList(state, { payload: franchiseAreaList }) {
      return { ...state, franchiseAreaList };
    },

    //获取区域详情
    reduceAreaDetail(state, { payload: areaDetail }) {
      return { ...state, areaDetail };
    },

    //获取区域草稿
    reduceAreaDraftDetail(state, { payload: areaDraftDetail }) {
      return { ...state, areaDraftDetail };
    },

    //重置区域详情数据
    resetAreaDetail(state) {
      const areaDetail = [];
      return { ...state, areaDetail };
    },

    //重置区域草稿数据
    resetAreaDraftDetail(state) {
      const areaDraftDetail = [];
      return { ...state, areaDraftDetail };
    },

    //重置创建成功后数据的id
    resetCreateAreaId(state) {
      const createAreaId = '';
      return { ...state, createAreaId };
    },

    //重置加盟列表数据
    resetFranchiseAreaList(state) {
      const franchiseAreaList = [];
      return { ...state, franchiseAreaList };
    },

    //重置直营列表数据
    resetDirectAreaList(state) {
      const directAreaList = [];
      return { ...state, directAreaList }
    },

    //重置保存成功后的回调
    resetUpdateAreaCallback(state) {
      const isUpdateAreaCallback = false;
      const publishAreaId = ''
      return { ...state, publishAreaId, isUpdateAreaCallback };
    },
    //重置创建区域后的回调
    resetCreateAreaCallback(state) {
      const isCreateAreaCallback = false;
      const createAreaId = '';
      return { ...state, createAreaId, isCreateAreaCallback };
    },
    //重置发布成功后的回调
    resetPublishAreaCallback(state) {
      const isPublishAreaCallback = false;
      return { ...state, isPublishAreaCallback };
    },

    //保存成功后回调
    callbackUpdateArea(state) {
      const isUpdateAreaCallback = true;
      return { ...state, isUpdateAreaCallback };
    },
    //创建成功后回调
    callbackCreateArea(state, { payload }) {
      const isCreateAreaCallback = true;
      const { createAreaId } = payload;
      return { ...state, createAreaId, isCreateAreaCallback };
    },
    //发布成功后回调
    callbackPublishArea(state, { payload }) {
      const isPublishAreaCallback = true;
      const { publishAreaId } = payload;
      return { ...state, publishAreaId, isPublishAreaCallback };
    },
  },
}
