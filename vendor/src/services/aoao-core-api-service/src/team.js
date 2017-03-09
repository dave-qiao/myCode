import request from './utils/request';
import qs from 'qs';
import { createListParam } from './utils/utils';


//获取所有团队列表
export async function getTeams(vendor_id, city_code, limit, sort) {
  const value = {
    vendor_id: vendor_id,
    city_code: city_code,
    limit: limit,
    sort: sort,
  };
  return request(`team/?${qs.stringify(value)}`).then((data) => data.data);
}
//获取团队详情
export async function getTeamDetail(team_id) {
  /*const value = {
   team_id: team_id,
   };*/
  return request(`team/${team_id}`).then((data) => data.data);
}
//获取待审核骑士数据
export async function readyCourierState(vendor_id, verify_state) {
  const value = {
    vendor_id: vendor_id,
    verify_state: verify_state,
  };
  return request(`couriers/?${qs.stringify(value)}`).then((data) => data.data);
}
//移除团队成员
export async function deleteTeamMember(team_id, courier_ids) {
  "use strict";
  const value = {
    'courier_ids': [`${courier_ids}`]
  }
  console.log('courier_ids', courier_ids, 'courier_ids')
  return request(`team/${team_id}/remove_member`, {
    method: 'post',
    body: JSON.stringify(value)
  }).then((data) => data.data);
}
//添加新团队
export async function addTeam(vendor_id, name, city_code) {
  const value = {
    vendor_id: vendor_id,
    name: name,
    city_code: city_code,
  };
  return request('team/create', {
    method: 'post',
    body: JSON.stringify(value)
  }).then((data) => data.data);
}
//局限于 某个团队 可添加的骑士列表
export async function teamAddMemberCourier(vendor_id, team_id) {
  const value = {
    vendor_id: vendor_id,
    team_id: team_id,
    limit: 1000
  };
  return request(`couriers/?${qs.stringify(value)}`).then((data) => data.data);
};
//局限于 某个团队 可添加的骑士列表
export async function teamAddMemberCourierId(params) {
  return request(`couriers/?${qs.stringify(params)}`).then((data) => data.data);
}
// 团队添加新成员
export async function addTeamMemeber(team_id, courier_ids) {
  const value = {
    courier_ids: [`${courier_ids}`],
  };
  return request(`team/${team_id}/add_member`, {
    method: 'post',
    body: JSON.stringify(value)
  }).then((data) => data.data);
}
//区域查询接口
export async function getManageArea(vendor_id) {
  const value = {
    vendor_id: vendor_id,
    limit: 1000,
    state: 100
  };
  return request(`areas/?${qs.stringify(value)}`).then((data) => data.data);
}

