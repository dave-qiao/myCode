import React, {Component, PropTypes} from 'react';
import {Button, Card,Table, Col, Row } from 'antd';
import { Link } from 'dva/router';
const List = ({data, total, current}) => {

  const columns = [{
    title: '交易日期',
    dataIndex: 'pay_date',
  }, {
    title: '交易方式',
    className: 'pay_way',
    dataIndex: 'pay_way',
  }, {
    title: '交易金额',
    dataIndex: 'pay_count',
  },{
    title: '方式',
    className: 'cut_payment',
    dataIndex: 'cut_payment',
  },
  {
    title: '交易状态',
    className: 'payment_state',
    dataIndex: 'payment_state',
  },
  {
    title: '操作',
    className: 'payment_detail',
    dataIndex: 'payment_detail',
    render: (text, record) => {
      return (
        <p>
          <Link to={"/business/area/list/edit?id="}>{text}</Link>
        </p>
      )
    }
  }];


  return (
    <Row>
      <Col sm={1}></Col>
      <Col sm={22}>
          <Card title="交易纪录" bordered={false}>
            <Table
               columns={columns}
               dataSource={data}
               showHeader={false}
               title={() => '最近交易纪录'}
             />
          </Card>
      </Col>
    </Row>

  );
};

module.exports =  List;
