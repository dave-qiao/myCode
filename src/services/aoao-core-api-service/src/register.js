import request from './utils/request';
import qs from 'qs';
// 注册接口
export async function register(params) {
  return request(
    'auth/register',
    {
      method: 'post',
      body: JSON.stringify(params)
    },
    'AUTH'
  );
};
