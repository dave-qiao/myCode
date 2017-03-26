import request from './utils/request';
import qs from 'qs';
import { createListParam } from './utils/utils';


//短信发送
export async function sms_send(params) {
  return request(
    'io/sms/send',
    { method: 'post', body: JSON.stringify(params) },
    'AUTH'
  );
};
//获取上传资源Token接口
export async function qiniu_tokens(params) {
  return request('io/qiniu/tokens', {
    method: 'post',
    body: JSON.stringify(params)
  });
};
//上传资源信息接口,资源持久化
export async function assets(params) {
  return request('storage/assets', {
    method: 'post',
    body: JSON.stringify(params)
  });
};
//上传资源到七牛
export async function qiniu_upload(params) {
  return request('https://up.qbox.me', {
    method: 'post',
    body: params
  });
};
//查询员工详情
export async function account_find_one(id) {
  return request(`accounts/${id}`);
}
//查询服务商详情
export async function vendor_find_one(id) {
  return request(`vendors/${id}`);
}
//编辑服务商详情
export async function vendor_update(params) {
  const { vendor_id } = params;
  delete params.vendor_id;
  return request(`vendors/${vendor_id}`, {
    method: 'post',
    body: JSON.stringify(params)
  });
}
//服务商提交审核
export async function vendor_apply_verify(params) {
  const { vendor_id } = params;
  delete params.vendor_id;
  return request(`vendors/${vendor_id}/apply_verify`, {
    method: 'post',
    body: JSON.stringify(params)
  });
}
//二维码链接获取
export async function utils_apk_download_url_find() {
  return request('utils/apk_download_url');
}
//错误类型获取
export async function close_type_find(id) {
  return request(`utils/shipment_tags`);
}
// 登出接口
export async function logout(params) {
  return request('accounts/logout', {
    method: 'post',
    body: JSON.stringify(params)
  });
}

//获取服务商注册城市列表
export async function fetchCityList(vendorId) {
  const params = {
    vendor_id:vendorId,
  }
  return request(`utils/vendor_cities?${qs.stringify(params)}`)
    .then((data) => data.data.data );
}

