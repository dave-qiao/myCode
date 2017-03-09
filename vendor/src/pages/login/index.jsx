import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Icon, Row, Col, message } from 'antd';
import { Link } from 'dva/router';
import ActionsName, {LOGIN} from '../../ActionsName';
import {connect} from 'dva';
const [FormItem,  InputGroup] = [Form.Item, Input.Group];
const ItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class View extends Component {
  constructor(props) {
    super();
    const {dispatch} = props;
    const {getFieldsValue,getFieldProps} = props.form;
    Object.assign(this,{dispatch,getFieldsValue,getFieldProps});

    this.state = {
      stopSms: false,
    };
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this;
    const {validateFieldsAndScroll, getFieldsValue} = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      };
      dispatch({
        type: LOGIN.submit,
        payload: values
      })
    });

  }


  getVcode = (e) => {
    message.config({
      duration: 3,
    });
    const {dispatch, setState} = this;
    const {getFieldsValue,validateFields} = this.props.form;

     validateFields(['mobile','vendor_code'],{ force: true },(err,value) => {
      if (err) {
        return ;
      } else {
        const {vendor_code, mobile} = getFieldsValue();
        dispatch({ type: LOGIN.ssm, payload: { mobile, code: vendor_code } });
      };
    });
  }

  render() {
    const { getFieldProps } = this;
    const {stopSms} = this.state;
    const {sys_login} = this.props;
    const itemProps = {
      vendor_code: getFieldProps('vendor_code', {
        rules: [ { required: true, trigger: 'onBlur', message: '请填写商户号'}, ],
      }),
      mobile: getFieldProps('mobile', {
        rules: [
          {
            required: true,
            trigger: 'onBlur',
            validator: (rule, value, callback) => {
              if(!value) { callback('请填写手机号'); return ; };
              if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return ; }
              callback();
            },
          }
        ],
      }),
      verify_code: getFieldProps('verify_code', {
        rules: [ { required: true, trigger: 'onBlur', message: '请填验证码'}, ],
      }),
    }

    return (
      <div className="login-container">
      <Form horizontal onSubmit={this.handleSubmit}>
        <h3 style={{textAlign:'right'}}><a href="https://console.aoaosong.com/seller/#">我是商家?</a></h3>
        <h2 >  服务商登录 </h2>
        <FormItem label='商户号' {...ItemLayout} >
            <Input {...itemProps.vendor_code} placeholder="请填写商户号" />
        </FormItem>
        <FormItem label='手机号' {...ItemLayout} >
          <Input {...itemProps.mobile} placeholder="请填写手机号" />
        </FormItem>
        <FormItem label='验证码' {...ItemLayout} required={true}>
          <InputGroup>
            <Col span="14">
              <Input {...itemProps.verify_code} placeholder="请填写验证码" />
            </Col>
            <Col span="10">
              <Button  id="verify_button" onClick={this.getVcode} disabled={stopSms ? 'disabled' : ''}>验证码</Button>
            </Col>
          </InputGroup>
        </FormItem>
        <Button type="primary" htmlType="submit">登录</Button>
        <Button className="other"><Link to='/register'>申请注册</Link></Button>
      </Form>
    </div>

    );
  }

}


View = Form.create()(View);

function mapStateToProps({sys_login}) {
  return {sys_login};
};

module.exports =  connect(mapStateToProps)(View);
