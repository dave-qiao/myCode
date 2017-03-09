import React, { Component, PropTypes } from 'react';
import { Form, Table, Row, Col, Modal, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { CONTROL_PANEL } from '../../ActionsName.js';
const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;
const [FormItem, confirm] = [Form.Item, Modal.confirm];

const reasons = {};
const View = ({ tms_control_panel, dispatch }) => {
  // 从model获取details信息
  const { shipment_detail, shipment_log = { data: [] }, shipment_area } = tms_control_panel;
  const { order_info = {}, vendor_info = {}, shop_info = {} } = shipment_detail;
  // 关闭类型
  const closed_type = reasons[shipment_detail.closed_type];
  // 服务商名字
  const vendor_name = window.currentAppVendorInfo.name;
  // 骑士
  const courier = shipment_detail.courier || {};
  let [shipping_time, created_at] = ['', ''];

  if (shipment_detail.created_at && shipment_detail.created_at.length !== 0) {
    const _date1 = utcToDate(shipment_detail.created_at);
    _date1.time.length = 2;
    created_at = `${_date1.date.join('-')}  ${_date1.time.join(':')}`;
    shipping_time = `${numberDateToStr(shipment_detail.plan_shipping_date)}  ${shipment_detail.plan_shipping_time}`;
  }
  const _local_calc_fee_vendor = (shipment_detail.shipping_fee_vendor + shipment_detail.tip_fee_vendor) / 100;
  const _local_calc_fee_courier = (shipment_detail.shipping_fee_courier + shipment_detail.tip_fee_courier) / 100;
  let data = shipment_log.data;

  if (data) {
    data = data.reverse();
  }
// 商家姓名
  let _seller_name = '';

  if (shipment_detail.seller) {
    _seller_name = shipment_detail.seller.name
  }
  // 关闭运单
  function handleConfirm() {
    const { id, error_note, error_flag } = shipment_detail;
    dispatch({
      type: CONTROL_PANEL.shipments.close, //关闭运单
      payload: {
        close: {
          shipment_ids: [id],
          closed_note: error_note, closed_type: error_flag,
        },
        id,
      },
    });
  }
// 表格的列
  const columns = [
    {
      title: '运单跟踪记录',
      dataIndex: 'event_state',
      key: 'event_state',
      render: (text, record) => {
        return stateTransform('event_name', record.event)
      },
    },
    {
      title: '操作',
      dataIndex: 'event',
      key: 'event',
      render: (text) => {
        return stateTransform('state_operation', text)
      },
    }, {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text, record) => {
        const _result = utcToDate(text);
        _result.time.length = 2;
        return `${_result.date.join('-')}  ${_result.time.join(':')}`;
      },
    }, {
      title: '操作人(手机号)',
      dataIndex: 'operator',
      key: 'operator',
      render: (text, record) => {
        if (record.event === 'created') {
          return `${shipment_detail.consignor_name}(${shipment_detail.consignee_mobile})` || `(${shipment_detail.consignor.tel})`;
        }
        if (record.event === 'confirmed' && (record.operator_info === '' || record.operator_info === undefined)) {
          return '系统自动操作';
        }
        if (record.operator_info) {
          return `${record.operator_info.name}(${record.operator_info.mobile})`;
        }
        if (record.courier_info) {
          return `${record.courier_info.name}(${record.courier_info.mobile})`;
        }
      },
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    },
  ];
// 布局配置参数
  const itemLayout = { '4_18': { labelCol: { span: 4 }, wrapperCol: { span: 18 } } };

  let text = '';
  if (shipment_detail.error_flag == 1) {
    text = '当前由于商家原因异常关闭订单，将正常收取商家配送费，是否确认关闭该订单?'
  } else if (shipment_detail.error_flag == 2) {
    text = '当前由于骑士原因异常关闭订单，将不收取商家配送费，是否确认关闭该订单？'
  }

 // 关闭订单的弹出框
  function showConfirm() {
    confirm({
      title: '您是否确认要关闭该订单',
      content: text,
      onOk() {
        handleConfirm();
      },
      onCancel() {},
    });
  }

  return (
    <div className="con-body">
      <div className="bd-header">
        <Form horizontal className="main-form">
          <h3 className="form-divider-header" style={{ margin: '0px' }}>订单基本信息</h3>
          <Row type="flex" justify="center">
            <Col sm={10}>
              <FormItem label="订单编号" {...itemLayout['4_18']}>
                {shipment_detail.org_order_id}
              </FormItem>
              <FormItem label="商家名称" {...itemLayout['4_18']}>
                {_seller_name}
              </FormItem>
              <FormItem label="商品类型" {...itemLayout['4_18']}>
                {stateTransform('seller_type', shipment_detail.seller_type)}
              </FormItem>
              <FormItem label="商家电话" {...itemLayout['4_18']}>
                {shipment_detail.consignor_mobile || shipment_detail.consignor_tel }
              </FormItem>
              <FormItem label="店铺地址" {...itemLayout['4_18']}>
                {shipment_detail.consignor_address} {shipment_detail.consignor_address_detail}
              </FormItem>
              <FormItem label="配送距离" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_distance}km
              </FormItem>
              <FormItem label="订单备注" {...itemLayout['4_18']}>
                {shipment_detail.delivery_note}
              </FormItem>
              <FormItem label="订单金额" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_o3_order_amount}元
              </FormItem>
              <FormItem label="服务商佣金" {...itemLayout['4_18']}>
                {_local_calc_fee_vendor}元
              </FormItem>
              <FormItem label="关闭原因" {...itemLayout['4_18']}>
                {shipment_detail.closed_note}
              </FormItem>
              <FormItem label="小费" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_tip_fee}元
              </FormItem>
            </Col>
            <Col sm={10}>
              <FormItem label="条形码" {...itemLayout['4_18']}>
                {shipment_detail.barcode}
              </FormItem>
              <FormItem label="期望送达" {...itemLayout['4_18']}>
                {shipping_time}
              </FormItem>
              <FormItem label="下单时间" {...itemLayout['4_18']}>
                {created_at}
              </FormItem>
              <FormItem label="顾客姓名" {...itemLayout['4_18']}>
                {shipment_detail.consignee_name}
              </FormItem>
              <FormItem label="顾客电话" {...itemLayout['4_18']}>
                {shipment_detail.consignee_mobile || shipment_detail.consignee_tel}
              </FormItem>
              <FormItem label="顾客地址" {...itemLayout['4_18']}>
                {shipment_detail.consignor_address}
              </FormItem>
              <FormItem label="物流商" {...itemLayout['4_18']}>
                {vendor_name}
              </FormItem>
              <FormItem label="所属区域" {...itemLayout['4_18']}>
                {shipment_area.name}
              </FormItem>
              <FormItem label="配送费" {...itemLayout['4_18']}>
                {shipment_detail.local_calc_shipping_fee} 元
              </FormItem>
              <FormItem label="结算方式" {...itemLayout['4_18']}>
                {stateTransform('pay_type', shipment_detail.pay_type)}
              </FormItem>
              <FormItem label="骑士提成" {...itemLayout['4_18']}>
                {_local_calc_fee_courier} 元
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="bd-content">
        <Form horizontal className="main-form">
          <h3 className="form-divider-header" style={{ margin: '0px' }}>物流追踪</h3>
          <Row type="flex" justify="center">
            <Col sm={22}>
              <Col sm={6}>运单号:{shipment_detail.id}</Col>
              <Col sm={5}>配送区域：{shipment_area.name} </Col>
              <Col sm={5}>骑士：{courier.name}</Col>
              <Col sm={6}>联系电话：{courier.mobile}</Col>
            </Col>
          </Row>
          <br />
          <Row type="flex" justify="center">
            <Col sm={22}>
              <Table
                columns={columns}
                dataSource={data}
              />
            </Col>
          </Row>

          <Row type="flex" justify="center" align="top" style={{ marginTop: '15px' }}>
            <Button ><Link to="/tms/control_panel">返回</Link></Button>
            {shipment_detail.delivery_state !== -50
              ? ''
              : <Button type="primary" onClick={showConfirm} style={{ marginLeft: '15px' }}>关闭</Button>
            }
          </Row>
        </Form>
      </div>
    </div>
  );
};
/*
 {shipment_detail.delivery_state !== -50
 ? ''
 : <Col sm={5}><Popconfirm placement="topRight" title={text} onConfirm={handleConfirm}> <Button>关闭</Button> </Popconfirm></Col>
 }

 */
function mapStateToProps({ tms_control_panel }) {
  return { tms_control_panel };
}

module.exports = connect(mapStateToProps)(View);
