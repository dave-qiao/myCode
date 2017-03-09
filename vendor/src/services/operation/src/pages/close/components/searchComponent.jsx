
import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select, DatePicker } from 'antd';
import style from './style.less';
import CityFilter from './cityFilter';

const moment = require('moment');

const RangePicker = DatePicker.RangePicker;
const rgReg = /\-/g;

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

class FilterComponent extends Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,        //当前城市code
      cityList: props.cityList,        //当前城市列表
      cityName: props.cityName,        //当前城市name
      startDate: props.startDate,      //日期范围
      endDate: props.endDate,      //日期范围
    };

    this.private = {
      onHandleSearch: props.onHandleSearch,   //处理搜索回调
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      cityCode: nextProps.cityCode,             //当前城市code
      cityList: nextProps.cityList,             //当前城市列表
      cityName: nextProps.cityName,             //当前城市name
      closeOrderList: nextProps.closeOrderList, //异常订单列表
      startDate: nextProps.startDate,           //日期范围
      endDate: nextProps.endDate,           //日期范围
    });
  };

  //选择城市
  onChangeCity = (cityCode, cityName) => {
    this.setState({ cityCode, cityName });
    //window.localStorage.setItem('cityCode', cityCode);
    //回调函数，将值传递给父级
    this.props.onChangeCity(cityCode, cityName);
  };

  //选择日期
  onChangeDate = (value, dateString) => {
    if (dateString) {
      const startDate = dateString[0].replace(rgReg, '');
      const endDate = dateString[1].replace(rgReg, '');
      window.localStorage.setItem('startDate', startDate);
      window.localStorage.setItem('endDate', endDate);
    }
  };

  //搜索
  onHandleSearch = () => {
    this.private.onHandleSearch();
  };

  //城市
  renderCityComponent = () => {
    const { cityCode, cityList, cityName } = this.state;
    const { onChangeCity } = this;
    const props = {
      cityCode,       //当前城市code
      cityName,       //当前城市name
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
    };
    return (
      <div>
        <CityFilter {...props} />
      </div>
    )
  };

  //日期
  renderDateComponent = () => {
    const { onChangeDate } = this;
    const today = moment().format().replace(rgReg, '').substring(0, 8);
    return (
      <RangePicker style={{ width: 184 }} onChange={onChangeDate} defaultStartValue={today} />
    )
  };

  //选择器
  render() {
    const { renderCityComponent, renderDateComponent, onHandleSearch } = this;
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormItem
          label="城市"
        >
          {/*城市列表   defaultValue={cityCode}  */}
          {renderCityComponent()}
        </FormItem>
        <FormItem
          label="日期"
        >
          {/*日期选择器 onClick={onHandleSearch} */}
          {renderDateComponent()}
        </FormItem>
        <FormItem>
          <Button type="ghost" onClick={onHandleSearch}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

module.exports = Form.create()(FilterComponent);
