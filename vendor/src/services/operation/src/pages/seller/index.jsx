import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover, Badge } from 'antd';
import OrderStatistics from '../order/components/orderStatistics';
import style from './style.less';

import { fetchCloseOrderDetail } from '../../services/order';

const orderWord = {
  total: 8888,          //总订单
  undone: 25,           //未完成 ＊
  done: 100,            //已完成 ＊
  unDistribution: 10,   //待分配 ＊
  distribution: 50,     //分配中 ＊
  exception: -50,       //异常   ＊
  canceled: -100,       //已取消 ＊
  completeRate: 0.88,   //成功率

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.total:
        return 'total';
      case this.undone:
        return 'undone';
      case this.done:
        return 'done';
      case this.unDistribution:
        return 'unDistribution';
      case this.distribution:
        return 'distribution';
      case this.exception:
        return 'exception';
      case this.canceled:
        return 'canceled';
      case this.completeRate:
        return 'completeRate';
      default:
        return 'other';
    }
  },
};


//请求的每页数据条数
const requestPagerSize = 12;
const requestPageNumber = 1;

class Seller extends React.Component {

  constructor(props) {
    super();
    const { operationOrder } = props;

    //sellerId props.location.query
    const { sellerId } = props.location.query;

    //订单状态
    const { totalOrderStatistics, areaOrderList } = operationOrder;

    //初始化状态
    this.state = {
      totalOrderStatistics,
      areaOrderList,
      sellerId,
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      dispatch: props.dispatch,              //dispatch函数
    };
  }

  componentDidMount = () => {
    const AccountSet = JSON.parse(window.localStorage.getItem('accountInfo') || '{}');
    const UserSet = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    const { vendor_id } = AccountSet;
    const { city_code } = UserSet;
    const date = window.localStorage.getItem('date') || ' ';
    const { dispatch } = this.props;
    const { sellerId } = this.state;
    //请求订单数据状态
    dispatch({
      type: 'fetchTotalOrderStatistics',
      payload: {
        vendorId: vendor_id,
        cityCode: city_code ? city_code : 110000,
        shippingDate: date },
    });

    //服务商订单列表
    dispatch({
      type: 'fetchAreaOrderList',
      payload: {
        sellerId,                    //商户ID
        vendorId: vendor_id,
        cityCode: city_code ? city_code : 110000,
        shippingDate: date,
        page: requestPageNumber,     //页码
        limit: requestPagerSize,     //分页
        sort:  '{created_at: -1}',   //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    })
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { totalOrderStatistics, areaOrderList } = operationOrder;
    this.setState({
      totalOrderStatistics,
      areaOrderList,
    })
  };

  //渲染商家订单状态统计
  renderStateDashboardComponent = () => {
    const { totalOrderStatistics } = this.state;
    const props = {
      totalOrderStatistics,     //订单状态
    };
    return (
      <OrderStatistics {...props} />
    )
  };

  //服务商列表（供应商列表）
  renderAreaOrderStateComponent= () => {
    const { areaOrderList } = this.state;
    const columns = [{
      title: '服务区域',
      dataIndex: 'area_name',
      key: 'area_name',
    }, {
      title: '供应商',
      dataIndex: 'supply_vendor_name',
      key: 'supply_vendor_name',
    }, {
      title: <span><Badge className={style.minCircle_2} />已确认</span>,
      dataIndex: 'states',
      key: 'unDistribution',
      render: (states, row, index) => { return states[orderWord.unDistribution] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_4} />配送中</span>,
      dataIndex: 'states',
      key: 'distribution',
      render: (states, row, index) => { return states[orderWord.distribution] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_5} />未完成</span>,
      dataIndex: 'states',
      key: 'undone',
      render: (states, row, index) => { return states[orderWord.undone] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_6} />已送达</span>,
      dataIndex: 'states',
      key: 'done',
      render: (states, row, index) => { return states[orderWord.done] || 0 },
    }, {
      title: <span><Badge className={style.minCircle_7} />已取消</span>,
      dataIndex: 'states',
      key: 'canceled',
      render: (states, row, index) => { return states[orderWord.canceled] || '0' },
    }, {
      title: '完成率',
      dataIndex: 'states',
      key: 'completeRate',
      render: (text, record, index) => {
        //TODO: percent rate
        const totalNum = record.order_count;
        let completeRate = ((text[orderWord.done] / totalNum).toFixed(3))*100;
        /*completeRate = completeRate && (completeRate.slice(2, 4) + '.' + completeRate.slice(4, 6));*/
        return (completeRate && (completeRate + '%')) || (0 + '%');
      },
    }];

    return (
      <Table dataSource={areaOrderList} columns={columns} />
    );
  };

  render() {
    const {
      renderStateDashboardComponent,
      renderAreaOrderStateComponent,
    } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            {/* 渲染状态数据面板 */}
            <div className="bd-content">{renderStateDashboardComponent()}</div>
          </Col>
          <Col>
            {/* 渲染订单状态 */}
            <div className="bd-content">{renderAreaOrderStateComponent()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(Seller);

