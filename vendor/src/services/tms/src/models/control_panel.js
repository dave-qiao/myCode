import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import { message } from 'antd';
import {
  tms_shipments_find,
  tms_shipments_find_one,
  tms_shipments_find_one_logs,
  tms_couriers_find,
  tms_shipments_close,
  tms_reassign,
  tms_shipments_statistics,
  tms_courier_shipments_statistics,
} from 'aoao-core-api-service/lib/tms.js';

import { area_find_500, area_find_one, courier_find_500, seller_find_one } from 'aoao-core-api-service/lib/business.js';

import {
  areas_total_list
} from '../services/tms.js';

const { dateFormat } = window.tempAppTool;

// 运单状态&运单配送状态对照表
const shipment_states_dict = {
  '1': '20',      //已接单
  '2': '24',      //已取货
  '3': '5|10|50', //未完成 = 已创建|已确认|配送中
  '4': '-50',     //异常
  '5': '100',     //已送达
  '6': '-100',    //已取消
  '7': 'no',      //全部
  '8': '10'       //待分配
};

// help函数返回到调度中心的运单列表页面
function toList() {
// 定时器
  setTimeout(()=> {
    window.location.href = '/#/tms/control_panel';
  }, 1500);

}

module.exports = {

  namespace: 'tms_control_panel',
  state: {
    areas: { //调度模块的区域区域模块
      data: [],//调度模块的区域区域
    },
    areas_total_list:{
      data:[],
    },
    default_area_id: '',    //默认的区域区域
    default_area_name: '',  //默认的区域名称
    vendor_id: '',          //服务商的ID
    couriers: {             //骑士的信息
      data: [],             //骑士列表的数据
      loading: false,       //是否loading的开关 默认是关闭状态
      _meta: {},            // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    shipments: {       //调度模块的运单信息
      data: [],        //调度模块的运单列表数据
      loading: false,  //是否loading的开关 默认是关闭状态
      _meta: {},       // 服务器端返回的附带信息（包括总共多少条，后面还有没有数据的一个对象）
    },
    shipments_stats: {}, //调度模块的运单状态信息
    shipment_detail: {}, //调度模块的运单详情信息
    shipment_log: [],    //调度模块的运单日志信息
    shipment_area: {},   //调度模块的区域运单信息
    visible: false,      //调度模块模态框的状态显示 默认是隐藏
  },

  subscriptions: [

    function ({ dispatch, history }) {

      history.listen(location => {
        // 路由控制
        const AccountSet = JSON.parse(window.getStorageItem('accountInfo') || '{}');
        const UserSet = JSON.parse(window.getStorageItem('userInfo') || '{}');
        // 获取服务商的ID
        const { vendor_id } = AccountSet;
        // 获取城市的列表
        const { city_code } = UserSet.account_info || {};
        const { pathname } = location;
        // 进入页面的初始化操作
        if (pathname === '/tms/control_panel') {
          dispatch({
            type: 'tms/page/init',
            payload: { city_code, vendor_id }
          });
        }

        // 如果跳转到详情页面
        if (location.pathname === '/tms/control_panel/detail') {
          let { query } = location;
          dispatch({
            type: 'tms/shipments/query/one',
            payload: query
          });
        }
      });
    }
  ],

  effects: {

    // 调度页面初始化
    *['tms/page/init'](params) {
      // 获取参数
      const { vendor_id, city_code } = params.payload;

      // 请求区域
      const result_areas = yield call(area_find_500, { state: 100, vendor_id, is_filter_sub_area: true });
      //获取加盟区域
      const result_total_areas = yield call(areas_total_list, vendor_id);
      console.log(result_total_areas, 'result_total_areas');

      // 返回区域的数据处理
      if (result_areas.err) {
        message.error('直营区域查询失败！');
      } else {
        const areas = result_areas.data;
        //合并加盟区域数据
        areas.data = areas.data.concat(result_total_areas);
        if (areas.data.length === 0) {
          //暂无可用区域，请先创建区域！
          message.error('暂无可用区域，请先创建区域！！');
        } else {
          //取出第一个区域
          const { city_code, id, name } = areas.data[0];
          // 设置默认区域的名字和城市为第一个区域的信息
          yield put({
            type: 'tms/page/init/success',
            payload: { city_code, default_area_id: id, default_area_name: name, areas, vendor_id, }
          });
          // 初始化运单
          yield put({
            type: 'tms/shipments/query',
            payload: { city_code, area_id: id, vendor_id, state: '1', is_master: false }
          });
          //初始化骑士
          yield put({
            type: 'tms/couriers/query',
            /*payload: { area_id: id, vendor_id, state: '100'},*/
            payload: { vendor_id , state: '100' }, /*Created by dave 17/1/19*/
          });
          //初始化统计
          yield put({
            type: 'tms/shipments/statistics',
            payload: { area_id: id, vendor_id, city_code, is_master: false , shipping_date: dateFormat().join('') }
          });
        }

      }

    },

    // 调度运单列表查询
    *['tms/shipments/query'](params) {
      // 获取查询的参数
      const { state } = params.payload;
      let shipments = { ...params.payload };

      //如果是全部就什么也不传
      delete shipments.state;

      //需要 delivery_state 在utils查询
      if (['1', '2', '8'].indexOf(state) !== -1) {
        shipments.delivery_state = shipment_states_dict[state];
      }

      //需要 运单的状态
      if (['3', '4', '5', '6'].indexOf(state) !== -1) {
        shipments.state = shipment_states_dict[state];
      }

      // 查询接口获取一定条件写的运单列表
      const result_shipments = yield call(tms_shipments_find, { ...shipments, shipping_date: dateFormat().join('') });
      // 返回运单数据的数据处理
      if (result_shipments.err) {
        message.error('运单查询失败！');
      } else {
        yield put({
          type: 'shimpents/query/success',//查询接口获取一定条件写的运单列表成功
          payload: result_shipments.data
        });
      }

    },

    // 运单详情查询
    *['tms/shipments/query/one'](params) {
      // 根据运单"ID"查询运单的详情信息
      let detail_shipments = yield call(tms_shipments_find_one, params.payload.id);
      // 获取该运单的详细日志信息
      let log_shipments = yield call(tms_shipments_find_one_logs, params.payload.id);
      // 返回的数据处理
      if (detail_shipments.err) {
        message.error('运单详情查询失败！');
      } else {
        // 数据返回成功的处理
        const { seller_id, courier } = detail_shipments.data;
        let _result = {
          shipment_detail: detail_shipments.data,
          shipment_log: log_shipments.data,
        };
        // 根据运单中的商家ID查询该商家的详细信息
        const result_seller = yield call(seller_find_one, seller_id);
        //返回结果的数据处理
        if (result_seller.data) {
          _result.shipment_detail.seller_type = result_seller.data.seller_type;
        }
        ;
        // 如果该运单有骑士接单 根据骑士的ID查询信息
        if (detail_shipments.data) {
          let result_area = yield call(area_find_one, detail_shipments.data.area_id);
          //返回结果的数据处理
          _result.shipment_area = result_area.data;
        }
        ;
        yield put({
          type: 'shimpents/query/one/success', //运单的各种返回信息put代reducer中用来更新state表
          payload: { ..._result }
        });
      }
      ;
    },

    // 关闭运单
    *['tms/shipments/one/close'](params) {
      const { id, close } = params.payload;
      //请求接口
      let result_close = yield call(tms_shipments_close, close);
      // 返回数据的处理
      if (result_close.err) {
        message.error('运单关闭失败！');
      } else {

        message.success('运单关闭 成功！');
        // 返回调度模块的运单列表
        toList();
        // 数据处理
        yield put({
          type: 'tms/shipments/query/one',//运单关闭 成功
          payload: { id }
        });
      }
      ;
    },

    // 骑士查询
    *['tms/couriers/query'](params) {
      //获取骑士查询参数
      let payload = { ...params.payload };
      const { state } = payload;
      payload.work_state = state;
      delete payload.state;
      // 接口调用
      const result_couriers = yield call(courier_find_500, payload);
      //返回的数据处理
      if (result_couriers.err) {
        message.error('骑士查询失败！');
        return;
      }
      ;
      // 根据页码信息循环获取所有的骑士信息
      const last_page = Math.ceil(result_couriers.data._meta.result_count / 500);
      let [result_arr,page] = [result_couriers.data.data, 2];
      while (page <= last_page) {
        payload.page = page;
        let result_courier_other = yield call(courier_find_500, payload);
        result_arr.push(...result_courier_other.data.data);
        page++;
      }
      ;
      //循环获取骑士的ID信息
      let courier_ids = result_arr.map(item => item.id);
      let _payload = { courier_ids, shipping_date: dateFormat().join(''), is_master:false, };
      // 根据骑士的ID查询调度模块骑士的运单详情
      const result_stats = yield call(tms_courier_shipments_statistics, _payload);
// 返回的数据处理
      if (result_stats.err) {
        message.error('骑士运单统计查询失败！');
      } else {
        // 如果成功获取到骑士运单统计的信息
        result_stats.data.data.forEach(item => {
          const _i = courier_ids.indexOf(item.courier_id);
          result_arr[_i].statistics = item;
        });
      }
      ;
// 更新骑士运单统计信息
      yield put({
        type: 'couriers/query/success',// 更新骑士运单统计信息
        payload: { _meta: result_couriers.data._meta, data: result_arr }
      });
    },
// 运单统计查询
    *['tms/shipments/statistics'](params) {
      //屏蔽总运单，显示子运单
      params.payload.is_master = false;
      // 运单统计查询接口
      const result_stats = yield call(tms_shipments_statistics, {
        ...params.payload,
        shipping_date: dateFormat().join('')
      });
      // 返回数据的处理
      if (result_stats.err) {
        message.error('运单统计查询失败！');
      } else {
        // 数据返回成功
        yield put({
          type: 'tms/shipments/statistics/success',// 运单统计查询成功
          payload: result_stats.data
        });
      }
      ;
    },
// 改派订单
    *['couriers/reassign'](params) {
      // ant-design message组件的配置 具体可参见ant-design
      message.config({
        top: 200,
        duration: 2,
      });
      //获取查询参数
      const { reassigns, couriers, shipments, account_id } = params.payload;
      //改派接口
      let result_reassign = yield call(tms_reassign, {
        courier_id: reassigns.curr_courier.id,
        shipment_ids: reassigns.selectedRowKeys,
        note: reassigns.reason,
        operator_id: account_id
      });
      // 返回数据的处理
      if (result_reassign.err) {
        message.error('改派失败！');
      } else {
        // 数据返回成功
        message.success('改派成功！');
        let stats = {
          oks: 0,
          fails: 0,
        };
        // 返回给view层的state值 改派成功
        result_reassign.data.data.forEach(item => {
          if (item.ok) {
            stats.oks++;
          } else {
            stats.fails++;
          }
          ;
        });
        // 改派成功的信息
        message.info(`改派成功${stats.oks}单,改派失败${stats.fails}单.`);
      }
      ;
      //弹窗消失
      yield put({
        type: 'shipments/reassign/toggle', //弹窗状态切换
        payload: {
          visible: false
        }
      });
      //更新运单
      yield put({
        type: 'tms/shipments/query',  //更新运单成功
        payload: shipments
      });
      //更新骑士
      yield put({
        type: 'tms/couriers/query', //更新骑士成功
        payload: couriers
      });
    },
    // 模态框组件（后期可用区域模块中封装的组件替换，具体的UI内容可以用配置文件替换）
    *['reassign/modal/visible'](params) {
      const {
        payload
      } = params;
      yield put({
        type: 'shipments/reassign/toggle', //模态框组件成功
        payload
      });
    },
  },

  reducers: {
    // 调度模块初始化页面成功
    ['tms/page/init/success'](state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
    // 切换改派模态框的状态
    ['shipments/reassign/toggle'](state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
    // 调度页面的运单查询
    ['shimpents/query/success'](state, action) {
      return {
        ...state,
        shipments: action.payload
      };
    },
    // 运单统计的数据
    ['tms/shipments/statistics/success'](state, action) {
      return {
        ...state,
        shipments_stats: action.payload
      };
    },
    // 骑士查询成功
    ['couriers/query/success'](state, action) {
      return {
        ...state,
        couriers: action.payload
      };
    },
    // 运单详情查询
    ['shimpents/query/one/success'](state, action) {
      let _result = {
        ...state,
        ...action.payload
      };
      let { shipment_detail } = _result;
      // 数据结构的整理
      const { distance = 0, o3_order_amount = 0, shipping_fee = 0, shipping_fee_courier_rate = 0, tip_fee = 0, tip_fee_courier_rate = 0 } = shipment_detail;
      // 骑士的小费
      let local_calc_fee_courier = (shipping_fee * shipping_fee_courier_rate + tip_fee * tip_fee_courier_rate) / 10000;
      // 取两位小数
      local_calc_fee_courier = local_calc_fee_courier.toFixed(2);
      // 服务商的消费
      let local_calc_fee_vendor = (shipping_fee + tip_fee) / 100 - local_calc_fee_courier * 1;
      // 取两位小数
      local_calc_fee_vendor = local_calc_fee_vendor.toFixed(2);
      // 数据结构整理
      Object.assign(shipment_detail, {
        local_calc_distance: distance / 1000,//配送距离
        local_calc_o3_order_amount: o3_order_amount / 100,//订单的数量
        local_calc_shipping_fee: shipping_fee / 100,//运单的费用
        local_calc_tip_fee: tip_fee / 100,//运单的小费
        local_calc_fee_courier,//骑士的服务费
        local_calc_fee_vendor//服务商的服务费
      });
      return { ..._result, shipment_detail };
    },
  },
}
