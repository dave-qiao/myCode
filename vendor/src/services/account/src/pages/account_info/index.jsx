import React, {Component, PropTypes} from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, Select} from 'antd';
import {connect} from 'dva';
import {ACCOUNT} from '../../ActionsName.js';

const [FormItem, ] = [Form.Item];
const {stateTransform,numberDateToStr,utcToDate} = window.tempAppTool;

let View = ({account_account,dispatch}) => {
  const {details} = account_account;
  const [ sex, work_state ] = [
    stateTransform('sex',details.sex),
    stateTransform('work_state',details.state),
  ];
  const vendor_no = window.currentAppVendorInfo.vendor_no;
  const vendor_name = window.currentAppVendorInfo.name;
  let hired_date = '';
  if (details.id) {
    hired_date = details.hired_date === 0 ? '' : numberDateToStr(details.hired_date);
  };

  return (
    <div className="con-body">
      <div className="bd-content">
        <Form horizontal className="main-form">
          <h3 className="form-divider-header" style={{width:'99%',margin:0}}>基本信息</h3>
          <Row type="flex" justify="center" align="top">
            <Col sm={10}>
                <FormItem label="工号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                  {details.code}
                </FormItem>

                <FormItem label="姓名" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                  {details.name}
                </FormItem>

                <FormItem label="性别" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                    {sex}
                </FormItem>


                <FormItem label="身份证号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                    {details.id_card_sn}
                </FormItem>
                <FormItem label="员工状态" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                    {work_state}
                </FormItem>

            </Col>
            <Col sm={10}>

                <FormItem label="服务商号" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                    {vendor_no}
                </FormItem>
                <FormItem label="所属服务商" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                    {vendor_name}
                </FormItem>
                <FormItem label="手机号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                  {details.mobile}
                </FormItem>
                <FormItem label="入职时间" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                  {hired_date}
                </FormItem>

            </Col>

          </Row>

        </Form>
      </div>
    </div>
  );
};
/*
<h3 className="form-divider-header">基本信息</h3>
<Row type="flex" justify="center" align="top">
  <Col sm={10}>
      <FormItem label="岗位" {...{"labelCol":{"span":4},"wrapperCol":{"span":15}}}>
        {details.role}
      </FormItem>
  </Col>
  <Col sm={10}></Col>
</Row>

*/
function mapStateToProps({account_account}) {
  return {account_account};
};

module.exports =  connect(mapStateToProps)(View);
