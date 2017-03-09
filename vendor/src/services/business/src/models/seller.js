import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import { getCityNameByCode } from '../../../../utils/authHelper';
import { SELLER } from '../ActionsName.js';

import {
  account_find,
  seller_find,
  seller_find_one,
  seller_update,
  seller_approve_verify,
  seller_shop_query,
  vendor_merchant_find
} from 'aoao-core-api-service/lib/business.js';

// 跳转到详情页面
function toDetail(id) {
  window.location.href = `/#/business/seller/list/detail?id=${id}`;
}
// 返回商家列表
function toList() {
  setTimeout(() => {
    window.location.href = '/#/business/seller/list';
  }, 1500);
}
const {
  err_codeTransform
} = window.tempAppTool;// 全局变量 来自aoao-core-api-service/src/utils/utils.js



module.exports = {
  namespace: 'business_seller',
  state: {
    list_tables: {     // 商家列表容器
      data: [],//商家的列表数据字段
      _meta: {}, // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    list_details: { //商家详情信息
      d_seller: {       //商家本身的信息
        apply_info: {},//返回的附带字段
        shop: {}//商家的店铺信息
      },
      d_account: {}//商家的账户信息
    },
    shops_info:{ //商家的店铺信息
      data:[],//商家的列表数据字段
      _meta:{}// 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    }
  },

  subscriptions: [
    function({
      dispatch,
      history
    }) {
    // 路由判断
      const detailPaths = ['/business/seller/list/detail', '/business/seller/list/edit', '/business/seller/list/check']
      history.listen(location => {
        //获取全局信息
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const _userInfo = window.getStorageItem('userInfo') || '{}';
        // 获取服务商的ID
        const { vendor_id } = JSON.parse(_accountInfo);
        //获取城市编码
        const { city_code } = JSON.parse(_userInfo);
        const {
          pathname
        } = location;
        // 如果是商家列表页面
        if (pathname === '/business/seller/list') {
          dispatch({
            type: SELLER.find, //见模块的ActionName.js
            payload: {history_vendor_id:vendor_id,state:100}
          });
        };
        if (detailPaths.indexOf(pathname) !== -1) {
          dispatch({
            type: SELLER.getDetail,//见模块的ActionName.js
            payload: location.query
          });
        };
      });
    },
  ],

  effects: {
  // 商户查询
    *['seller/querys'](params) {
      //请求商户查询接口
      let result_seller = yield call(vendor_merchant_find, params.payload);
      // 返回数据的处理
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 商户查询成功映射到reducer中
          yield put({
            type: 'seller/querySuccess', // 商户查询成功
            payload: {
              data: result_seller.data.data,
              _meta:result_seller.data._meta
            }
          });

      };



    },
    // 商家编辑（二期不要了）
    // TODO: 废弃
    *['seller/updates'](params) {
      const {
        seller_id
      } = params.payload;
      const result_seller = yield call(seller_update, params.payload);
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`商家编辑失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('商家编辑成功!');
        toList();
      };
      //跳转到详情页
      // toDetail(seller_id);
    },
    // 商户审核
    *['seller/approve_verify'](params) {
      //请求接口
      const result_seller = yield call(seller_approve_verify, params.payload);
      // 返回数据的处理
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`操作失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('操作成功!');
        // 审核成功返回商户列表
        toList();
      };
    },
  // 获取商户详情
    *['seller/getDetail'](params) {
      // 获取用户的信息
      const _userInfo = window.getStorageItem('userInfo') || '{}';
      // 获取城市编码
      const { city_code } = JSON.parse(_userInfo);
     // 获取请求参数
      const {id} = params.payload;
      // 获取商户信息
      let result_seller = yield call(seller_find_one, id);
      // 获取账户信息
      let result_account = yield call(account_find, {
        org_id: id,
        org_type: 2
      });

      // 获取多店铺地址
      yield put({
        type: SELLER.getSellerShops, // 获取多店铺地址
        payload: {
          seller_id:id
        }
      });

      // 判断返回结果（有的数据没加可参照这种格式）
      if (result_seller.err) {
        const _response = result_seller.err.response.json();
        _response.then((err_obj) => {
          message.error(`商家查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        // 接收返回数据
        let _result = {
          d_seller: result_seller.data,
          d_account: {}
        };
       // 判断返回的账号信息
        if(result_account.err) {

        } else {
          _result.d_account = result_account.data.data[0]
        };
 // 返回成功put到reducer中
        yield put({
          type: SELLER.updateDetail, // 获取商户详情成功
          payload: {..._result}
        });
      };
    },

    // 获取该商户的店铺信息
    *['seller/getSellerShops'](params){
      //请求接口
      // seller_shop_query为服务名 可在相应的service层中查找
      const { data } = yield call(seller_shop_query, params.payload);
// 返回数据的处理
      if (data) {
        // 获取到商户的店铺信息
        yield put({
          type: SELLER.getSellerShopSucess, // 获取到商户的店铺信息
          payload: {
            data: data.data,
            _meta:data._meta
          }
        });
      }
    },

  },

  reducers: {
    // 获取商家的列表信息
    ['seller/querySuccess'](state, action) {
      const { list_tables } = state;

      //处理返回数据，添加城市名称字段
      if (action.payload.data.length) {
        action.payload.data.map((item) => {
          const data = item;
          data.city_name = getCityNameByCode(data.city_code);
          return data;
        });
      }

      // ES6语法对象映射
      Object.assign(list_tables, action.payload);
      return {
        ...state,
        list_tables
      };
    },
    // 获取商家详情成功
    ['seller/queryItemSuccess'](state, action) {
      return {...state,
        ... {
          list_details: action.payload
        }
      };
    },
    // 获取商家的店铺信息成功
    ['seller/getSellerShopsSucess'](state, action){

      return {
        ...state,
        ...{shops_info: action.payload}
      };

    },
    // 创建用户成功
    ['seller/createSuccess'](state, action) {},
    // 更新商家信息成功
    ['seller/updateSuccess'](state, action) {},
  },
}
