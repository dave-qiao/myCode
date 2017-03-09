import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import OrderStatistics from './components/orderStatistics';
import FilterComponent from './components/filter';
import StateTable from './components/stateTable';
import style from './components/style.less';

const moment = require('moment');

const rgReg = /\-/g;

class Operation extends React.Component {
  constructor(props) {
    super();
    const { operationOrder } = props;

    //订单状态
    const { totalOrderStatistics, cityList, sellerOrderList } = operationOrder;
    const today = moment().format().replace(rgReg, '').substring(0, 8);

    //初始化状态
    this.state = {
      cityCode: city_code ? city_code : 110000,        //当前城市code
      cityName: city_name ? city_name : '北京市',       //当前城市名称
      totalOrderStatistics,                            //订单状态
      cityList,                                        //城市列表
      sellerOrderList,                                 //商家订单列表
      date: today,                                     //日期
    };

    //获取账户信息
    const { vendor_id } = window.currentAppAccountInfo;
    const { city_name, city_code } = window.currentAppUserInfo;

    //存储日期
    window.localStorage.setItem('date', today);

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      vendorId: vendor_id,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { totalOrderStatistics, cityList, sellerOrderList } = operationOrder;
    const { cityCode, cityName, date } = this.state;

    //状态发生变化时－重新赋值
    this.setState({
      totalOrderStatistics,                            //订单状态
      cityList,                                        //城市列表
      sellerOrderList,                                 //商家订单列表
      date,                                            //日期
      cityCode,
      cityName,
    });
  };

  //选择城市---通过回调实现子组件与父组件的通信
  onChangeCity = (cityCode, cityName) => {
    this.setState({ cityCode, cityName });
  };

  //选择日期－－－同上
  onChangeDate = (date) => {
    this.setState({ date });
    window.localStorage.setItem('date', date);
  };

  //搜索---触发商家列表请求
  onHandleSearch = () => {
    const AccountSet = JSON.parse(window.localStorage.getItem('accountInfo') || '{}');
    //const UserSet = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    const date = window.localStorage.getItem('date') || ' ';
    const { cityCode } = this.state;
    const { vendor_id } = AccountSet;
    const { dispatch } = this.props;

    //请求商家列表
    dispatch({
      type: 'fetchSellerOrderList',
      payload: { vendorId: vendor_id, cityCode, shippingDate: date },
    },

    //请求订单状态统计
    dispatch({
      type: 'fetchTotalOrderStatistics',
      payload: { vendorId: vendor_id, cityCode, shippingDate: date },
    }))
  };

  //选择器-－－－上
  renderFilterComponent = () => {

    const { cityCode, cityList, cityName, date } = this.state;
    const { onChangeCity, onChangeDate, onHandleSearch } = this;
    const props = {
      cityCode,       //当前城市code
      cityName,       //当前城市name
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
      onChangeDate,   //选择日期的时间回调
      onHandleSearch, //搜索回调
      date,           //today
    };

    return (
      <FilterComponent {...props} />
    );
  };

  //渲染订单状态－－－中
  renderStateDashboardComponent = () => {
    const { totalOrderStatistics } = this.state;
    const props = {
      totalOrderStatistics,     //订单状态
    };
    return (
      <OrderStatistics {...props} />
    )
  };

  //状态数据列表－－－下
  renderStateTableComponent = () => {
    const { sellerOrderList } = this.state;
    const props = {
      sellerOrderList,
    };
    return (
      <StateTable {...props} />
    )
  };

  render() {
    const {
      renderFilterComponent,
      renderStateDashboardComponent,
      renderStateTableComponent,
    } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            {/* 渲染条件筛选组件 */}
            <div className="bd-content">{renderFilterComponent()}</div>
            {/* 渲染状态数据面板 */}
            <div className="bd-content">{renderStateDashboardComponent()}</div>
          </Col>
          <Col className={style.center} >
            {/* 渲染状态数据列表 */}
            <div className="bd-content">{renderStateTableComponent()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(Operation);
