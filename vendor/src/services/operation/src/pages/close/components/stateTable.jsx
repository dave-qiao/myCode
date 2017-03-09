
import React from 'react';
import { Table, Badge } from 'antd';
import { Link } from 'dva/router';

import style from './style.less';

//优化代码－－－
const payType = {
  1: '现金',
  2: '余额',
  3: '后付费',
};

const columns = [{
  title: '订单编号',
  dataIndex: 'id',
  key: 'id',
  render: (text, record) => (
    <span>
      <Link to={{ pathname: '/operation/order/close/detail/', query: { id: record.id, shipmentId: record.shipment_id } }}>{ record.id }</Link>
    </span>
  ),
}, {
  title: '商家名称',
  dataIndex: 'shipment',
  key: 'seller_name',
  render: (text, record, index) => { return text.seller.name; },
}, {
  title: '供应商',
  dataIndex: 'shipment',
  key: 'vendor_name',
  render: (text, record, index) => { return text.supply_vendor_info.name; },
}, {
  title: '配送距离',
  dataIndex: 'shipment',
  key: 'distance',
  render: (text, record, index) => { return text.distance; },
}, {
  title: '配送费(元)',
  dataIndex: 'shipment',
  key: 'shipping_fee',
  render: (text, record, index) => { return text.shipping_fee; },
}, {
  title: '结算方式',
  dataIndex: 'shipment',
  key: 'pay_type',
  render: (text, record, index) => { return payType[text.pay_type]; },
}, {
  title: '分单状态',
  dataIndex: 'state',
  key: 'state',
  render: (text, record, index) => { return '异常'; },
}, {
  title: '订单金额',
  dataIndex: 'shipment',
  key: 'o3_order_amount',
  render: (text, record, index) => { return text.o3_order_amount; },
}, {
  title: '下单时间',
  dataIndex: 'created_at',
  key: 'created_at',
}, {
  title: '期望送达',
  dataIndex: 'shipment',
  key: 'plan_shipping_time',
  render: (text, record, index) => { return text.plan_shipping_time; },
}];

class StateTable extends React.Component {
  constructor(props) {
    super();

    //初始化商家列表
    this.state = {
      closeOrderList: props.closeOrderList,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //update 商家列表
    this.setState({
      closeOrderList: nextProps.closeOrderList,
    });
  };

  render() {
    const { closeOrderList } = this.state;

    return (
      <Table dataSource={closeOrderList} columns={columns} />
    );
  }
}
module.exports = StateTable;
