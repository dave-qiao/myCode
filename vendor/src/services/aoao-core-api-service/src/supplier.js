/**
 * Created by dave 17/1/16
 * 项目管理的直营项目
 */
import request from './utils/request';
import qs from 'qs';
import { createListParam } from './utils/utils';


// 获取供应商管理列表查询
export async function getSupplierList(params) {
  return request(`vendor_biz_info/?${qs.stringify(params)}`).then((data) => data.data);
}

// 查询某服务商所有供应商列表
export async function getVendorSupplier(params) {
  return request(`vendors/?${qs.stringify(params)}`).then((data) => data);
}

// 增加新供应商
export async function addSupplier(params) {
  return request(`vendor_biz_info/create`,{
    method:'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

// 获取供应商信息详情
export async function getSupplierDetail(params) {
  return request(`vendor_biz_info/${params.biz_info_id}`).then((data) => data.data);
}

// 编辑供应商信息详情
export async function editSupplierDetail(params) {
  return request(`vendor_biz_info/${params.biz_info_id}/update`, {
    method: 'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

// 服务商关闭业务
export async function closeBusiness(params) {
  return request(`vendor_biz_info/${params.biz_info_id}/banned`,{
    method:'post',
  }).then((data) => data.data);
}

// 服务商开启业务
export async function openBusiness(params) {
  return request(`vendor_biz_info/${params.biz_info_id}/active`,{
    method:'post',
  }).then((data) => data.data);
}

//获取区域列表
export async function getAreas(params) {
  return request(`vendor_biz_area/?${qs.stringify(params)}`).then((data) => data.data);
}

export async function getAddAreas(params) {
  return request(`areas/?${qs.stringify(params)}`).then((data) => data.data);
}

// 提交添加的区域
export async function submitAdd(params) {
  return request(`vendor_biz_area/create`, {
    method: 'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

// 编辑供应商信息详情
export async function editArea(params) {
  return request(`vendor_biz_area/${params.values.biz_area_id}/update`, {
    method: 'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}




//获取商户详情
export async function getSellerInfoMessage(params) {
  return request(`sellers/${params.seller_id}`).then((data) => data.data);
}

//获取商家店铺列表
export async function getSellerShops(params) {
  return request(`shops/?${qs.stringify(params)}`).then((data) => data.data);
}





