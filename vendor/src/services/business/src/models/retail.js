/**
 *  Created by dave 17/1/7
 *  项目管理-直营项目model层
 */
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {
  getContractSellers,
  getSellerInfoMessage,
  getSellerShops,
} from '../../../aoao-core-api-service/src/retail';
import { fetchCityList } from '../../../aoao-core-api-service/src/public';
import { stateTransform, numberDateToStr, dateFormatNew, sqlit } from '../../../../utils/newUtils';
import { getCityNameByCode } from '../../../../utils/authHelper';

module.exports = {
  namespace: 'manageRetail',
  state: {
    city_code: '110000', //城市
    retailList: {
      _meta: {},
      data: []
    }, // 直营项目签约商户信息列表
    affiliatesList: [], // 加盟项目签约商户信息列表
    current: 1, //分页：当前页数
    basicInfoData: [
      {
        noun: '商户号',
        value: '',
      }, {
        noun: '审核状态',
        value: ''
      }, {
        noun: '注册日期',
        value: ''
      }, {
        noun: '商家名称',
        value: ''
      }, {
        noun: '所属城市',
        value: ''
      }, {
        noun: '联系人',
        value: ''
      }, {
        noun: '商家类型',
        value: ''
      }, {
        noun: '商户状态',
        value: ''
      }, {
        noun: '注册手机',
        value: '111'
      },
    ],
    shopList: {
      _meta: {},
      data: [],
    },
    serviceCityList: [],

  },
  subscriptions: [
    function ({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        const seller_id = sessionStorage.getItem('sellerId');
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const userInfo = window.getStorageItem('userInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const { city_code } = JSON.parse(userInfo);
        const contract_id = sessionStorage.getItem('contractId');
        const state = 100;//区域状态 100启用 -100 禁用
        const relate_type = 20; // 区域类型 10 直营 20 加盟
        const supply_vendor_id = vendor_id;
        const is_filter_sub_area = true; //是否过滤子区
        const is_set_courier_delivery_rule = true; //是否返回设置骑士分单规则状态

        // 监测路由进入直营项目
        if (pathname === '/business/manage/retail' || pathname === '/business/manage') {

          const city_codes = city_code;
          const contract_type = 10;//签约类型为直营
          dispatch({
            type: 'init',
            payload: { vendor_id, city_code, contract_type }
          });
          dispatch({
            type: 'cityChange',
            payload: { city_codes },
          });
          dispatch({
            type: 'getServiceCityListE',
            payload: { vendor_id }
          })
        }

        // 监测路由进入加盟项目
        if (pathname === '/business/manage/affiliates') {
          const city_codes = city_code;
          const contract_type = 20;//签约类型为加盟
          dispatch({
            type: 'init',
            payload: { vendor_id, city_code, contract_type }
          });
          dispatch({
            type: 'cityChange',
            payload: { city_codes },
          });
          dispatch({
            type: 'getServiceCityListE',
            payload: { vendor_id }
          })
        }

        // 监测路由进入加盟项目商家信息
        if (pathname === '/business/manage/affiliates/info') {

          // 商家信息
          dispatch({
            type: 'getSellerInfoManageJoin',
            payload: { seller_id, vendor_id, city_code },
          });

          // 店铺列表
          dispatch({
            type: 'getSellerShopsJoinE',
            payload: { seller_id, city_code },
          });

        }

        // 监测路由进入骑士分担规则
        if (pathname === '/business/manage/affiliates/knigh') {
          const limit = 1000;
          const vendor_id = sessionStorage.getItem('vendorId');
          // 区域列表
          dispatch({
            type: 'getAreaE',
            payload: {
              vendor_id,
              supply_vendor_id,
              state,
              relate_type,
              is_filter_sub_area,
              is_set_courier_delivery_rule,
              contract_id,
              limit,
            },
          });
        }

      });
    },
  ],

  effects: {

    /*进入业务中心供应商页面初始数据*/
    *init(params) {
      const _accountInfo = window.getStorageItem('accountInfo') || '{}';
      const { vendor_id } = JSON.parse(_accountInfo);
      const { city_code, contract_type, page } = params.payload;
      const pages = page ? page : 1;
      const limit = 10;
      const sort = '{"created_at":-1}';
      const retailList = yield call(getContractSellers, vendor_id, city_code, contract_type, pages, limit, sort);
      yield put({
        type: 'initState',
        payload: { retailList },
      })
    },

    // 获取商户信息
    *getSellerInfoManageJoin(params){
      const resultValue = yield call(getSellerInfoMessage, params.payload);
      yield put({
        type: 'sellerInfoInitJoin',
        payload: { resultValue },
      })
    },

    // 获取商户店铺列表
    *getSellerShopsJoinE(params){
      const shopList = yield call(getSellerShops, params.payload);
      yield put({
        type: 'getSellerShopsJoinR',
        payload: shopList,
      })
    },

    // 获取服务商服务城市
    *getServiceCityListE(params){
      const serviceCityList = yield call(fetchCityList, params.payload.vendor_id);
      yield put({
        type: 'getServiceCityListR',
        payload: serviceCityList,
      })
    }

  },
  reducers: {

    // 初始化数据(直营列表商户数据)
    initState(state, action){
      const { retailList }= state;
      Object.assign(retailList, action.payload);
      return {
        ...state,
        ...retailList,
      }
    },

    // 城市的更改
    cityChange(state, action) {
      let { city_code } = state;
      const { city_codes } = action.payload;
      /*Object.assign({ city_code }, action.payload);*/
      city_code = city_codes;
      return {
        ...state,
        city_code,
      }
    },

    // 初始化数据(商户信息详情)
    sellerInfoInitJoin(state, action){
      const { basicInfoData }= state;
      const { resultValue } = action.payload;
      basicInfoData[0].value = resultValue.seller_no;
      basicInfoData[1].value = stateTransform('verify_state', resultValue.verify_state);
      basicInfoData[2].value = dateFormatNew(resultValue.created_at);
      basicInfoData[3].value = resultValue.name;
      basicInfoData[4].value = getCityNameByCode(resultValue.city_code);
      basicInfoData[5].value = resultValue.biz_profile.legal_name;
      basicInfoData[6].value = stateTransform('seller_type', resultValue.seller_type);
      basicInfoData[7].value = stateTransform('state', resultValue.state);
      basicInfoData[8].value = resultValue.mobile;
      return {
        ...state,
        basicInfoData,
      }
    },

    // 商家店铺列表
    getSellerShopsJoinR(state, action){
      const { shopList } = state;
      Object.assign(shopList, action.payload);
      return {
        ...state,
        shopList,
      }
    },

    // 服务商可服务城市
    getServiceCityListR(state, action){
      const { serviceCityList } =state;
      Object.assign(serviceCityList, action.payload);
      return {
        ...state,
        serviceCityList,
      }
    },
  },
}

