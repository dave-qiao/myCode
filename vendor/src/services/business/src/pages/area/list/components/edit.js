import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const [FormItem, Option, InputGroup] = [Form.Item, Select.Option, Input.Group];

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      parentName: props.parentName,
      parentId: props.parentId,
      cityCode: props.cityCode,
      cityName: props.cityName,
    };
  }

  //监听state变化
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      parentName: nextProps.parentName,
      parentId: nextProps.parentId,
      cityCode: nextProps.cityCode,
      cityName: nextProps.cityName,
    });
  }

  //显示弹窗
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  //隐藏弹窗
  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  //数据提交
  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  //渲染页面模块
  render() {
    const { children, type } = this.props;
    const { getFieldProps } = this.props.form;
    const { parentName, parentId, cityCode, cityName } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        {/* 渲染添加区域弹窗 */}
        <Modal title="添加区域" visible={this.state.visible} onOk={this.okHandler} onCancel={this.hideModelHandler}>
          <Form horizontal className="main-form" onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="城市">
              {cityName}
              <Input type="hidden" {...getFieldProps('cityCode', { initialValue: cityCode })} />
            </FormItem>

            <FormItem {...formItemLayout} label="父区域名称" >
              {
                //判断是否是子区域，如果是子区域则只显示父区域名称
                type === 'subArea' ? parentName
                : <Input placeholder="请输入区域名称" {...getFieldProps('areaName', { initialValue: '' })} />
              }
            </FormItem>

            {
              //判断是否是子区域，如果是子区域则显示
              type === 'subArea' ?
                <FormItem {...formItemLayout} label="子区域名称" >
                  <Input placeholder="请输入子区域名称" {...getFieldProps('areaName', { initialValue: '' })} />
                  <Input type="hidden" {...getFieldProps('parentId', { initialValue: parentId })} />
                </FormItem>
                : ''
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
