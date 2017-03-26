import request from './utils/request';
import qs from 'qs';

// 登录
export async function login(params) {
  return request(
    'auth/login',
    {
      method: 'post',
      body: JSON.stringify(params)
    },
    'AUTH'
  );
};
// 查询登陆者账号信息
export async function account_find_one(params) {
  return request(`accounts/?${qs.stringify(params)}`);
};
// 登出接口
export async function logout (params) {
  return request('accounts/logout', {
    method: 'post',
    body: JSON.stringify(params)
  });
}
