import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Icon, Row, Col, Select, message } from 'antd';
import { Link } from 'dva/router';
import ActionsName, {REGISTER} from '../../ActionsName';
import {connect} from 'dva';
const [FormItem, Option, InputGroup] = [Form.Item,Select.Option, Input.Group];
const ItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const FormStyle = {
  width: '400px',
  position: 'absolute',
  padding: '40px 30px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: 'rgba(3,3,3,0.4)'
};

const cities = window.appGlobalInfos.city;

class View extends Component {
  constructor(props) {
    super();
    const {dispatch} = props;
    this.state = {
      stopSms: false,
    };
    const {getFieldsValue,getFieldProps} = props.form;
    Object.assign(this,{dispatch,getFieldsValue,getFieldProps});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this;
    const {validateFieldsAndScroll, getFieldsValue} = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      };
      values.city_name = cities.data[cities.index.indexOf(values.city_code)].name;
      dispatch({
        type: REGISTER.submit,
        payload: values
      });
    });
  }

  getVcode = (e) => {
    const {dispatch, setState} = this;
    const {getFieldsValue,validateFields} = this.props.form;
     validateFields(['mobile'],{ force: true },(err,value) => {
      if (err) {
        return ;
      } else {
        const values = getFieldsValue();
        dispatch({ type: REGISTER.ssm, payload: values });

      };

    });
  }



  render() {
    const { getFieldProps } = this;
    const {stopSms} = this.state;
    const {verify_msg} = this.props;
    const itemProps = {
      name: getFieldProps('name', {
        rules: [
          {
            required: true,
            max: 30,
            message: '请填写商户名称, 且长度不能超过30个字符',
          },
        ],
      }),
      mobile: getFieldProps('mobile', {
        rules: [
          {
            required: true,
            trigger: 'onBlur',
            validator: (rule, value, callback) => {
              if(!value) {
                callback('请填写手机号');
                return ;
              };
              if (!(/^1[34578]\d{9}$/.test(value))) {
                callback('手机格式不对');
                return ;
              }
              callback();
            },
          }
        ],
      }),
      verify_code: getFieldProps('verify_code', {
        rules: [
          { required: true, message: '请填验证码' },
        ],
      }),
      city_code: getFieldProps('city_code', {
        rules: [
          { required: true, message: '请选择城市' },
        ],
      }),
      legal_name: getFieldProps('legal_name', {
        rules: [
          {
            required: true,
            max: 10,
            message: '请填法人姓名, 且长度不能超过10个字符',
          },
        ],
      }),
    }

    return (
      <div className="login-container">
      <Form horizontal  onSubmit={this.handleSubmit} >
        <h2 > 用户注册 </h2>
        <FormItem label='手机号' {...ItemLayout} >
          <Input {...itemProps.mobile} placeholder="请填写手机号" />
        </FormItem>
        <FormItem label='城市' {...ItemLayout} >
          <Select showSearch {...itemProps.city_code} placeholder="请选择城市" optionFilterProp="children" notFoundContent="无法找到" >
            {cities.data.map( (item, index) => {
              return (<Option key={index} value={item._id}>{item.name}</Option>);
            })}
          </Select>
        </FormItem>
        <FormItem label='商户名称'  {...ItemLayout} >
            <Input {...itemProps.name} placeholder="请填写商户名称" />
        </FormItem>
        <FormItem label='法人姓名' {...ItemLayout} >
            <Input {...itemProps.legal_name} placeholder="请填写法人姓名" />
        </FormItem>
        <FormItem label='验证码' {...ItemLayout} >
          <InputGroup>
            <Col span="14">
              <Input {...itemProps.verify_code} placeholder="请填写验证码" />
            </Col>
            <Col span="10">
              <Button  id="verify_button" onClick={this.getVcode} disabled={stopSms ? 'disabled' : ''}>验证码</Button>
            </Col>
          </InputGroup>
        </FormItem>
        <Button type="primary" htmlType="submit">申请注册</Button>
        <Button className="other"><Link to='/login'>已有账号？点此登录</Link></Button>
      </Form>
      </div>
    );
  }

}


View = Form.create()(View);

function mapStateToProps({sys_register}) {
  return {sys_register};
};

module.exports =  connect(mapStateToProps)(View);
