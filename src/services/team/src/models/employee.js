import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import { EMPLOYEE } from '../ActionsName.js';
import { account_find, account_find_one, account_create, account_update } from 'aoao-core-api-service/lib/business.js';
import { getManageArea } from '../../../aoao-core-api-service/src/team';
import { fetchCityList } from '../../../aoao-core-api-service/src/public';

function toDetail(id) {
  window.location.href = `/#/team/employee/list/detail?id=${id}`;
}
function toList() {
  setTimeout(()=> {
    window.location.href = '/#/team/employee/list';
  }, 1500);
}
const { err_codeTransform } = window.tempAppTool;
module.exports = {
  namespace: 'business_employee',
  state: {
    list_tables: {
      _meta: {},
      data: [],
    },
    list_details: {},
    list_adds: {},
    list_edits: {},
    areaList: {},
    cityList: [],
  },

  subscriptions: [
    function ({ dispatch, history }) {
      const detailPaths = ['/team/employee/list/detail', '/team/employee/list/edit'];
      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const { pathname } = location;
        if (pathname === '/team/employee/list') {
          dispatch({
            type: EMPLOYEE.find,
            payload: { org_id: vendor_id, state: 100 }
          });
        }
        ;
        if (pathname === '/team/employee/list/add') {
          dispatch({
            type: 'employee/getArea',
            payload: { vendor_id: vendor_id, state: 100 }
          });

          dispatch({
            type: 'getEmployeeServiceCityE',
            payload: { vendor_id },
          })
        }
        if (detailPaths.indexOf(pathname) !== -1) {
          dispatch({
            type: EMPLOYEE.getDetail,
            payload: location.query
          });
        }
        ;
      });
    },
  ],

  effects: {
    // 员工查询
    *['employee/querys'](params){
      const result_account = yield call(account_find, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`员工查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: 'employee/querySuccess',
          payload: result_account.data
        });
      }
    },
    // 创建员工
    *['employee/creates'](params){
      const result_account = yield call(account_create, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`账号添加失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('账号添加成功！');
        //跳转到列表
        toList();
      }
      ;
      //跳转到详情页
      // toDetail(result_account.user_id);
    },
    // 更新员工信息
    *['employee/updates'](params){
      const result_account = yield call(account_update, params.payload);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`账号更新失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        //跳转到列表
        toList();
        message.success('账号更新成功！');
      }
      ;
      //跳转到详情页
      // toDetail(area_id);
    },
    // 获取员工详情
    *['employee/getDetail'](params){
      const { id } = params.payload;
      let result_account = yield call(account_find_one, id);
      if (result_account.err) {
        const _response = result_account.err.response.json();
        _response.then((err_obj)=> {
          message.error(`账号查询失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        yield put({
          type: EMPLOYEE.updateDetail,
          payload: result_account.data
        });
      }
      ;

    },
    //获取可分配管理的区域
    *['employee/getArea'](params) {
      const { vendor_id } = params.payload;
      let areaList = yield call(getManageArea, vendor_id);
      yield put({
        type: 'employee/getAreaList',
        payload: { areaList }
      })
    },

    // 服务商服务的城市
    *getEmployeeServiceCityE(params) {
      const cityList = yield call(fetchCityList, params.payload.vendor_id);
      yield put({
        type: 'getEmployeeServiceCityR',
        payload: { cityList },
      })
    },
  },
  reducers: {
    ['employee/querySuccess'](state, action){
      let { list_tables } = state;
      Object.assign(list_tables, action.payload);
      return {
        ...state,
        list_tables
      };
    },
    ['employee/queryItemSuccess'](state, action){
      return {
        ...state,
        ...{ list_details: action.payload }
      };
    },
    ['employee/getAreaList'](state, action) {
      return {
        ...state,
        ...{ areaList: action.payload }
      }
    },

    getEmployeeServiceCityR(state, action){
      return {
        ...state,
        ...{ cityList: action.payload }
      }
    },
  },
}
