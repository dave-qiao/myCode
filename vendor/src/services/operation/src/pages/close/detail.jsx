import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import style from './components/style.less';
import DetailHeader from './components/detailHeader';
import { fetchCloseOrderDetail } from '../../services/order';

class Details extends React.Component {

  constructor(props) {
    super();
    const { operationOrder } = props;
    const { id } = props.location.query;
    const { shipmentId } = props.location.query;

    //订单状态
    const { closeOrderDetail, closeOrderLog } = operationOrder;

    //初始化状态
    this.state = {
      closeOrderDetail,
      closeOrderLog,
      id,
      shipmentId,       //运单ID
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      //orderId: order_id,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

  componentDidMount = () => {
    const { id, shipmentId } = this.state;
    const { dispatch } = this.props;
    const orderId = id;
    const shipment_id = shipmentId;
    dispatch({
      type: 'fetchCloseOrderDetail',
      payload: orderId,
    });
    dispatch({
      type: 'fetchCloseOrderLog',
      payload: orderId,
    });
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { closeOrderDetail, closeOrderLog } = operationOrder;
    const { id, shipmentId } = this.state;
    this.setState({
      closeOrderDetail,
      closeOrderLog,
      id,
      shipmentId,
    })
  };

  //订单基本信息
  renderBasicInfo= () => {
    const { closeOrderDetail } = this.state;
    const props = {
      title: '订单基本信息',
    };
    return (
      <div>
        <DetailHeader {...props} />
        <div>
          <Row className={style.lineH}>
            <Col span={6}>订单编号：{(closeOrderDetail && closeOrderDetail.id) || ''} </Col>
            <Col span={6} offset={6}>期望到达: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.plan_shipping_time) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>顾客姓名: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_name) || ''}</Col>
            <Col span={6} offset={6}>下单时间: {(closeOrderDetail && closeOrderDetail.created_at) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>店铺名称：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shop.name) || ''} </Col>
            <Col span={6} offset={6}>顾客电话: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_mobile) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>商家联系人：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_mobile) || '无联系方式'} </Col>
            <Col span={6} offset={6}>顾客地址: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_address) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>商家电话：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_tel) || '发货人固话'} </Col>
            <Col span={6} offset={6}>物流商: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.supply_vendor_info.name) || '供应商名称'}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>发货地址：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_address) || ''} </Col>
            <Col span={6} offset={6}>所属区域: {(closeOrderDetail && closeOrderDetail.area_name) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>配送距离：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.distance) || ''} </Col>
            <Col span={6} offset={6}>配送费: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shipping_fee) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>订单备注：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.delivery_note) || ''} </Col>
            <Col span={6} offset={6}>服务商佣金: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shipping_fee_vendor) || '0'}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>订单金额：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment && closeOrderDetail.shipment.o3_order_amount) || ''} </Col>
            <Col span={6} offset={6}>结算方式: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.pay_type) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>小费：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.tip_fee) || ''} </Col>
            <Col span={6} offset={6}>骑士提成: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shipping_fee_courier) || '0'}</Col>
          </Row>
        </div>
      </div>
    )
  };

  //供应商信息
  renderVendorInfo= () => {
    const { closeOrderDetail } = this.state;
    const props = {
      title: '供应商信息',
    };
    return (
      <div>
        <DetailHeader {...props} />
        <Row className={style.lineH}>
          <Col span={6}>供应商：{(closeOrderDetail && closeOrderDetail.vendor_id) || ''}</Col>
          <Col span={6} offset={6}>配送费：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shipping_fee) || '0'}</Col>
        </Row>
      </div>
    )
  };

  //物流追踪
  renderLogisticsInfo= () => {
    const { closeOrderDetail } = this.state;
    const props = {
      title: '物流追踪',
    };
    return (
      <div>
        <DetailHeader {...props} />
        <div>
          <Row className={style.lineH}>
            <Col span={6}>运单号：{(closeOrderDetail && closeOrderDetail.id) || ''}</Col>
            <Col span={6} offset={6}>骑士：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_name) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>配送区域：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.area_name) || ''}</Col>
            <Col span={6} offset={6}>联系电话：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_mobile) || '无联系方式'}</Col>
          </Row>
        </div>
      </div>
    )
  };

  //运单状态
  renderOrderState= () => {
    const { closeOrderLog } = this.state;
    const orderState = [];

    //构造数组
    /*if (closeOrderDetail) {
      orderState.push(closeOrderDetail);
    }*/

    const columns = [{
      title: '运单状态',
      dataIndex: 'shipment',
      key: 'closed_state',
      render: (text, record, index) => { return text && text.state },
    }, {
      title: '操作',
      dataIndex: 'shipment',
      key: 'closed_operator',
      render: (text, record, index) => { return text && text.closed_note },
    }, {
      title: '操作时间',
      dataIndex: 'shipment',
      key: 'closed_at',
      render: (text, record, index) => { return text && text.closed_at },
    }, {
      title: '操作人',
      dataIndex: 'shipment',
      key: 'city_code',
      render: (text, record, index) => { return text && text.closed_note },
    }, {
      title: '备注',
      dataIndex: 'shipment',
      key: 'closed_note',
      render: (text, record, index) => { return text && text.closed_note },
    }];

    return (
      <Table dataSource={closeOrderLog} columns={columns} />
    );
  };

  render() {
    const {
      renderBasicInfo,
      renderVendorInfo,
      renderLogisticsInfo,
      renderOrderState,
    } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            {/* 渲染条件筛选组件 */}
            <div className="bd-content">{renderBasicInfo()}</div>
            {/* 渲染状态数据面板 */}
            <div className="bd-content">{renderVendorInfo()}</div>
          </Col>
          <Col className={style.center} >
            {/* 渲染状态数据列表 */}
            <div className="bd-content">{renderLogisticsInfo()}</div>
          </Col>
          <Col>
            {/*渲染订单状态*/}
            <div className="bd-content">{renderOrderState()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}
module.exports = connect(mapStateToProps)(Details);
