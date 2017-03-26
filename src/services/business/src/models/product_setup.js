import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {SERVICE} from '../ActionsName.js';
import { service_find, service_find_one, service_create, service_update, service_find_versions, service_active, service_update_one_version } from 'aoao-core-api-service/lib/business.js';
import {close_type_find} from 'aoao-core-api-service/lib/public.js';
 // 跳转到详情页
function toDetail() {
  window.location.href = `/#/business/product_setup`;
}

/*
 current_status =>   loading | detail(展示生效产品) | add(没产品，添加一个立即激活的产品) | edit(编辑生效产品生成待激活产品) | toEnable(激活待激活产品)
 */
module.exports = {
  namespace: 'business_product_setup',
  state: {
    curr_status: 'loading', //当前的状态
    getDetailStamp: 0,//获取时间戳
    version_id_100: '', // 查询正在启用的版本
    visible:false, //模态框的状态
    plan_temp: {//基础定价方案 距离的数据结构参见API文档
      base_price : 300,//基础定价
      ext_distance:1000,//增加的距离
      ext_price : 0,//额外的定价
      max_distance:3000,//最大距离
      min_distance:0,//最小距离
      "time_span":["08:30", "23:00"],  //一条规则的时间段
    },
    detail_defaults: {      //页面加载时默认的状态
      biz_time: ["08:30", "23:00"],//营业时间
      price_mode: 2,//定价模式
      plan_type: 21,//定价类型
      biz_mode: 10,//定价模式
      delivery_time: 120,//运送时间
      shipping_fee_courier_rate: 0,//配送费骑士提成
      tip_fee_courier_rate: 0,//小费骑士提成
      price_plan: [  //默认的定价方案
        {
          "base_price":300, //基础的定价
          "ext_distance":1000,//增加的距离
          "ext_price":0,//额外的定价
          "max_distance":3000,//最大距离
          "min_distance":0,//最小距离
          "time_span":["08:30", "23:00"] //一条规则的时间段
        },
      ]
    },
    detail_state_0: { //编辑未激活
      no_result: true, //默认是没有结果的
    },
    detail_state_50: { //点启用按钮
      no_result: true,//默认是没有结果的
    },
    detail_state_100: {//已经在使用的
      no_result: true,//默认是没有结果的
    },
  },
  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const { pathname } = location;
        // 路由判断
        if (pathname === '/business/product_setup') {
          dispatch({ type: 'service/querys/special', payload: {vendor_id} });
        };
      });
    },
  ],
  effects: {
// 查询服务
    *['service/querys/special'](params) {
      const {vendor_id} = params.payload;
        //查询可用的服务
      const result_service_100 = yield call(service_find, {vendor_id,state: 100});
      // 服务查询的数据处理
      if (result_service_100.err) {
        message.error('服务查询失败！');
        return ;
      };
      // message.success('服务查询成功！');
      const {data} = result_service_100.data;
      // 如果当前没有可用服务则进入添加状态
      if (data.length === 0) {
        yield put({
          type: 'service/set/status',//对应reeducer的类型 改变状态为添加
          payload: { status: 'add'}
        })
        return ;
      };
      // 获取已经在使用的版本
      const detail_state_100 = result_service_100.data.data[0];
      // 保存当前可用版本的id和version
      const {id, version} = detail_state_100;
      // 查询可用服务的版本信息
      const result_100_ex = yield call(service_find_versions, {service_id: id,state: 100});
      // 从版本中获取信息比如创建时间和生效时间
      const {actived_at, used_at} = result_100_ex.data.data[0];
      // 如果查询成功
      yield put({
        type: 'service/querys/special/success',//对应reducer中的类型 查询成功  更新信息
        payload: {detail_state_100: {...detail_state_100, actived_at, used_at}, service_id: id, version_id_100: version}
      });
      // 获取各个版本的服务
      const result_0 = yield call(service_find_versions, {service_id: id,state: 0});
      const result_50 = yield call(service_find_versions, {service_id: id,state: 50});
     // 获取不同状态下的服务
      yield put({
        type: 'service/querys/special/success',
        payload: {
          detail_state_0: result_0.data.data[0] || {no_result: true},
          detail_state_50: result_50.data.data[0]  || {no_result: true}
        }
      });
        // 设置页面的状态
      yield put({
        type: 'service/set/status',
        payload: { status: 'detail'}
      })
    },

    // 更新服务
    *['service/querys/update_special'](params) {

      // yield put({
      //   type: SERVICE.changeVisible,
      //   payload: { visible:false}
      // })
      // 获取到服务商的ID
      const {vendor_id} = params.payload;
      // 获取正在启用的服务
      const result_service_100 = yield call(service_find, {vendor_id,state: 100});
      // 如果获取服务错误
      if (result_service_100.err) {
        message.error('服务查询失败！');
        return ;
      };
      // message.success('服务查询成功！');
      const {data} = result_service_100.data;
      // 如果数据不存在
      if (data.length === 0) {
        yield put({
          type: 'service/set/status',
          payload: { status: 'add'}
        })
        return ;
      };
      const detail_state_100 = result_service_100.data.data[0];
      const {id, version} = detail_state_100;
      const result_100_ex = yield call(service_find_versions, {service_id: id,state: 100});
      // 获取更新时间
      const {actived_at, used_at} = result_100_ex.data.data[0];

      yield put({
        type: 'service/querys/special/success',
        payload: {detail_state_100: {...detail_state_100, actived_at, used_at}, service_id: id, version_id_100: version}
      });
      // 获取到不同状态下的服务
      // 未激活
      const result_0 = yield call(service_find_versions, {service_id: id,state: 0});
      //正在启用
      const result_50 = yield call(service_find_versions, {service_id: id,state: 50});
      // put到reducer上
      yield put({
        type: 'service/querys/special/success',//对应到reducer的类型上更新信息
        payload: {
          detail_state_0: result_0.data.data[0] || {no_result: true},
          detail_state_50: result_50.data.data[0]  || {no_result: true}
        }
      });
    },
 // 改变当前的status 触发不同的页面变化
    *['service/set/status'](params) {
      // 获取状态值
      const {payload} = params;
      yield put({ type: 'service/did/set_status', payload });
    },
    // 获取可用的服务版本
    *['service/version/enable'](params) {
      yield put({
        type: SERVICE.changeVisible, // service/version/changeVisible 参见项目目录下的ActionNAme
        payload: { visible:false}
      })
      let {payload} = params;
      const {vendor_id} = params.payload;
      delete payload.vendor_id;
      // 查询服务
      const result_service = yield call(service_active, payload);
      // 返回的数据处理
      if (result_service.err) {
        message.error('服务启用失败！');
      } else {
        message.success('服务启用成功！');
        // 服务启用成功该白呢页面的状态为详情
        yield put({ type: 'service/set/status', payload: {status: 'detail'} });
        // 再一次查询可用的服务
        yield put({ type: 'service/querys/special', payload: {vendor_id} });
      };
    },
    // 创建服务
    *['service/creates'](params) {
      //获取创建服务的参数
      let {payload} = params;
      const {vendor_id} = params.payload;
      delete payload.service_id;
      //请求创建服务的接口
      const result_service = yield call(service_create, payload);
      // 创建服务的返回数据
      if (result_service.err) {
        message.error('服务创建失败！');
      } else {
        message.success('服务创建成功！');
        // 创建服务成功后还需要再走一遍服务查询的流程确保当前的服务是最新的状态
        yield put({ type: 'service/querys/special', payload: {vendor_id} });
      };
    },
    // 服务更新
    *['service/updates'](params) {
      // 获取更新服务的参数
      let {payload} = params;
      const {vendor_id} = params.payload;
      delete payload.vendor_id;
      // 请求接口
      const result_service = yield call(service_update, payload);
      // 请求接口回来数据的信息处理
      if (result_service.err) {
        message.error('服务更新失败！');
      } else {
        yield put({ type: 'service/change/visible', payload: {
          visible:true
        } });//将弹框的状态设为true
        // 更新服务成功
        yield put({ type: 'service/querys/update_special', payload: {vendor_id} });
      };
    },
  },

  reducers: {

//改变弹框的状态值
    ['service/change/visible'](state, action) {
      return { ...state, visible: action.payload.visible};
   },
    // 获取可用的服务版本
    ['service/version/changeVisible'](state, action) {
      return { ...state, visible: action.payload.visible};
    },
    // 如果服务查询成功改变store中state的值
    ['service/querys/special/success'](state, action) {
      return {...state,...action.payload, getDetailStamp: new Date() * 1};
    },
    //设置页面的状态值
    ['service/did/set_status'](state, action) {
      return { ...state, curr_status: action.payload.status};
    },
  },
}
