import request from './utils/request';
import qs from 'qs';
import {createListParam,createlimitPage} from './utils/utils';

// 查询日账单
export async function seller_day_bills_find(params) {
  const {page} = params
  delete params.page
  return request(`bills/sellers/daily?${qs.stringify(createlimitPage(page))}`, {
    method: 'post',
    body: JSON.stringify(params)
  });
};
// 查询月账单
export async function seller_month_bills_find(params) {
  let value = params
  const {page} = params
  delete params.page
  return request(`bills/sellers/monthly?${qs.stringify(createlimitPage(page))}`, {
    method: 'post',
    body: JSON.stringify(params)
  });
};


