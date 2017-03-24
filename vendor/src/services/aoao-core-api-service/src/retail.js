/**
 * Created by dave 17/1/16
 * 项目管理的直营项目
*/
import request from './utils/request';
import qs from 'qs';
import { createListParam } from './utils/utils';


//获取直营项目信息列表、  查询签约商户列表
export async function getContractSellers(vendor_id, city_code, contract_type, pages, limit) {
  const value = {
    vendor_id: vendor_id,
    city_code: city_code,
    contract_type: contract_type,
    page:pages,
    limit: limit,
  };
  return request(`contracts/sellers?${qs.stringify(value)}`).then((data) => data.data);
}

//根据商户类型获取商户列表
export async function getSellerByType(params) {
  return request(`contracts/sellers?${qs.stringify(params)}`).then((data) => data.data);
}

//获取商户详情
export async function getSellerInfoMessage(params) {
  return request(`sellers/${params.seller_id}`).then((data) => data.data);
}

//获取商家店铺列表
export async function getSellerShops(params) {
  return request(`shops/?${qs.stringify(params)}`).then((data) => data.data);
}

//获取签约详情
export async function getSignedInfo(params) {
  return request(`contracts/${params.contract_id}`).then((data) => data.data);
}

//获取订单分单规则详情
export async function getOrderRuleList(params) {
  return request(`delivery_dispatch_rule/?${qs.stringify(params)}`).then((data) => data.data);
}

//获取订单分单 规则列表
export async function getOrderRuleDetail(params) {
  return request(`delivery_dispatch_rule/?${qs.stringify(params)}`).then((data) => data.data);
}

//获取区域列表
export async function getAreas(params) {
  return request(`areas/?${qs.stringify(params)}`).then((data) => data.data);
}

//获取服务商列表
export async function getServiceProvider(params) {
  return request(`vendor_biz_info/supply_vendor_total_list/?${qs.stringify(params)}`).then((data) => data.data);
}

//获取服务商详情
export async function getVenderNameS(params) {
  return request(`vendors/${params.vendor_id}`).then((data) => data.data);
}

//添加订单分单规则
export async function addOrderRules(params) {
  return request(`delivery_dispatch_rule/create`,{
    method:'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

//添加骑士分单规则
export async function addKnightRules(params) {
  return request(`courier_dispatch_rule/create`,{
    method:'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

//发布订单分单规则
export async function publishOrderRules(params) {
  return request(`delivery_dispatch_rule/${params}/publish`,{
    method:'post',
  }).then((data) => data.data);
}

//发布骑士分单规则
export async function publishKnightRules(params) {
  return request(`courier_dispatch_rule/${params}/publish`,{
    method:'post',
  }).then((data) => data.data);
}

// 订单规则编辑接口
export async function editOrderRuleS(params) {
  return request(`delivery_dispatch_rule/${params.rule_id}/update`,{
    method:'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}

// 订单规则禁用接口
export async function deleteOrderRule(params) {
  console.log(params);
  return request(`delivery_dispatch_rule/${params.rule_id}/disable`,{
    method:'post',
  }).then((data) => data.data);
}

// 骑士规则禁用接口
export async function deleteKnightRule(params) {
  console.log(params);
  return request(`courier_dispatch_rule/${params.rule_id}/disable`,{
    method:'post',
  }).then((data) => data.data);
}

//获取骑士分单 规则列表
export async function getKnightRuleDetail(params) {
  return request(`courier_dispatch_rule/?${qs.stringify(params)}`).then((data) => data.data);
}

//添加骑士规则时可用的团队及骑士列表
export async function getCanSelectTeam(params) {
  return request(`team/?${qs.stringify(params)}`).then((data) => data.data);
}

// 骑士规则编辑接口
export async function editKnightRuleS(params) {
  return request(`courier_dispatch_rule/${params.rule_id}/update`,{
    method:'post',
    body: JSON.stringify(params.values),
  }).then((data) => data.data);
}


