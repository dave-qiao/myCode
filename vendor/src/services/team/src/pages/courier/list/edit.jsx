import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Row, Col, Radio, Select, Upload, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { COURIER } from '../../../ActionsName.js';

const [FormItem,
  RadioGroup,
  Option] = [Form.Item, Radio.Group, Select.Option];


class MainForm extends React.Component {

  constructor(props) {
    super()
    this.state = {
      initTeamList: [],
      teams_info: [],
      teamList: {
        _meta: {},
        data: [],
      }
    }
    this.form = props.form;
    let { city_code, city_name } = window.currentAppVendorInfo;
    const { vendor_id } = window.currentAppAccountInfo;
    if (typeof city_name === 'undefined' || city_name === '') {
      try {
        city_name = citesDict.data[citesDict.index.indexOf(city_code)].name;
      } catch (e) {
        city_name = '';
        const _len = citesDict.data;
        for (let i = 0; i < _len; i++) {
          if (citesDict.data[i]._id === city_code) {
            city_name = citesDict.data[i].name;
          }
          ;
        }
        ;
      } finally {
        if (city_name.length === 0) {
          console.error('该城市无法找到，默认北京市');
          city_name = '北京市';
        }
        ;
      }
      ;
      window.currentAppVendorInfo.city_name = city_name;
    }
    ;
  }


  componentWillReceiveProps = (nextProps) => {
    const { details, getCourierDetail, teamList } = nextProps;
    const { courier_detail } = details;
    const { teams_info } = getCourierDetail;
    const initTeamList = [];
    if (teams_info) {
      for (var i = 0; i < teams_info.length; i++) {
        initTeamList.push(teams_info[i].id);
      }
      this.setState({
        initTeamList: initTeamList,
        teams_info: teams_info,
      })
    }
    this.setState({
      teamList: teamList,
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this;
    const { didSubmit, details } = this.props;
    const { account_detail, courier_detail } = details;

    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();
        const { city_code } = account_detail;
        const { id, area_id } = courier_detail;
        values.hired_date = values.hired_date.replace(/-/g, '');
        didSubmit({ ...values, courier_id: id, city_code });
      }
      ;
    });
  }

  getUploadStyle = (path) => {
    const _path = path || '/assets/none.png';
    return {
      style: {
        width: '230px',
        height: '100px',
        backgroundImage: `url(${_path})`,
      }
    };
  }

  render() {
    const { getFieldProps, validateFields, getFieldsValue } = this.form;
    const { details, areas, handleUpload } = this.props;
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: '/upload.do',
    };
    const { account_detail, courier_detail } = details;
    const { handleSubmit, getUploadStyle } = this;
    const initTeamList = this.state.initTeamList;
    const teams_info = this.state.teams_info;
    const teamList = this.state.teamList;
    let hired_date = account_detail.hired_date ? (account_detail.hired_date + '') : '1900-09-09';
    if (account_detail.hired_date) {
      hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
    }
    ;

    return (
      <Form horizontal onSubmit={handleSubmit} className="main-form">

        <h3 className="form-divider-header" style={{ width: '99%', margin: 0 }}>基本信息</h3>
        <div style={{ height: 16 }}></div>
        <Row>
          <Col sm={12}>
            <FormItem label="姓名" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
              <Input {...getFieldProps("name", {
                initialValue: courier_detail.name,
                validate: [
                  { rules: [{ required: true, message: '请输入姓名' },], trigger: 'onBlur', }
                ]
              })}/>
            </FormItem>

            <FormItem label="手机号" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 8 } }}>
              <Input {...getFieldProps("mobile", {
                initialValue: courier_detail.mobile,
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
              <DatePicker {...getFieldProps("hired_date", {
                getValueFromEvent: (date, dateString) => dateString,
                initialValue: hired_date,
                validate: [
                  { rules: [{ required: true, message: '请选择入职时间' },], trigger: 'onBlur', }
                ]
              })} />
            </FormItem>
            <FormItem label="员工类型" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
              <RadioGroup {...getFieldProps("work_type", { initialValue: courier_detail.work_type })} >
                <Radio value={10}>全职</Radio>
                <Radio value={20}>兼职</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="所属团队" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
              <Select
                multiple
                {...getFieldProps("team_list", {
                  initialValue: initTeamList,
                  validate: [
                    { rules: [{ type: 'array', required: true, message: '请选择所属团队' },], trigger: 'onChange', }
                  ]
                })}>
                {teamList.data.map((item, index) => {
                  return (<Option key={`area_${item.id}`} value={item.id}>{item.name} </Option>)
                })}
              </Select>
            </FormItem>
            <FormItem label="性别" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
              <RadioGroup {...getFieldProps("sex", { initialValue: account_detail.sex })} >
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="在职状态" {...{ "labelCol": { "span": 4 }, "wrapperCol": { "span": 12 } }}>
              <RadioGroup {...getFieldProps("state", { initialValue: account_detail.state })} >
                <Radio value={100}>在职</Radio>
                <Radio value={-100}>离职</Radio>
              </RadioGroup>
            </FormItem>

          </Col>
        </Row>

        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/courier/list">返回</Link></Button>
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
/*
 <Row  type="flex" justify="center">
 <Col sm={16}>
 <FormItem label="身份证号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
 <Input {...getFieldProps("id_card_sn",{
 initialValue: account_detail.id_card_sn,
 rules: [
 {
 required: true,
 trigger: 'onBlur',
 validator: (rule, value, callback) => {
 if(!value) { callback('请填写身份证号'); return ; };
 if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value))) { callback('请输入正确的身份证号'); return ; }
 callback();
 },
 }
 ],
 })} />
 </FormItem>
 </Col>
 </Row>

 */

let View = ({ business_courier, dispatch, business_publics }) => {
  const { getCourierDetail, teamList } = business_courier;
  const FormProps = {
    details: business_courier.list_details,
    areas: business_publics.areas,
    getCourierDetail,
    teamList,
    handleUpload(params) {
      dispatch({
        type: COURIER.upload,
        payload: { ...params }
      });
    },
    didSubmit(values) {
      dispatch({
        type: COURIER.updates,
        payload: values
      });
    }
  }
  return (
    <div className="con-body">
      <div className="bd-content">
        <MainForm {...FormProps}/>
      </div>
    </div>
  );
};

function mapStateToProps({ business_courier, business_publics }) {
  return { business_courier, business_publics };
};

module.exports = connect(mapStateToProps)(View);
