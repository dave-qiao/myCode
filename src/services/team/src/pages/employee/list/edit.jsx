import React, {Component, PropTypes} from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, Select, Checkbox, DatePicker} from 'antd';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {EMPLOYEE} from '../../../ActionsName.js';

const [FormItem,
  RadioGroup,
  Option] = [Form.Item, Radio.Group, Select.Option];

const role_RomoteToLocal = {
  "1": "r1",
  "2": "r2",
  "3": "r3",
  "4": "r4",
  "5": "r5",
};
const role_LocalToRomote = {
  "r1": "1",
  "r2": "2",
};
class MainForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      r1: false,
      r2: false,
      r3: false,
      r4: false,
      r5: false,
      r1_areas: [],
      r2_areas: [],
    };
  }

  componentWillReceiveProps = (props) => {
    const details = props.details || {};
    const {roles = [], extra_data = {}} = details;
    let {state} = this;
    try {
      roles.forEach(item => {
        state[`${role_RomoteToLocal[item]}`] = true;
      });
      ['r1', 'r2'].forEach(item => {
        if (state[item]) {
          state[`${item}_areas`] = extra_data[`${role_LocalToRomote[item]}`];
        }
      });
      this.setState(state);
    } catch (e) {

    }
    ;

  }


  handleCheck = (val) => {
    let _state = {};
    _state[val.name] = val.state;
    this.setState(_state);
  }

  handleSubmit = (e) => {
    const {form, dispatch, details} = this.props;
    const {id} = details;
    e.preventDefault();
    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();
        values.user_id = id;
        values.org_id = window.currentAppAccountInfo.vendor_id;
        values.hired_date = values.hired_date ? values.hired_date.replace(/-/g, '') : '';
        values.type = 1;
        //移除多余字段
        let n = 5;
        while (n) {
          delete values[`role_${n}`];
          n--;
        }
        ;
        dispatch({
          type: EMPLOYEE.updates,
          payload: values
        })
      }
      ;
    });


  }

  render() {
    const {getFieldProps} = this.props.form;
    const {details = {}, areas = []} = this.props;
    const {handleCheck, handleSubmit} = this;
    const {r1, r2, r3, r4, r5, r1_areas, r2_areas} = this.state;

    let d = new Date();
    let str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    let hired_date = details.hired_date ? (details.hired_date + '') : str;
    if (details.hired_date) {
      hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
    }
    ;
    return (
      <div>
        <div className="bd-header">

          <Form horizontal onSubmit={handleSubmit} className="main-form">
            <h3 className="form-divider-header" style={{margin:0,width:'99%'}}>基本信息</h3>
            <div style={{height:16}}></div>
            <Row>
              <Col sm={12}>
                <FormItem label="姓名" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                  <Input {...getFieldProps("name", {
                    initialValue: details.name,
                    validate: [
                      {rules: [{required: true, message: '请输入姓名'},], trigger: 'onBlur',}
                    ]
                  })}/>
                </FormItem>

                <FormItem label="手机号" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                  <Input {...getFieldProps("mobile", {
                    initialValue: details.mobile,
                    rules: [
                      {
                        required: true,
                        trigger: 'onBlur',
                        validator: (rule, value, callback) => {
                          if (!value) {
                            callback('请填写手机号');
                            return;
                          }
                          ;
                          if (!(/^1[34578]\d{9}$/.test(value))) {
                            callback('手机格式不对');
                            return;
                          }
                          callback();
                        },
                      }
                    ],
                  })} />
                </FormItem>

                <FormItem label="入职时间" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                  <DatePicker {...getFieldProps(
                    "hired_date",
                    {
                      validate: [
                        {rules: [{required: true, message: '请选择入职时间'},], trigger: 'onBlur',}
                      ],
                      initialValue: hired_date,
                      getValueFromEvent: (date, dateString) => dateString
                    }
                  )} />
                </FormItem>
                <FormItem label="员工类型" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                  <RadioGroup {...getFieldProps("work_type", {initialValue: details.work_type + ''})} >

                    <Radio key="state_0" value="10">全职</Radio>

                    <Radio key="state_1" value="20">兼职</Radio>

                  </RadioGroup>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="性别" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                  <RadioGroup {...getFieldProps("sex", {initialValue: details.sex})} >

                    <Radio key="sex0" value={1}>男</Radio>

                    <Radio key="sex1" value={2}>女</Radio>

                  </RadioGroup>
                </FormItem>

                <FormItem label="身份证号" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                  <Input {...getFieldProps("id_card_sn", {
                    initialValue: details.id_card_sn,
                    rules: [
                      {
                        required: true,
                        trigger: 'onBlur',
                        validator: (rule, value, callback) => {
                          if (!value) {
                            callback('请填写身份证号');
                            return;
                          }
                          ;
                          if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
                            callback('请输入正确的身份证号');
                            return;
                          }
                          callback();
                        },
                      }
                    ],
                  })} />
                </FormItem>

                <FormItem label="员工状态" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 12}}}>
                  <RadioGroup {...getFieldProps("state", {initialValue: details.state + ''})} >

                    <Radio key="state_0" value="100">在职</Radio>

                    <Radio key="state_1" value="-100">离职</Radio>

                  </RadioGroup>
                </FormItem>
              </Col>

            </Row>
            <Row type="flex" justify="center" align="top">
              <Col sm={5}>
                <Button ><Link to="/team/employee/list">返回</Link></Button>
              </Col>
              <Col sm={5}>
                <Button htmlType="submit" style={{
                  textAlign: 'center', width: '100px', backgroundColor: 'rgb(88,226,194)',
                  borderColor: 'rgb(88,226,194)', color: '#fff'
                }}>确定</Button>
              </Col>
            </Row>

          </Form>
        </div>
        <div style={{height:16}}></div>

      </div>
    )
  }
}
;

MainForm = Form.create()(MainForm);


let View = ({business_employee, dispatch }) => {
  const formProps = {
    dispatch,
    details: business_employee.list_details,
  };
  return (
    <div className="con-body">
      <MainForm {...formProps}/>
    </div>
  );
};

function mapStateToProps({business_employee }) {
  return {business_employee };
};

module.exports = connect(mapStateToProps)(View);
