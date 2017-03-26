import request from './utils/request';
import qs from 'qs';
import {createListParam,createlimitPage} from './utils/utils';

 // 查询运单详情
  export async function shipments_detail_find(params) {
    return request(`shipments/?${qs.stringify(params)}`);
  };
  //运单月统计
  export async function shipments_seller_monthly_find(params) {
    return request('reports/orders/monthly/by_seller', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //运单日统计
  export async function shipments_seller_daily_find(params) {
  const {page} = params
  delete params.page
  return request(`reports/shipments/daily/by_seller?${qs.stringify(createlimitPage(page))}`, {
    method: 'post',
    body: JSON.stringify(params)
  });
};
  //日统计详情
  export async function shipments_seller_daily_detail_find(params) {
    return request('reports/orders/daily_detail/by_seller', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //运单月查询
  export async function shipments_area_monthly_find(params) {
    return request('reports/shipments/monthly/by_area', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //运单日查询
  export async function shipments_area_daily_find(params) {
    const {page} = params
    delete params.page
    return request(`reports/shipments/daily/by_area?${qs.stringify(createlimitPage(page))}`, {
      method: 'post',
      body: JSON.stringify(params)
    });

  };
  //日运单详情查询
  export async function shipments_area_daily_detail_find(params) {
    return request('reports/shipments/daily_detail/by_area', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //骑士月运单查询
  export async function shipments_courier_monthly_find(params) {
    return request('reports/shipments/monthly/by_courier', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //骑士日运单查询
  export async function shipments_courier_daily_find(params) {
    const {page} = params
    delete params.page
    return request(`reports/shipments/daily/by_courier?${qs.stringify(createlimitPage(page))}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //骑士日账单详情
  export async function shipments_courier_daily_detail_find(params) {
    return request('reports/shipments/daily_detail/by_courier', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  // 日运单查询
  export async function shipments_daily_find(params) {
  return request(`reports/shipments/daily/by_vendor/?${qs.stringify(createListParam(params))}`);
};
  //订单详情下载
  export async function shipments_daily_down(params) {
  return request(`reports/download_file?${qs.stringify(params)}`);
};

