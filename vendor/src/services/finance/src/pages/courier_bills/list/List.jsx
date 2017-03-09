import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';

const List = ({data, total, current, onShowItem, onEditItem}) => {
  const columns = [
  {
    "title": "日期",
    "dataIndex": "date",
    "key": "date"
  }, {
    "title": "骑士名称",
    "dataIndex": "name",
    "key": "name"
  }, {
    "title": "所属区域",
    "dataIndex": "business_circle",
    "key": "business_circle"
  }, {
    "title": "完成订单数",
    "dataIndex": "orders",
    "key": "orders"
  }, {
    "title": "订单金额",
    "dataIndex": "order_amount",
    "key": "order_amount"
  }, {
    "title": "配送费",
    "dataIndex": "packing_fee",
    "key": "packing_fee"
  }, {
    "title": "骑士提成",
    "dataIndex": "commission",
    "key": "commission"
  }, {
    "title": "结算金额（元）",
    "dataIndex": "settlement_amount",
    "key": "settlement_amount"
  }, {
    "title": "实际结算金额",
    "dataIndex": "actual_amount",
    "key": "actual_amount"
  }, {
    "title": "对账状态",
    "dataIndex": "check_state",
    "key": "check_state"
  }, {
    "title": "对账时间",
    "dataIndex": "check_date",
    "key": "check_date"
  }, {
    "title": "操作",
    "dataIndex": "operation",
    "key": "operation",
    render: (text, record) => {
      return (
        <p>
          <Link to={"#"}><Button type="primary">{text}</Button></Link>
        </p>
      )
    }
  }
];

  return (
    <Table columns={columns} dataSource={data}/>
  );
};

module.exports =  List;
