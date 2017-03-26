import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, Tabs, Alert, message } from 'antd';
import { connect } from 'dva';
import { SERVICE } from '../../ActionsName';
import ViewForm from './form';
import ViewDetail from './detail';

class View extends Component {
  constructor(props) {
    super();
    //获取服务商的信息
    const { vendor_id } = window.currentAppAccountInfo;
    // 设置当前页面的状态来判断应该进入edit页还是details页
    this.state = {
      curr_status: 'loading',//当前页面的状态
    };
    Object.assign(this, {
      vendor_id,
    });//将服务商的ID放到this变量中
  }
// 改变页面状态的函数
  changeCurrStatus = (status) => {
    this.props.dispatch({ type: SERVICE.switchCase, payload: { status } });
  }
// 启用服务
  didEnabled = () => {
// 从this里面获取信息
    const { vendor_id } = this;
    // 从props里面获取信息
    const { dispatch, business_product_setup } = this.props;
    // 从model获取信息
    const { service_id, detail_state_0 } = business_product_setup;
    // 触发action
    dispatch({ type: SERVICE.enable, payload: { service_id, vendor_id, version_id: detail_state_0.id } });
  }

  didSubmit = ({ actionType, values }) => {
    // 从this里面获取信息
    const { vendor_id } = this;
    // 从props里面获取信息
    const { dispatch, business_product_setup } = this.props;
    // 从model获取details信息
    const { service_id } = business_product_setup;
    // 触发action
    dispatch({ type: SERVICE[actionType], payload: { service_id, vendor_id, ...values } });
  }
// 改变弹出框的状态
  changeVisible = () => {
    // 从props里面获取信息
    const { dispatch, business_product_setup } = this.props;
    // 触发action
    dispatch({ type: SERVICE.changeVisible, payload: { visible: false } });
  }

   // 稍后启用
  laterhandle = () => {
    // 从this里面获取信息
    const { vendor_id } = this;
    // 从props里面获取信息
    const { dispatch, business_product_setup } = this.props;
    // 触发action 改变弹出框的状态
    dispatch({ type: SERVICE.changeVisible, payload: { visible: false } });
    // 触发action 查询服务
    dispatch({ type: SERVICE.find, payload: { vendor_id } });
  }


  render = () => {
    // 从props里面获取信息
    const { business_product_setup, dispatch } = this.props;
    // 从model获取details信息
    const {
      curr_status,
      plan_temp,
      detail_defaults,
      detail_state_0,
      detail_state_100,
      getDetailStamp,
      visible,
    } = business_product_setup;
    // 从this里面获取信息
    const { didEnabled, didSubmit, changeVisible, changeCurrStatus, laterhandle } = this;
    // 详情页或者编辑页的基础参数
    const viewProps = {
      detail_state_0,
      changeCurrStatus,
      curr_status,
      detail: detail_defaults,
    };
// 根据curr_status判断应该进入那个页面 封装的参数
    if (['detail', 'edit'].indexOf(curr_status) !== -1) {
      viewProps.detail = detail_state_100;
      Object.assign(viewProps, { getDetailStamp, plan_temp, visible, didSubmit, laterhandle, didEnabled, changeVisible });
    }
    // 刚注册的服务商 需要的参数,在model默认是add 所以首先会进
    if (['add'].indexOf(curr_status) !== -1) {
      Object.assign(viewProps, { getDetailStamp, plan_temp, didSubmit });
    }
    // 如果页面状态是toEnable 封装的参数
    if (['toEnable'].indexOf(curr_status) !== -1) {
      viewProps.detail = detail_state_0;
      Object.assign(viewProps, { didEnabled });
    }

    // 根据curr_status判断加载哪个页面组件
    function checkStatus() {
      // 第一次进去的时候默认是添加，所以就直接进入添加或者是编辑页面，如果之前有过产品，那么默认进入的是detail页面
      switch (true) {
        // 'add', 'edit' 进入编辑页面
        case ['add', 'edit'].indexOf(curr_status) !== -1:
          return (<ViewForm {...viewProps} />);
          break;
        default:
          return (<ViewDetail {...viewProps} />);// 默认进入ViewDetail 详情页面
          break;
      }
    }
    return (
      <div className="con-body">
        {checkStatus()}
      </div>
    );
  }

}

// 链接model
function mapStateToProps({ business_product_setup, business_public }) {
  return { business_product_setup, business_public };
}


module.exports = connect(mapStateToProps)(View);
