import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, Select, Checkbox, DatePicker, Alert } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { EMPLOYEE } from '../../../ActionsName.js';
import style from '../style/team.less';
const [FormItem,
  RadioGroup,
  Option] = [Form.Item, Radio.Group, Select.Option];

class MainForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      cityList: [],
      r1: false,
      r2: false,
      r3: false,
      r4: false,
      r5: false,
      r6: false
    };
  }

  handleCheck = (val) => {
    let _state = {};
    _state[val.name] = val.state;
    this.setState(_state);
  }

  componentWillReceiveProps = (nextProps) => {
    const { cityList } = nextProps.cityList;
    this.setState({
      cityList: cityList,
    })
  }

  handleSubmit = (e) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();
        values.type = 1;
        values.hired_date = values.hired_date ? values.hired_date.replace(/-/g, '') : '';
        values.org_id = window.currentAppAccountInfo.vendor_id;
        //移除多余字段
        let n = 6;
        while (n) {
          delete values[`role_${n}`];
          n--;
        }
        ;
        dispatch({
          type: EMPLOYEE.creates,
          payload: values
        })
      }
      ;
    });
  }

  render() {
    const { form } = this.props;
    const { areaList } = this.props.areaList;
    const cityList = this.state.cityList || [];
    const areas = areaList ? areaList.data : [];
    const { getFieldProps } = form;
    const { handleCheck, handleSubmit } = this;
    const { r1, r2, r3, r4, r5, r6 } = this.state;
    return (
      <Form horizontal onSubmit={handleSubmit}>
        <div className="bd-header">
          <div className="form-divider-header">
            <div className={style.teamLeftBorder}>基本信息</div>
          </div>
          <Row>
            <Col sm={12}>
              <FormItem label="姓名"  {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
                <Input placeholder="请输入员工姓名" {...getFieldProps("name", {
                  validate: [
                    { rules: [{ required: true, message: '请输入员工姓名' },], trigger: 'onBlur', }
                  ]
                })}/>
              </FormItem>

              <FormItem label="手机号" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
                <Input placeholder="请输入员工手机号" {...getFieldProps("mobile", {
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

              <FormItem label="入职时间" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
                <DatePicker {...getFieldProps(
                  "hired_date",
                  {
                    getValueFromEvent: (date, dateString) => dateString,
                    validate: [
                      { rules: [{ required: true, message: '请输入入职时间' },], trigger: 'onChange', }
                    ]
                  }
                )} />
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="城市"  {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请输入城市"
                  {...getFieldProps("city_code", {
                    validate: [
                      { rules: [{ required: true, message: '请输入城市' },], trigger: 'onBlur', }
                    ]
                  })}>
                  {
                    cityList.map(function (item, index) {
                      return (

                        <Option value={item.city_code} key={item.city_code}>{item.city_name}</Option>
                      )
                    })
                  }
                </Select>
              </FormItem>
              <FormItem label="身份证号" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
                <Input placeholder="请输入员工身份证号" {...getFieldProps("id_card_sn", {
                  rules: [
                    {
                      required: true,
                      trigger: 'onBlur',
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback('请填写员工身份证号');
                          return;
                        }
                        ;
                        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
                          callback('请输入正确的身份证号');
                          return;
                        }
                        callback();
                      },
                    }
                  ],
                })} />
              </FormItem>

              <FormItem label="性别" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
                <RadioGroup {...getFieldProps("sex", { initialValue: 1 })} >

                  <Radio key="sex0" value={1}>男</Radio>

                  <Radio key="sex1" value={2}>女</Radio>

                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem label="员工状态" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
                <RadioGroup {...getFieldProps("state", { initialValue: 100 })} >

                  <Radio key="state_0" value={100}>在职</Radio>

                  <Radio key="state_1" value={-100}>离职</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="员工类型" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
                <RadioGroup {...getFieldProps("work_type", { initialValue: 10 })} >

                  <Radio key="state_02" value={10}>全职</Radio>

                  <Radio key="state_12" value={20}>兼职</Radio>

                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        {/*<div className="bd-content" style={{ marginLeft: 0, marginRight: 0 }}>
         <div className="form-divider-header">
         <div className={style.teamLeftBorder}>岗位信息</div>
         </div>
         <div className={style.teamStyle}>
         <Alert message="提示:&nbsp;每个员工需分配一个岗位" type="warning" showIcon/>
         </div>
         <Row>
         <Col sm={3}>
         <FormItem label="岗位" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 15 } }}></FormItem>
         </Col>
         <Col sm={12}>
         <div className={style.jobInformations}>
         <FormItem {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox
         {...getFieldProps(
         "role_1",
         {
         valuePropName: 'checked',
         initialValue: r1,
         onChange: (e) => {
         handleCheck({ name: 'r1', state: e.target.checked })
         }
         }
         )}
         >超级管理员</Checkbox>
         {
         r1
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role1_areas")}
         className={style.teamInlineBlock}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }

         </FormItem>

         <FormItem label="" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox
         {...getFieldProps(
         "role_2",
         {
         valuePropName: 'checked',
         initialValue: r2,
         onChange: (e) => {
         handleCheck({ name: 'r2', state: e.target.checked })
         }
         }
         )}>总负责人</Checkbox>
         {
         r2
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role_2_areas")}
         className={style.teamInlineBlock}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }
         </FormItem>
         <FormItem label="" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox {...getFieldProps(
         "role_3",
         {
         valuePropName: 'checked',
         initialValue: r3,
         onChange: (e) => {
         handleCheck({ name: 'r3', state: e.target.checked })
         }
         }
         )}>
         中心调度负责人
         </Checkbox>
         {
         r3
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role_3_areas")}
         className={style.teamInlineBlock}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }
         </FormItem>
         <FormItem label="" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox {...getFieldProps(
         "role_4",
         {
         valuePropName: 'checked',
         initialValue: r4,
         onChange: (e) => {
         handleCheck({ name: 'r4', state: e.target.checked })
         }
         }
         )}>
         加盟负责人
         </Checkbox>
         {
         r4
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role_4_areas")}
         className={style.teamInlineBlock}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }
         </FormItem>
         <FormItem label="" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox {...getFieldProps(
         "role_5",
         {
         valuePropName: 'checked',
         initialValue: r5,
         onChange: (e) => {
         handleCheck({ name: 'r5', state: e.target.checked })
         }
         }
         )}>
         区域调度负责人
         </Checkbox>
         {
         r5
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role_5_areas")}
         className={style.teamInlineBlock}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }
         </FormItem>
         <FormItem label="" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 15 } }}>
         <Checkbox {...getFieldProps(
         "role_6",
         {
         valuePropName: 'checked',
         initialValue: r6,
         onChange: (e) => {
         handleCheck({ name: 'r6', state: e.target.checked })
         }
         }
         )}>
         总财务
         </Checkbox>
         {
         r6
         ?
         (<Row>
         <Col sm={5}>
         <p>分配负责区域:</p>
         </Col>
         <Col sm={12}>
         <Select multiple style={{ width: '100%' }} {...getFieldProps("role_5_areas")}>
         {areas.map((item, index) => {
         return (<Option key={"area_id" + index} value={ item.id }>{ item.name } </Option>)
         })}
         </Select>
         </Col>
         </Row>)
         :
         null
         }
         </FormItem>
         </div>
         </Col>
         <Col sm={9}>
         <div className={style.jobInformation}>
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
         </div>*/}
        <div style={{ height: '16px' }}></div>
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/employee/list">返回</Link></Button>
          </Col>
          <Col sm={5}>
            <Button style={{
              width: '100px', backgroundColor: 'rgb(88,226,194)',
              borderColor: 'rgb(88,226,194)', color: '#fff'
            }} htmlType="submit">确定</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
;

MainForm = Form.create()(MainForm);
let View = ({ business_employee, dispatch }) => {
  const formProps = {
    dispatch,
    areaList: business_employee.areaList,
    cityList: business_employee.cityList,
  };
  return (
    <div className="con-body">
      <div className="con-header">
        <MainForm {...formProps} />
      </div>
    </div>
  );
};

function mapStateToProps({ business_employee }) {
  return { business_employee };
};

module.exports = connect(mapStateToProps)(View);
