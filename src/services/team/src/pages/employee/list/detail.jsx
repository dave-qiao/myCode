import React, {Component, PropTypes} from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, DatePicker, Alert} from 'antd';
import {connect} from 'dva';
import {Link} from 'dva/router';
import style from '../style/team.less';
import { stateTransform } from '../../../../../../utils/newUtils.js'
const [FormItem] = [Form.Item];
const {utcToDate, dateFormat, numberDateToStr} = window.tempAppTool;

let View = ({business_employee, dispatch}) => {
  const {list_details} = business_employee;
  let _create_at = '';
  if (list_details.created_at) {
    const _date = utcToDate(list_details.created_at);
    _date.time.length = 2;
    _create_at = `${_date.date.join('-')}  ${_date.time.join(':')}`;
  }
  ;


  let hired_date = list_details.hired_date ? (list_details.hired_date + '') : '1900-09-09';
  if (list_details.hired_date) {
    hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
  }
  ;
  return (
    <div className="con-body">
      <div className="bd-header">
        <Form horizontal className="ant-form ant-form-horizontal main-form">
          <div className={style.teamLeftBorder}>基本信息</div>
          <div className={style.borderBottom}></div>
          <Row>
            <Col sm={12}>
              <FormItem label="姓名" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                {list_details.name}
              </FormItem>

              <FormItem label="手机号" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                {list_details.mobile}
              </FormItem>

              <FormItem label="入职时间" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                {hired_date}
              </FormItem>
              <FormItem label="创建时间" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                {_create_at}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="性别" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                {stateTransform('sex', list_details.sex)}
              </FormItem>

              <FormItem label="身份证号" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                {list_details.id_card_sn}
              </FormItem>

              <FormItem label="员工状态" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                {stateTransform('work_state', list_details.state)}
              </FormItem>
              <FormItem label="员工类型" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                {stateTransform('work_type', list_details.work_type)}
              </FormItem>
              {/*<FormItem label="创建人" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>*/}
              {/*{stateTransform('work_state',list_details.state)}*/}
              {/*</FormItem>*/}
            </Col>
          </Row>
        </Form>
      </div>
      <div className="bd-content">
        <div className="form-divider-header">
          <div className={style.teamLeftBorder}>岗位信息</div>
          <div className={style.borderBottom}></div>
        </div>
        <div className={style.teamStyle}>
          <Alert message="提示:&nbsp;每个员工需分配一个岗位" type="warning" showIcon/>
        </div>
        <Row>
          <Col sm={3}>
            <div className={style.jobInformations}>
              <Form>
                <FormItem label="岗位" {...{"labelCol": {"span":7}, "wrapperCol": {"span": 12}}}>
                  {/*{list_details.org_type}*/} 超级管理员
                </FormItem>
              </Form>
            </div>
          </Col>
          <Col sm={12}></Col>
          <Col sm={9}>
            <div style={{borderLeft: '1px solid #e3e3e3',paddingLeft:'16px'}}>
              <h4>岗位说明:</h4>
              <p>超级管理员:管理总负责人及其所有事务</p>
              <p>总负责人:负责所有站事务管理</p>
              <p>中心调度负责人：负责中心调度所有事务管理</p>
              <p>加盟负责人：负责所有加盟相关事务</p>
              <p>区域调度负责人：负责分配区域所有事务管理</p>
              <p>总财务：负责所有站财务相关事务</p>
            </div>
          </Col>
        </Row>
      </div>
      <div style={{height: 16}}></div>
      <Row type="flex" justify="center" align="top">
        <Col sm={5}>
          <Button ><Link to="/team/employee/list">返回</Link></Button>
        </Col>
      </Row>
    </div>
  );
};
/*
 <h3 className="form-divider-header">岗位信息</h3>
 <Row>
 <Col sm={12}>
 <FormItem label="岗位" {...{"labelCol":{"span":4},"wrapperCol":{"span":15}}}>
 {list_details.role}
 </FormItem>
 </Col>
 </Row>
 */
function mapStateToProps({business_employee }) {
  return {business_employee };
};

module.exports = connect(mapStateToProps)(View);
