import request from '../../../aoao-core-api-service/src/utils/request';
import qs from 'qs';
import {createListParam} from '../../../aoao-core-api-service/src/utils/utils';

//查询某服务商所有总加盟商列表，取上一级的
export async function fetchSupplyVendorList(vendorId, cityCode) {
  const params = {
    supply_vendor_id:vendorId,
    city_code:cityCode,
  };
  return request(`vendor_biz_info/vendor_total_list/?${qs.stringify(params)}`)
          .then((data) => data.data.data);
}

//查询某服务商所有供应商列表，取下一集的
export async function fetchVendorList(vendorId, cityCode){
  const params = {
    vendor_id:vendorId,
    city_code:cityCode,
  };
  return request(`vendor_biz_info/supply_vendor_total_list/?${qs.stringify(params)}`)
          .then((data) => data.data.data);
}

//获取城市列表
export async function fetchCityList(vendorId) {
  const params = {
    vendor_id:vendorId,
  }
  return request(`utils/vendor_cities?${qs.stringify(params)}`)
          .then((data) => data.data.data );
}

//获取区域列表
export async function fetchAreaList(vendorId, supplyVendorId = '', relateType, cityCode, areaState, page = 1, size = 20) {
  const params = {
    city_code:cityCode,
    relate_type:relateType,
    vendor_id:vendorId,
  }

  //添加区域列表状态参数
  if (areaState !== '') {
    params.state = areaState;
  }

  //判断是否有供应商ID参数
  if (supplyVendorId !== '') {
    params.supply_vendor_id = supplyVendorId;
  }

  params.page = (page <= 0) ? 1 : page;                 //当前分页页码
  params.limit = (size <= 0 || size > 20) ? 20 : size;  //数据条数

  params.sort = '{"created_at":-1}';  //数据排序，最新创建的显示在前面
  params.is_filter_sub_area = true;   //判断是否过滤子类

  return request(`areas/?${qs.stringify(params)}`)
          .then((data) => data.data);
}

//获取区域详情接口
export async function fetchAreaDetail(areaId) {
  return request(`areas/${areaId}`)
          .then((data) => data.data );
}

//获取区域草稿接口
export async function fetchAreaDraftDetail(areaId){
  return request(`areas/${areaId}/update_info`)
          .then((data) => data.data );
}

//发布区域
export async function publishArea(areaId){
  const params = {
    area_id: areaId,
  }

  return request(`areas/${areaId}/publish`, {
    method: 'post',
    body: JSON.stringify(params)
  }).then((data) => data );
}

//创建区域
export async function createArea(vendorId, areaName, cityCode, parentId) {
  const params = {
    name: areaName,
    city_code: cityCode,
    vendor_id: vendorId,
  }

  //判断参数是否存在，不存在则不添加
  if (parentId && parentId !== '') {
    params.parent_area_id = parentId;
  }

  return request('areas/create', {
    method: 'post',
    body: JSON.stringify(params)
  });
}

//更新区域
export async function updateArea(areaId, areaName, areaState, vendorId, cityCode, coordinates) {
  const params = {
    name: areaName,
    city_code: cityCode,
    vendor_id: vendorId,
    state: areaState,
  }

  //判断参数是否存在，不存在则不添加
  if (coordinates && coordinates != []) {
    const coordinatesArray = coordinates.map( (item) => {
      return [item];
    })
    params.coordinates = coordinatesArray;
  }

  return request(`areas/${areaId}/update`, {
    method: 'post',
    body: JSON.stringify(params)
  });
};
