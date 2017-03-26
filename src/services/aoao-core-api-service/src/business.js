import request from './utils/request';
import qs from 'qs';
import {createListParam} from './utils/utils';


//area

  //查询多个区域
  export async function area_find(params) {
    return request(`areas?${qs.stringify(createListParam(params))}`);
  };
  // 查询五百个区域
  export async function area_find_500(params) {
    return request(`areas?${qs.stringify({...params, limit: 500})}`);
  };

  // 查询一百个区域
  export async function area_find_100(params) {
    return request(`areas?${qs.stringify({...params, limit: 99})}`);
  };
  // 查询50个区域
  export async function area_find_50(params) {
    return request(`areas?${qs.stringify({...params, limit: 50})}`);
  };
  //查询单个区域
  export async function area_find_one(id) {
    return request(`areas/${id}`);
  };
  //添加单个区域
  export async function area_create(params) {
    return request('areas', {
      method: 'post',
      body: JSON.stringify(params)
    });
  }
  //更新单个区域
  export async function area_update(params) {
    const {area_id} = params;
    delete params.area_id;
    delete params.region_id;
    delete params.vendor_id;
    return request(`areas/${area_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //查询单个区域区域
  export async function area_regions_find_one(params) {
    return request(`maps/regions?${qs.stringify(params)}`);
  };
  //添加单个区域区域
  export async function area_regions_create(params) {
    return request('maps/regions', {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //更新单个区域区域
  export async function area_regions_update(params) {
    const {region_id} = params;
    delete params.region_id;
    delete params.vendor_id;
    return request(`maps/regions/${region_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };

//employee

  //查询多个员工
  export async function account_find(params) {
    return request(`accounts?${qs.stringify(createListParam(params))}`);
  };
  //查询单个员工
  export async function account_find_one(id) {
    return request(`accounts/${id}`);
  };
  //添加单个员工
  export async function account_create(params) {
    return request('accounts', {
      method: 'post',
      body: JSON.stringify(params)
    });
  }
  //更新单个员工
  export async function account_update(params) {
    const {user_id} = params;
    delete params.user_id;
    delete params.type;
    return request(`accounts/${user_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };

//courier

  //查询多个骑士
  export async function courier_find(params) {
    return request(`couriers?${qs.stringify(createListParam(params))}`);
  };
  //查询单个骑士
  export async function courier_find_one(id) {
    return request(`couriers/${id}`);
  };
  //查询单个骑士操作日志
  export async function courier_find_one_audit_logs(params) {
    return request(`audit_logs/?${qs.stringify(params)}`);
  };
  //添加单个骑士
  export async function courier_create(params) {
    return request('couriers', {
      method: 'post',
      body: JSON.stringify(params)
    });
  }
  //更新单个骑士
  export async function courier_update(params) {
    const {courier_id} = params;
    delete params.courier_id;
    return request(`couriers/${courier_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //审核单个骑士
  export async function courier_approve_verify(params) {
    const {courier_id} = params;
    delete params.courier_id;
    return request(`couriers/${courier_id}/approve_verify`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //查询500个骑士
  export async function courier_find_500(params) {
    return request(`couriers?${qs.stringify({...params, limit: 500})}`);
  };

  //查询100个骑士
  export async function courier_find_100(params) {
    return request(`couriers?${qs.stringify({...params, limit: 99})}`);
  };

//seller

  //查询多个商家
  export async function seller_find(params) {
    return request(`contracts/?${qs.stringify(createListParam(params))}`);
  };
  //查询500个商家
  export async function seller_find_500(params) {
    return request(`contracts?${qs.stringify({...params, limit: 500})}`);
  };
  //查询100个商家
  export async function seller_find_100(params) {
    return request(`contracts?${qs.stringify({...params, limit: 99})}`);
  };
  //查询单个商家
  export async function seller_find_one(id) {
    return request(`sellers/${id}`);
  };
  //更新单个商家
  export async function seller_update(params) {
    const {seller_id} = params;
    delete params.seller_id;
    return request(`sellers/${seller_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //审核单个商家
  export async function seller_approve_verify(params) {
    const {seller_id} = params;
    delete params.seller_id;
    return request(`sellers/${seller_id}/approve_verify`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
//service

  //查询多个产品
  export async function service_find(params) {
    return request(`service?${qs.stringify(createListParam(params))}`);
  };
  //查询单个产品
  export async function service_find_one(id) {
    return request(`service/${id}`);
  };
  //添加单个产品
  export async function service_create(params) {
    delete params.service_id;
    delete params.version_id;
    return request('service', {
      method: 'post',
      body: JSON.stringify(params)
    });
  }
  //更新单个产品
  export async function service_update(params) {
    const {service_id} = params;
    delete params.service_id;
    return request(`service/${service_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //查询产品某个版本信息
  export async function service_find_versions(params) {
    const {service_id} = params;
    delete params.service_id;
    return request(`service/${service_id}/versions?${qs.stringify(params)}`);
  };
  //编辑产品某个版本信息
  export async function service_update_one_version(params) {
    const {service_id, version_id} = params;
    delete params.service_id;
    delete params.version_id;
    return request(`service/${service_id}/versions/${version_id}`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  //启用服务商产品
  export async function service_active(params) {
    const {service_id} = params;
    delete params.service_id;
    return request(`service/${service_id}/active`, {
      method: 'post',
      body: JSON.stringify(params)
    });
  };
  // 查询签约列表
  export async function sign_find(params) {
  return request(`contracts/?${qs.stringify(createListParam(params))}`);
};
  // 获取签约详情
  export async function sign_find_detail(params) {
  const {contract_id} = params
  return request(`contracts/${contract_id}?${qs.stringify(params)}`);
};
  // 更新签约信息
  export async function sign_update(params) {
  const {contract_id} = params;
  delete params.contract_id
  return request(`contracts/${contract_id}`, {
    method: 'post',
    body: JSON.stringify(params)
  });
};
 // 获取商家的店铺列表
  export async function seller_shop_query(params) {
  return request(`shops/?${qs.stringify(createListParam(params))}`);
};
 //获取服务商签约的历史商户
  export async function vendor_merchant_find(params, page) {
  return request(`sellers/?${qs.stringify(createListParam(params,page))}`);
};

  // 获取合作的城市
  export async function cooperative_city_find(params) {
  return request(`utils/vendor_cities/?${qs.stringify(params)}`);
};
