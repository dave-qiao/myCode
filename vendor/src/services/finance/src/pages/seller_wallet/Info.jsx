import React, {Component, PropTypes} from 'react';
import { Form, Row, Button,Popover, Col, Icon} from 'antd';
import { Link } from 'dva/router';

const [FormItem] = [Form.Item];

const Info = Form.create()(({form, details}) => {
  const { getFieldProps, getFieldsValue } = form;
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  };

  const text = <span>收入来源</span>;
  const content = (
    <div style={{width:'120px',overflow:"hidden"}}>
         钱包收入来源为商家发单使用账户余额支付的金额，金额大于500.0元可
         申请提现，平台审核通过将会在3-4个工作日之内与您进行线下结算。
    </div>
  );
  return (
    <Form inline onSubmit={handleSubmit} className="main-form">
      <h3 className="form-divider-header">我的钱包</h3>
      <Row type="flex" justify="center">
        <Col sm={4} className="finance-img" >

        </Col>

        <Col sm={7}  className="vertical-style">
          <h2 style={{paddingLeft:'6px'}}>账户余额（元)</h2>
          <span className="font-size-30">￥{details.calc_balance || 0}</span><br/>
          {
            // <p className="ant-form-text theme-color">  <a href="#" className="theme-color">交易明细</a> <Icon type="right" className="font-size-style" /> </p>
          }
        </Col>
        <Col sm={5} >
          <h4>锁定金额（元）</h4>
          <span className="font-size-24">￥{details.calc_frozen_balance || 0}</span>
          <h4>可提现余额（元）</h4>
          <span className="font-size-24">￥{details.calc_withdraw_balance || 0}</span>
        </Col>


      </Row>
    </Form>
  );
});

module.exports =  Info;
