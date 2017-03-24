import request from './utils/request';
import qs from 'qs';
import {createListParam} from './utils/utils';
  //运单查询
  export async function tms_shipments_find(params) {
    return request(`shipments/?${qs.stringify(createListParam(params))}`);
  };
  //运单详情查询
  export async function tms_shipments_find_one(id) {
    return request(`shipments/${id}`);
  };
  //运单操作日志查询
  export async function tms_shipments_find_one_logs(id) {
    return request(`shipments/${id}/track_logs`);
  };
  //运单关闭
  export async function tms_shipments_close(params) {
    return request('shipments/close', {
      method: 'post',
      body: JSON.stringify(params)
    });
  }

  //推单记录查询
  export async function tms_push_order_find(params) {
    return request(`contest_queues/?${qs.stringify(params)}`);
  };

  //骑士查询
  export async function tms_couriers_find(params) {
    return request(`couriers/?${qs.stringify(params)}`);
  };
  //运单改派
  export async function tms_reassign(params) {
    return request('shipments/reassign', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //实时运单统计
  export async function tms_shipments_statistics(params) {
    return request(`statistics/shipments?${qs.stringify(params)}`);
  };
  //实时骑士运单统计
  export async function tms_courier_shipments_statistics(params) {
    return request('statistics/courier_shipments', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
