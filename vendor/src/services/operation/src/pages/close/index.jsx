
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import SearchComponent from './components/searchComponent';
import StateTable from './components/stateTable';

import style from './components/style.less';
const moment = require('moment');

const rgReg = /\-/g;
const requestPagerSize = 12;
const requestPageNumber = 1;

class Close extends React.Component {

  constructor(props) {
    super();
    const { operationOrder } = props;

    //订单状态
    const { cityList, closeOrderList } = operationOrder;
    const today = moment().format().replace(rgReg, '').substring(0, 8);

    //初始化状态
    this.state = {
      cityCode: city_code ? city_code : 110000,        //当前城市code
      cityName: city_name ? city_name : '北京市',       //当前城市名称
      cityList,                                        //城市列表
      closeOrderList,                                  //异常订单列表
      startDate: today,                                   //日期范围
      endDate: today,                                     //日期范围
    };
    //获取账户信息
    const { vendor_id } = window.currentAppAccountInfo;
    const { city_name, city_code } = window.currentAppUserInfo;

    //存储日期范围
    window.localStorage.setItem('startDate', '');
    window.localStorage.setItem('endDate', '');

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      vendorId: vendor_id,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    const { startDate, endDate } = this.state;
    const AccountSet = JSON.parse(window.localStorage.getItem('accountInfo') || '{}');
    const UserSet = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    const { vendor_id } = AccountSet;
    const { city_code } = UserSet;
    //异常订单列表
    dispatch({
      type: 'fetchCloseOrderList',
      payload: {
        vendorId: vendor_id,
        cityCode: city_code ? city_code : 110000,
        startDate,
        endDate,
        state: -100,
        page: requestPageNumber,     //页码
        limit: requestPagerSize,     //分页
        sort:  '{created_at: -1}',   //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { cityList, closeOrderList } = operationOrder;
    const { cityCode, cityName, startDate, endDate } = this.state;

    //状态发生变化时－重新赋值
    this.setState({
      cityList,                                        //城市列表
      cityCode,
      cityName,
      closeOrderList,
      startDate,
      endDate,
    });
  };

//选择城市---通过回调实现子组件与父组件的通信
  onChangeCity = (code, name) => {
    this.setState({ cityCode: code, cityName: name });
  };

  //搜索---触发异常订单列表请求
  onHandleSearch = () => {
    const { vendor_id } = window.currentAppAccountInfo;
    const startDate = window.localStorage.getItem('startDate');
    const endDate = window.localStorage.getItem('endDate');
    const vendorId = vendor_id;
    const state = -100;

    const { cityCode } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'fetchCloseOrderList',
      payload: {
        vendorId,
        cityCode,
        startDate,
        endDate,
        state,
      },
    });
  };

  //选择器－search
  renderSearchComponent = () => {
    const { cityCode, cityList, cityName, closeOrderList, startDate, endDate } = this.state;
    const { onChangeCity, onHandleSearch } = this;
    const props = {
      cityCode,       //当前城市code
      cityName,       //当前城市name
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
      onHandleSearch, //搜索回调
      closeOrderList,
      startDate,
      endDate,
    };

    return (
      <SearchComponent {...props} />
    );
  };

  //异常单列表－table
  renderStateTableComponent = () => {
    const { closeOrderList } = this.state;
    const props = {
      closeOrderList,
    };
    return (
      <StateTable {...props} />
    )
  };

  render() {
    const { renderSearchComponent, renderStateTableComponent } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            {/* 渲染条件筛选组件 */}
            <div className="bd-content">{renderSearchComponent()}</div>
          </Col>
          <Col>
            {/* 渲染状态数据列表 */}
            <div className="bd-content">{renderStateTableComponent()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}
function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(Close);
