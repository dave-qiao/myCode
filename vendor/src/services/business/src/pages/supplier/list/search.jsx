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

  componentWillReceiveProps = () => {

  }

  showModal = ()=> {
    this.setState({
      visible: true,
    });
    this.props.add();
  };

  handleOk = ()=> {
    const { VendorSupplierList } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('信息不全')
        return;
      } else {
        let values = this.props.form.getFieldsValue();
        const cityCode = values.service_city_code;
        values.service_city_code = [`${cityCode}`];
        for (var i = 0; i < VendorSupplierList.length; i++) {
          if (VendorSupplierList[i].id == values.supply_vendor_id) {
            values.name = VendorSupplierList[i].name;
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
    dispatch({
      type: 'changeCityCodeR',
      payload: { city_code },
    })
  };

  // 添加供应商城市更改
  onAddChange = (value)=> {
    const { dispatch } = this.props;
    const city_code = value;
    const state = 100;
    const verify_state = 100;
    dispatch({
      type: 'getVendorSupplierE',
      payload: { city_code, state, verify_state },
    });

  }

  // 按条件查询
  search = ()=> {

    // 查询供应商列表
    this.props.supplierSearch();

    this.props.areaSearch();

  };

  render() {
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    /*const { city_code } = JSON.parse(userInfo);*/
    let type = this.props.type;

    // 获取form提供的api
    const { VendorSupplierList, city_code, serviceCityList } = this.props;
    const { getFieldProps } = this.props.form;

    // 将当前服务商从 添加供应商列表中删除
    for (var i = 0; i < VendorSupplierList.length; i++) {
      if (VendorSupplierList[i].id == vendor_id) {
        VendorSupplierList.splice(i, 1);
      }
    }

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
            <Button type="primary" onClick={this.showModal}>{type == 'regional' ? '添加' : '添加新供应商'}</Button>
            <Modal title={type == 'regional' ? '添加区域' : '添加新供应商'} visible={this.state.visible}
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
                      showSearch
                      style={{ width: '80%' }}
                      placeholder="请选择"
                      optionFilterProp="children"
                      defaultValue={getCityNameByCode(city_code)}
                      onSelect={this.onAddChange}
                      {...getFieldProps('service_city_code', {
                        rules: [{ required: true, message: '请选择城市' },],
                        initialValue: city_code,
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
                    <div>{type == 'regional' ? '区域名称' : '供应商:'}</div>
                  </Col>
                  <Col sm={18} style={{ textAlign: 'left' }}>
                    <Select
                      showSearch
                      style={{ width: '80%' }}
                      placeholder={type == 'regional' ? '请选择区域名称' : '请选择服务商'}
                      optionFilterProp="children"
                      {...getFieldProps('supply_vendor_id', {
                        rules: [{ required: true, message: '请输入服务商' }],
                        type: 'array',
                      })}
                    >
                      {
                        VendorSupplierList.map(function (item, index) {
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
