/**
 * Created by dave
 * 团队管理城市选择模块
 */
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select } from 'antd';
import data from '../../../../../../assets/citys/city.json';
import { getCityNameByCode } from '../../../../../../utils/authHelper';

const Option = Select.Option;
const city = data.data;
/*选中城市的回调*/
function handleChange(value,key) {

}
/*城市列表组件*/
export default class TeamCity extends React.Component {
  render() {
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { city_code } = JSON.parse(userInfo);
    const cityName = getCityNameByCode(city_code);
    const { serviceCityList } = this.props;
    return (
      <div>
        <span>城市&nbsp;&nbsp;</span>
        <Select
          showSearch
          style={{ width: '80%' }}
          placeholder="请选择"
          defaultValue={cityName}
          optionFilterProp="children"
          onSelect={this.props.cityChange}
        >
          {
            serviceCityList.map((item, index) => {
              return (
                <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
              )
            })
          }
        </Select>
      </div>
    )
  }
}
