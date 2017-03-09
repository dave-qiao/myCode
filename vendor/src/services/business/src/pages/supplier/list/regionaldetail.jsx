/**
 * Created by dave 17/1/2
 * 供应商搜索组件
 */
import React, { Component, PropTypes } from 'react';
import { Select, Row, Col, Button, Modal, Form, message } from 'antd';
import data from '../../../../../../assets/citys/city.json';
import { getCityNameByCode } from '../../../../../../utils/authHelper.js'
const [Option,FormItem] = [Select.Option, Form.FormItem];
const city = data.data;
/*新的组件*/
class Search extends Component {
  constructor() {
    super()
    this.state = {
      visible: false
    }
  }

  showModal = ()=> {
    this.setState({
      visible: true,
    });
    this.props.add();
  };

  handleOk = ()=> {
    const { biz_info_id, supplierDetail } = this.props;
    let supply_vendor_id = sessionStorage.getItem('supply_vendor_id');
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('信息不全')
        return;
      } else {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        let values = this.props.form.getFieldsValue();
        values.supply_vendor_id = supply_vendor_id;
        values.vendor_id = vendor_id;
        for (var i = 0; i < city.length; i++) {
          if (city[i]._id == values.city_code) {
            values.city_name = city[i].name;
          }
        }
        this.props.addSubmit(values);
        this.setState({
          visible: false,
        });
      }
    });
    const { form } = this.props;
    form.resetFields();

  };

  handleCancel = (e)=> {
    this.setState({
      visible: false,
    });
    const { form } = this.props;
    form.resetFields();
  };

  // 城市更改
  onChange = (value)=> {
    const { dispatch } = this.props;
    const city_code = value;
    this.props.onChange(value);
  };

  // 按条件查询
  search = ()=> {
    this.props.areaSearch();
  };

  // 根据不同的城市选出不同的区域
  addAreaCityChange = (value) => {
    this.props.addAreaCityChange(value);
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { city_code } = JSON.parse(userInfo);
    let type = this.props.type;
    if (type == 'regional') {
      const city = city;
    } else {
      const city = [];
    }
    ;

    // 获取form提供的api
    const { addAreaList, serviceCityList } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div>

        <Row>
          <Col sm={5}>
            <Select
              showSearch
              style={{ width: '80%' }}
              placeholder="请选择"
              optionFilterProp="children"
              onChange={this.onChange}
              defaultValue={getCityNameByCode(city_code)}
            >
              {
                serviceCityList.map(function (item, index) {
                  return (
                    <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
                  )
                })
              }
            </Select>
          </Col>
          <Col sm={12}>
            <Button onClick={this.search}>查询</Button>
            <Button type="primary" onClick={this.showModal}>{ '添加'}</Button>
            <Modal title={'添加区域'} visible={this.state.visible}
                   onOk={this.handleOk} onCancel={this.handleCancel}
                   style={{ top: '35%' }}
            >
              <Form>
                <Row align="middle" type="flex" justify="center" gutter={16}>

                  <Col sm={6} style={{ textAlign: 'right' }}>
                    <div>城市:</div>
                  </Col>
                  <Col sm={18} style={{ textAlign: 'left' }}>
                    <Select
                      key="1"
                      showSearch
                      style={{ width: '80%' }}
                      placeholder="请选择"
                      optionFilterProp="children"
                      defaultValue={getCityNameByCode(city_code)}
                      onSelect={this.addAreaCityChange}
                      {...getFieldProps('city_code', {
                        rules: [{ required: true, message: '请选择城市' },],
                        initialValue:city_code,
                      })}
                    >
                      {
                        serviceCityList.map(function (item, index) {
                          return (
                            <Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>
                          )
                        })
                      }
                    </Select>
                  </Col>
                </Row>
                <Row align="middle" type="flex" justify="center" gutter={16} style={{ marginTop: 16 }}>
                  <Col sm={6} style={{ textAlign: 'right' }}>
                    <div>{ '区域名称' }</div>
                  </Col>
                  <Col sm={18} style={{ textAlign: 'left' }}>
                    <Select
                      key="2"
                      showSearch
                      style={{ width: '80%' }}
                      placeholder={'请选择区域名称'}
                      optionFilterProp="children"
                      {...getFieldProps('area_id', {
                        rules: [{ required: true, message: '请选择区域' }],
                      })}
                    >
                      {
                        addAreaList.data.map(function (item, index) {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          )
                        })

                      }
                    </Select>
                  </Col>

                </Row>
              </Form>
            </Modal>
          </Col>
        </Row>

      </div>
    )
  }
}
module.exports = Form.create()(Search);
