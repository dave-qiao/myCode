//TODO: 未开发
import request from './utils/request';
import qs from 'qs';
import {createListParam} from './utils/utils';

// 数据罗盘
export async function compass_find(params) {
  return request(`compass/?${qs.stringify(params)}`);
};
