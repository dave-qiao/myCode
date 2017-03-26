//TODO: 未开发
import request from './utils/request';
import qs from 'qs';
import {createListParam} from './utils/utils';

export async function monito_find(params) {
  return request(`monito/?${qs.stringify(params)}`);
};

export async function monito_state(params) {
  return request(`monito/find/?${qs.stringify(params)}`);
};
