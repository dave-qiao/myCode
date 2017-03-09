import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Row, Col, Radio, Select, DatePicker} from 'antd';
import {connect} from 'dva';
import { Link } from 'dva/router';
import {COURIER} from '../../../ActionsName.js';
import data from '../../../../../../assets/citys/city.json';


const city=data.data;
const [FormItem,
  RadioGroup,
  Option] = [Form.Item, Radio.Group, Select.Option];

class MainForm extends React.Component {

  constructor(props) {
    super();
    this.accountInfo = window.currentAppAccountInfo;
    this.userInfo = window.currentAppUserInfo;
  }

  // 城市更改 获取不同城市下的团队列表
  onCityChange = (value) => {
    const { dispatch } = this.props;
    const city_code = value;
    const { vendor_id } = this.accountInfo;
    dispatch({
      type: 'business_courier/getTeam',
      payload: { vendor_id, city_code },
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {didSubmit,form} = this.props;
    const {city_code, name} = this.userInfo;
    let {vendor_id, account_id} = this.accountInfo;
    let created_by = account_id;
    form.validateFields((err,value) => {
      if (err) {
        return ;
      } else {
        let values = form.getFieldsValue();
        values.hired_date = values.hired_date.replace(/-/g,'');
        didSubmit({
          ...values,
          vendor_id,
          created_by,
        });
      };
    });



  };

  render() {
    const {getFieldProps, validateFields, getFieldsValue} = this.props.form;
    const { areas, teamList, serviceCityList } = this.props;
    const {handleSubmit} = this;
    return (
      <Form horizontal onSubmit={handleSubmit} className="main-form">

        <h3 className="form-divider-header" style={{width:'99%',margin:'0 0 16px 0 '}}>基本信息</h3>

        <Row>
          <Col sm={12}>
            <FormItem label="城市" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              <Select
                showSearch
                placeholder="请选择城市"
                optionFilterProp="children"
                onSelect={this.onCityChange}
                {...getFieldProps("city_code",{
                  validate: [
                    { rules: [ { required: true, message: '请选择城市'}, ], trigger: 'onBlur', }
                  ]
                })}
              >
                {
                  serviceCityList.map(function (item, index) {
                    return (
                      <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
                    )
                  })
                }
              </Select>
            </FormItem>
              <FormItem label="姓名" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                <Input placeholder="请输入骑士姓名"  {...getFieldProps("name",{
                  validate: [
                    { rules: [ { required: true, message: '请输入骑士姓名'}, ], trigger: 'onBlur', }
                  ]
                })}/>
              </FormItem>
              <FormItem label="手机号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                <Input placeholder="请输入骑士手机号" {...getFieldProps("mobile",{
                  rules: [
                    {
                      required: true,
                      trigger: 'onBlur',
                      validator: (rule, value, callback) => {
                        if(!value) { callback('请输入骑士手机号'); return ; };
                        if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return ; }
                        callback();
                      },
                    }
                  ],
                })} />
              </FormItem>

              <FormItem label="入职时间" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                <DatePicker {...getFieldProps("hired_date",{
                  getValueFromEvent:(date, dateString) => dateString,
                  validate: [
                    { rules: [ { required: true, message: '请选择入职时间'}, ], trigger: 'onBlur', }
                  ]
                })} />
              </FormItem>
          </Col>
          <Col sm={12}>
            {/*更改  将区域数据改为团队数据*/}
              <FormItem label="所属团队" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                  <Select placeholder="请选择骑士隶属团队" multiple {...getFieldProps("team_list",{
                    validate: [
                      { rules: [{ required: true, message: '请选择骑士隶属团队',type:'array'}] }
                    ]
                  })}>
                    {teamList.data.map( (item, index) => {
                      return (<Option key={`area_${item.id}`} value={item.id}>{item.name} </Option>)
                    })}
                  </Select>
              </FormItem>

              <FormItem label="性别" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                <RadioGroup {...getFieldProps("sex",{
                  initialValue: 1,
                })} >

                  <Radio value={1}>男</Radio>

                  <Radio value={2}>女</Radio>

                </RadioGroup>
              </FormItem>
              <FormItem label="员工状态" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                <RadioGroup {...getFieldProps("state",{
                  initialValue: 100,
                })} >

                  <Radio value={100}>在职</Radio>

                  <Radio value={-100}>离职</Radio>

                </RadioGroup>
              </FormItem>
            <FormItem label="员工类型" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
              <RadioGroup {...getFieldProps("work_type",{
                initialValue: 10,
              })} >

                <Radio value={10}>全职</Radio>

                <Radio value={20}>兼职</Radio>

              </RadioGroup>
            </FormItem>

          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/courier/list">返回</Link></Button>
          </Col>
          <Col sm={5}>
            <Button style={{width:'100px',backgroundColor:'rgb(88,226,194)',
            borderColor:'rgb(88,226,194)',color:'#fff'}} htmlType="submit">确定</Button>
          </Col>
        </Row>

      </Form>
    )
  }
};

MainForm = Form.create()(MainForm);



let View = ({business_courier, business_publics, dispatch}) => {
  const formProps = {
    didSubmit(values) {
      dispatch({
        type: COURIER.creates,
        payload: values
      });
    },
    areas: business_publics.areas,
    teamList: business_courier.teamList,
    serviceCityList:business_courier.serviceCityList,
    dispatch:dispatch,
  }
  return (
    <div className="con-body">
      <div className="bd-header">
        <MainForm {...formProps}/>
      </div>
    </div>
  );
};

function mapStateToProps({business_courier,business_publics}) {
  return {business_courier,business_publics};
};

module.exports =  connect(mapStateToProps)(View);
