/**
 * Created by user on 17/2/16.
 */
import request from '../../../aoao-core-api-service/src/utils/request';
import qs from 'qs';
import {createListParam} from '../../../aoao-core-api-service/src/utils/utils';

//获取所有订单状态
export async function fetchTotalOrderStatistics(vendorId, cityCode, shippingDate) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate
  };
  return request(`vendor_order/total_statistics/?${qs.stringify(params)}`)
    .then((data) => data.data.data);
}

//获取城市列表
export async function fetchOrderCityList(vendorId) {
  const params = {
    vendor_id:vendorId,
  };
  return request(`utils/vendor_cities?${qs.stringify(params)}`)
    .then((data) => data.data.data );
}

//获取商家订单列表
export async function fetchSellerOrderList(vendorId, cityCode, shippingDate, page, limit, sort) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate,
    page: page,
    limit: limit,
    sort: sort,
  };
  return request(`vendor_order/statistics_by_seller?${qs.stringify(params)}`)
    .then((data) => data.data.data);
}

//获取区域订单列表
export async function fetchAreaOrderList(sellerId, vendorId, cityCode, shippingDate, page, limit, sort) {
  const params = {
    seller_id: sellerId,
    vendor_id: vendorId,
    city_code: cityCode,
    shipping_date: shippingDate,
    page: page,
    limit: limit,
    sort: sort,
  };
  return request(`vendor_order/statistics_by_area?${qs.stringify(params)}`)
    .then((data) => data.data.data);
}

//获取异常订单列表
export async function fetchCloseOrderList(vendorId, cityCode, startDate, endDate, state, page, limit, sort) {
  const params = {
    vendor_id: vendorId,
    city_code: cityCode,
    start_date: startDate,
    end_date: endDate,
    state: state,
    page: page,
    limit: limit,
    sort: sort,
  };
  return request(`vendor_order/?${qs.stringify(params)}`)
    .then((data) => data.data.data);
}

//异常订单详情
export async function fetchCloseOrderDetail(orderId) {
  const params = {
    order_id: orderId,
  };
  return request(`vendor_order/${params.order_id}`)
    .then((data) => data.data);
}

//异常订单日志
export async function fetchCloseOrderLog(shipmentId) {
  const params = {
    shipment_id: shipmentId,
  };
  return request(`shipments/${params.shipment_id}/track_logs`)
    .then((data) => data.data.data);
}
