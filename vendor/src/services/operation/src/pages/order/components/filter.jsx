
import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select } from 'antd';
import style from './style.less';

const moment = require('moment');

const rgReg = /\-/g;
//初始化变量   {/*onChange={onChangeCity}defaultValue={cityCode}*/} {/*{...state}*/}
const [FormItem, Option] = [Form.Item, Select.Option];

class FilterComponent extends Component {

  constructor(props) {
    super();

    this.state = {
      cityCode: props.cityCode,        //当前城市code
      cityList: props.cityList,        //当前城市列表
      cityName: props.cityName,        //当前城市name
      date: props.date,
    };
    this.private = {
      onChangeCity: props.onChangeCity, //选择城市的事件回调
      onChangeDate: props.onChangeDate, //选择日期的时间回调
      onHandleSearch: props.onHandleSearch, //处理搜索回调
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      cityCode: nextProps.cityCode,        //当前城市code
      cityList: nextProps.cityList,        //当前城市列表
      cityName: nextProps.cityName,        //当前城市name
      date: nextProps.date,                //当前日期
    });
  };

  //选择城市
  onChangeCity = (cityCode) => {
    const { cityList } = this.state;
    let cityName = '北京市';
    cityList.forEach((value, key) => {
      if (value.city_code === cityCode) {
        cityName = value.city_name;
      }
    });
    this.private.onChangeCity(cityCode, cityName);
  };

  //选择日期
  onChangeDate = (date) => {
    this.setState({ date });
    this.private.onChangeDate(date);
  };

  //搜索
  onHandleSearch = (date, cityCode) => {
    this.setState({ date, cityCode });
    this.private.onHandleSearch(date, cityCode);
  };

  //城市
  renderCityComponent = () => {
    const { onChangeCity } = this;
    const { cityName } = this.props;
    let { cityCode, cityList } = this.state;

    //判断城市列表，设置默认
    if (cityList.length === 0) {
      cityList = [{
        city_code: '',
        //city_name: '北京市',
      }];
      cityCode = '';
    }

    //修正默认城市加载后，默认值刷新不掉的问题
    let state = {};
    if (cityCode !== '') {
      state = { value: cityName };
    }

    return (
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="请选择城市"
        optionFilterProp="children"
        onChange={onChangeCity}

        {...state}
      >
        {
          //渲染选项
          cityList.map((item, index) => {
            return (<Option key={index} value={item.city_code} title={item.city_name}>{item.city_name}</Option>);
          })
        }
      </Select>
    )
  };

  //日期
  renderDateComponent = () => {
    //今天
    const today = moment().format().replace(rgReg, '').substring(0, 8);
    //昨天
    const yesterday = moment().subtract(1, 'days').format().replace(rgReg, '').substring(0, 8);
    //明天
    const tomorrow = moment().add(1, 'days').format().replace(rgReg, '').substring(0, 8);

    const dateSource = [
      { title: '昨天', date: yesterday },
      { title: '今天', date: today },
      { title: '明天', date: tomorrow },
    ];
    const { onChangeDate } = this;
    return (
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="请选择时间"
        optionFilterProp="children"
        onChange={onChangeDate}
        defaultValue="今天"
      >
        {
          //渲染选项
          dateSource.map((item, index) => {
            return (<Option key={index} value={item.date} title={item.title}>{item.title}</Option>);
          })
        }
      </Select>
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
          {/*日期选择器 */}
          {renderDateComponent()}
        </FormItem>
        <FormItem>
          <Button type="ghost" onClick={onHandleSearch}>查询</Button>
        </FormItem>
        <Link to="/operation/order/close" className={style.exception}>异常单查看</Link>
      </Form>
    );
  }
}

module.exports = Form.create()(FilterComponent);
